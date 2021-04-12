const mysql = require('mysql');
const db_config = {
  host: '127.0.0.1',
  user: 'root',
  password: 'Alskdjfh10@',
  database: 'webapp',
};

let connection;

const handleDisconnect = () => {
  connection = mysql.createConnection(db_config);
  connection.connect((err) => {
    if (err) {
      console.log('Connection Error:', err);
      setTimeout(handleDisconnect, 2000);
    }
  });
  connection.on('error', (err) => {
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      handleDisconnect();
    } else {
      throw err;
    }
  });
};

handleDisconnect();

module.exports = connection;
