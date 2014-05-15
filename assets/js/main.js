var socket = io.connect('http://localhost:3456');

//HERE YOU CAN CHANGE THE COUNTDOWN TIMER
//---------------------------------------
var THE_FINAL_COUNTDOWN = 5;
//---------------------------------------
//---------------------------------------



$(document).ready(function(){
	setTimeout(function(){
		$(".twitter > #twitter-widget-0").contents().find("head").append("<link rel='stylesheet' href='/css/app.css'>");
		$(".twitter > #twitter-widget-0").contents().find("h1").html("Chocolate Feed");
		console.log($(".twitter > #twitter-widget-0").contents());
		window.contents = $(".twitter > #twitter-widget-0").contents();
	},5000);
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
	$(".modal.twitter").addClass("show");
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
