var currPosition;
var currFood;

$(document).ready(function(){
	getLocation();
	$("#makeMeHappy").click(function(){
		var money = $("[name='money']").val();	
		var people = $("[name='people']").val();	
		var food = $("[name='food'] option:selected").text().replace("food", "").trim();
		var time = $("[name='time'] option:selected").text();;	
		var uber = $("[name='uber'] option:selected").text();;	
		var lat = currPosition.coords.latitude;
		var lon = currPosition.coords.longitude;
		$.ajax({
		  type: "POST",
		  url: "/v1/find",
		  data: {
		  	food: food.replace("food", ""),
			slat: lat,
			slon: lon		  	
		  },
		  success: function(data){
		  	console.log(data);
		  	data.restaurants.forEach(function(item, idx){
		  			if(idx >= 5) return;
		  			var thisDiv = jQuery('<div class="cardLayout"><div class="top"><div class="bkg"></div><div class="name"></div><div class="location"></div></div><div class="bottom"><div class="stars"></div><div class="price"></div></div></div>', {
					    id: 'cardId' + idx
					});
					console.log("asdasd");
					thisDiv.addClass("cardLayout");
					thisDiv.find(".name").text(item.name);
					thisDiv.find(".location").text(item.address.address_locality + ", " + item.address.address_region);
					for(var j = 0; j < item.ratings.rating_value; j++){
						var starDiv = jQuery('<div/>', {
						});
						starDiv.addClass("glyphicon glyphicon-star");
						starDiv.appendTo(thisDiv.find(".stars"));
					}
					thisDiv.find(".bkg").css("background-image", "url('" + item.logo + "')");
					thisDiv.find(".price").text("$" + ((item.delivery_minimum.price / 100) + 10));
					thisDiv.appendTo($(".foodList"));
					$(".foodList").show();

					thisDiv.click(function(){
						currFood = item;
						$(".foodList").hide();
						$(".movieList").show();
						data.movies.forEach(function(item, idx2){
							if(idx2 >= 5) return;
							var movieDiv = jQuery('<div class="cardLayout"><div class="top"><div class="bkg"></div><div class="name"></div><div class="location"></div></div><div class="bottom"><div class="stars"></div><div class="price"></div></div></div>', {
					    		id: 'cardId' + idx
							});
							movieDiv.addClass("cardLayout");
							movieDiv.find(".name").text(item.title);
							movieDiv.find(".location").text(item.showtimes[0].theatre.name);
							movieDiv.find(".stars").text(item.ratings[0].code);
							var time = new Date(item.showtimes[0].dateTime);
							movieDiv.find(".price").text((time.getHours() < 10 ? ("0" + time.getHours()) : time.getHours())
							 + ":" + (time.getMinutes() < 10 ? ("0" + time.getMinutes()) : time.getMinutes()));
							movieDiv.appendTo(".movieList");

							movieDiv.click(function(){
								calculateUber(currFood, item);
							})
						});
					});
		  	});
		  }
		});
	});
});

function calculateUber(food, movie){
	var ways = [];
	var currLoc = new google.maps.LatLng(currPosition.coords.latitude,currPosition.coords.longitude);
	 var request = {
	    location: currLoc,
	    radius: '500',
	    query: movie.showtimes[0].theatre.name
	  };

	  var $attrib = $('<div id="attributions"></div>');
	  service = new google.maps.places.PlacesService($attrib[0]);
	  service.textSearch(request, function(results, status){
	  	console.log(results[0]);
	  	if (status == google.maps.places.PlacesServiceStatus.OK) {
			var datas = [{
			  	slat: currPosition.coords.latitude,
				slon: currPosition.coords.longitude,
				elat: food.address.latitude,
				elon: food.address.longitude
			  }, {
				slat: food.address.latitude,
				slon: food.address.longitude,
			  	elat: results[0].geometry.location.lat(),
				elon: results[0].geometry.location.lng()
			  }, {
			  	slat: results[0].geometry.location.lat(),
				slon: results[0].geometry.location.lng(),
				elat: currPosition.coords.latitude,
				elon: currPosition.coords.longitude
			  }]
			getUber(datas[0], function(data){
					ways[0] = data;
					getUber(datas[1], function(data){
						ways[1] = data;
						getUber(datas[2], function(data){
							ways[2] = data;
							var foodDiv = $(".finalFood");
							foodDiv.find(".name").text(food.name);
							foodDiv.find(".location").text(food.address.address_locality + ", " + food.address.address_region);
							for(var j = 0; j < food.ratings.rating_value; j++){
								var starDiv = jQuery('<div/>', {
								});
								starDiv.addClass("glyphicon glyphicon-star");
								starDiv.appendTo(foodDiv.find(".stars"));
							}
							foodDiv.find(".bkg").css("background-image", "url('" + food.logo + "')");
							foodDiv.find(".price").text("$" + ((food.delivery_minimum.price / 100) + 10));

							var movieDiv = $(".finalMovie");
							movieDiv.find(".name").text(movie.title);
							movieDiv.find(".location").text(movie.showtimes[0].theatre.name);
							movieDiv.find(".stars").text(movie.ratings[0].code);
							var time = new Date(movie.showtimes[0].dateTime);
							movieDiv.find(".price").text((time.getHours() < 10 ? ("0" + time.getHours()) : time.getHours())
							 + ":" + (time.getMinutes() < 10 ? ("0" + time.getMinutes()) : time.getMinutes()));

							for(var j = 0; j < 3; j++){
								$(".time" + j).text(ways[j].duration + "m");
								$(".money" + j).text(ways[j].price);
							}

							$(".planList").css("display", "inline-block");
						 	$(".movieList").hide();
						});
					});
				});
		}
	  });
}

function getUber(data, cb){
	$.ajax({
		  type: "POST",
		  url: "/v1/uber",
		  data: data,
		  success: function(data){
		  	cb({
		  		price: data.price.prices[0].estimate,
		  		duration: data.price.prices[0].duration / 60,
		  		distance: data.price.prices[0].distance
		  	});
		  }
		});
}



function getLocation() {
    navigator.geolocation.getCurrentPosition(locationSuccess, locationError);
}

function locationSuccess(position) {
	currPosition = position;
}

function locationError(error) {
	currPosition = null;
}
