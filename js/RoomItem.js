var RoomItem = function(xpos, ypos, myRotation, typeLookup, myType){

	return {
		x:xpos,
		y:ypos,
		rotation:myRotation,
		height:typeLookup.height,
		width:typeLookup.width,
		type:myType,
		movable:typeLookup.movable,
		url:typeLookup.url+"/"+typeLookup.width+"/"+typeLookup.height,
		speed:3,
		frameCount:1
	}
}