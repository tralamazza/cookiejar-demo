var socket = io.connect('http://localhost:3456');


$(document).ready(function(){
	setTimeout(function(){
		$(".twitter > #twitter-widget-0").contents().find("head").append("<link rel='stylesheet' href='/css/app.css'>");
		console.log($(".twitter > #twitter-widget-0").contents());
		window.contents = $(".twitter > #twitter-widget-0").contents();
	},5000);
});

var sout;
var theFinalCountdown = 10;
function hand(){
   $(".modal").removeClass("show");
   $(".modal").addClass("show");
   $(".modal.twitter").removeClass("show");
	clearInterval(sout);
	theFinalCountdown = 10;
	$(".modal .content span").addClass("show");
	sout = setInterval(function(){
		theFinalCountdown -=1;
		$(".modal .content span h1 strong").html(theFinalCountdown);
		if (theFinalCountdown === 0){
			clearInterval(sout);
			socket.emit("tweet",lastAddedPhoto);
			handOut();
		}

	},1000);

}

function handOut(){
	
	$(".modal .content span").removeClass("show");
	theFinalCountdown =10;
	$(".modal .content span").removeClass("show");
	$(".modal .content span h1 strong").html(theFinalCountdown);
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
		addImg(photo);
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

function addImg(img){
	$(".history").prepend("<figure file='"+img+"'><img width='480' height='270' src='/images/"+img+"'/></figure>");

}
