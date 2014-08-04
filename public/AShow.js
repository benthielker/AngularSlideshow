// 
// AShow
// Use AShow.MakeShowWithElement to create instance for an element.
// Instance will be configured based on element attributes.
// That element will be used as a wrapper for dynamically created slideshow elements.
// 


/**
 * AShow
 * Constructor for slideshow instance.
 * Values passed in the props parameter object will be assigned to the properties of the
 * resulting instance.
 * 
 * If props contains an element property, this will be the parent element for the show.
 * This element can act as a conveyance for configuration properties via its attributes.
 * Attributes which represent complex configuration values must be in JSON format.
 *
 *   ATTRIBUTE:               CONFIGURED PROPERTY:   EXAMPLE VALUE:
 *   transitionType            transition_type         'fade'
 *   transitionDuration         transition_duration      '1000'
 *   groundDimension            ground_dimension      '0'
 *   loopDimensions            loop_dimensions         '[0]'
 *   advanceDelay            advance_delay         '1000'
 *   advanceChange            advance_change         '[1,0]'
 *   directionLabels            direction_labels      '{"left":"Prev","right":"Next"}'
 *   showPageNumbers            show_page_numbers      '1'
 * 
 */
AShow = function(props) {
   //
   // define default property values...
   //
   this.slidesByIndex = {};
   this.current_index = [0,0];
   this._current_slide = null;
   this.is_transitioning = false;
   // configuration properties
   this.element = null;
   this.units = null;
   this.width = null;
   this.height = null;
   this.transition_type = null; // will default based on slide proximity if null.
   this.transition_duration = 1000;
   this.ground_dimension = -1;
   this.loop_dimensions = [];
   this.advance_delay = 0;
   this.advance_change = [0,0];
   this.direction_labels = {
      'down' : 'Down',
      'left' : 'Left',
      'right' : 'Right',
      'up' : 'Up'
   };
   this.show_page_numbers = false;
   
   // apply passed properties to instance
   for (var p in props) this[p] = props[p];
   
   //
   // Configure and setup dynamic elements
   //
   if (this.element) {
      //
      // Apply configuration properties assigned to element attributes
      //
      var units = 'px',
          width = this.element[0].style.width,
          height = this.element[0].style.height,
          slideshow_id = this.element.attr('slideshow_id'),
          transitionDuration = this.element.attr('transitionDuration'),
          groundDimension = this.element.attr('groundDimension'),
          loopDimensions = this.element.attr('loopDimensions'),
          advanceDelay = this.element.attr('advanceDelay'),
          advanceChange = this.element.attr('advanceChange'),
          directionLabels = this.element.attr('directionLabels'),
          showPageNumbers = this.element.attr('showPageNumbers');
      // if separate slideshow_id not specified, use element id.
      if (!slideshow_id) slideshow_id = this.element.attr('id');
      
      if (width) {
         if (width.indexOf('em') !== -1) units = 'em';
         this.width = width.replace(units,'')-0;
         this.element.css('width','');
      }
      if (height) {
         if (height.indexOf('em') !== -1) units = 'em';
         this.height = height.replace(units,'')-0;
         this.element.css('height','');
      }
      this.units = units;
      
      if (slideshow_id) {
         this.slideshow_id = slideshow_id;
      }
      if (transitionDuration) {
         this.transition_duration = new Number(transitionDuration).valueOf();
      }
      if (groundDimension) {
         this.ground_dimension = new Number(groundDimension).valueOf();
      }
      if (loopDimensions) {
         if (loopDimensions.indexOf('[') >= 0) loopDimensions = JSON.parse(loopDimensions);
         else loopDimensions = [ new Number(loopDimensions).valueOf() ];
         if (loopDimensions) {
            this.loop_dimensions = [];
            for (var d in loopDimensions) {
               this.loop_dimensions.push( loopDimensions[d] );
            }
         }
      }
      if (advanceDelay) {
         this.advance_delay = new Number(advanceDelay).valueOf();
      }
      if (advanceChange) {
         if (advanceChange.indexOf('[') >= 0) advanceChange = JSON.parse(advanceChange);
         else advanceChange = [ new Number(advanceChange).valueOf() ];
         if (advanceChange) {
            if (!advanceChange[0]) advanceChange[0] = 0;
            if (!advanceChange[1]) advanceChange[1] = 0;
            this.advance_change = advanceChange;
         }
      }
      if (directionLabels) {
         directionLabels = JSON.parse(directionLabels);
         if (directionLabels)
         for (var direction in directionLabels) {
            this.direction_labels[direction] = directionLabels[direction]
         }
      }
      if (showPageNumbers) {
         this.show_page_numbers = true;
      }
      
      console.log(
         "AShow "+AShow.AShows.length+" constructor |", {
            units : this.units,
            width : this.width,
            height : this.height
         }
      );
      
      // assign slideshow class to element.
      this.element.addClass('AShow');
      
      // create frame element
      var frame = $(
         "<div class='AShowFrame'>"+
            "<div class='AShowSlideHolder'>"+
               "<div class='AShowSlide AShowPlaceholder' style='"+
                  "top:0; left:0; z-index:2'>"+
                     "loading..."+
               "</div>"+
            "</div>"+
         "</div>");
      frame.find('.AShowSlide')[0].style.width = this.width+this.units;
      frame.find('.AShowSlide')[0].style.height = this.height+this.units;
      frame[0].style.width = this.width+this.units;
      frame[0].style.height = this.height+this.units;
      
      // append frame to slideshow element.
      this.element.append(frame);
   }
   
   //
   // register this instance and return.
   //
   this.AShowId = AShow.AShows.length;
   if (!this.slideshow_id) this.slideshow_id =  this.AShowId;
   AShow.AShows.push(this);
   return this;
};
//
// static properties...
//
AShow.AShows = [];
//
// static methods...
//
/**
 * MakeShowWithElement
 * Creates a slideshow instance with the passed element as its parent.
 * The parent element will be a wrapper for all dynamically created show elements.
 * @param element Object Element to act as parent of slide show.
 * @param props Object List of properties to assign new show.
 * @returns Object New slideshow instance.
 */
