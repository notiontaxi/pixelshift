/*
ImageProcessor class

Florian Wokurka (2013)
https://github.com/notiontaxi
*/

"use strict"

define([], function() {

  var ImageProcessor, module;
  module = function() {}
  ImageProcessor = (function(){
  //__extends(ImageProcessor, Superclass);
// --------------------------------------



  function ImageProcessor(){


  }


  ImageProcessor.prototype.computeThreshold = function(threshold, imageData){
    for (var i = 0; i < imageData.data.length; i+=4) {
      imageData.data[i] = imageData.data[i+1] = imageData.data[i+2] = imageData.data[i] > threshold ? 255 : 0;
    }
    return imageData;
  }


  ImageProcessor.prototype.computeOutline = function(imageData){

  }




// --------------------------------------
    return ImageProcessor
  })()
  return module.exports = ImageProcessor
})



