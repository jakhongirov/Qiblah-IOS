require('dotenv').config();
const model = require('./model')
const path = require('path')
const FS = require('../../lib/fs/fs')
const fs = require('fs')

module.exports = {
   GET: async (req, res) => {
      try {
         const { limit, page, lang } = req.query

         if (limit && page) {
            const version = await model.versionVote()
            const voteList = await model.voteList(limit, page, lang)

            if (voteList?.length > 0) {
               return res.status(200).json({
                  status: 200,
                  message: "Success",
                  data: voteList,
                  version: version?.meditation_votes
               })
            } else {
               return res.status(404).json({
                  status: 404,
                  message: "Not found"
               })
            }

         } else {
            return res.status(400).json({
               status: 400,
               message: "Must write limit and page"
            })
         }

      } catch (error) {
         console.log(error);
         res.status(500).json({
            status: 500,
            message: "Interval Server Error"
         })
      }
   },

   DOWNLOAD: async (req, res) => {
      try {
         const data = await model.download()

         res.setHeader('Content-Disposition', 'attachment; filename=my_table_data.json');
         res.setHeader('Content-Type', 'application/json');

         // Send JSON data as file download
         res.send(JSON.stringify(data, null, 2));
      } catch (error) {
         console.error('Error fetching data:', error);
         res.status(500).send('Error fetching data');
      }
   },

   ADD_VOTE_FILE: async (req, res) => {
      try {
         const data = new FS(path.resolve(__dirname, '..', '..', '..', 'files', `calmVotesDb.json`))
         const file = JSON.parse(data.read())

         for (const item of file) {
            await model.addVote(
               item?.name,
               item?.lang,
               item?.suggested,
               item?.audioLink,
               item?.audioLink?.split('/')[item?.audioLink?.split('/')?.length - 1],
               item?.iconLink,
               item?.iconLink?.split('/')[item?.iconLink?.split('/')?.length - 1],
            )
         }

         return res.status(200).json({
            status: 200,
            message: "Success"
         });

      } catch (error) {
         console.log(error);
         res.status(500).json({
            status: 500,
            message: "Interval Server Error"
         })
      }
   },

   ADD_VOTE: async (req, res) => {
      try {
         const uploadFile = req.files;
         const { vote_name, vote_lang, suggested_item, audio_link } = req.body
         const audioUrl = audio_link ? audio_link : `${process.env.BACKEND_URL}/${uploadFile?.audio[0]?.filename}`;
         const audioName = audio_link ? null : uploadFile?.audio[0]?.filename;

         const iconUrl = `${process.env.BACKEND_URL}/${uploadFile?.icon[0]?.filename}`;
         const iconName = uploadFile?.icon[0]?.filename;

         const addVote = await model.addVote(
            vote_name,
            vote_lang,
            suggested_item,
            audioUrl,
            audioName,
            iconUrl,
            iconName
         )

         if (addVote) {
            return res.status(200).json({
               status: 200,
               message: "Success",
               data: addVote
            })
         } else {
            return res.status(400).json({
               status: 400,
               message: "Bad request"
            })
         }

      } catch (error) {
         console.log(error);
         res.status(500).json({
            status: 500,
            message: "Interval Server Error"
         })
      }
   },

   UPDATE_VOTE: async (req, res) => {
      try {
         const uploadFile = req.files;
         const { vote_id, vote_name, vote_lang, suggested_item, audio_link } = req.body
         const foundVote = await model.foundVote(vote_id)
         let audioUrl = '';
         let audioName = '';
         let iconUrl = '';
         let iconName = '';

         if (foundVote) {
            if (uploadFile?.audio) {
               if (foundVote?.vote_audio_name) {
                  const deleteOldAvatar = new FS(path.resolve(__dirname, '..', '..', '..', 'public', 'images', `${foundVote?.vote_audio_name}`))
                  deleteOldAvatar.delete()
               }
               audioUrl = `${process.env.BACKEND_URL}/${uploadFile?.audio[0]?.filename}`;
               audioName = uploadFile?.audio[0]?.filename;
            } else if (audio_link) {
               audioUrl = audio_link;
               audioName = null;
            } else {
               audioUrl = foundVote?.vote_audio_url;
               audioName = foundVote?.vote_audio_name;
            }

            if (uploadFile?.icon) {
               if (foundVote?.vote_icon_name) {
                  const deleteOldAvatar = new FS(path.resolve(__dirname, '..', '..', '..', 'public', 'images', `${foundVote?.vote_icon_name}`))
                  deleteOldAvatar.delete()
               }
               iconUrl = `${process.env.BACKEND_URL}/${uploadFile?.icon[0]?.filename}`;
               iconName = uploadFile?.icon[0]?.filename;
            } else {
               iconUrl = foundVote?.vote_icon_url;
               iconName = foundVote?.vote_icon_name;
            }

            const updateVote = await model.updateVote(
               vote_id,
               vote_name,
               vote_lang,
               suggested_item,
               audioUrl,
               audioName,
               iconUrl,
               iconName
            )

            if (updateVote) {
               return res.status(200).json({
                  status: 200,
                  message: "Success",
                  data: updateVote
               })
            } else {
               return res.status(400).json({
                  status: 400,
                  message: "Bad request"
               })
            }

         } else {
            return res.status(404).json({
               status: 404,
               message: "Not found"
            })
         }

      } catch (error) {
         console.log(error);
         res.status(500).json({
            status: 500,
            message: "Interval Server Error"
         })
      }
   },

   DELETE_VOTE: async (req, res) => {
      try {
         const { vote_id } = req.body
         const foundVote = await model.foundVote(vote_id)

         if (foundVote) {
            if (foundVote?.vote_audio_name) {
               const deleteOldAvatar = new FS(path.resolve(__dirname, '..', '..', '..', 'public', 'images', `${foundVote?.vote_audio_name}`))
               deleteOldAvatar.delete()
            }

            if (foundVote?.vote_icon_name) {
               const deleteOldAvatar = new FS(path.resolve(__dirname, '..', '..', '..', 'public', 'images', `${foundVote?.vote_icon_name}`))
               deleteOldAvatar.delete()
            }

            const deleteVote = await model.deleteVote(vote_id)

            if (deleteVote) {
               return res.status(200).json({
                  status: 200,
                  message: "Success",
                  data: deleteVote
               })
            } else {
               return res.status(400).json({
                  status: 400,
                  message: "Bad request"
               })
            }

         } else {
            return res.status(404).json({
               status: 404,
               message: "Not found"
            })
         }


      } catch (error) {
         console.log(error);
         res.status(500).json({
            status: 500,
            message: "Interval Server Error"
         })
      }
   }
}