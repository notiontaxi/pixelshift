/*
Class for outline and threshold class

Florian Wokurka (2013)
https://github.com/notiontaxi
*/

"use strict"

define(['text!templates/image-processing.html','js/Outline', 'js/Areas','js/VectorizerView','js/CanvasGui'], function(contentTemplate, Outline, Areas, Vectorizer, CanvasGui) {

var ImageProcessing, _ref, module,


  module = function() {}
  ImageProcessing = (function(_super){
    __extends(ImageProcessing, CanvasGui);
// --------------------------------------



    function ImageProcessing(containerIdentifier){   
      // render templates
      $(containerIdentifier).html($(contentTemplate))

      ImageProcessing.__super__.constructor("#canvas-container")
      
      new Outline(".controls-wrapper")
      new Areas(".controls-wrapper")
      new Vectorizer(".controls-wrapper")
    }





// --------------------------------------
    return ImageProcessing
  })()
  return module.exports = ImageProcessing
})