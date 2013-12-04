/*
Class for outline and threshold class

Florian Wokurka (2013)
https://github.com/notiontaxi
*/

"use strict"

define(['text!templates/image-processing.html','js/OutlineTask', 'js/AreasTask','js/VectorizerTask','js/CanvasGui'], function(contentTemplate, OutlineTask, AreasTask, VectorizerTask, CanvasGui) {

var ImageProcessing, _ref, module,


  module = function() {}
  ImageProcessing = (function(_super){
    __extends(ImageProcessing, CanvasGui);
// --------------------------------------



    function ImageProcessing(containerIdentifier){   
      // render templates
      $(containerIdentifier).html($(contentTemplate))

      ImageProcessing.__super__.constructor("#canvas-container")
      

      this.addTask(new OutlineTask(".controls-wrapper", this.canvasOrigin, this.canvasStage, this.canvasShown, this.imageProcessor))
      this.addTask(new AreasTask(".controls-wrapper", this.canvasOrigin, this.canvasStage, this.canvasShown, this.imageProcessor))
      this.addTask(new VectorizerTask(".controls-wrapper", this.canvasOrigin, this.canvasStage, this.canvasShown, this.imageProcessor))

    }

    ImageProcessing.prototype.addTask = function(task){
      task.initializeTools()
      task.appendToMenuBar()
    } 





// --------------------------------------
    return ImageProcessing
  })()
  return module.exports = ImageProcessing
})