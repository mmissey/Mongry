var doorimg = new Image();
doorimg.src = 'img/door.png';
var backdoorimg = new Image();
backdoorimg.src = 'img/door_back.png';
var golddoor = new Image();
golddoor.src = 'img/door_gold.png';
var RoomManager = function(config) {
		this['doorCount'] = 1;
		this['enemies'] = [{
			'type': 'a',
			'value': 1,
			'width': 30,
			'height': 30		
		},{
				'type': 'b',
				'value': 5,
				'width': 30,
				'height': 30
			}
		];
		this['floors'] = {
			'def': 'img/floor.png',
			'tile': 'img/tilefloor.png',
			'office': 'img/carpet.png'
		}

		this['obstacles'] = {
			'def': [{            //chair
				'img': new Image(),
				'height': 50,
				'width': 40,
				'type': 'ofloor'
			}, {                 //bed
				'img': new Image(),
				'height': 50,
				'width': 35,
				'type': 'ofloor'
			}, {                //sideshelf
				'img': new Image(),
				'height': 80,
				'width': 35,
				'type': 'ofloor'
			}, {                //blacktable
				'img': new Image(),
				'height': 37,
				'width': 37,
				'type': 'ofloor'
			}, {                //closed cabinet
				'img': new Image(),
				'height': 55,
				'width': 32,
				'type': 'ofloor'
			}, {                   //stool
				'img': new Image(),
				'height': 20,
				'width': 20,
				'type': 'ofloor'
			}, {                    //metal table
				'img': new Image(),
				'height': 25,
				'width': 35,
				'type': 'ofloor'
			}, {                     //boxes
				'img': new Image(),
				'height': 60,
				'width': 35,
				'type': 'ofloor'
			}],
			//room type 2 
			"tile": [{            //cleartable
				"img": new Image(),
				"height": 60,
				"width": 92,
				"type": "ofloor"
			}, {                 //fridge
				"img": new Image(),
				"height": 32,
				"width": 32,
				"type": "ofloor"
			}, {                //machine
				"img": new Image(),
				"height": 28,
				"width": 28,
				"type": "ofloor"
			}, {                //mysteryobject
				"img": new Image(),
				"height": 27,
				"width": 22,
				"type": "ofloor"
			}, {                //oven
				"img": new Image(),
				"height": 32,
				"width": 32,
				"type": "ofloor"
			}, {                   //roundtable
				"img": new Image(),
				"height": 48,
				"width": 48,
				"type": "ofloor"
			}, {                    //tub
				"img": new Image(),
				"height": 32,
				"width": 50,
				"type": "ofloor"
			}, {                     //metalcabinet
				"img": new Image(),
				"height": 33,
				"width": 33,
				"type": "ofloor"
			}],
			//room type 3 
			"office": [{            //alchemyshelf
				"img": new Image(),
				"height": 32,
				"width": 32,
				"type": "ofloor"
			}, {                 //blacktable
				"img": new Image(),
				"height": 40,
				"width": 45,
				"type": "ofloor"
			}, {                //drawers
				"img": new Image(),
				"height": 33,
				"width": 33,
				"type": "ofloor"
			}, {                //largebookshelf
				"img": new Image(),
				"height": 32,
				"width": 64,
				"type": "ofloor"
			}, {                //wineshelf
				"img": new Image(),
				"height": 32,
				"width": 32,
				"type": "ofloor"
			}, {                   //woodbookshelf
				"img": new Image(),
				"height": 32,
				"width": 32,
				"type": "ofloor"
			}, {                    //closedcabinet
				"img": new Image(),
				"height": 32,
				"width": 32,
				"type": "ofloor"
			}, {                     //sideshelf
				"img": new Image(),
				"height": 32,
				"width": 32,
				"type": "ofloor"
			}]

		
		};

		this.obstacles.tile[0].img.src = "img/cleartable.png";
		this.obstacles.tile[1].img.src = "img/fridge.png";
		this.obstacles.tile[2].img.src = "img/machine.png";
		this.obstacles.tile[3].img.src = "img/mysteryobject.png";
		this.obstacles.tile[4].img.src = "img/oven.png";
		this.obstacles.tile[5].img.src = "img/roundtable.png";
		this.obstacles.tile[6].img.src = "img/tub.png";
		this.obstacles.tile[7].img.src = "img/metalcabinet.png"; 

		this.obstacles.def[0].img.src = 'img/chair.png';
		this.obstacles.def[1].img.src = 'img/bed.png';
		this.obstacles.def[2].img.src = 'img/side_shelf.png';
		this.obstacles.def[3].img.src = 'img/black_table.png';
		this.obstacles.def[4].img.src = 'img/closed_cabinet.png';
		this.obstacles.def[5].img.src = 'img/stool.png';
		this.obstacles.def[6].img.src = 'img/metal_table.png';
		this.obstacles.def[7].img.src = 'img/stacked_boxes.png'; 

		this.obstacles.office[0].img.src = 'img/alchemyshelf.png';
		this.obstacles.office[1].img.src = 'img/blacktable.png';
		this.obstacles.office[2].img.src = 'img/drawers.png';
		this.obstacles.office[3].img.src = 'img/largebookshelf.png';
		this.obstacles.office[4].img.src = 'img/wineshelf.png';
		this.obstacles.office[5].img.src = 'img/woodbookshelf.png';
		this.obstacles.office[6].img.src = 'img/closedcabinet.png';
		this.obstacles.office[7].img.src = 'img/sideshelf.png';


		this.doorimg = new Image();
		this.doorimg.src = 'img/door.png'; 
		this['MAXDOORS'] = 3;      
	};

