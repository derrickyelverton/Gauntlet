function Input() {
	this.loggedIn = false;
	this.accessRequested = false;
	this.lastUserInputString = null;

	// set the user input 
	window.addEventListener('keydown', this.handleKeyDown, false);
	window.addEventListener('keyup', this.handleKeyUp, false);
	gameController.canvas.addEventListener('mousedown', this.handleMouseDown, false);
}

Input.prototype.handleInputCommand = function(userInputString) {
	userInputString = userInputString.toLowerCase();
	
    if (userInputString.indexOf('hello') >= 0) {
		document.getElementById('outputField').innerHTML = 'There is no one around to hear you.';
	}
	else if (userInputString.indexOf('look') >= 0) {
		document.getElementById('outputField').innerHTML = 'You look around and see nothing of value, but have an erie feeling that someone is watching you.';
	}
	else if (userInputString.indexOf('search') >= 0) {
		document.getElementById('outputField').innerHTML = 'You search around but find nothing of value, maybe you need to be more specific.';
	}
	else if (userInputString.indexOf('get') >= 0) {
		document.getElementById('outputField').innerHTML = 'You are unable to get that.';
	}
	else if (userInputString.indexOf('take') >= 0) {
		document.getElementById('outputField').innerHTML = 'You are unable to take that.';
	}
	else if (userInputString.indexOf('give') >= 0) {
		document.getElementById('outputField').innerHTML = 'There is no one around to get it to';
	}
	else if (userInputString.indexOf('acquire') >= 0) {
		document.getElementById('outputField').innerHTML = 'You can not acquire that now.';
	}
	else if (userInputString.indexOf('swipe') >= 0) {
		document.getElementById('outputField').innerHTML = 'You can not swipe that.';
	}
	else if (userInputString.indexOf('pick') >= 0) {
		document.getElementById('outputField').innerHTML = 'You can not pick that.';
	}
	else if (userInputString.indexOf('pluck') >= 0) {
		document.getElementById('outputField').innerHTML = 'You can not puck that.';
	}
	else if (userInputString.indexOf('pull') >= 0) {
		document.getElementById('outputField').innerHTML = 'You can not pull that.';
	}
	else if (userInputString.indexOf('push') >= 0) {
		document.getElementById('outputField').innerHTML = 'You can not push that.';
	}
	else if (userInputString.indexOf('bow') >= 0) {
		document.getElementById('outputField').innerHTML = 'You can not bow.';
	}
	else if (userInputString.indexOf('jump') >= 0) {
		document.getElementById('outputField').innerHTML = 'You can not jump.';
	}
	else if (userInputString.indexOf('open') >= 0) {
		document.getElementById('outputField').innerHTML = 'There is nothing around to open.';
	}
	else if (userInputString.indexOf('close') >= 0) {
		document.getElementById('outputField').innerHTML = 'There is nothing around to close.';
	}
	else if (userInputString.indexOf('move') >= 0) {
		document.getElementById('outputField').innerHTML = 'There is nothing around to move.';
	}
	else if (userInputString.indexOf('climb') >= 0) {
		document.getElementById('outputField').innerHTML = 'There is nothing around to climb.';
	}
	else if (userInputString.indexOf('scale') >= 0) {
		document.getElementById('outputField').innerHTML = 'There is nothing around to scale.';
	}
	else if (userInputString.indexOf('show') >= 0) {
		document.getElementById('outputField').innerHTML = 'There is nothing around to show or anyone to show it to.';
	}
	else if (userInputString.indexOf('talk') >= 0) {
		document.getElementById('outputField').innerHTML = 'There is no one around to talk to.';
	}
	else if (userInputString.indexOf('build') >= 0) {
		document.getElementById('outputField').innerHTML = 'There is nothing around to build.';
	}
	else if (userInputString.indexOf('plant') >= 0) {
		document.getElementById('outputField').innerHTML = 'There is nothing around to plant.';
	}
	else if (userInputString.indexOf('play') >= 0) {
		document.getElementById('outputField').innerHTML = 'There is nothing around to play.';
	}
	else if (userInputString.indexOf('eat') >= 0) {
		document.getElementById('outputField').innerHTML = 'There is nothing around to eat.';
	}
	else if (userInputString.indexOf('read') >= 0) {
		document.getElementById('outputField').innerHTML = 'There is nothing around to read.';
	}
	else if (userInputString.indexOf('drink') >= 0) {
		document.getElementById('outputField').innerHTML = 'There is nothing around to drink.';
	}
	else if (userInputString.indexOf('attack') >= 0) {
		document.getElementById('outputField').innerHTML = 'Hit the F key to fire';
	}
	else if (userInputString.indexOf('do you understand what i am saying') >= 0) {
		document.getElementById('outputField').innerHTML = 'Sometime, i am programmed to respond to you in a way you might feels like a "human".';
	}
	else if (userInputString.indexOf('i dont like you') >= 0  || userInputString.indexOf("i don't like you") >= 0) {
		document.getElementById('outputField').innerHTML = 'I dont like you either.';
	}
	else if (userInputString.indexOf('what is your favorite movie') >= 0) {
		document.getElementById('outputField').innerHTML = 'I have never seen a movie. I dont have eyes';
	}
	else if (userInputString.indexOf('what is your name') >= 0 || userInputString.indexOf('do you have a name') >= 0) {
		document.getElementById('outputField').innerHTML = 'My name is , well I do not have a name.  I am a program. Silly';
	}
	else if (userInputString.indexOf('what is your favorite color') >= 0 || userInputString.indexOf('do you have a favorite color') >= 0) {
		document.getElementById('outputField').innerHTML = 'I do not have a favorite color';
	}
	else if (userInputString.indexOf('what is your favorite food') >= 0) {
		document.getElementById('outputField').innerHTML = 'I do not eat food. I suppose it enjoy being on in and eating power';
	}
	else if (userInputString.indexOf('next') >= 0) {
		gameController.setupNewLevel();
	}
	else if (userInputString.indexOf('walk') >= 0) {
		Keys.getDown.push(Keys.RIGHT);
	}
	else if (userInputString.indexOf('stop') >= 0) {
		Keys.getDown = [];
	}
	else if (userInputString.indexOf('shoot') >= 0) {
		Keys.getDown.push(Keys.SPACE);
		setTimeout(function(){ Keys.getDown = []; }, 1000);
	}
	else if (userInputString.indexOf('punch') >= 0) {
		Keys.getDown.push(Keys.P);
		setTimeout(function(){ Keys.getDown = []; }, 1000);
	}
	else if (userInputString.indexOf('kick') >= 0) {
		Keys.getDown.push(Keys.K);
		setTimeout(function(){ Keys.getDown = []; }, 1000);
	}
	else if (userInputString.indexOf('go') >= 0 || userInputString.indexOf('up') >= 0 || userInputString.indexOf('down') >= 0 ||
	userInputString.indexOf('right') >= 0 || userInputString.indexOf('left') >= 0) {
		document.getElementById('outputField').innerHTML = 'Use the arrow keys';
	}
	else if (userInputString.indexOf('request access') >= 0) {
		document.getElementById('outputField').innerHTML = 'Username/Password';
		this.accessRequested = true;
	}
	else if (this.accessRequested && userInputString.indexOf('saturn/welcome') >= 0) {
		document.getElementById('outputField').innerHTML = 'logged in to system. welcome saturn';
		this.loggedIn = true;
	}
	else {
		document.getElementById('outputField').innerHTML = 'I am not sure what you are trying to do?';
	}
	this.lastUserInputString = userInputString;

}

