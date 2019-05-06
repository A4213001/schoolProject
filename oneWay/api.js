var express = require('express');
var variable = require('./variable');
var api = express.Router();

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

module.exports = api;