RoomManager.prototype.generateRoom = function(fromDoor, distance) {
	var rm = this;

	var newDoors = 8; //Math.max(1, Math.floor(this.MAXDOORS * Math.random())) + rm.doorCount;
	var position;
	var direction;
	var height = undefined;
	var width = undefined;

	var myRoom;
	var roomItemCount = undefined;

	var typeKeys = Object.keys(rm.obstacles);
	var roomType = typeKeys[~~(Math.random()* typeKeys.length)];

	if(fromDoor.doorParent == -1){
		myRoom = new Room(0, 800, 800);
		roomItemCount = 0;
		roomType = 'def';
	} else {
		height = Math.max(DEFAULTS.MINRoomHeight,(Math.min((~~(Math.random()*(DEFAULTS.MAXRoomHeight+DEFAULTS.MINRoomHeight))),DEFAULTS.MAXRoomHeight)));
		width  = Math.max(DEFAULTS.MINRoomWidth,(Math.min((~~(Math.random()*(DEFAULTS.MAXRoomWidth+DEFAULTS.MINRoomWidth))),DEFAULTS.MAXRoomWidth)));
		myRoom = new Room(fromDoor.index, width, height);
	}

	myRoom['type'] = roomType;

	var doorWidth = 100;
	var doorHeight = myRoom.wallDepth/2;		//NOTE: this assumes the non-rotated door is oriented horizontally

	var firstDoor = rm.generateDoor(myRoom, doorWidth, doorHeight, fromDoor.doorParent, 0, myRoom.flipDirection(fromDoor.direction));
	myRoom.doors['0']= firstDoor;//new Door(0,0,0,0,0, myRoom.flipDirection(fromDoor.direction), fromDoor.doorParent, 0);

	myRoom.doors['0'].image = backdoorimg;  

	var doors = ~~(Math.random() * rm.MAXDOORS) + 1;
	for(var i = 0; i < doors; i++){
		var door = rm.generateDoor(myRoom, doorWidth, doorHeight, fromDoor.index, rm.doorCount);
		if (door != undefined) {
			myRoom.doors[rm.doorCount] = door;
			rm.doorCount = rm.doorCount+1; 
		}else{
			return;
		}
		door.image = rm.doorimg;
	}

	myRoom.floorURL = rm.floors[roomType];

	this.generateItems(myRoom, 0, roomItemCount, roomItemCount); //distance doesn't do anything yet 
	return myRoom;
}

RoomManager.prototype.generateDoor = function(myRoom, doorWidth, doorHeight, parentId, destinationId, direction) {
	var rm = this;
	var direction = direction || directions[~~(Math.random()*directions.length)];
	var wallLength = rm.getWallLength(myRoom, direction);

	var failCount = 0;
	var position = Math.min(Math.max((~~(Math.random()*(wallLength+myRoom.wallDepth))), myRoom.wallDepth) +200, (wallLength - myRoom.wallDepth - doorWidth)-200);	//a starting position for the door on the wall.
	while(rm.doorCollide(position, doorWidth, direction, myRoom.doors)){
		position = Math.min(Math.max((~~(Math.random()*(wallLength+myRoom.wallDepth))), myRoom.wallDepth) +200, (wallLength - myRoom.wallDepth - doorWidth)-200);

		failCount++;
		if (failCount > 5) {
			return undefined;
		} else if (failCount > 2) {
			direction = directions[~~ (Math.random() * directions.length)];
		}

	}

	var thisDoorWidth = undefined;
	var thisDoorHeight = undefined;
	var xpos = undefined;
	var ypos = undefined;
	var rotation = undefined;

	switch (direction) {
		case "north":
			rotation = 0;
			thisDoorWidth = doorWidth;
			thisDoorHeight = doorHeight;
			ypos = myRoom.wallDepth - doorHeight + 1; //so door doesn't protrude into room more than a pixel
			xpos = position;
		break;
		case "south":
			rotation = 180;
			thisDoorWidth = doorWidth;
			thisDoorHeight = doorHeight;
			ypos = myRoom.roomHeight - myRoom.wallDepth - 1;
			xpos = position;
		break;
		case "east":
			rotation = 90;
			thisDoorWidth = doorHeight;
			thisDoorHeight = doorWidth;
			xpos = myRoom.roomWidth - myRoom.wallDepth - 1;
			ypos = position;
		break;
		case "west":
			rotation = 270;
			thisDoorWidth = doorHeight;
			thisDoorHeight = doorWidth;
			xpos = myRoom.wallDepth - doorHeight + 1; //so door doesn't protrude into room more than a pixel
			ypos = position;
		break;
	}
	var newDoor = new Door(xpos, ypos, rotation, thisDoorWidth, thisDoorHeight, direction, parentId, destinationId);
	return newDoor;
}

