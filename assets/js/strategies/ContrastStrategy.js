/*
Class for contrast manipulation

Florian Wokurka (2013)
https://github.com/notiontaxi
*/

"use strict"

define(['text!templates/task-contrast.html','js/strategies/ImageProcessingStrategy'], function(contentTemplate, ImageProcessingStrategy) {

var ContrastStrategy, _ref, module,


  module = function() {}
  ContrastStrategy = (function(_super){
  __extends(ContrastStrategy, ImageProcessingStrategy)
// --------------------------------------

  ContrastStrategy.NAME = 'contrast'
  ContrastStrategy.LABEL = 'Contrast'

    function ContrastStrategy(canvasOrigin, canvasStage, canvasShown,imageProcessor){
      this.name = ContrastStrategy.NAME
      ContrastStrategy.__super__.constructor(canvasOrigin, canvasStage ,canvasShown, imageProcessor, ImageProcessingStrategy.TYPE_MENU)

      // render templates
      $(".controls-wrapper").append($(contentTemplate))
      this.init({label: ContrastStrategy.LABEL, name: ContrastStrategy.NAME})
      this.currentValue = 0
      this.changed = false
      this.onChangeAction = null      
    }

    ContrastStrategy.prototype.initializeTools = function(){
      this.initializeDefaultSlider(ContrastStrategy.NAME, 0, -255, 255)
    }

    ContrastStrategy.prototype.execute = function(imgData, preview){

      if(!imgData)
        var imgData = this.canvasOrigin.getFullImageData()

      this.processedImageData = this.imageProcessor.processContrast(imgData, this.currentValue)

      if(!!preview)
        this.canvasStage.draw(this.processedImageData)
      else
        this.canvasOrigin.putImageData(this.processedImageData)
    }






// --------------------------------------
    return ContrastStrategy
  })()
  return module.exports = ContrastStrategy
})