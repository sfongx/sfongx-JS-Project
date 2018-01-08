/***************************************************************************************************
* File: main1.js
* Date: 11/29/2017
* Author: Sherwin Fong
*
* Project 4, P2
* Description: Externalized javascript code.
	'mainForm' is the entire form
	'fname' is the name of the sender
	'fname' is the sent message
	'messages' is the messages box
*****************************************************************************************************/

//globals
var username; //store the username
var convoReq; //store the request thing itself
var convoObj; //store the json as an object

//used to avoid printing same message twice
var recentTime; //time of last message 
var recentName; //name of last message sender

function sendClicked(){
	//console.log("you clicked send");
	//get the name and message
	var currName = document.forms["mainForm"]["fname"].value;
	var currMssg = document.forms["mainForm"]["fmessage"].value;
	document.cookie = 'name=' + currName;
	
	if (!currMssg || !currName){
		alert("Please enter a name and message")
	}
	else {
		//post request
		var postReq = new XMLHttpRequest();
		postReq.onreadystatechange = function(){
			if (postReq.readyState == 4){
				if (postReq.status == 200){
					displayNew();
				}
			}
		}
		
		postReq.open('POST', 'server/shout.php');
		postReq.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		postReq.send("name=" + currName + "&message=" + currMssg);
	
		//clear the message box and focus on it
		document.forms["mainForm"]["fmessage"].value = "";
		document.getElementById('message').focus();
	}
}

function clearClicked(){
	//just clear the message box and focus on it	
	document.forms["mainForm"]["fmessage"].value = "";
	document.getElementById('message').focus();
}

function displayNew(){
	//display a message just sent by the user
	//assumes a POST request already went through
	//do a GET request and print out the most recent message
	convoReq = new XMLHttpRequest();
	
	convoReq.onreadystatechange = function(){
		if (convoReq.readyState == 4){
			if (convoReq.status == 200){
				convoObj = JSON.parse(convoReq.responseText);
	
				var convoArr = convoObj['data'];
				var mssgObj = convoArr[0];
				var topName = mssgObj['name'];
				var topTime = mssgObj['time'];
				var topMssg = mssgObj['message'];
				
				//set recent name and time to current message's so that
				//when the interval happens again it will not print this one again
				recentName = topName;
				recentTime = topTime;
				
				var mssgDump =""; //initialize empty string
				
				mssgDump = mssgDump + '<div class="shout">';
				mssgDump = mssgDump + '<span class="timestamp">['+ topTime +'] </span>';
				mssgDump = mssgDump + '<span class="name">'+ topName +'</span>:';
				mssgDump = mssgDump + '<span style="message"> '+ topMssg +'</span>';
				mssgDump = mssgDump + '</div>';	
	
				document.getElementById('messages').innerHTML += mssgDump;
			}
		}
	}
	
	convoReq.open('GET', 'server/shout.php', true);
	convoReq.send(null); //uncomment when testing on server
}

function displayNext(){
	//assumes a GET request already was made
	//get stuff from the first entry
	var convoArr = convoObj['data'];
	var mssgObj = convoArr[0];
	var topName = mssgObj['name'];
	var topTime = mssgObj['time'];
	var topMssg = mssgObj['message'];
	
	var mssgDump = ""; //initialize as empty string
	
	if (recentTime !== topTime || recentName !== topName){
		//if the time or name of the most recent message is different
		//print it and change recent time and name to those
		recentTime = topTime;
		recentName = topName;
		
		mssgDump = mssgDump + '<div class="shout">';
		mssgDump = mssgDump + '<span class="timestamp">['+ topTime +']</span> ';
		mssgDump = mssgDump + '<span class="name">'+ topName +'</span>: ';
		mssgDump = mssgDump + '<span style="message">'+ topMssg +'</span>';
		mssgDump = mssgDump + '</div>';	
	}

	//append the new (or none) message to messages in the HTML
	document.getElementById('messages').innerHTML += mssgDump;
}

function displayAll(){
	//only called when page first loads
	var mssgDump = ""; //initialize as empty string
	
	var name; //name of sender	
	var message; //message itself
	var mssgObj; //message object
	var time; //time of message
	var convoArr = convoObj['data']; //get the enclosing array w/ the mssgs
	
	//loop through the array backwards since latest messages
	//are added to the top
	for (var j = convoArr.length - 1; j >= 0; j--){
		mssgObj = convoArr[j];
		name = mssgObj['name'];
		time = mssgObj['time'];
		message = mssgObj['message'];
		
		mssgDump = mssgDump + '<div class="shout">';
		mssgDump = mssgDump + '<span class="timestamp">['+ time +']</span> ';
		mssgDump = mssgDump + '<span class="name">'+ name +'</span>: ';
		mssgDump = mssgDump + '<span class="message">'+ message +'</span>';
		mssgDump = mssgDump + '</div>';	
	}
	document.getElementById('messages').innerHTML = mssgDump;
}

window.onload = function(){
	//see if the site has been visited before using regex
	if (document.cookie.indexOf('name=') >= 0){
		var regx1 = /name=(\w+)/;
		var username = regx1.exec(document.cookie);
		document.getElementById('name').outerHTML = '<input type="text" class="stretch" id="name" name="fname" value="'+ username[1] +'"/>';
	}
	
	//first request. Display all messages
	convoReq = new XMLHttpRequest();
	
	convoReq.onreadystatechange = function(){
		if (convoReq.readyState == 4){
			if (convoReq.status == 200){
				//if there is nothing in the conversation yet don't parse and print
				var convoArr;
				var topObj;
				if (convoReq.responseText){
					convoObj = JSON.parse(convoReq.responseText);
					displayAll();
				
					//get the time of the most recent for subsequent requests
					var convoArr = convoObj['data'];
					var topObj = convoArr[0];
					recentTime = topObj['time'];
					recentName = topObj['name'];
				}	
			}
		}
	}
	
	convoReq.open('GET', 'server/shout.php', true);
	convoReq.send(null); //uncomment when testing on server
	
	//subsequent requests in an interval
	var reqIval = window.setInterval(function(){
		convoReq = new XMLHttpRequest();		
		convoReq.onreadystatechange = function(){
			if (convoReq.readyState == 4){
				if (convoReq.status == 200){
					//if there is nothing in the conversation yet don't parse and print
					if (convoReq.responseText){
						convoObj = JSON.parse(convoReq.responseText);
						displayNext();
					}
				}
			}
		}
		convoReq.open('GET', '../server/shout.php', true);
		convoReq.send(null);
	}, 15000);
}