RoomManager.prototype.getWallLength = function(r, direction) {
	return ((direction == "north" || direction == "south") ? r.roomWidth : r.roomHeight);

};

RoomManager.prototype.doorCollide = function(position, width, direction, doors) {
	var doesNotCollide = true;
	var doorMin;
	var doorMax;
	var testMin = position;
	var testMax = position+width;
	if(Object.keys(doors).length > 0 && position != undefined){
		$.each(doors, function(i, door){
			if(door.direction == direction){
				doorMin = (door.direction == "north" || door.direction == "south") ? door.x : door.y;
				doorMax = doorMin + ((door.direction == "north" || door.direction == "south") ? door.width : door.height);
				doesNotCollide = doesNotCollide && (doorMin > testMax) || (doorMax < testMin);
				if(!doesNotCollide){
					return !doesNotCollide;
				}
			}
		});
	}
	return !doesNotCollide;
}

//super cheap, will be WAY worse if we try to implement non-rectangular rooms
RoomManager.prototype.getWallLength = function(room, direction) {
	var dimension = (direction == "north" || direction == "south") ? room.roomWidth : room.roomHeight;
	return dimension;
}

RoomManager.prototype.generateItems = function(r, distance, numEnemies, numObstacles) {
	var type = r['type'] != undefined ? r['type'] : 'def';
	distance += 1;
	var rm = this;
	var prop = undefined;
	var i = 0;
	var xpos = undefined;
	var ypos = undefined;
	var propRotation = undefined;
	var typeLookup = undefined;
	var roomWidth = r.roomWidth;
	var roomHeight = r.roomHeight;

	var roomSizeScalar = (roomHeight * roomWidth) / (DEFAULTS.MAXRoomWidth*DEFAULTS.MAXRoomHeight);

	var transfer = {};
	r.enemies = [];
	r.obstacles = [];

	numEnemies = ~~(Math.random() * DEFAULTS.MAXenemies * roomSizeScalar);
	
	if(numEnemies < 1 && r.id !== 0){
		numEnemies = 1;
	}

	for (i = 0; i < numEnemies; i++) {
		transfer = new Object();
		$.extend(transfer, rm.enemies[~~ (Math.random() * rm.enemies.length)]);
		r.enemies.push(transfer);
		i += transfer.value;
	}

	i = 0;

	numObstacles = Math.max(~~(Math.random() * DEFAULTS.MAXobstacles * (roomSizeScalar ) * (distance+1)), 5);
	if(numObstacles > DEFAULTS.MAXobstacles){ numObstacles = DEFAULTS.MAXobstacles; } 
	
	if(r.id == 0){
		numObstacles = 0;
	}

	for (i = 0; i < numObstacles; i++) {
		transfer = new Object();
		$.extend(transfer, rm.obstacles[type][~~ (Math.random() * rm.obstacles[type].length)]);
		r.obstacles.push(transfer);
	}
}

RoomManager.prototype.doesCollide = function(r, xpos, ypos, typeLookup) {
	var nocollision = false;
	if ((xpos != undefined || ypos != undefined) && r.obstacles.length > 0) {
		$.each(r.obstacles, function(key, obstacle) {
			nocollision = nocollision || (obstacle.x + obstacle.width) < xpos || (obstacle.y + obstacle.height) < ypos || obstacle.x < (xpos + typeLookup.width) || obstacle.y > (ypos + typeLookup.height);
		});
	} else if ((xpos != undefined || ypos != undefined) && r.obstacles.length == 0) {
		nocollision = true;
	}
	return !nocollision;
}
