
describe("AShowAngular", function() {
   describe("modules should have no existential crises", function() {
      //
      // basic module existence tests...
      //
      it("should have defined 'AShow' module", function() {
         expect(angular.module('AShow')).toBeDefined();
      });
      it("should have defined 'AShow.services' module", function() {
         expect(angular.module('AShow.services')).toBeDefined();
      });
      it("should have defined 'AShow.directives' module", function() {
         expect(angular.module('AShow.directives')).toBeDefined();
      });
   });
   describe("injectables", function() {
      var injector;
      beforeEach(function() {
         injector = angular.element('body').injector();
      });
      it("injector should be able to invoke self", function() {
         expect(injector.get('$injector')).toBe(injector);
         expect(injector.invoke(function($injector) {
            return $injector;
         })).toBe(injector);
      });
      it("injector should be able to inject $compile and $rootScope", function() {
         injector.invoke(['$compile','$rootScope', function($compile, $rootScope) {
            expect($compile).toBeTruthy();
            expect($rootScope).toBeTruthy();
         }]);
      });
      
      it("should be able to retrieve slides via service", function() {
         injector.invoke(['Slides', function(Slides) {
            var slides = Slides.query({showId:'example1'}); // json or api
            //var slides = Slides.forShow('example1'); // if browsing local files
            
            waitsFor(function() {
               return slides.length > 0;
            }, "should have finished loading slides",
            2000);
            
            runs(function() {
               expect(slides.length).toBeTruthy();
               expect(slides[0].index).toBeTruthy();
               expect(slides[0].content).toBeTruthy();
            });
         }]);
      });
      
      it("should be able to process aSlideshow directive", function() {
         injector.invoke(['$compile','$rootScope', function($compile, $rootScope) {
            var testShowElement = $compile(
               "<div id='test' a-slideshow></div>"
               )($rootScope);
            $rootScope.$digest();
            
            // Directive should have created AShow instance linked to element.
            var show = testShowElement[0].AShow;
            expect(show).toBeDefined();
            // Make sure property is created from attribute.
            expect(show.slideshow_id).toEqual('test');
         }]);
      });
      it("should be able to process aSlide directive", function() {
         injector.invoke(['$compile','$rootScope', function($compile, $rootScope) {
            // slideshow_id of example1 should find slides, thus triggering creation
            // of slide elements bearing the a-slide directive.
            var testShowElement = $compile(
               "<div id='example1' a-slideshow></div>"
               )($rootScope);
            $rootScope.$digest();
            
            // Directive should have created a .slide elements
            expect(testShowElement.find('.AShowSlide').length).toBeTruthy();
            
            // Directive should populate slides for show.
            var show = testShowElement[0].AShow;
            expect(show).toBeTruthy();
            
            waitsFor(function() {
               return show.slides.length > 0;
            }, "slides to finished loading",
            5000);
            
            runs(function() {
               expect(show.slidesByIndex).toBeTruthy();
               expect(show.slidesByIndex['0,0']).toBeTruthy();
               expect(show.slidesByIndex['0,0'].element).toBeTruthy();
               expect(show.slidesByIndex['0,0'].element.html()).toEqual(
                  "First example slide..."
               );
            });
            
         }]);
      });
   });
   
});
