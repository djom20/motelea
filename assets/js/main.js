var mapLoaded = false;

function loadMap(){
          		 	     	var canvas = document.getElementById('map');
          		 	     	var options = {
 								 center: new google.maps.LatLng(-34.397, 150.644),
 								 zoom: 8,
 								 mapTypeId: google.maps.MapTypeId.ROADMAP
									};
          		 	     	var MAP = new google.maps.Map(canvas, options);

          		 	     }

function loadScript(src) {
  
  if(mapLoaded)
  	{
  		loadMap();
  		return;
  	}

  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = src;
  document.body.appendChild(script);
  mapLoaded = true;

}


 var app = angular.module('motelea', ['ngRoute', 'ngAnimate']);   


 app.controller('nearCtrl', function(){
     
          		 	     $('#map').height( ($(window).height() - $('header').height()) - 30 );
   						  loadScript('http://maps.google.com/maps/api/js?sensor=false&callback=loadMap');
   						

 });      		 	    


  app.controller('searchCtrl', function(){
     
   						

 });      		 	     


 app.config(['$routeProvider', '$locationProvider',
    function($routeProvider, $locationProvider) {
     
      $routeProvider
        .when('/', {
          templateUrl: 'views/home.html',
          controller : 'searchCtrl'
        })
        .when('/home', {
          templateUrl: 'views/home.html',
          controller : 'searchCtrl'
        })
        .when('/near', {
          templateUrl: 'views/near.html', 
          controller : 'nearCtrl'
        })
        .when('/promos', {
          templateUrl: 'views/promos.html'
        })


    }]);