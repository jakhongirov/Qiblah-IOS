const { fetch } = require('./src/lib/postgres')

const foundUser = (token) => {
   const QUERY = `
      SELECT
         *
      FROM
         users
      WHERE
         $1 = ANY (user_token);
   `;

   return fetch(QUERY, token)
}
const checkUser = (phoneNumber) => {
   const QUERY = `
      SELECT
         *
      FROM
         users
      WHERE
         user_phone_number = $1;
   `;

   return fetch(QUERY, phoneNumber)
}
const addToken = (
   user_id,
   parameter,
   user_premium,
   user_premium_expires_at,
   payment_type,
   user_country_code,
   user_region,
   user_location,
   user_address_name,
   user_location_status,
   tracking
) => {

   if (tracking == null) {
      tracking = [];
   }

   const QUERY = `
      UPDATE
         users
      SET
         user_token = array_append(user_token, $2),
         user_premium = $3, 
         user_premium_expires_at = $4,
         payment_type = $5,
         user_country_code = $6,
         user_region = $7,
         user_location = $8,
         user_address_name = $9,
         user_location_status = $10,
         tracking = array_append(tracking, $11)
      WHERE
         user_id = $1
      RETURNING *;
   `;

   return fetch(
      QUERY,
      user_id,
      parameter,
      user_premium,
      user_premium_expires_at,
      payment_type,
      user_country_code,
      user_region,
      user_location,
      user_address_name,
      user_location_status,
      tracking
   )
}
const deleteUser = (id) => {
   const QUERY = `
      DELETE FROM
         users
      WHERE
         user_id = $1
      RETURNING *;
   `;

   return fetch(QUERY, id)
}
const updatedUserPhone = (id, phone_number) => {
   const QUERY = `
      UPDATE
         users
      SET
         user_phone_number = $2,
         user_signin_method = 'withTelegram'
      WHERE
         user_id = $1
      RETURNING *;
   `;

   return fetch(QUERY, id, phone_number);
}
const updatedUserPassword = (user_id, pass_hash) => {
   const QUERY = `
      UPDATE
         users
      SET
         user_password = $2
      WHERE
         user_id = $1
      RETURNING *;
   `;

   return fetch(QUERY, user_id, pass_hash)
};
const addMessage = (chat_id, date) => {
   const QUERY = `
      INSERT INTO
         messages (
            chat_id,
            message_dete
         ) VALUES (
            $1,
            $2
         ) RETURNING *;
   `;

   fetch(QUERY, chat_id, date)
}
const foundMsg = (date) => {
   const QUERY = `
      SELECT
         *
      FROM
         messages
      WHERE
         message_dete = $1;
   `;

   return fetch(QUERY, date)
}
const addUserComment = (id, text) => {
   const QUERY = `
      UPDATE
         users
      SET
         user_comment = array_append(user_comment, $2)
      WHERE
         user_id = $1
      RETURNIG *;
   `;

   return fetch(QUERY, id, text)
}
const foundUserChatId = (chatId) => {
   const QUERY = `
      SELECT
         *
      FROM
         users
      WHERE
         chat_id = $1;
   `;

   return fetch(QUERY, chatId)
}
const editStep = (chat_id, step) => {
   const QUERY = `
      UPDATE
         users
      SET
         bot_step = $2
      WHERE
         chat_id = $1
      RETURNING *;
   `;

   return fetch(QUERY, chat_id, step)
}
const addChatId = (user_id, chatId) => {
   const QUERY = `
      UPDATE
         users
      SET
         chat_id = $2
      WHERE
         user_id = $1
      RETURNING *;
   `;

   return fetch(QUERY, user_id, chatId)
}

module.exports = {
   foundUser,
   checkUser,
   addToken,
   deleteUser,
   updatedUserPhone,
   updatedUserPassword,
   addMessage,
   foundMsg,
   addUserComment,
   foundUserChatId,
   editStep,
   addChatId
}