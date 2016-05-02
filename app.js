var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var mysql = require('mysql');
var connection = mysql.createConnection({
  host : 'localhost',
  user : 'root',
  password : 'qwer1234',
  multipleStatements: true
});

var app = express();

// Database setup
connection.query('CREATE DATABASE IF NOT EXISTS jariyo', function (err) {
  if (err) throw err;
  connection.query('USE jariyo', function (err) {
    if (err) throw err;
    connection.query('CREATE TABLE IF NOT EXISTS ParkingLot('
            + 'parkinglot_id INT NOT NULL AUTO_INCREMENT,'
            + 'parkinglot_name VARCHAR(50) NOT NULL,'
            + 'total_floor INT NOT NULL default 0,'
            + 'PRIMARY KEY(parkinglot_id)'
            + ') ENGINE=InnoDB DEFAULT CHARSET=utf8;'

            + 'CREATE TABLE IF NOT EXISTS ParkingFloor('
            + 'floor_id INT NOT NULL AUTO_INCREMENT,'
            + 'total_space INT NOT NULL default 0,'
            + 'empty_space INT NOT NULL default 0,'
            + 'parkinglot_id INT NOT NULL,'
            + 'PRIMARY KEY(floor_id),'
            + 'FOREIGN KEY(parkinglot_id) REFERENCES ParkingLot(parkinglot_id) ON UPDATE CASCADE ON DELETE CASCADE'
            + ') ENGINE=InnoDB DEFAULT CHARSET=utf8;'

            + 'CREATE TABLE IF NOT EXISTS Node('
            + 'node_id INT NOT NULL AUTO_INCREMENT,'
            + 'node_loc_x INT NOT NULL default 0,'
            + 'node_loc_y INT NOT NULL default 0,'
            + 'PRIMARY KEY(node_id)'
            + ') ENGINE=InnoDB DEFAULT CHARSET=utf8;'

            + 'CREATE TABLE IF NOT EXISTS Edge('
            + 'edge_id INT NOT NULL AUTO_INCREMENT,'
            + 'head_node_id INT NOT NULL,'
            + 'tail_node_id INT NOT NULL,'
            + 'total_empty_space INT NOT NULL default 0,'
            + 'floor_id INT NOT NULL,'
            + 'PRIMARY KEY(edge_id),'
            + 'FOREIGN KEY(head_node_id) REFERENCES Node(node_id) ON UPDATE CASCADE ON DELETE CASCADE,'
            + 'FOREIGN KEY(tail_node_id) REFERENCES Node(node_id) ON UPDATE CASCADE ON DELETE CASCADE,'
            + 'FOREIGN KEY(floor_id) REFERENCES ParkingFloor(floor_id) ON UPDATE CASCADE ON DELETE CASCADE'
            + ') ENGINE=InnoDB DEFAULT CHARSET=utf8;'

            + 'CREATE TABLE IF NOT EXISTS ParkingSpace('
            + 'space_id INT NOT NULL AUTO_INCREMENT,'
            + 'edge_id INT NOT NULL,'
            + 'empty INT NOT NULL default 0,'
            + 'space_loc_x INT NOT NULL default 0,'
            + 'space_loc_y INT NOT NULL default 0,'
            + 'PRIMARY KEY(space_id),'
            + 'FOREIGN KEY(edge_id) REFERENCES Edge(edge_id) ON UPDATE CASCADE ON DELETE CASCADE'
            + ') ENGINE=InnoDB DEFAULT CHARSET=utf8;'
            , function (err) {
      if (err) throw err;
    });
  });
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
