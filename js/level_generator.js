//Level Generator/Manager
//Feeder

var levelManager = {};
levelManager.rooms = [];
var currentRoom = 0;
var rm = new RoomManager(); 

levelManager.rooms[0] = rm.generateRoom({'index':0, 'doorParent':-1}, 0);

levelManager.navigate = function(door){
	if(door.doorParent == -1){
		//FEED THE MONSTER
		if(player.items.length > 0){
			levelManager.feedMonster();
			floorTextIndex = floorTextIndex + 1;
			
			impress().goto('win'); 
			$('body').css('pointer-events', 'none'); 

			setTimeout(function(){
				impress().goto('play'); 
				$('body').css('pointer-events', 'all');
			}, 2000);
			return;

		//FEED ME	

		}
		//hud.addTime(5, true);
		
	}
	else if(door.index == 0){
		currentRoom = door.doorParent;
		$('#roomNumber').text(currentRoom);
		//console.log(door.index);
		return levelManager.rooms[door.doorParent];
	}
	else if(levelManager.rooms[door.index] !==  undefined){
		//console.log(door.index);
		$('#roomNumber').text(currentRoom);
		return levelManager.rooms[door.index];
	}
	else{
		levelManager.rooms[door.index] = rm.generateRoom(door);
		currentRoom = door.index;
		$('#roomNumber').text(currentRoom);
		//console.log(door.index);
		return levelManager.rooms[door.index];
	} 	

};

levelManager.feedMonster = function(){
	if(player.items.length > 0){
		var newTime = player.items.length*10;
		audioManager.playSound(audioManager.sounds['eating']);
		player.foundItems = player.foundItems.concat(player.items);
		player.items = [];
		hud.updateSupply(0);
		hud.addTime(newTime);
		rm = new RoomManager();

		var firstRoom= this.rooms[0];
		this.rooms = [];
		this.rooms[0] = firstRoom;
	}
}

levelManager.die = function(){
	audioManager.playSound(audioManager.sounds['flashlightdrop']);
	$('#playboard').trigger('startRumble'); 
	setTimeout(function(){
		player.dead = true;
	}, 1000);
	setTimeout(function(){
		audioManager.playSound(audioManager.sounds['die']);
		$('#playboard').trigger('stopRumble');
		impress().goto('lose');
	}, 2000);  

	var min = ~~ (hud.timeElapsed / 60);
    var seconds = hud.timeElapsed % 60;
    if (seconds < 10) {
        seconds = '0' + seconds;
    }
	$("<div id='time'>").html('YOU LASTED ' + min + ' MINUTES ' + seconds + ' SECONDS, FED ' + player.foundItems.length + ' CRITTERS, AND EXPLORED ' + levelManager.rooms.length + ' ROOMS').appendTo('#lose');
	$("<div id='playagain'>").html('PLAY AGAIN?').bind('click', function(){
		levelManager.restartGame();
	}).appendTo('#lose');
	
}

levelManager.restartGame = function(){
	$('#lose').empty();
	impress().goto('play');
	rm = null;
	rm = new RoomManager(); 
	player.items = [];
	player.foundItems = [];
	hud.startBar(true);
	hud.updateSupply(0);
	hud.timeElapsed = 0;
	currentRoom = 0;
	player.dead = false;
	levelManager.rooms = [];
	levelManager.rooms[0] = rm.generateRoom({'index':0, 'doorParent':-1}, 0);
	for (var b = world.m_bodyList; b; b = b.m_next){
			if(b.type !== 'player'){
				world.DestroyBody(b);
			}
		}  
	
		var room = levelManager.rooms[currentRoom];  
		world.roombounds(room);
		drawFloor(room);
		player.SetPosition(new b2Vec2(400, 400));
		world.changeroom = false;
};
