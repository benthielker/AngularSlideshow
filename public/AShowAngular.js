'use strict';

//
// If you need console output to troubleshoot set verbose to true.
// Use log function to issue additional console logs.
//
var verbose = false,
   log = function(msg) {
      if (verbose) console.log(msg);
   };

//
// App module
//
var app = angular.module("AShow", [
   "AShow.controllers",
   "AShow.directives",
   "AShow.services"
]);

//
// Controllers
//
angular.module("AShow.controllers", [
]).
controller("slideshowCtrl", ["$scope", "Slides",
   function($scope, Slides) {
      //
      // All logic currently required is handled by directives and services.
      //
   }
]);

//
// Directives
//
angular.module("AShow.directives", [
]).
directive("aSlideshow", ['$compile', 'Slides', function($compile, Slides) {
   return {
      link : function(scope, element) {
         log("aSlideshow directive called for element.id '"+element.attr('id')+"'");
         //
         // Create AShow instance for element and register with scope.
         // (Will be configured by element attributes.)
         //
         var thisShow = AShow.MakeShowWithElement(element);
         // lookup slides for this show
         //thisShow.slides = Slides.forShow(thisShow.slideshow_id); // if running as local file
         thisShow.slides = Slides.query({showId:thisShow.slideshow_id}); // for json or api
         if (typeof(scope.shows)=='undefined') scope.shows = {};
         scope.shows[thisShow.slideshow_id] = thisShow;
         //
         // Populate element with .slides div which will hold slide content divs.
         //
         var slidesRepoHtml = "<div class='AShowSlides'>"+
               "<div class='AShowSlide' ng-repeat='slide in shows."+thisShow.slideshow_id+".slides' a-slide></div>"+
            "</div>";
         var slidesRepo = $compile(slidesRepoHtml)(scope);
         element.append(slidesRepo);
      }
   };
}]).
directive("aSlide", function() {
   return {
      link : function(scope, element) {
         log("aSlide directive called.");
         log(". element.parent.AShow:"+element.parents('.AShow')[0].AShow);
         //
         // Create AShowSlide instance for this slide content element.
         // Link to AShow instance assigned to the parent element.
         //
         var slide = scope.slide,
            show = element.parents('.AShow')[0].AShow;
         if (slide && show)
         {   
            var showId = show.slideshow_id;
            log(". slide:"+slide+", show:"+show+" showId:"+showId);
            
            // populate element with slide content.
            element.html(slide.content);
            
            // create AShowSlide instance for element.
            var instance = AShowSlide.MakeSlideWithElementForShow(element, show, {
               'index' : slide.index
            });
            
            // Check if this is last slide to load.
            if (scope.$last) {
               // Display show navigation controls.
               show.createControls();
               // Call show's advance method to display first slide.
               show.advance();
            }
         }
         else
         {   
            if (!slide) throw new Error("aSlide directive ERROR: slide object not found in scope.");
            if (!show) throw new Error("aSlide directive ERROR: show object '"+showId+"' not found in scope.");
         }
      }
   };
});

