var Door = function(xpos, ypos, rotation, width, height, direction, fromId, toId){
	this.direction = direction;
	this.doorParent = fromId;
	this.index = (toId == undefined ? -1 : toId);
	this.x = xpos;
	this.y = ypos;
	this.width = width || 30;
	this.height = height || 30;
}