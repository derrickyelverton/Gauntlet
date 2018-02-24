var constantUtils = null;
var gameController = null;
var inputController = null;
	

window.onload = function() {
	alert("Starting the game! Welcome to Saturn Gauntlet X.");
	constantUtils = new ConstantUtils();
	// create the game
	gameController = new Game();
    //create the input
	inputController = new Input();

	document.getElementById('newGameButton').onclick = function() {
		gameController.setupNewGame();
		document.getElementById('statusClockStart').innerHTML = "";
	}

	document.getElementById('showHeatMapButton').onclick = function() {
		gameController.showHeatMap();
	}

	document.getElementById('nextBoardButton').onclick = function() {
		gameController.setupNewLevel();
	}
	
	
	// setup a interval of 5 mil to have the game redraw itself 
	setInterval(function() {
		// draw
		if (gameController.timer != undefined) {
			if (document.getElementById('statusClockStart').innerHTML == "") {
				document.getElementById('statusClockStart').innerHTML = gameController.timer.getSeconds();
			}
			gameController.draw(gameController.timer.getSeconds());
			// update health and magic bar
			document.getElementById('healthBar').style = 'height:25px;width:'+gameController.hero.health+'%;background-color:red;';
			document.getElementById('magicBar').style = 'height:25px;width:'+gameController.hero.magic+'%;background-color:blue;';
			document.getElementById('experienceBar').style = 'height:25px;width:'+gameController.hero.experience+'%;background-color:green;';
			// update status
			document.getElementById('statusCanvasWidth').innerHTML = Constants.canvasWidth;
			document.getElementById('statusCanvasHeight').innerHTML = Constants.canvasHeight;
			document.getElementById('statusClockRun').innerHTML = gameController.timer.getSeconds() - document.getElementById('statusClockStart').innerHTML;
			document.getElementById('statusClock').innerHTML = gameController.timer.getSeconds();
			if (gameController.timer.getSeconds() != Constants.lastSecond) {
				Constants.lastSecond = gameController.timer.getSeconds();
				document.getElementById('statusFPS').innerHTML = Constants.runTime - Constants.lastRunTime;
				Constants.lastRunTime = Constants.runTime;
			}
			document.getElementById('statusGameTime').innerHTML = Constants.runTime;
			document.getElementById('statusPlayerHealth').innerHTML = gameController.hero.health;
			document.getElementById('statusPlayerMagic').innerHTML = gameController.hero.magic;
			document.getElementById('statusPlayerExperience').innerHTML = gameController.hero.experience;
			document.getElementById('statusPlayerLevel').innerHTML = gameController.hero.level;
		}
	}, 10);
}
