$(document).ready(function(){
	var Max =0;
	$.get("http://api.flickr.com/services/rest/", {
	    method: "flickr.photos.search",
	    api_key: "90485e931f687a9b9c2a66bf58a3861a",
	    text: "car",
	    safe_search: 1,
	    content_type: 1,
	    sort: "relevance",
	    per_page: 200
	  }, function(data, status, request) {
	    var photos = request.responseXML.getElementsByTagName("photo");
	 
	    for (var i = 0, photo; photo = photos[i]; i++) {
	    	Max++;
	    	$(".history").append("<figure style='background-image: url("+construcURL(photo)+");'></figure>");
	    }
	  }
	);

	function construcURL(photo){
    return "http://farm" + photo.getAttribute("farm") +
        ".static.flickr.com/" + photo.getAttribute("server") +
        "/" + photo.getAttribute("id") +
        "_" + photo.getAttribute("secret") +
        "_m.jpg";
   }
 	$("article.history").addClass("sway");
   var mainTimer= setInterval(function(){

	   	if ($("article.history").hasClass("sway")){

	   		console.log("hasClass");
	   		$("article.history").removeClass("sway");
	   	}else{
	   		console.log("!hasClass");
	   		$("article.history").addClass("sway");
	  

	   	}
   },30000);   
   
   var cycle =0;
   var select= setInterval(function(){


   		$("article.history figure").removeClass("selected");
   		for (var i = cycle; i < cycle + 20; i++) { 
    		$("article.history").find("figure").eq(i).addClass("selected");
		}
		
	   	if ($("article.history").hasClass("sway")){
		   	if (cycle >= Max){
	   			return;
	   		}
			cycle +=20;
	   	}else{
		   	if (cycle <= 0){
	   			return;
	   		}
			cycle -=20;
	  

	   	}

		
		

   },3000);




});   

var theFinalCountdown = 50;
function hand(){
   $(".modal").removeClass("show");
   $(".modal").addClass("show");
   
   setTimeout(function(){
   	$(".modal .content span").addClass("show");
		setInterval(function(){
			theFinalCountdown -=1;
			$(".modal .content span h1 strong").html(theFinalCountdown);
		},1000);
   }, 1000);


}
