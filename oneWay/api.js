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

api.post('/test', function(req, res) {
	let params = req.body;
	let index = routeMethod.findIndex(params.id);
	routeMethod.findRoute(point[index].x, point[index].y, params.x, params.y, params.id, index);
	res.json({ route : route[index]});
});

module.exports = api;