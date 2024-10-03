const { fetchALL, fetch } = require('../../../lib/postgres')

const categories = (lang_id, gender) => {
   const QUERY = `
      SELECT
         category_id,
         category_name,
         category_description,
         category_text_color,
         category_description_color,
         category_background_color,
         category_big,
         category_gender,
         category_order,
         lang_id,
         category_image_link,
         category_image_name,
         category_create_at
      FROM
         pray_categories a
      ${lang_id && gender ? (
         `
            INNER JOIN
               languages b
            ON
               a.lang_id = b.id
            WHERE
               b.name = '${lang_id}' and ( category_gender = ${gender} or category_gender = 0 )
         `
      ) : lang_id ? (
         `
            INNER JOIN
               languages b
            ON
               a.lang_id = b.id
            WHERE
               b.name = '${lang_id}'
         `
      ) : ""}
      ORDER BY
         category_order;
   `;

   return fetchALL(QUERY)
}
const addCategory = (
   category_name,
   category_description,
   category_text_color,
   category_description_color,
   category_background_color,
   category_big,
   category_gender,
   category_order,
   lang_id,
   imgUrl,
   imgName
) => {
   const QUERY = `
      INSERT INTO 
         pray_categories (
            category_name,
            category_description,
            category_text_color,
            category_description_color,
            category_background_color,
            category_big,
            category_gender,
            category_order,
            lang_id,
            category_image_link,
            category_image_name
         ) VALUES (
            $1,
            $2,
            $3,
            $4,
            $5,
            $6,
            $7,
            $8,
            $9,
            $10,
            $11
         ) RETURNING *;
   `;

   return fetch(
      QUERY,
      category_name,
      category_description,
      category_text_color,
      category_description_color,
      category_background_color,
      category_big,
      category_gender,
      category_order,
      lang_id,
      imgUrl,
      imgName
   )
}
const foundCategory = (category_id) => {
   const QUERY = `
      SELECT
         *
      FROM
         pray_categories
      WHERE
         category_id = $1;
   `;

   return fetch(QUERY, category_id)
}
const editCategory = (
   category_id,
   category_name,
   category_description,
   category_text_color,
   category_description_color,
   category_background_color,
   category_big,
   category_gender,
   category_order,
   lang_id,
   imgUrl,
   imgName
) => {
   const QUERY = `
      UPDATE
         pray_categories
      SET
         category_name = $2,
         category_description = $3,
         category_text_color = $4,
         category_description_color = $5,
         category_background_color = $6,
         category_big = $7,
         category_gender = $8,
         category_order = $9,
         lang_id = $10,
         category_image_link = $11,
         category_image_name = $12
      WHERE
         category_id = $1
      RETURNING *;
   `;

   return fetch(
      QUERY,
      category_id,
      category_name,
      category_description,
      category_text_color,
      category_description_color,
      category_background_color,
      category_big,
      category_gender,
      category_order,
      lang_id,
      imgUrl,
      imgName
   )
}

module.exports = {
   categories,
   addCategory,
   foundCategory,
   editCategory
}