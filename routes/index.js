/**
 * Created by hyeji on 2016. 5. 8..
 */

//0: parameter undefined

var express = require('express');
var router = express.Router();
var mysqlHandler = require('../module/mysqlHandler');
var navigationHandler = require('../public/javascripts/navigation');

/*POST home page.*/
//req.body={spaceID, isEmpty}
router.post('/led_lamp', function(req, res, next){ //{spaceId: 10, isEmpty: 0}
	console.log(req.body)
	if(req.body.spaceId == undefined || req.body.isEmpty == undefined)
	{
		res.end();
		return;
	}	
	console.log(req.body)
	mysqlHandler.updateSpaceState(req.body, function(error, result){
		if(error)
		{
			console.log(error);
			res.json({error:1});
		}
		else res.json({error:0});
	});
});
//led_lamp Fin.
//req.body={node_id, option}
router.post('/navi', function(req, res, next){
	if(req.body.node_id == undefined)
	{
		console.log(error);
		res.json({error: 1});
		return;
	}
	console.log(req.body);
	navigationHandler.findPath(req.body, function (error, result) {
		console.log("In the navigationHandler function!!!!!!!!!!!!");
		if(error)
		{
			console.log("Error occurred!!!!!!!!!!!!!!!!!!!!");
			console.log(error);
			res.json(1);
		}
		else res.json(result);
		console.log("After IFELSE not occured!!!!!!!!!!!!!!!!!!!");
	});
});
module.exports = router;