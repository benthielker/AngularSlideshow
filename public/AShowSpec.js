describe("AShow & AShowSlide", function() {
	
	//
	// Define test data...
	//
	var testShows = [];
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
		]
	};
	
	//
	// Tests performed in order of dependence.
	// Tests providing functionality or objects needed for later tests must come first.
	//
	describe("AShow.MakeShowWithElement",
		function() {
			// define repetitive tests...
			var testParentPopulatedWithElements = (function(showIdx) {
				expect(testShows[showIdx].element.find('.AShowFrame').length).toBeTruthy();
				expect(testShows[showIdx].element.find('.AShowSlideHolder').length).toBeTruthy();
			});
		
			describe("test show instance 1", function() {
				it("creates instance configured by attributes", function() {
					var show = testShows[0] = AShow.MakeShowWithElement($('#example1'));
					expect(show.slideshow_id).toEqual('example1');
					expect(show.height).toEqual(150);
					expect(show.width).toEqual(300);
					expect(show.transition_duration).toEqual(750);
					expect(show.loop_dimensions.join(',')).toEqual('0');
					expect(show.advance_delay).toEqual(4000);
					expect(show.advance_change.join(',')).toEqual('1,0');
				});
				it("populates instance parent with dynamic elements", function() {
					testParentPopulatedWithElements(0);
				});
			});
			describe("test show instance 2", function() {
				it("creates instance configured by attributes", function() {
					var show = testShows[1] = AShow.MakeShowWithElement($('#example2'));
					expect(show.slideshow_id).toEqual('example2');
					expect(show.height).toEqual(150);
					expect(show.width).toEqual(300);
					expect(show.transition_duration).toEqual(500);
					expect(show.loop_dimensions.length).toBeFalsy();
				});
				it("populates instance parent with dynamic elements", function() {
					testParentPopulatedWithElements(1);
				});
			});
			describe("test show instance 3", function() {
				it("creates instance configured by attributes", function() {
					var show = testShows[2] = AShow.MakeShowWithElement($('#example3'));
					expect(show.slideshow_id).toEqual('example3');
					expect(show.height).toEqual(150);
					expect(show.width).toEqual(300);
					expect(show.transition_duration).toEqual(500);
					expect(show.loop_dimensions.join(',')).toEqual('1');
					expect(JSON.stringify(show.direction_labels)).toEqual(
						'{"down":"Next","left":"Left","right":"Right","up":"Prev"}'
					);
				});
				it("populates instance parent with dynamic elements", function() {
					testParentPopulatedWithElements(2);
				});
			});
			describe("test show instance 4", function() {
				it("creates instance configured by attributes", function() {
					var show = testShows[3] = AShow.MakeShowWithElement($('#example4'));
					expect(show.slideshow_id).toEqual('example4');
					expect(show.height).toEqual(150);
					expect(show.width).toEqual(300);
					expect(show.transition_duration).toEqual(750);
					expect(show.loop_dimensions.join(',')).toEqual('0,1');
					expect(JSON.stringify(show.direction_labels)).toEqual(
						'{"down":"South","left":"West","right":"East","up":"North"}'
					);
				});
				it("populates instance parent with dynamic elements", function() {
					testParentPopulatedWithElements(3);
				});
			});
		}
	);
	
	describe("AShowSlide.MakeSlideWithElementForShow",
		function() {
			//
			// Populate elements with slides to simulate angularjs behavior.
			//
			var show = null,
				showIdx = 0,
				slideRepository = null;
			beforeEach(function() {
				show = testShows[showIdx++];
				slideRepository = $("<div class='AShowSlides'></div>");
			});
			afterEach(function() {
				show.element.append(slideRepository);
			});
			
			// define repetitive tests...
			var testCreateInstances = (function() {
				var slideData = slides_by_show[show.slideshow_id],
					slidesDefined = [],
					successValue = [];
				for (var s in slideData) {
					var data = slideData[s];
				
					// generate slide element and append to repository
					var element = $("<div class='AShowSlide' ng-repeat='slide in shows."+
						show.slideshow_id+".slides' a-slide>"+data.content+"</div>");
					slideRepository.append(element);
				
					// Create slide instance
					var slide = AShowSlide.MakeSlideWithElementForShow(element, show, {
						'index' : data.index
					});
				
					// update success value
					successValue.push(1);
				
					// update slidesDefined with indication of whether this slide was defined.
					slidesDefined.push(
						(typeof(slide)!='undefined') ? 1 : 0
					);
				}
			
				expect(slidesDefined.join(',')).toEqual(successValue.join(','));
			});
		
			describe("test show instance 1", function() {
				it("creates slide instances", testCreateInstances);
			});
			describe("test show instance 2", function() {
				it("creates slide instances", testCreateInstances);
			});
			describe("test show instance 3", function() {
				it("creates slide instances", testCreateInstances);
			});
			describe("test show instance 4", function() {
				it("creates slide instances", testCreateInstances);
			});
		}
	);
	
	describe("AShow.prototype.createControls",
		function() {
			describe("test show instance 1", function() {
				it("creates no controls for auto-advancing show", function() {
					var show = testShows[0];
					show.createControls();
					var controls = show.element.find(".AShowNav");
					expect(controls.length).toBeFalsy();
				});
			});
			describe("test show instance 2", function() {
				it("creates up and down controls for horizontal show", function() {
					var show = testShows[1];
					show.createControls();
					var controls = [
							show.element.find(".AShowNav.AShowNavLeft"),
							show.element.find(".AShowNav.AShowNavRight")
						];
					expect(controls[0].length).toEqual(1);
					expect(controls[1].length).toEqual(1);
				});
			});
			describe("test show instance 3", function() {
				it("creates up and down controls for vertical show", function() {
					var show = testShows[2];
					show.createControls();
					var controls = [
							show.element.find(".AShowNav.AShowNavUp"),
							show.element.find(".AShowNav.AShowNavDown")
						];
					expect(controls[0].length).toEqual(1);
					expect(controls[1].length).toEqual(1);
				});
			});
			describe("test show instance 4", function() {
				it("creates up, right, down, left controls for 2d grid show", function() {
					var show = testShows[3];
					show.createControls();
					var controls = [
							show.element.find(".AShowNav.AShowNavUp"),
							show.element.find(".AShowNav.AShowNavRight"),
							show.element.find(".AShowNav.AShowNavDown"),
							show.element.find(".AShowNav.AShowNavLeft")
						];
					expect(controls[0].length).toEqual(1);
					expect(controls[1].length).toEqual(1);
					expect(controls[2].length).toEqual(1);
					expect(controls[3].length).toEqual(1);
				});
				it("has controls with custom labels", function() {
					var show = testShows[3],
						controls = [
							show.element.find(".AShowNav.AShowNavUp"),
							show.element.find(".AShowNav.AShowNavRight"),
							show.element.find(".AShowNav.AShowNavDown"),
							show.element.find(".AShowNav.AShowNavLeft")
						],
						labels = show.direction_labels;
					expect(controls[0].html()).toEqual(labels['up']);
					expect(controls[1].html()).toEqual(labels['right']);
					expect(controls[2].html()).toEqual(labels['down']);
					expect(controls[3].html()).toEqual(labels['left']);
				});
			});
		}
	);
	
	describe("AShow.prototype.slide",
		function() {
			describe("test show instance 1", function() {
				it("returns slide at index '0'", function () {
					var show = testShows[0],
						slide = show.slide(0);
					expect(slide).toBeDefined();
					expect(show.slidesByIndex['0,0']).toBeDefined();
					expect(slide).toEqual(show.slidesByIndex['0,0']);
				});
				it("returns slide at index '0,0'", function () {
					var show = testShows[0],
						slide = show.slide([0,0]);
					expect(slide).toBeDefined();
					expect(show.slidesByIndex['0,0']).toBeDefined();
					expect(slide).toEqual(show.slidesByIndex['0,0']);
				});
				it("stores test slide at index '0,99'", function() {
					// 0,99 is a safe test index because it doesn't effect the
					// configured looping dimension for this show.
					var show = testShows[0],
						test = new AShowSlide({ index:[0,99], test:true }),
						slide = show.slide([0,99], test);
					expect(slide).toBeDefined();
					expect(slide).toEqual(test);
					expect(slide.test).toBe(true);
					expect(slide.index.join(',')).toEqual('0,99');
					expect(show.slide([0,99])).toEqual(slide);
				});
			});
		}
	);
	describe("AShow.prototype.removeSlide",
		function() {
			describe("test show instance 1", function() {
				it("removes slide at index '0,99'", function () {
					var show = testShows[0];
					
					// Confirm slide to remove exists before proceeding with test
					expect(show.slidesByIndex['0,99']).toBeDefined();
					
					var slide = show.removeSlide([0,99]);
					expect(slide).toBeDefined();
					expect(show.slidesByIndex['0,99']).toBeUndefined();
					expect(show.slide([0,99])).toBeUndefined();
				});
			});
		}
	);
	
	describe("AShowSlide.prototype.pickupElement",
		function() {
			describe("test show instance 1 slide 0,0", function() {
				it("removes slide element from repo and returns", function () {
					//
					// Get reference to slide repo and slide element.
					// Confirm they exist before proceeding with tests.
					//
					var show = testShows[0],
						slide = show.slidesByIndex['0,0'],
						repo = show.element.find('.AShowSlides');
					expect(repo.length).toBeTruthy();
					expect(slide.element).toBeDefined();
					expect(slide.element.length).toBeTruthy();
					
					// Test if parent of slide element is the repo.
					var slideIsInRepo = (slide.element.parent()[0] == repo[0]);
					expect(slideIsInRepo).toBeTruthy();
				
					// Confirm slide.pickupElement() returns the element.
					var pickupResult = slide.pickupElement();
					expect(pickupResult).toBeDefined();
					expect(pickupResult.length).toBeTruthy();
				
					// Confirm element is still referenced by instance.
					expect(slide.element).toBeDefined();
					expect(slide.element.length).toBeTruthy();
				
					// Confirm that slide element's parent is no longer the repo.
					slideIsInRepo = (slide.element.parent()[0] == repo[0]);
					expect(slideIsInRepo).toBeFalsy();
				});
			});
		}
	);
	describe("AShowSlide.prototype.storeElement",
		function() {
			describe("test show instance 1 slide 0,0", function() {
				it("returns slide element to repo", function () {
					//
					// Get reference to slide repo and slide element.
					// Confirm they exist before proceeding with tests.
					//
					var show = testShows[0],
						slide = show.slidesByIndex['0,0'],
						repo = show.element.find('.AShowSlides');
					expect(repo.length).toBeTruthy();
					expect(slide.element).toBeDefined();
					expect(slide.element.length).toBeTruthy();
				
					// Confirm that element is not currently in the repo.
					var slideIsInRepo = (slide.element.parent()[0] == repo[0]);
					expect(slideIsInRepo).toBeFalsy();
				
					slide.storeElement();
				
					// Confirm element is still referenced by instance.
					expect(slide.element).toBeDefined();
					expect(slide.element.length).toBeTruthy();
				
					// Confirm that slide element's parent is now the repo.
					slideIsInRepo = (slide.element.parent()[0] == repo[0]);
					expect(slideIsInRepo).toBeTruthy();
				});
			});
		}
	);
	
	//
	// Asynchronous tests...
	//
	describe("AShow.prototype.advance",
		function() {
			describe("test show instance 1", function() {
				// need to spy on show.changeSlide
				var show = null;
				beforeEach(function() {
					show = testShows[0];
					show.advance_delay = 1000; // faster advance for testing.
					spyOn(show,'changeSlide').andCallThrough();
				});
				afterEach(function() {
					show.advance_delay = 4000; // restore normal delay after tests.
				});
				
				it("changes to slide at index 0", function() {
					// Before proceeding, confirm that there is no current slide.
					expect(show.currentSlide()).toBeFalsy();
					
					// Commence test...
					show.advance();
					expect(show.changeSlide).toHaveBeenCalled();
					expect(show.changeSlide).toHaveBeenCalledWith([0,0]);
					
					// Asynchronous test...
					expect(show.is_transitioning).toBe(true);
					
					waitsFor(function() {
						return !show.is_transitioning;
					}, "should have finished transitioning",
					show.transition_duration+100);
					
					runs(function() {
						// Test if correct slide is current.
						expect(show.currentSlide()).toEqual(show.slide([0,0]));
					});
				});
				
				it("auto-advances to slide at index 1", function() {
					// Before proceeding, confirm that current slide is correct.
					expect(show.currentSlide()).toEqual(show.slide([0,0]));
					
					// Commence asynchronous test...
					expect(show.is_transitioning).toBe(false);
					
					waitsFor(function() {
						return show.is_transitioning;
					}, "should have started transitioning",
					show.advance_delay+100);
					
					waitsFor(function() {
						return !show.is_transitioning;
					}, "should have finished transitioning",
					show.transition_duration+100);
					
					runs(function() {
						expect(show.changeSlide).toHaveBeenCalled();
						expect(show.changeSlide).toHaveBeenCalledWith([1,0]); // direction
						// Test if correct slide is current.
						expect(show.currentSlide()).toEqual(show.slide([1,0]));
					});
				});
				
				it("auto-advances to slide at index 2", function() {
					// Before proceeding, confirm that current slide is correct.
					expect(show.currentSlide()).toEqual(show.slide([1,0]));
					
					// Commence asynchronous test...
					expect(show.is_transitioning).toBe(false);
					
					waitsFor(function() {
						return show.is_transitioning;
					}, "should have started transitioning",
					show.advance_delay+100);
					
					waitsFor(function() {
						return !show.is_transitioning;
					}, "should have finished transitioning",
					show.transition_duration+100);
					
					runs(function() {
						expect(show.changeSlide).toHaveBeenCalled();
						expect(show.changeSlide).toHaveBeenCalledWith([1,0]); // direction
						// Test if correct slide is current.
						expect(show.currentSlide()).toEqual(show.slide([2,0]));
					});
				});
				
				it("loops back to slide at index 0", function() {
					// Before proceeding, confirm that current slide is correct.
					expect(show.currentSlide()).toEqual(show.slide([2,0]));
					
					// Commence asynchronous test...
					expect(show.is_transitioning).toBe(false);
					
					waitsFor(function() {
						return show.is_transitioning;
					}, "should have started transitioning",
					show.advance_delay+100);
					
					waitsFor(function() {
						return !show.is_transitioning;
					}, "should have finished transitioning",
					show.transition_duration+100);
					
					runs(function() {
						expect(show.changeSlide).toHaveBeenCalled();
						expect(show.changeSlide).toHaveBeenCalledWith([1,0]); // direction
						// Test if correct slide is current.
						expect(show.currentSlide()).toEqual(show.slide([0,0]));
					});
				});
				
			});
			
			describe("test show instance 2", function() {
				it("changes to slide at index 0", function() {
					var show = testShows[1];
					// Before proceeding, confirm that there is no current slide.
					expect(show.currentSlide()).toBeFalsy();
					
					// Commence asynchronous test...
					show.advance();
					expect(show.is_transitioning).toBe(true);
					
					waitsFor(function() {
						return !show.is_transitioning;
					}, "should have finished transitioning",
					show.transition_duration+100);
					
					runs(function() {
						// Test if correct slide is current.
						expect(show.currentSlide()).toEqual(show.slide([0,0]));
					});
				});
			});
			
			describe("test show instance 3", function() {
				it("changes to slide at index 0,0", function() {
					var show = testShows[2];
					// Before proceeding, confirm that there is no current slide.
					expect(show.currentSlide()).toBeFalsy();
					
					// Commence asynchronous test...
					show.advance();
					expect(show.is_transitioning).toBe(true);
					
					waitsFor(function() {
						return !show.is_transitioning;
					}, "should have finished transitioning",
					show.transition_duration+100);
					
					runs(function() {
						// Test if correct slide is current.
						expect(show.currentSlide()).toEqual(show.slide([0,0]));
					});
				});
			});
			
			describe("test show instance 4", function() {
				it("changes to slide at index 0,0", function() {
					var show = testShows[3];
					// Before proceeding, confirm that there is no current slide.
					expect(show.currentSlide()).toBeFalsy();
					
					// Commence asynchronous test...
					show.advance();
					expect(show.is_transitioning).toBe(true);
					
					waitsFor(function() {
						return !show.is_transitioning;
					}, "should have finished transitioning",
					show.transition_duration+100);
					
					runs(function() {
						// Test if correct slide is current.
						expect(show.currentSlide()).toEqual(show.slide([0,0]));
					});
				});
			});
		}
	);
	
	describe("AShow.prototype.changeSlide",
		function() {
			describe("test show instance 3", function() {
				var show = null;
				beforeEach(function() {
					show = testShows[2];
					spyOn(show,'changeSlide').andCallThrough();
				});
				
				it("changes to slide at index 1", function() {
					// Before proceeding, confirm that current slide is correct.
					expect(show.currentSlide()).toEqual(show.slide([0,0]));
					
					// Commence asynchronous test...
					expect(show.is_transitioning).toBe(false);
					show.changeSlide([0,1]);
					expect(show.is_transitioning).toBe(true);
					
					waitsFor(function() {
						return !show.is_transitioning;
					}, "should have finished transitioning",
					show.transition_duration+100);
					
					runs(function() {
						expect(show.changeSlide).toHaveBeenCalled();
						expect(show.changeSlide).toHaveBeenCalledWith([0,1]); // direction
						// Test if correct slide is current.
						expect(show.currentSlide()).toEqual(show.slide([0,1]));
					});
				});
				
				it("changes to slide at index 2", function() {
					// Before proceeding, confirm that current slide is correct.
					expect(show.currentSlide()).toEqual(show.slide([0,1]));
					
					// Commence asynchronous test...
					expect(show.is_transitioning).toBe(false);
					show.changeSlide([0,1]);
					expect(show.is_transitioning).toBe(true);
					
					waitsFor(function() {
						return !show.is_transitioning;
					}, "should have finished transitioning",
					show.transition_duration+100);
					
					runs(function() {
						expect(show.changeSlide).toHaveBeenCalled();
						expect(show.changeSlide).toHaveBeenCalledWith([0,1]); // direction
						// Test if correct slide is current.
						expect(show.currentSlide()).toEqual(show.slide([0,2]));
					});
				});
				
				it("loop back to slide at index 0", function() {
					// Before proceeding, confirm that current slide is correct.
					expect(show.currentSlide()).toEqual(show.slide([0,2]));
					
					// Commence asynchronous test...
					expect(show.is_transitioning).toBe(false);
					show.changeSlide([0,1]);
					expect(show.is_transitioning).toBe(true);
					
					waitsFor(function() {
						return !show.is_transitioning;
					}, "should have finished transitioning",
					show.transition_duration+100);
					
					runs(function() {
						expect(show.changeSlide).toHaveBeenCalled();
						expect(show.changeSlide).toHaveBeenCalledWith([0,1]); // direction
						// Test if correct slide is current.
						expect(show.currentSlide()).toEqual(show.slide([0,0]));
					});
				});
				
			});
		}
	);
	
	describe("AShow.prototype.goToSlide",
		function() {
			describe("test show instance 3", function() {
				var show = null;
				beforeEach(function() {
					show = testShows[2];
					spyOn(show,'fadeToSlide').andCallThrough();
					spyOn(show,'panToSlide').andCallThrough();
				});
				
				it("fades from slide at index 0 to slide at index 2", function() {
					// Before proceeding, confirm that current slide is correct.
					expect(show.currentSlide()).toEqual(show.slide([0,0]));
					
					// Commence asynchronous test...
					expect(show.is_transitioning).toBe(false);
					show.goToSlide([0,2]);
					expect(show.is_transitioning).toBe(true);
					
					waitsFor(function() {
						return !show.is_transitioning;
					}, "should have finished transitioning",
					show.transition_duration+100);
					
					runs(function() {
						expect(show.fadeToSlide).toHaveBeenCalled();
						expect(show.currentSlide()).toEqual(show.slide([0,2]));
					});
				});
				
				it("pans back to slide at index 1", function() {
					// Before proceeding, confirm that current slide is correct.
					expect(show.currentSlide()).toEqual(show.slide([0,2]));
					
					// Commence asynchronous test...
					expect(show.is_transitioning).toBe(false);
					show.goToSlide([0,1]);
					expect(show.is_transitioning).toBe(true);
					
					waitsFor(function() {
						return !show.is_transitioning;
					}, "should have finished transitioning",
					show.transition_duration+100);
					
					runs(function() {
						expect(show.panToSlide).toHaveBeenCalled();
						expect(show.currentSlide()).toEqual(show.slide([0,1]));
					});
				});
				
			});
		}
	);
});