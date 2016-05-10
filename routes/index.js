var express = require('express');
var router = express.Router();
var mysqlHandler = require('../module/mysqlHandler');
//var dijkstraHandler = require('dijkstraHandler');

/*POST home page.*/
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

// router.post('/navi', function(req, res, next){



//});
module.exports = router;
