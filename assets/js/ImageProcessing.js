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
      

      new OutlineTask(".controls-wrapper", this.canvasOrigin, this.canvasStage, this.canvasShown, this.imageProcessor)
      new AreasTask(".controls-wrapper", this.canvasOrigin, this.canvasStage, this.canvasShown, this.imageProcessor)
      new VectorizerTask(".controls-wrapper", this.canvasOrigin, this.canvasStage, this.canvasShown, this.imageProcessor)

    }






// --------------------------------------
    return ImageProcessing
  })()
  return module.exports = ImageProcessing
})