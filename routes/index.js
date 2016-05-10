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
	if(req.body.spaceId == undefined || req.body.isEmpty == undefined)
	{
		res.end();
		return;
	}	

	mysqlHandler.updateSpaceState(req.body, function(error, result){
		if(error)
			console.log(error);
		res.end();
	})

});
//req.body={node_id}
router.post('/navi', function(req, res, next){
	if(req.body.node_id == undefined)
	{
		res.json({error: 0});
		return;
	}
	
	navigationHandler.findPath(req.body, function (error, result) {
		if(error)
		{
			console.log(error);
			return;
		}
		
		res.json(result);
		
	})


});
module.exports = router;