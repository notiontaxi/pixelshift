/*
ImageProcessingTask class

Florian Wokurka (2013)
https://github.com/notiontaxi
*/

"use strict"

define([], function() {

var ImageProcessingTask, _ref, module,


  module = function() {}
  ImageProcessingTask = (function(_super){
  //__extends(, )
// --------------------------------------



    function ImageProcessingTask(canvasOrigin, canvasShown, imageProcessor){

      this.canvasOrigin = canvasOrigin    
      this.canvasShown = canvasShown
      this.imageProcessor = imageProcessor

    }

    ImageProcessingTask.prototype.initializeTools = function(){
      console.error("initalizeTools() not implementet jet")
    }

    ImageProcessingTask.prototype.appendToMenuBar = function(){
      console.error("appendToMenuBar() not implementet jet")
    }


// --------------------------------------
    return ImageProcessingTask
  })()
  return module.exports = ImageProcessingTask
})