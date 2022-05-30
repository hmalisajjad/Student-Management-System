const dbService = require('./services/database');
const routes = require('./routes/routes');
const path = require('path');
const cookieParser = require('cookie-parser')

const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql')

const dotenv = require('dotenv');
dotenv.config();

const app = express();
const port = process.env.port || 5000;
dbService.dbinitialize();

//routes

//parse app/json
app.use(bodyParser.json());

//middleware
app.use(bodyParser.urlencoded({ extended: false}));

// Cors for cross origin allowance
const cors = require('cors');
app.use(cors());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs'); 

app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());



//app.use(express.static(''))
app.use(express.static(path.join(__dirname, 'public')));
let baseUrl = "";
app.use(baseUrl,routes);
  
  // set port, listen for requests
  app.listen(5000, () => {
    console.log("Server is running on port 5000.");
  });

  app.use(function (req, res, next) {
    next(createError(404));
  });
  
  // error handler
  app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
  
    // render the error page
    res.status(err.status || 500);
    res.render('error');
  });
  
module.exports = app;