//HUD

var hud = {};
hud.currentWidth = 100;
hud.timer = undefined;
hud.timeToEmpty = 180;
hud.timeLeft = 180;
hud.maxSupply = 20;
hud.timeElapsed = 0;
hud.addTime = function(sec, instant){
	clearTimeout(hud.timer);
	hud.timeLeft += sec;
	if(hud.timeLeft > hud.timeToEmpty){
		hud.timeLeft = hud.timeToEmpty;
	}
	if(hud.timeLeft > 30){
		if(hud.timeLeft > 80){
			$("#hungerLevel").removeClass('yellow').removeClass('red').addClass('green');
		}else{
			$("#hungerLevel").removeClass('red').addClass('yellow');
		}
	}else{
		$("#hungerLevel").removeClass('red').removeClass('yellow').addClass('red');
	}
	if(instant){
		$("#hungerLevel").css({'webkit-transition' : 'none', 'width' : (hud.timeLeft/hud.timeToEmpty)*100 + "%"});
	}
	hud.startBar(false);
}

hud.startBar = function(fill){
	if(hud.timer != undefined){
		clearTimeout(hud.timer);
	}
	$("#hungerLevel").removeClass('red').addClass('green');
	if(fill){
		hud.timeLeft = hud.timeToEmpty;
	}
	//clearTimeout(hud.timer);
	hud.timer = setTimeout(function(){
		hud.incrementBar();
	}, 1000);
}

hud.incrementBar = function(){
	hud.timeLeft -=1;
	hud.timeElapsed += 1;
	//clearTimeout(hud.timer);
	$("#hungerLevel").css({'webkit-transition' : '1s linear', 'width' : (hud.timeLeft/hud.timeToEmpty)*100 + "%"});
	if(hud.timeLeft == 0){
		console.log('LOSE');
		levelManager.die();
		//YOU LOSE
	}else if(hud.timeLeft == 80){
		audioManager.playSound(audioManager.sounds['mongry']);
		$("#hungerLevel").removeClass('green').addClass('yellow').css('-webkit-animation-duration', '0.5s');
		hud.timer = setTimeout(function(){
			hud.incrementBar();
		}, 1000);
	}else if(hud.timeLeft == 30){
		audioManager.playSound(audioManager.sounds['hurry']);
		$("#hungerLevel").removeClass('yellow').addClass('red').css('-webkit-animation-duration', '0.5s');
		hud.timer = setTimeout(function(){
			hud.incrementBar();
		}, 1000);
	}else{
		hud.timer = setTimeout(function(){
			hud.incrementBar();
		}, 1000);
	}	
}
hud.updateSupply = function(supply){
	var newVal = (supply / hud.maxSupply)*100;
	if(supply == 0){
		newVal = 0;
		$("#supplyLevel").removeClass('orange').addClass('yellow');
	}else if(newVal > 100){
		newVal -= 100;
		$("#supplyLevel").removeClass('yellow').addClass('orange');
	}
	$("#supplyLevel").css('width' , newVal + "%");
}
