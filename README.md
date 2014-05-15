# [Pixelshift](http://notiontaxi.github.io/pixelshift)

An online image processing tool

##Functionalities
###Zoom
* positive zoom (>1)  
  Implementation of pixel repeating (Pixels will be repeated 2 times when zoom is 2)  
* negative zoom (<1 & >0)  
  New imagedata will be created via the instantiation of a new (smaller) canvas object. This object will be destroyed after extracting the pixels for the view.

###Navigation
* You can navigate in the picture by clicking the cursor keys.  
  (currently when zoom is >= 1)

###File Operations
* Open files (jpeg, png) [source](https://github.com/notiontaxi/pixelshift/blob/master/assets/js/FileProcessor.js)
* Save the processed image (png) [source](https://github.com/notiontaxi/pixelshift/blob/master/assets/js/FileProcessor.js)

###Filter
* One click  
    * [Grayscale](https://github.com/notiontaxi/pixelshift/blob/master/assets/js/ImageProcessor.js#L81)  
    * [Bitmap](https://github.com/notiontaxi/pixelshift/blob/master/assets/js/ImageProcessor.js#L71)  
    * [Color invert](https://github.com/notiontaxi/pixelshift/blob/master/assets/js/ImageProcessor.js#L29)  
    * [Convolution](https://github.com/notiontaxi/pixelshift/blob/master/assets/js/ImageProcessor.js#L363)
      * Emboss  
      * Sharpen  
      * Lowpass  
      * High-pass  
* Adjustable by a slider  
    * [Brightness](https://github.com/notiontaxi/pixelshift/blob/master/assets/js/ImageProcessor.js#L51)  
    * [Contrast](https://github.com/notiontaxi/pixelshift/blob/master/assets/js/ImageProcessor.js#L38)  
    * Blur (Source from [StackBlur](http://www.quasimondo.com/StackBlurForCanvas/StackBlurDemo.html)) 

###Redo & Undo
The changes can be saved in two different structures, which depends on the amount of changed pixels.  
Example:  
By a color invert all pixels are changed and the whole imagedata (all pixels) will be saved. 
After drawing a line, only a small amount of pixels will be changed and only these changed pixels (color and position) will be saved.  
The amount of saved steps depends on the device (20 on mobile otherwise 40)  
[source](https://github.com/notiontaxi/pixelshift/blob/master/assets/js/Canvas.js#L661)

###Crop
The original source (visual part) of the crop tool is from [here](http://deepliquid.com/content/Jcrop.html)

###Shape Tool
 * Rectangle
 * Circle
 * Line
 * Draggable preview (press space during drawing)
 * Snapping line (press space during drawing)
 * Filled shape / only border
 * Adjustable border width
 * [Source](https://github.com/notiontaxi/pixelshift/blob/master/assets/js/strategies/ShapeStrategy.js)

###Pencil tool
* Adjustable thickness
* [source](https://github.com/notiontaxi/pixelshift/blob/master/assets/js/strategies/PencilStrategy.js)
  
###Flood-fill tool
* Adjustable variance
* [source](https://github.com/notiontaxi/pixelshift/blob/master/assets/js/strategies/FloodfillStrategy.js)
  
###Color Picker
The original source of the color-picker is from [http://acko.net/blog/farbtastic-jquery-color-picker-plug-in/]

##Mobile & Desktop
All the functions (excluding crop) are working in mobile devices. (Tap events become translated to click events)  
Views and events get replaced while the source-base keeps the same.  
Different layouts for mobile (adjusting to screen size) and desktop (currently three sizes)

##Used libraries
* [Bootstrap](http://getbootstrap.com/)  
  MIT License
* [Farbtastic](http://acko.net/blog/farbtastic-jquery-color-picker-plug-in/)  
  GNU GENERAL PUBLIC LICENSE
* [Jcrop](http://deepliquid.com/content/Jcrop.html)  
  MIT License
* [jQuery](http://jquery.com/)  
  MIT License
* [jQuery UI](http://jqueryui.com/)  
  MIT License
* [jQuery mobile](http://jquerymobile.com/)  
  MIT License
* [Touchpunch](http://touchpunch.furf.com/)  
  Dual licensed under the MIT or GPL Version 2 licenses
* [Mousetrap](https://github.com/ccampbell/mousetrap)  
  Apache License, Version 2.0
* [Require](http://requirejs.org/)  
  MIT License
* [Text.js](http://github.com/requirejs/text)  
  MIT License
* [StackBlur](http://www.quasimondo.com/StackBlurForCanvas/StackBlurDemo.html)  
  MIT License
  Modified

##Used Resources
* [IcoMoon](http://icomoon.io/)  
  GNU GENERAL PUBLIC LICENSE v 3.0


##To do
* Crop for mobiles
* Change image resolution
* Image rotation
* Flip image (horizontal/vertical)
* Text-tool
* Layers  
  * File format for layers
