var mysql = require('mysql2');

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "12345678",
    port:3306,
    database: "bicycle_track"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");

  //טבלת משתמשים
  // var sql = "CREATE TABLE users (
  // id INT AUTO_INCREMENT PRIMARY KEY,
  // user_name VARCHAR(255) , 
  // email VARCHAR(255), 
  // password VARCHAR(255), 
  // fitness_level VARCHAR(255), 
  // max_slope VARCHAR(255))";
  // con.query(sql, function (err) {
  //   if (err) throw err;
  // console.log("Users Table created");
  // });

  // var sql = "DROP TABLE IF EXISTS routes";
  // con.query(sql, function (err, result) {
  //   if (err) throw err;
  //   console.log("Table deleted");
  // });
  
  //טבלת מסלולים
  // var sql = "CREATE TABLE routes (
  // route_id INT AUTO_INCREMENT PRIMARY KEY,
  // user_id INT , start_point VARCHAR(255), 
  // destination_point VARCHAR(255), 
  // created_date DATETIME, 
  // trip_purpose VARCHAR(255) , 
  // selectedTime DOUBLE, 
  // FOREIGN KEY (user_id) REFERENCES users(id) )";
  // con.query(sql, function (err) {
  //   if (err) throw err;
  // console.log("Routes Table created");
  // });

  //טבלת קשתות
  // var sql = "CREATE TABLE edges (
  // edge_id INT AUTO_INCREMENT PRIMARY KEY, 
  // time_riding INT , 
  // edge_slope DOUBLE, 
  // distance DOUBLE, 
  // closed_street INT, 
  // complex_transition INT, 
  // sum_sport DOUBLE, 
  // sum_traveling DOUBLE)";
  // con.query(sql, function (err) {
  //   if (err) throw err;
  // console.log("Edges Table created");
  // });

  //טבלת צמיתם/קודקודים בגרף
  // var sql = "CREATE TABLE vertices (
  // vertex_id INT AUTO_INCREMENT PRIMARY KEY, 
  // coordinate_x DOUBLE, 
  // coordinate_y DOUBLE, 
  // address VARCHAR(255))";
  // con.query(sql, function (err) {
  //   if (err) throw err;
  // console.log("Vertices Table created");
  // });

  //טבלת יעדים שמורים של המשתמש
  // var sql = "CREATE TABLE destination_reserved (
  // destination_reserved_id INT AUTO_INCREMENT PRIMARY KEY, 
  // vertex_id INT, 
  // FOREIGN KEY (vertex_id) REFERENCES vertices(vertex_id))";
  // con.query(sql, function (err) {
  //   if (err) throw err;
  // console.log("Destination_reserved Table created");
  // });

  //טבלת כל הנקודות העצירה הקיימות
  // var sql = "CREATE TABLE stopping_point (
  // stopping_point_id INT AUTO_INCREMENT PRIMARY KEY, 
  // route_id INT, 
  // edge_id INT, 
  // number_point_route INT, 
  // is_user_point INT, 
  // FOREIGN KEY (route_id) REFERENCES routes(route_id), 
  // FOREIGN KEY (edge_id) REFERENCES edges(edge_id))";
  // con.query(sql, function (err) {
  //   if (err) throw err;
  // console.log("Stopping_point Table created");
  // });
});