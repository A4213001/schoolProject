var express = require('express');
var variable = require('./variable');
var api = express.Router();
var bodyParser = require('body-parser');
var routeMethod = require('./routeMethod');

api.use(bodyParser.json());
api.use(bodyParser.urlencoded({extended: false}));

api.get('/point', function(req, res) {
    res.json({ point: point });
});

api.get('/getRoute/:id', function(req, res) {
	let exist = false;
	for(let i = 0; i < route.length; ++i){
		if(route[i].id == req.params.id){
			res.json({ route : route[i]});
			exist = true;
			break;
		}
	}
	if(!exist){
		res.json({ route : '此id不存在'});
	}
});

api.post('/controlRobot', function(req, res) {
	let params = req.body;
	let index = routeMethod.findIndex(params.id);
	routeMethod.findRoute(point[index].x, point[index].y, params.x, params.y, params.id, index);
	res.json({ route : route[index]});
});

api.post('/insertCargo', function(req, res) {
	let params = req.body;
	if(params.x == 0){
		cargo.left[params.y].unshift(params.targetY);
	} else if (params.x == 13){
		cargo.right[params.y].unshift(params.targetY);
	}
});

module.exports = api;