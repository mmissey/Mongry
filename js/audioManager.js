//AudioManager
var audioManager = {};
audioManager.context;
audioManager.bufferLoader;
audioManager.files = [
	'sounds/Monster_eating.mp3',
	'sounds/Startle_with_creature_drop.mp3',
	'sounds/you_die_and_get_eaten.mp3',
	'sounds/Feeder_Soundtrack.mp3',
	'sounds/step.mp3',
	'sounds/Stuff_in_bag.mp3',
	'sounds/Startle_no_inventory.mp3',
	'sounds/monster_coming_from_afar.mp3',
	'sounds/mongry.mp3',
	'sounds/Flashlight_falls.mp3'
];
audioManager.walking = undefined;
audioManager.theme = undefined;
audioManager.sounds = {};
audioManager.bufferLoader = undefined;
;
audioManager.initSounds = function() {
  audioManager.context = new webkitAudioContext();
  audioManager.bufferLoader = new BufferLoader(audioManager.context, audioManager.files, audioManager.loadSounds);
  audioManager.bufferLoader.load();
}

audioManager.loadSounds = function(bufferList){
	audioManager.sounds['eating'] = bufferList[0];
  	audioManager.sounds['startle'] = bufferList[1];
  	audioManager.sounds['die'] = bufferList[2];
  	audioManager.sounds['soundtrack'] = bufferList[3];
  	audioManager.sounds['walking'] = bufferList[4];
  	audioManager.sounds['stuff'] = bufferList[5];
  	audioManager.sounds['startle2'] = bufferList[6];
  	audioManager.sounds['hurry'] = bufferList[7];
  	audioManager.sounds['mongry'] = bufferList[8];
  	audioManager.sounds['flashlightdrop'] = bufferList[9];
  	audioManager.startTheme();
}

audioManager.playSound = function(buffer, time, loop) {
 	var source =  audioManager.context.createBufferSource();
 	source.buffer = buffer;
	source.connect(audioManager.context.destination);
	if(loop){
		source.loop = true;
	}
	source.noteOn(time);
	return source;
}

audioManager.allOff = function(){
	audioManager.walking.noteOff(0);
	audioManager.theme.noteOff(0);
}
audioManager.startTheme = function(){
	if(audioManager.theme == undefined){
		audioManager.theme = audioManager.playSound(audioManager.sounds['soundtrack'], 0, true);
		audioManager.theme.gain.value = 0.5;
	}else{
		audioManager.theme.connect(audioManager.context.destination);
	}
}

audioManager.pauseTheme = function(){
	audioManager.theme.disconnect();
}

audioManager.startWalking = function(){
	if(audioManager.walking == undefined){
		audioManager.walking = audioManager.playSound(audioManager.sounds['walking'], 0, true);
	}else{
		audioManager.walking.connect(audioManager.context.destination);
	}
}

audioManager.pauseWalking = function(){
	audioManager.walking.disconnect();
}
//audioManager.playSound(audioManager.buffers['die'].buffer, 45)