var mapLoaded = false;
window.MAP = null;
window.positionMark = null;
var device = !! window.cordova ? 'cordova' : 'html5';

function loadMap(){

            if(!utils.coverage) return;
                
           		 	     	var canvas = document.getElementById('map');
                      _location.latLng = new google.maps.LatLng(_location.lat,_location.lng);

          		 	     	var options = {
 								 center: _location.latLng ,
 								 zoom: 13,
 								 mapTypeId: google.maps.MapTypeId.ROADMAP
									};                  


          		 	      
                window.MAP = new google.maps.Map(canvas, options);
                utils.position.init();


                  enviroment[device].watchPosition();

                                     

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


var render = {
      map : function(){

              $('#map').height( ($(window).height() - $('header').height())  );
      }
}


var utils = {
       position : 
            
       {
         update : function(){

          if(google){

            _location.latLng = new google.maps.LatLng(_location.lat,_location.lng);
             positionMark.setPosition(_location.latLng);

             console.log('position changed');
             
          }

         

        },
        init : function(){

            positionMark = new google.maps.Marker({
                 position: _location.latLng,
                 map: window.MAP,                 
                 icon : 'assets/img/current.png'
                });

        },

        getCity : function( callback){

              $.getJSON('http://maps.googleapis.com/maps/api/geocode/json?latlng=' + _location.lat + ',' + _location.lng, function(rs){

                                     _location.city = rs.results[0].address_components[3].short_name.split(' ')[0];
                                      console.log(JSON.stringify(_location));

                                      if(callback)
                                         callback(_location);

                                });

        }

       },
       coverage : function(){
            return enviroment[device].isOnline();
       }
}

var _location = {
     lat : null,
     lng : null,
     city : null,
     latLng : null        
}


 var enviroment = {
      html5 : {
              //metodos para app corriendo html5
              perms : {  // permisos 
                    location : function( callback){  // localizacion

                         if(navigator.geolocation)
                           navigator.geolocation.getCurrentPosition(function(position){

                                _location.lat = position.coords.latitude;
                                _location.lng = position.coords.longitude;



                               utils.position.getCity( callback);


                              
                           })

                    }
              },
              watchPosition : function(){   // checamos el cambio de posicion del usuario

                                navigator.geolocation.watchPosition(function(position) {

                                 
                                        _location.lat = position.coords.latitude;
                                        _location.lng = position.coords.longitude;
                                         utils.position.update();

                                }, null, {maximumAge: 3000, timeout: 5000, enableHighAccuracy: true} );



              },
              isOnline : function(){  var online = navigator.online;  }
      },
      // metodos para cordova 
      cordova : {
          init : function(){

               $(document).on('deviceReady', function(){

               })

          }
      }
 }


var app = angular.module('motelea', ['ngRoute', 'ngAnimate']);   


app.controller('nearCtrl', function(){
     
                render.map();
                loadScript('//maps.google.com/maps/api/js?sensor=false&callback=loadMap');
   					//	  loadScript('//google-maps-utility-library-v3.googlecode.com/svn/trunk/geolocationmarker/src/geolocationmarker-compiled.js');
                //var GeoMarker = new GeolocationMarker(MAP);

   						

 });      		 	    


app.controller('searchCtrl', function($scope){
     
   						$scope.city = "";
              $scope.searching = false;


              $scope.toggle = function(){
                   $scope.searching = !$scope.searching;
                   console.log($scope.searching);
              }

              enviroment[device].perms.location(function(loc){

                  $scope.$apply(function() {
                      $scope.city = loc.city;
                      });

              });


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



 app.run(function($window, $rootScope){


        $(window).on('resize', render.map);
       
 
 });
