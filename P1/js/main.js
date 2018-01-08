/***************************************************************************************************
* File: main.js
* Date: 11/29/2017
* Author: Sherwin Fong
*
* JS-Project, P1
* Description: Externalized javacript code for P1
	bx1 through bx9 are the mole boxes
	'timeRem' is the box for the time remaining
	'score' is the score box for the current game
	'highscore' is the high score box
*****************************************************************************************************/

var startTime; //hold the start time, whenever that is
var gameOver = false; //is the game over
var gameOn = false; //can tell if user started a game
var timeLeft; //store the counter
var score; //game score
var highScore; //high score (will reset upon refresh)

//store the state of whether or not a box has a mole
//initialized all to false (not up)
var boxStates = {
	'bx1': false,
	'bx2': false,
	'bx3': false,
	'bx4': false,
	'bx5': false,
	'bx6': false,
	'bx7': false,
	'bx8': false,
	'bx9': false	
}

function startClicked(){
	if (gameOn == false){
		//first get the high score from the cookie
		if (document.cookie.indexOf("highscore=") >= 0){
			//site has been visited before
			var regx1 = /highscore=(\d+)/;
			var mtc = regx1.exec(document.cookie);
			highScore = mtc[1];
			document.getElementById('highScore').innerHTML = highScore;
		}
		else{
			//first visit, set highScore to 0
			highScore = 0;
		}		
		
		//middle guy is up when game is not on. Get him down
		document.getElementById('bx5').innerHTML = '<img src="img/down.png" />';
		//get the current time
		startTime = Date.now(); //current time for reference
		//set score to zero and display it.
		score = 0;
		document.getElementById('score').innerHTML = score;
		
		//set gameOn to true so none of this happens
		//again if it's already started and the user clicks "start game"
		gameOn = true;
		
		//loop through the boxes to addEventListener to each
		var currId;
		var currBox;
		for (var j = 1; j <= 9; j++){
			currId = "bx" + j;
			currBox = document.getElementById(currId);
			currBox.addEventListener('click', boxHit);			
		}

		//interval for the moles coming up
		var upIval = window.setInterval(function(){
			//9 squares. If rand is 0 1 will be picked.
			//floor function so need a +1 to make sure between 1-9
			var onNum = Math.floor((Math.random() * 9) + 1);
			var onNumStr = "bx" + onNum;
			boxStates[onNumStr] = true;
			document.getElementById(onNumStr).innerHTML = '<img src="img/up.png" />';
			setTimeout(function(){
				document.getElementById(onNumStr).innerHTML = '<img src="img/down.png" />';
				boxStates[onNumStr] = false;
			}, 575)
		}, 1000);
		
		//interval for the game clock
		var countDown = setInterval(function(){	
			var currTime = Date.now();
			var diff = currTime - startTime;
			diff = Math.floor((diff % (1000 * 60)) / 1000);
			timeLeft = 31 - diff; //takes a while to spool up
			document.getElementById('timeRem').innerHTML = timeLeft;
			
			if (timeLeft <= 0){
				//clear all intervals
				clearInterval(countDown);
				clearInterval(upIval);
				//bring the middle guy back up and say game over
				document.getElementById('timeRem').innerHTML = "GAME<br><br>OVER!";
				document.getElementById('bx5').innerHTML = '<img src="img/up.png" />';
				
				//remove the event listener to make sure everything is
				//counted only once on successive games
				for (var j = 1; j <= 9; j++){
					currId = "bx" + j;
					currBox = document.getElementById(currId);
					currBox.removeEventListener('click', boxHit);			
				}

				if (score > highScore){
					highScore = score;
					document.getElementById('highScore').innerHTML = highScore;
					document.cookie = 'highscore=' + highScore + '; expires="Sun, 31 Dec 2017 11:59:59 UTC; path=/';
				}
				gameOn = false;
			}
		}, 1000); //do once every second
	}
}

function boxHit(){
	var boxId = this.id;

	switch(boxId){
		case "bx1":
			if (boxStates['bx1'] == true){
				score++;
				boxStates['bx1'] = false;
			}			
		break;		
		case "bx2":
			if (boxStates['bx2'] == true){
				score++;
				boxStates['bx2'] = false;
			}
		break;	
		case "bx3":
			if (boxStates['bx3'] == true){
				score++;
				boxStates['bx3'] = false;
			}
		break;		
		case "bx4":
			if (boxStates['bx4'] == true){
				score++;
				boxStates['bx4'] = false;
			}
		break;		
		case "bx5":
			if (boxStates['bx5'] == true){
				score++;
				boxStates['bx5'] = false;
			}
		break;
		case "bx6":
			if (boxStates['bx6'] == true){
				score++;
				boxStates['bx6'] = false;
			}
		break;		
		case "bx7":
			if (boxStates['bx7'] == true){
				score++;
				boxStates['bx7'] = false;
			}
		break;		
		case "bx8":
			if (boxStates['bx8'] == true){
				score++;
				boxStates['bx8'] = false;
			}
		break;		
		case "bx9":
			if (boxStates['bx9'] == true){
				score++;
				boxStates['bx9'] = false;
			}
		break;		
		default:
			//do nothing
		break;
	}
	//if score went up show the update
	document.getElementById('score').innerHTML = score;	
}

window.onload = function(){
	var startBut = document.getElementById('startBtn');
	startBut.onclick = startClicked;
}

//var t = document.getElementById('timeRem')