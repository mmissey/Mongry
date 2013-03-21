var Room = function(id, width, height){
	this['id'] = id,
	this['doors'] = {},
	this['props'] = [],
	this['obstacles'] = [],
	this['floorURL'] = "img/floor.png",
	this['wallDepth'] = 37.5,
	this['roomHeight'] = width != undefined ? width : 800,
	this['roomWidth'] = height != undefined ? height : 800,
	this['walls'] = {"wall":{"url":"img/wall.png"},"corner":{"url":"img/corner.png"}}
};

Room.prototype.init = function(config){
	this['id'] = config.id;
	this['doors'] = config.doors;
	this['props'] = config.props;
	this['obstacles'] = config.obstacles;
	this['floorURL'] = config.floorURL;
	this['roomHeight'] = config.roomHeight;
	this['roomWidth'] = config.roomWidth;
};

var directions = ['north','south','east','west'];
var flipped = {"north":"south","south":"north","east":"west","west":"east"};

Room.prototype.flipDirection = function(direction){
	return flipped[direction];
}
