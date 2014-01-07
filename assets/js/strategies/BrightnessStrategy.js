/*
Class for brightness manipulation

Florian Wokurka (2013)
https://github.com/notiontaxi
*/

"use strict"

define(['text!templates/task-brightness.html','js/strategies/ImageProcessingStrategy'], function(contentTemplate, ImageProcessingStrategy) {

var BrightnessStrategy, _ref, module,


  module = function() {}
  BrightnessStrategy = (function(_super){
  __extends(BrightnessStrategy, ImageProcessingStrategy)
// --------------------------------------

  BrightnessStrategy.NAME = 'brightness'
  BrightnessStrategy.LABEL = 'Brightness'

    function BrightnessStrategy(canvasOrigin, canvasStage, canvasShown, imageProcessor){
      this.name = BrightnessStrategy.NAME
      BrightnessStrategy.__super__.constructor(canvasOrigin, canvasStage ,canvasShown, imageProcessor, ImageProcessingStrategy.TYPE_MENU)

      // render templates
      $(".controls-wrapper").append($(contentTemplate))
      this.init({label: BrightnessStrategy.LABEL, name: BrightnessStrategy.NAME})
      this.currentValue = 0
      this.changed = false
      this.onChangeAction = null
    }

    BrightnessStrategy.prototype.initializeTools = function(){
      this.initializeDefaultSlider(BrightnessStrategy.NAME, 0, -255, 255)
    }

    BrightnessStrategy.prototype.execute = function(imgData, preview){

      if(!imgData)
        var imgData = this.canvasOrigin.getFullImageData()
      
      this.processedImageData = this.imageProcessor.processBrightness(imgData, this.currentValue)

      if(!!preview)
        this.canvasStage.draw(this.processedImageData)
      else
        this.canvasOrigin.putImageData(this.processedImageData)
    }






// --------------------------------------
    return BrightnessStrategy
  })()
  return module.exports = BrightnessStrategy
})