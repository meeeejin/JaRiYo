var mysql = require('mysql');
//pool is simmilar with thread. thread pool
var pool  = mysql.createPool({
  connectionLimit : 10,
  host            : 'localhost',
  user            : 'root',
  password        : 'qwer1234',
  database        : 'jariyo'
});

//exports = {} like an object
exports.updateSpaceState = function(data, callback)
{
	//console.log(data);
	//parameter check
	if(data.spaceId == undefined || data.isEmpty == undefined)
	{
		callback("parameter error");
		return;
	}

	var sql = 'UPDATE ParkingSpace SET `empty`=? where `space_id`=?'
	var params = [];
	params.push(data.isEmpty);
	params.push(data.spaceId);

	pool.getConnection(function(err, connection) {
		// Use the connection
		connection.query(sql, params, function(err, rows) {
			// And done with the connection.
			connection.release();
			callback(err, rows);
			// Don't use the connection here, it has been returned to the pool.
		});
	});
}
exports.getAllNode = function(callback)
{
	var sql = 'SELECT * FROM Node;';
	pool.getConnection(function(err, connection) {
		connection.query(sql, function (err, rows) {
			callback(err, rows);
		});
	});
}
exports.getAllEdge = function(callback)
{
	var sql = 'SELECT * FROM Edge;';
	pool.getConnection(function(err, connection) {
		connection.query(sql, function (err, rows) {
			callback(err, rows);
		});
	});
}
//{node_id:10} data.node_id
//test code
//exports.updateSpaceState({spaceId:10, isEmpty: 0}, function(err, res){console.log(err, res)})