AShow.MakeShowWithElement = function(element, props) {
   if (!props) props = {};
   props['element'] = element;
   var newShow = new AShow(props);
   element[0].AShow = element.AShow = newShow;
   return newShow;
};
//
// instance methods...
//
AShow.prototype = {
   /**
    * wrapIndex
    * Wraps the passed index around looped dimensions if out of bounds.
    * @param index Array Index to wrap if needed
    * @param Array Potentially updated index
    */
   wrapIndex : function(index) {
      // check each configured loop dimension for index wrapping.
      for (var d in this.loop_dimensions) {
         var dimension = this.loop_dimensions[d];
         if (index[dimension] > this.max_index[dimension]) index[dimension] = this.min_index[dimension];
         if (index[dimension] < this.min_index[dimension]) index[dimension] = this.max_index[dimension];
      }
      return index;
   },
   
   /**
    * slide
    * Get or set slide at index.
    * Passed index will be converted to 2d if provided as number.
    * @param index Number|Array Index of slide to get or set.
    * @param slide Object Slide to assign to index (optional).
    * @returns Object Slide instance at index.
    */
   slide : function(index, slide) {
      // convert passed index to 2d if its a number.
      if (typeof(index)==="number") index = [index,0];
      // assign passed slide to index if provided.
      if (slide) {
         // check if this index expands the max or min index ranges.
         if (typeof(this.max_index)==='undefined') this.max_index=[-Infinity,-Infinity];
         if (typeof(this.min_index)==='undefined') this.min_index=[Infinity,Infinity];
         if (index[0] > this.max_index[0]) this.max_index[0] = index[0];
         if (index[1] > this.max_index[1]) this.max_index[1] = index[1];
         if (index[0] < this.min_index[0]) this.min_index[0] = index[0];
         if (index[1] < this.min_index[1]) this.min_index[1] = index[1];
         // register slide at index.
         this.slidesByIndex[index] = slide;
      }
      // return slide at index.
      return this.slidesByIndex[index];
   },
   /**
    * removeSlide
    * Removes a slide from the show.
    * @param index Number|Array Index of slide to remove from show.
    * @returns Object Removed slide instance.
    */
   removeSlide : function(index) {
      // convert passed index to 2d if its a number.
      if (typeof(index)==="number") index = [index,0];
      
      // If index defined, remove slide from list and return.
      if (typeof(this.slidesByIndex[index])!='undefined') {
         var removed = this.slidesByIndex[index];
         delete this.slidesByIndex[index];
         return removed;
      }
   },
   /**
    * currentSlide
    * Get or set the current slide.
    * When setting: current page number is highlighted, and nav link validity is checked.
    * @param slide (optional) Object AShowSlide instance to make current.
    * @returns Object Current slide instance.
    */
   currentSlide : function(slide) {
      if (typeof(slide)!='undefined') {
         this._current_slide = slide;
         this.current_index = slide.index;
         // update page numbers if enabled
         if (this.show_page_numbers) {
            // remove .current class from all page numbers
            this.element.find('.AShowPageNumber').removeClass('AShowCurrent');
            // add .current class to this slide's page number.
            this.element.find('.AShowPageNumber[index="'+this.current_index.join(',')+'"]').addClass('AShowCurrent');
         }
         // update nav buttons if show doesn't auto-advance
         if (!this.advance_delay) {
            // start by hiding all nav buttons.
            this.element.find('.AShowNav').css('visibility','hidden');
            // determine which buttons to show based on present adjacent slides.
            var testDirections = [
                  "Up", "Right", "Down", "Left"
               ], testIndexes = [
                  [ this.current_index[0] , this.current_index[1]-1 ], // up
                  [ this.current_index[0]+1 , this.current_index[1] ], // right
                  [ this.current_index[0] , this.current_index[1]+1 ], // down
                  [ this.current_index[0]-1 , this.current_index[1] ]  // left
               ];
            for (var i in testIndexes) {
               var testDirection = testDirections[i],
                  testIndex = testIndexes[i],
                  testSlide = this.slide(testIndex);
               // need to account for looping.
               if (!testSlide) {
                  testIndex = this.wrapIndex(testIndex);
                  testSlide = this.slide(testIndex);
               }
               // create nav link to existing adjacent slide.
               if (testSlide) {
                  this.element.find('.AShowNav.AShowNav'+testDirection).css('visibility','visible');
               }
            }
         }
      }
      return this._current_slide;
   },
   
   /**
    * goToSlide
    * Transitions to the specified slide index.
    * If requested slide is adjacent to current, pan transition is used, else fade.
    * @param index Number|Array Index of slide to present.
    */
   goToSlide : function(index) {
      // convert passed index to 2d if provided as number.
      if (typeof(index)==='number') index = [index,0];
      if (typeof(index)==='string') {
         var i = index.split(',');
         index = [ parseInt(i[0]), parseInt(i[1]) ];
      }
      
      // get change from current to determine if adjacent.
      var delta = [
         index[0] - this.current_index[0],
         index[1] - this.current_index[1]
         ],
         change = Math.abs(delta[0]) + Math.abs(delta[1]);
      
      // only need to transition if index has actually changed (or not current slide).
      if (!this.currentSlide() || (change > 0)) {
         var newSlide = this.slide(index);
         if (newSlide) {
            // determine transition type
            var transition = this.transition_type;
            if (!transition && this.currentSlide() && (change < 2)) transition = 'pan';
            
            // request transition
            if (transition==='pan') {
               // moving to adjacent slide, use pan transition.
               this.panToSlide(newSlide,delta);
            } else {
               // moving to non-adjacent slide, use fade transition.
               this.fadeToSlide(newSlide);
            }
         } else {
            console.log("AShow.goToSlide ERROR: No slide found at index: "+index);
         }
      }
   },
   /**
    * changeSlide
    * Transitions to a slide relative to the current slide.
    * If requested change is adjacent to current, pan transition is used, else fade.
    * If ground_dimension is defined (0 or 1), and its value is changed by this request,
    * then the other dimension will be zeroed.
    *   
    * Example Values...
    *
    *   Purpose:                           Change Value:
    *
    *   Advance to next frame of linear show:        [1,0] or 1
    *   Return to previous frame of linear show:     [-1,0] or -1
    *   Advance to next frame of vertical show:      [0,1]
    *   Return to previous frame of vertical show:   [0,-1]
    *   Move north on a grid:                        [0,1]
    *   Move south-west on a grid:                   [-1,-1]
    *   
    * @param change Number|Array Change to current slide index.
    */
   changeSlide : function(delta) {
      // convert passed delta to 2d if provided as number.
      if (typeof(delta)==='number') delta = [delta,0];
      //console.log("AShow["+this.AShowId+"].changeSlide("+delta+")...");
      
      // get total change to determine if adjacent.
      var change = Math.abs(delta[0]) + Math.abs(delta[1]);
      
      // only need to transition if index has actually changed (or not current slide).
      if (!this.currentSlide() || (change > 0)) {
         
         // get index of requested slide.
         var index = [
            this.current_index[0] + delta[0],
            this.current_index[1] + delta[1]
            ];
         index = this.wrapIndex(index);
         
         var newSlide = this.slide(index);
         if (newSlide) {
            // determine transition type
            var transition = this.transition_type;
            if (!transition && this.currentSlide() && (change < 2)) transition = 'pan';
            
            // request transition
            if (transition==='pan') {
               // moving to adjacent slide, use pan transition.
               this.panToSlide(newSlide,delta);
            } else {
               // moving to non-adjacent slide, use fade transition.
               this.fadeToSlide(newSlide);
            }
         } else {
            console.log("No slide found at index: "+index);
         }
      }
   },
   
   /**
    * fadeToSlide
    * Uses the fade transition to present passed slide.
    * New slide element appended to slide holder positioned below current slide.
    * Old slide opacity is faded to zero, and it is removed from the holder.
    * @param slide Object AShowSlide instance to present.
    */
   fadeToSlide : function(newSlide) {
      var oldSlide = this.slide(this.current_index);
      if (newSlide && oldSlide) {
         var newElement = newSlide.pickupElement(),
            oldElement = oldSlide.element;
         // if newSlide and oldSlide are the same, then this is the first slide, and
         // we need to fade out the placeholder.
         if (newSlide===oldSlide) oldElement = $(this.element).find('.AShowSlide.AShowPlaceholder');
         
         if (newElement && newElement.length) {
            
            // style element to be positioned behind current slide.
            // NOTE: not using jQuery .css method when units are involved.
            newElement[0].style.left = oldElement[0].style.left;
            newElement[0].style.top = oldElement[0].style.top;
            newElement[0].style.width = this.width+this.units;
            newElement[0].style.height = this.height+this.units;
            newElement.css('z-index', 1); // current element should have z-index of 2.
            
            // append newSlide element to holder.
            $(this.element).find('.AShowSlideHolder').append(newElement);
            
            // commence transition animation
            this.is_transitioning = true;
            $(oldElement).animate({'opacity':0},
               this.transition_duration,
               (function() {
                  // after visible, bring new element to current element depth.
                  newElement.css('z-index', 2);
                  if (newSlide===oldSlide) {
                     // remove placeholder element.
                     oldElement.remove();
                  } else {
                     // store old slide's element.
                     oldSlide.storeElement();
                     oldSlide.element.css('opacity',1); // restore opacity for later use.
                  }
                  // register new current slide and index.
                  newSlide.show.currentSlide(newSlide);
                  
                  this.is_transitioning = false;
               }).bind(this)
            );
         }
      }
   },
   /**
    * panToSlide
    * Uses pan transition in specified direction to present passed slide.
    * New slide element appended to slide holder positioned at entry location.
    * Slide holder is moved to bring new slide into frame, and old slide is removed.
    * @param slide Object AShowSlide instance to present.
    * @param direction Number|Array indicates which side new slide should enter from.
    */
   panToSlide : function(newSlide, direction) {
      if (typeof(direction)==='number') direction = [direction,0];
      console.log(
         "AShow::panToSlide |",
         "direction:",direction
      );
      var oldSlide = this.slide(this.current_index);
      if (newSlide && oldSlide) {
         var newElement = newSlide.pickupElement(),
            oldElement = oldSlide.element;
         if (newElement) {
            // get position of new slide relative to current.
            var oldLeft = 0,
                oldTop = 0;
            if (oldElement) {
               oldLeft = oldElement[0].style.left.replace(this.units,'')-0;
               oldTop = oldElement[0].style.top.replace(this.units,'')-0;
               if (isNaN(oldLeft)) oldLeft = 0;
               if (isNaN(oldTop)) oldTop = 0;
            }
            var newLeft = oldLeft + (this.width * direction[0]),
                newTop = oldTop + (this.height * direction[1]);
            console.log(
               "AShow::panToSlide |",
               "oldLeft:",oldLeft,
               "oldTop:",oldTop,
               "newLeft:",newLeft,
               "newTop:",newTop
            );
            
            // style new element to be positioned for incoming pan.
            newElement[0].style.left = newLeft+this.units;
            newElement[0].style.top = newTop+this.units;
            newElement[0].style.width = this.width+this.units;
            newElement[0].style.height = this.height+this.units;
            newElement.css('z-index', 2);
            
            // append newSlide element to holder.
            var holder = $(this.element).find('.AShowSlideHolder');
            holder.append(newElement);
            
            // determine new slideHolder position relative to current.
            var oldHolderLeft = holder[0].style.left.replace(this.units,'')-0,
                oldHolderTop = holder[0].style.top.replace(this.units,'')-0,
                newHolderLeft = oldHolderLeft + (this.width * direction[0] * -1),
                newHolderTop = oldHolderTop + (this.height * direction[1] * -1);
            console.log(
               "AShow::panToSlide |",
               "oldHolderLeft:",oldHolderLeft,
               "oldHolderTop:",oldHolderTop,
               "newHolderLeft:",newHolderLeft,
               "newHolderTop:",newHolderTop
            );
            
            //
            // commence transition animation...
            //
            this.is_transitioning = true;
            $(holder).animate({
                  'left':newHolderLeft+this.units,
                  'top':newHolderTop+this.units
               },
               this.transition_duration,
               (function() {
                  // ensure correct position (and units) after animation.
                  holder[0].style.left = newHolderLeft+this.units;
                  holder[0].style.top = newHolderTop+this.units;
                  
                  // store old slide's element.
                  oldSlide.storeElement();
                  
                  // register new current slide and index.
                  newSlide.show.currentSlide(newSlide);
                  
                  // clear is_transitioning flag.
                  this.is_transitioning = false;
               }).bind(this)
            );
         }
      }
   },
   
   /**
    * advance
    * Displays the first slide, or changes to next slide per advance_change property.
    * Timer is set to call advance again after specified advance_delay property.
    */
   advance : function() {
      if (!this.currentSlide()) {
         // advance to first slide.
         this.changeSlide([0,0]);
      }
      else
      if (this.advance_change) {
         // advance to slide per configured advance_change.
         this.changeSlide(this.advance_change);
      }
      
      // set timer to advance again if delay and change specified.
      if (this.advance_change)
      if (this.advance_delay > 0) {
         this.advance_timer = window.setTimeout(
            "AShow.AShows["+this.AShowId+"].advance()",
            this.advance_delay
            );
      }
   },
   
   /**
    * createControls
    * Creates navigation controls based on indexes registered.
    * This should only be called after all slides have loaded.
    * NOTE: This automatically determines which type of controls to create: left/right,
    * up/down, or north/east/south/west.
    * If desired, these default labels can be overridden via direction_labels property.
    */
   createControls : function() {
      // Only display nav controls if no auto-advance behavior configured.
      // Can't display controls until show is populated with slides.
      if (!this.advance_delay)
      if (typeof(this.max_index)!='undefined')
      {
         // determine navigation buttons needed...
         var horizontal_space = this.max_index[0] - this.min_index[0];
         var vertical_space = this.max_index[1] - this.min_index[1];
         var buttons_to_add = [];
         if (horizontal_space && vertical_space) {
            // this is a 2d grid, create Up/Right/Down/Left controls.
            buttons_to_add = ['up','right','down','left'];
         }
         else
         if (horizontal_space > vertical_space) {
            // this is a horizontal linear slideshow, create Left/Right controls.
            buttons_to_add = ['left','right'];
         }
         else
         if (vertical_space > horizontal_space) {
            // this is a vertical linear slideshow, create Up/Down controls.
            buttons_to_add = ['up','down'];
         }
         
         // create requested buttons...
         // (order of insert is important)
         var fontSize = $('body').css('font-size').replace('px','')-0;
         if (buttons_to_add.indexOf('up') >= 0) {
            var html = "<a class='AShowNav AShowNavUp'>"+this.direction_labels['up']+"</a>",
                href = "javascript:AShow.AShows["+this.AShowId+"].changeSlide([0,-1])";
            var button = $(html).attr('href', href);
            button.insertBefore(this.element.children('.AShowFrame'));
         }
         if (buttons_to_add.indexOf('left') >= 0) {
            var html = "<a class='AShowNav AShowNavLeft'>"+this.direction_labels['left']+"</a>",
                href = "javascript:AShow.AShows["+this.AShowId+"].changeSlide([-1,0])";
            var button = $(html).attr('href', href);
            button.insertBefore(this.element.children('.AShowFrame'));
         }
         
         if (buttons_to_add.indexOf('down') >= 0) {
            var html = "<a class='AShowNav AShowNavDown'>"+this.direction_labels['down']+"</a>",
                href = "javascript:AShow.AShows["+this.AShowId+"].changeSlide([0,1])";
            var button = $(html).attr('href', href);
            button.insertAfter(this.element.children('.AShowFrame'));
         }
         if (buttons_to_add.indexOf('right') >= 0) {
            var html = "<a class='AShowNav AShowNavRight'>"+this.direction_labels['right']+"</a>",
                href = "javascript:AShow.AShows["+this.AShowId+"].changeSlide([1,0])";
            var button = $(html).attr('href', href);
            button.insertAfter(this.element.children('.AShowFrame'));
         }
         
         
         
         // create page number buttons if requested by configuration.
         if (this.show_page_numbers) {
            // page numbers only rendered for ground dimension.
            var gd = this.ground_dimension;
            if (gd < 0) gd = (horizontal_space > vertical_space) ? 0 : 1;
            
            // create page number holder.
            //var pageNumberHolder = $("<div class='AShowPageNumbers' style='width:"+this.width+"px'></div>");
            var pageNumberHolder = $("<div class='AShowPageNumbers'></div>");
            // create page numbers
            var first_page_number = this.min_index[gd],
               last_page_number = this.max_index[gd];
            for (var n = first_page_number; n <= last_page_number; n++) {
               var index = [];
               if (gd===0) index = [n,0];
               else index = [0,n];
               
               // create page number element.
               var pageNumber = $("<a class='AShowPageNumber' index='"+index.join(',')+"' href='javascript:;'>"+(n+1)+"</a>");
               // link element to show it should interact with.
               pageNumber[0].AShow = this;
               pageNumberHolder.append(pageNumber);
            }
            // append populated holder to show element.
            this.element.append(pageNumberHolder);
            
            // assign click events to page number elements.
            this.element.find('.AShowPageNumber').click(function() {
               if (this.AShow) {
                  var index = $(this).attr('index');
                  this.AShow.goToSlide(index);
               }
            });
         }
      }
   }
};



