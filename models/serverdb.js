const db = require('../db.js');

save_user_information = (data) =>
  new Promise((resolve, reject) => {
    db.query(
      'INSERT INTO lottery_information SET ?',
      data,
      (err, results, fields) => {
        if (err) {
          reject('Could not insert into lottery inforamtion');
        }
        resolve('Successful');
      }
    );
  });

module.exports = {
  save_user_information,
};
