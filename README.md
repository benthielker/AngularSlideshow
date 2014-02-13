# Angular Slideshow

A versatile slideshow presentation tool using jQuery and AngularJS.
Intended to easily integrate with any Node and Angular based site.

Can create typical linear looping auto-advancing slideshows arranged both horizontally and
vertically, manually advanced shows via automatically generated controls, and or more
complex 2d grid based shows with slides arranged both vertically and horizontally.


## Configured by markup

Shows are configured via attributes of elements on the page assigned the `a-slideshow`
directive.

```html
<div id='slideshow1'
  loopDimensions='0'
  showPageNumbers='1'
  transitionDuration='500'
  style='width:300px; height:150px;'
a-slideshow></div>
```

The above example is a manually advancing slideshow with horizontal looping, page numbers
displayed, a half second transition duration, and dimensions of 300 x 150 pixels.
**(NOTE: The show width and height should match the slides it will display.)**

The below example is an auto-advancing slideshow...
```html
<div id='slideshow2'
  loopDimensions='1'
  transitionDuration='750'
  advanceDelay='4000'
  advanceChange='1'
  style='width:300px; height:150px;'
a-slideshow></div>
```
If an `advanceDelay` greater than zero is configured for a slideshow *no navigation
controls will be generated for it*. Note that the `loopDimensions` has been assigned a
value of `1` instead of `0`. Unlike the previous example this is requesting *vertical*
looping. That value is indicating the axis to loop.

All slides in a show are assigned a 2d index. If you have a horizontally arranged show you
can use simplified indexes such as `1`, `2` and `3`. These would be automatically
converted to 2d: `[1,0]`, `[2,0]` and `[3,0]`. However if the show's slides are vertically
arranged their indexes would have to be `[0,1]`, `[0,2]` and `[0,3]`.

When dealing with a manually advancing slideshow, you will likely want to override the
nav link labels. The following example demonstrates how that is done...
```html
<div id='slideshow3'
  transitionDuration='750'
  loopDimensions='[0,1]'
  directionLabels='{"up":"North","right":"East","down":"South","left":"West"}'
  style='width:300px; height:150px; float:right; margin:1em 0 2em 3em'
a-slideshow></div>
```
The above show is intended to display slides arranged on a 2d grid, with looping around
both axes, and features overridden direction control labels via the `directionLabels` 
attribute whose value must be provided in valid JSON format. The possible directions of
navigation controls are `up`, `right`, `down`, and `left`. These should be the keys of the
direction label override object described by this parameter's value.


## Slide definitions

The `AShowAngular.js` file has examples for loading slides via an api call, a json file,
or a hardcoded list defined in that file. (The later allows for testing when browsing the
files locally.)

```json
[
	{	
		"index" : [0,0],
		"content" : "First example slide..."
	},
	{	
		"index" : [1,0],
		"content" : "Second example slide..."
	},
	{	
		"index" : [2,0],
		"content" : "Third example slide..."
	}
]
```

Above is content of an example json file defining very simple slides for a horizontally
arranged slideshow. (This data could also have been returned from an api call, or defined
in a local variable.)

```json
[
	{	
		"index" : [0,0],
		"content" : "<img src='images/show1_slide1.jpeg'/>"
	},
	{	
		"index" : [0,1],
		"content" : "<img src='images/show1_slide1.jpeg'/>"
	},
	{	
		"index" : [0,2],
		"content" : "<img src='images/show1_slide1.jpeg'/>"
	}
]
```

This example demonstrates that the `content` assigned to each slide is `html`, so if your
slide content will consist of images, you will need to populate their content with image
tags. Note that the `index` properties of these slides vary along the y-axis, therefore
these slides would belong to a vertically aligned show.

```json
[
	{	
		"index" : [0,0],
		"content" : "Slide 0,0..."
	},
	{	
		"index" : [0,1],
		"content" : "Slide 0,1..."
	},
	{	
		"index" : [0,-1],
		"content" : "Slide 0,-1..."
	},
	{	
		"index" : [1,0],
		"content" : "Slide 1,0..."
	},
	{	
		"index" : [1,1],
		"content" : "Slide 1,1..."
	},
	{	
		"index" : [1,-1],
		"content" : "Slide 1,-1..."
	},
	{	
		"index" : [2,0],
		"content" : "Slide 2,0..."
	},
	{	
		"index" : [2,1],
		"content" : "Slide 2,1..."
	},
	{	
		"index" : [2,-1],
		"content" : "Slide 2,-1..."
	}
]
```

That example describes a 3x3 grid of slides centered around the `[0,0]` index.


## Configuration Options

| Attribute           | Example Values      | Purpose
| ---                 | ---                 | ---
| transitionType      | `'fade'`, `'pan'`   | Forces all transitions to be of this type.
| transitionDuration  | `'1000'`            | Specifies duration of transition animations.
| loopDimensions      | `'0'`, `'[0,1]'`    | Index dimensions that should wrap-around.
| advanceDelay        | `'5000'`            | Time to wait before advancing to next slide.
| advanceChange       | `'[1,0]'`, `'[0,1]'`| Change to apply to current index when advancing.
| directionLabels     | `'{"left":"Prev"}'` | Custom labels to display for nav links.
| showPageNumbers     | `'1'`, `'true'`     | If "truthy" display page numbers for slides.


## Testing

Jasmine test runners are located in the /public directory so they can be served by node:
[AShowSpectRunner.html](https://github.com/benthielker/Angular-Slideshow/blob/master/public/AShowSpectRunner.html), 
[AShowAngularSpecRunner.html](https://github.com/benthielker/Angular-Slideshow/blob/master/public/AShowAngularSpecRunner.html).
These run the
[AShowSpec.js](https://github.com/benthielker/Angular-Slideshow/blob/master/public/AShowSpec.js)
and 
[AShowAngularSpec.js](https://github.com/benthielker/Angular-Slideshow/blob/master/public/AShowAngularSpec.js)
scripts respectively.
These should make good starting points if you need to setup your own tests.


## Examples

The example node app serves 
[example.html](https://github.com/benthielker/Angular-Slideshow/blob/master/public/example.html)
as the index. This page contains fairly comprehensive examples with descriptions of their
configurations.

The 
[gemHunter.html](https://github.com/benthielker/Angular-Slideshow/blob/master/public/GemHunter.html)
example is just a fun demonstration of what can be done with a 2d slideshow. Its source is
worth a look if you will need to implement custom behaviors.


## Directory Layout

    root/               --> node.js app directory
      public/           --> client files (this is all you need if not using node)
        css/            --> default stylesheet for slideshow (important underpinnings)
        images/         --> used by Gem Hunter example
        slides/         --> slide definition json files