/*
{----------------------------------------------}
Controls                                      }
{----------------------------------------------}

Up Arrow - Move North/Up
Down Arrow - Move South/Down
Left Arrow - Move West
Right Arrow - Move East
Page Up - Move Northeast
Page Down - Move Southeast
Home - Move Northwest
End- Move Southwest

+ - Faster Speed
= - Normal Speed
- - Slower Speed

F1 - Open Help Menu
F2 - Toggle Sound On/Off
F3 - Retype Last Command
F4 - Duck
F5 - Save Game
F6 - Jump
F7 - Restore Game
F9 - Restart Game

Ctrl A - About KQ1
Ctrl Q - Quit Game
Ctrl p - Pause Game
Ctrl I - Inventory
Ctrl S - Change Speed
Ctrl V - Change Volume 

Esc - Open Menu Bar
Tab - Open Inventory
Space - Retype Last Message

*/
Input.prototype.handleKeyDown = function(e) {
	switch (e.keyCode) {
	    case Keys.ENTER:
		    if (document.getElementById('inputField').value != '') {
			   inputController.handleInputCommand(document.getElementById('inputField').value);
			   this.gameController.hero.communication.push(document.getElementById('inputField').value);
			}
		    break;
		case Keys.SPACE:
			Keys.getDown.push(Keys.SPACE);
			break;
		case Keys.SHIFT:
			Keys.getDown.push(Keys.SHIFT);
			break;

		case Keys.A:
			if (!constantUtils.inArray(Keys.D, Keys.getDown) && !constantUtils.inArray(Keys.A, Keys.getDown)) {
				Keys.getDown.push(Keys.A);
			}
			break;
	   case Keys.D:
			if (!constantUtils.inArray(Keys.A, Keys.getDown) && !constantUtils.inArray(Keys.D, Keys.getDown)) {
				Keys.getDown.push(Keys.D);
			}
			break;
		case Keys.W:
			if (!constantUtils.inArray(Keys.W, Keys.getDown) && !constantUtils.inArray(Keys.S, Keys.getDown)) {
				Keys.getDown.push(Keys.W);
			}
			break;
		case Keys.K:
			if (!constantUtils.inArray(Keys.W, Keys.getDown) && !constantUtils.inArray(Keys.S, Keys.getDown)) {
				Keys.getDown.push(Keys.K);
			}
			break;
		case Keys.P:
			if (!constantUtils.inArray(Keys.W, Keys.getDown) && !constantUtils.inArray(Keys.S, Keys.getDown)) {
				Keys.getDown.push(Keys.P);
			}
			break;
		case Keys.S:
			if (!constantUtils.inArray(Keys.S, Keys.getDown) && !constantUtils.inArray(Keys.W, Keys.getDown)) {
				Keys.getDown.push(Keys.S);
			}
			break;
		case Keys.LEFT:
			if (!constantUtils.inArray(Keys.RIGHT, Keys.getDown) && !constantUtils.inArray(Keys.LEFT, Keys.getDown)) {
				Keys.getDown.push(Keys.LEFT);
			}
			break;
	   case Keys.RIGHT:
			if (!constantUtils.inArray(Keys.LEFT, Keys.getDown) && !constantUtils.inArray(Keys.RIGHT, Keys.getDown)) {
				Keys.getDown.push(Keys.RIGHT);
			}
			break;
		case Keys.UP:
			if (!constantUtils.inArray(Keys.UP, Keys.getDown) && !constantUtils.inArray(Keys.DOWN, Keys.getDown)) {
				Keys.getDown.push(Keys.UP);
			}
			break;
		case Keys.DOWN:
			if (!constantUtils.inArray(Keys.DOWN, Keys.getDown) && !constantUtils.inArray(Keys.UP, Keys.getDown)) {
				Keys.getDown.push(Keys.DOWN);
			}
			break;
	}
}