/**
 * AShowSlide
 * Slide instance for use in a slide show.
 * Must be assigned an element, which will be used for its display.
 * These elements should be provided in the invisible .slides element by angular when
 * the slideshow directive is processed.
 * Slide's element is removed from the .slides element and appended to the .slideHolder
 * element when displayed. When hidden, the element is removed from .slideHolder and
 * returned to .slides element.
 */
AShowSlide = function(props) {
   // default properties
   this.show = null;
   this.index = [];
   this.element = null;
   this.delay = null; // overrides default show delay if desired.
   
   // apply passed properties to instance
   for (var p in props) this[p] = props[p];
   
   //
   // register instance and return
   //
   this.AShowSlideId = AShowSlide.AShowSlides.length;
   AShowSlide.AShowSlides.push(this);
   return this;
};
//
// static properties...
//
AShowSlide.AShowSlides = [];
//
// static methods...
//
/**
 * MakeSlideForShow
 * Creates a slide instance with the passed show as its parent.
 * @param show Object Slideshow instance new slide belongs to.
 * @param props Object List of properties to assign to new slide.
 * @returns Object New slide instance.
 */
AShowSlide.MakeSlideForShow = function(show, props) {
   if (!props) props = {};
   props['show'] = show;
   var newSlide = new AShowSlide(props);
   show.slide(props.index, newSlide);
   return newSlide;
};
/**
 * MakeSlideWithElementForShow
 * Updates props with reference to passed element and relays to MakeSlideForShow method
 * for slide creation.
 * @param element Object Content element for new slide.
 * @param show Object Slideshow instance new slide belongs to.
 * @param props Object List of properties to assign to new slide.
 * @returns Object New slide instance.
 */
AShowSlide.MakeSlideWithElementForShow = function(element, show, props) {
   if (!props) props = {};
   props['element'] = element;
   return AShowSlide.MakeSlideForShow(show, props);
};
//
// instance methods...
//
AShowSlide.prototype = {
   /**
    * pickupElement
    * Remove slide element from parent and return.
    * @returns Object This slide's element.
    */
   pickupElement : function() {
      if (this.element) {
         this.element = $(this.element).remove();
         return this.element;
      }
   },
   /**
    * storeElement
    * Removes slide element from current parent and adds to the .slides storage element.
    */
   storeElement : function() {
      if (this.element) {
         this.element = $(this.element).remove();
         $(this.show.element).children(".AShowSlides").append(this.element);
      }
   }
};
