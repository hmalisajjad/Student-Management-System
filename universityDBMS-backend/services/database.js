const q = require('q');
const mysql = require("mysql");
//const { connect } = require("../routes/user");
//const dbConfig = require("/");

//initialization
var connection
const dbinitialize = () => {
  // Create a connection to the database
  let config = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'mystudentdb',
    multipleStatements: true
  }
  connection = mysql.createPool(config)
  console.log('pool creation');

// open the MySQL connection

 

}
const executeQuerys = (sql, value) => {
  console.log('inside executeQuerys')
  let defer = q.defer()
  connection.getConnection((
    error,connect
  ) => {
    if (error){
    console.log('error found: ', error);
    return error}
    connect.query(sql,value, function(err, data){
      connect.release()
        if(err){
          console.log('error: ', err)
          defer.resolve({
            success: false,
            error: err
          })

        }
        defer.resolve({
          success: true, data: data
        })
      
    })
  })
  return defer.promise;
}


  
  module.exports = {
    dbinitialize, 
    executeQuerys
  };