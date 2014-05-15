var socket = io.connect('http://localhost:3456');

//HERE YOU CAN CHANGE THE COUNTDOWN TIMER AND TWITTER ON/OFF
//---------------------------------------
var THE_FINAL_COUNTDOWN = 5;
var SHOW_TWITTER =true;
//---------------------------------------
//---------------------------------------



$(document).ready(function(){
	if (!SHOW_TWITTER){
		$(".modal.twitter").removeClass("show");
	}
	reloadTwitter();
});

var sout;
var ticker = 10;
function hand(){
   $(".modal").removeClass("show");
   $(".modal").addClass("show");
   $(".modal.twitter").removeClass("show");
	clearInterval(sout);
	ticker = THE_FINAL_COUNTDOWN;
	$(".modal .content span").addClass("show");
	sout = setInterval(function(){
		ticker -=1;
		$(".modal .content span h1 strong").html(ticker);
		if (ticker === 0){
			clearInterval(sout);
			socket.emit("tweet",lastAddedPhoto);
			setTimeout(function(){
				reloadTwitter();
			},5000)
			handOut();
		}

	},1000);

}

function handOut(){
	
	$(".modal .content span").removeClass("show");
	ticker =THE_FINAL_COUNTDOWN;
	$(".modal .content span").removeClass("show");
	$(".modal .content span h1 strong").html(ticker);
	$(".modal").removeClass("show");
	if (SHOW_TWITTER){
		$(".modal.twitter").addClass("show");
	}
}


var scrlAmount = 0;
var currentPhotos = [];
var lastAddedPhoto;
function scrollPage(){
	scrlAmount = scrlAmount - $(window).height();
	$(".history").css("top",scrlAmount+"px");
}




socket.on("photos", function(data){
	console.log(data);
	for (var i = 0, photo; photo = data[i]; i++){
		currentPhotos.push(photo);
		addImg(photo, true);
	}
	console.log(data.length)
});

socket.on("added", function(photo){

	if ($.inArray(photo, currentPhotos) > -1){
	}else{
		lastAddedPhoto = photo;
		$(".modal .content img").attr("src","/images/"+photo);
		currentPhotos.push(photo);
		hand();
		addImg(photo);
	}

});

socket.on("removed", function(photo){
	if ($.inArray(photo, currentPhotos) > -1){
		currentPhotos.split(currentPhotos.indexOf(photo));
		console.log("found in array, remove it");
	}else{

	}

});


socket.on("sensor", function(data){
	$(".deviceInfo span").html(JSON.stringify(data));

});

socket.on("abort", function(){
	clearInterval(sout);
	handOut();
});

function addImg(img, noRemove){
	$(".history").prepend("<figure file='"+img+"'><img width='480' height='270' src='/images/"+img+"'/></figure>");
	
	if (!noRemove){
		$(".history figure").last().remove();
	}
}

function reloadTwitter(){
	$(".twitterBaby").html('<a class="twitter-timeline" href="https://twitter.com/RelayrCookieJar" data-tweet-limit="2" data-widget-id="465936244635996160"></a>');
	var script   = document.createElement("script");
	script.type  = "text/javascript";

	script.text  = "!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+'://platform.twitter.com/widgets.js';fjs.parentNode.insertBefore(js,fjs);}}(document,'script','twitter-wjs');";

	$(".twitterBaby").append(script);
	$(".twitterBaby").hide();

	setTimeout(function(){
		$(".twitterBaby > iframe").contents().find("head").append("<link rel='stylesheet' href='/css/app.css'>");
		$(".twitterBaby > iframe").contents().find("h1").html("<img src='/css/images/twitter.png'/> Who stole the cookies?");
		console.log($(".twitterBaby > iframe").contents());
		window.contents = $(".twitterBaby > iframe").contents();
		$(".twitterBaby").show();
	},2000);
}