//
// Services
//
angular.module("AShow.services", [
   "ngResource"
])
.factory("Slides", ["$resource", "$q",
   function($resource, $q) {
      
      
      //
      // Lookup via api call...
      // Comment out this section (including return) to use json file lookup instead.
      //
      var result = $resource('api/slides/:showId');
      return result;
      
      
      //
      // Lookup from json file...
      // Comment out this section (including return) to use hardcoded list instead.
      //
      var result = $resource('slides/:showId.json');
      return result;
      
      
      //
      // Lookup from hardcoded value list...
      // (Works when browsing files locally)
      // Requires commenting out above lookups and calling
      //      Slides.forShow(show.slideshow_id)
      // instead of
      //      Slides.query({showId:show.slideshow_id});
      //
      return {
         forShow : function(showId, callback) {
            //
            // Lookup from hard-coded value list.
            // (In lieu of ability to make $resource call when running as local file
            // in browser)
            //
            var slides_by_show = {
               "example1" : [
                  {   
                     "index" : [0,0],
                     "content" : "Example1 Slide 1..."
                  },
                  {   
                     "index" : [1,0],
                     "content" : "Example1 Slide 2..."
                  },
                  {   
                     "index" : [2,0],
                     "content" : "Example1 Slide 3..."
                  }
               ],
               "example2" : [
                  {   
                     "index" : [0,0],
                     "content" : "Example2 Slide 1..."
                  },
                  {   
                     "index" : [1,0],
                     "content" : "Example2 Slide 2..."
                  },
                  {   
                     "index" : [2,0],
                     "content" : "Example2 Slide 3..."
                  }
               ],
               "example3" : [
                  {   
                     "index" : [0,0],
                     "content" : "Example3 Slide 1..."
                  },
                  {   
                     "index" : [0,1],
                     "content" : "Example3 Slide 2..."
                  },
                  {   
                     "index" : [0,2],
                     "content" : "Example3 Slide 3..."
                  }
               ],
               "example4" : [
                  {   
                     "index" : [0,0],
                     "content" : "Example4 Slide 0,0..."
                  },
                  {   
                     "index" : [0,1],
                     "content" : "Example4 Slide 0,1..."
                  },
                  {   
                     "index" : [0,-1],
                     "content" : "Example4 Slide 0,-1..."
                  },
                  {   
                     "index" : [1,0],
                     "content" : "Example4 Slide 1,0..."
                  },
                  {   
                     "index" : [1,1],
                     "content" : "Example4 Slide 1,1..."
                  },
                  {   
                     "index" : [1,-1],
                     "content" : "Example4 Slide 1,-1..."
                  },
                  {   
                     "index" : [2,0],
                     "content" : "Example4 Slide 2,0..."
                  },
                  {   
                     "index" : [2,1],
                     "content" : "Example4 Slide 2,1..."
                  },
                  {   
                     "index" : [2,-1],
                     "content" : "Example4 Slide 2,-1..."
                  }
               ],
               "gemHunter" : [
                  {
                     "index" : [0,0],
                     "content" : "<div style='background-image:url(images/maze_room_0_0.jpg)'><div class='dialog' onclick='dismiss(this)'><p>You have fallen into a labyrinth, and must find your way out.</p><p>You can tap items to collect them along the way.</p></div></div>"
                  },
                  {
                     "index" : [1,0],
                     "content" : "<img src='images/maze_room_1_0.jpg'/>"
                  },
                  {
                     "index" : [1,-1],
                     "content" : "<img src='images/maze_room_1_-1.jpg'/>"
                  },
                  {
                     "index" : [2,-1],
                     "content" : "<div style='background-image:url(images/maze_room_2_-1.jpg)'><img id='key' class='collectable' onclick='collect(this)' style='top:175px;left:310px'/></div>"
                  },
                  {
                     "index" : [1,1],
                     "content" : "<img src='images/maze_room_1_1.jpg'/>"
                  },
                  {
                     "index" : [2,1],
                     "content" : "<img src='images/maze_room_2_1.jpg'/>"
                  },
                  {
                     "index" : [1,2],
                     "content" : "<img src='images/maze_room_1_2.jpg'/>"
                  },
                  {
                     "index" : [0,2],
                     "content" : "<div style='background-image:url(images/maze_room_0_2.jpg)'><img id='gems' class='collectable' onclick='collect(this)' style='top:200px;left:175px'/></div>"
                  },
                  {
                     "index" : [1,3],
                     "content" : "<img src='images/maze_room_1_3.jpg'/>"
                  },
                  {
                     "index" : [2,3],
                     "content" : "<img src='images/maze_room_2_3.jpg'/>"
                  },
                  {
                     "index" : [3,3],
                     "content" : "<img src='images/maze_room_3_3.jpg'/>"
                  },
                  {
                     "index" : [3,2],
                     "content" : "<img src='images/maze_room_3_2.jpg'/>"
                  },
                  {
                     "index" : [3,0],
                     "content" : "<div id='goal'><h1>Congratulations!</h1><p>You have escaped the maze.</p><div id='score'></div></div>"
                  }
               ]
            };
            //
            // Return promise to simulate resource call.
            //
            var getSlidesForShow = function(showId) {
               var deferred = $q.defer(),
                  promise = deferred.promise,
                  data = slides_by_show[showId];
               if (data) {
                  deferred.resolve(data);
               } else {
                  deferred.reject("No slides found for show id '"+showId+"'.");
               }
               
               promise.then(function(value) {
                  // deferred.resolve callback
                  // Apply vales to promise object to approximate resource behavior.
                  for (var i in value) promise[i] = value[i];
                  promise.length = value.length;
                  promise.$resolved = true;
                  if (callback) callback();
               }, function(reason) {
                  // deferred.reject callback
                  throw new Error(reason);
               }, function(update) {
                  // deferred.notify callback
                  console.log(update);
               });
               
               return promise;
            };
            var result = getSlidesForShow(showId);
            return result;
         }
      };
      
   }
]);