Input.prototype.handleMouseDown = function(e) {
/*
	var gridOffsetY = 0;
	var gridOffsetX = 0;

	// Take into account the offset on the X axis caused by centering the grid horizontally
	gridOffsetX += (gameController.canvas.width / 2) - (gameController.tile.width / 2);

	var col = (e.clientY - gridOffsetY) * 2;
	col = ((gridOffsetX + col) - e.clientX) / 2;
	
	var row = ((e.clientX + col) - gameController.tile.height) - gridOffsetX;

	row = Math.round(row / gameController.tile.height);
	col = Math.round(col / gameController.tile.height);

	// Check the boundaries!
	if (row >= 0 && 
		col >= 0 && 
		row <= gameController.grid.width &&
		col <= gameController.grid.height) {

		gameController.tileMap[row] = (gameController.tileMap[row] === undefined) ? [] : gameController.tileMap[row];
			
		gameController.tileMap[row][col] = 1;
	}
*/	
}

Input.prototype.handleKeyUp = function(e) {
	switch (e.keyCode) {
		case Keys.C:
			if (Constants.currentHero === (Constants.spritesheet.length - 1)) {
				Constants.currentHero = 0;
			} else {
				Constants.currentHero++;
			}
			
			gameController.hero.setSpritesheet(Constants.spritesheet[Constants.currentHero]);
			break;
		case Keys.W:
		case Keys.D:
		case Keys.S:
		case Keys.A:
		case Keys.K:
		case Keys.P:
		case Keys.SPACE:
		case Keys.SHIFT:
		case Keys.LEFT:
		case Keys.RIGHT:
		case Keys.UP:
		case Keys.DOWN:
			Keys.getDown = constantUtils.removeFromArray(e.keyCode, Keys.getDown);
			break;
	}
}	
