var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  database :  'dpg'
});
connection.connect();
exports.connection = connection;