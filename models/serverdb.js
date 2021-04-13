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

get_total_amount = (data) =>
  new Promise((resolve, reject) => {
    db.query(
      'select sum(amount) as total_amount from lottery_information',
      null,
      (err, results, fields) => {
        if (err) {
          reject('Could not get total amount');
        }
        resolve(results);
      }
    );
  });

get_list_of_participants = (data) =>
  new Promise((resolve, reject) => {
    db.query(
      'select email from lottery_information',
      null,
      (err, results, fields) => {
        if (err) {
          reject('Could not fetch list of participants');
        }
        resolve(results);
      }
    );
  });

module.exports = {
  save_user_information,
  get_list_of_participants,
};
