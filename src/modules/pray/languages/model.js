const { fetchALL, fetch } = require('../../../lib/postgres')

const languages = () => {
   const QUERY = `
      SELECT
         *
      FROM
         languages
   `;

   return fetchALL(QUERY)
}
const addLang = (name) => {
   const QUERY = `
      INSERT INTO
         languages (
            name
         ) VALUES (
            $1 
         ) RERTuRNING *;
   `;

   return fetch(QUERY, name)
}
const editLang = (id, name) => {
   const QUERY = `
      UPDATE
         languages
      SET
         name = $2
      WHERE
         id = $1
      RETURNING *;
   `;

   return fetch(QUERY, id, name)
}
const deleteLang = (id) => {
   const QUERY = `
      DELETE FROM
         languages
      WHERE
         id = $1
      RETURNING *;
   `;

   return fetch(QUERY, id)
}

module.exports = {
   languages,
   addLang,
   editLang,
   deleteLang
}