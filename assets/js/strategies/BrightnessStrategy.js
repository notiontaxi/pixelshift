/*
Class for brightness manipulation

Florian Wokurka (2013)
https://github.com/notiontaxi
*/

"use strict"

define(['text!templates/task-brightness.html','js/strategies/ImageProcessingMenubarStrategy'], function(contentTemplate, ImageProcessingMenubarStrategy) {

var BrightnessStrategy, _ref, module,


  module = function() {}
  BrightnessStrategy = (function(_super){
  __extends(BrightnessStrategy, ImageProcessingMenubarStrategy)
// --------------------------------------

  BrightnessStrategy.NAME = 'brightness'
  BrightnessStrategy.LABEL = 'Brightness'

    function BrightnessStrategy(canvases, imageProcessor){
      this.name = BrightnessStrategy.NAME
      this.label = BrightnessStrategy.LABEL
      this.menuTyp = ImageProcessingMenubarStrategy.MENU_TYP_FILTER
      BrightnessStrategy.__super__.constructor(canvases, imageProcessor)

      // render templates
      $(".controls-wrapper").append($(contentTemplate))
      this.init()
      this.currentValue = 0
      this.changed = false
      this.onChangeAction = null
    }

    BrightnessStrategy.prototype.initializeTools = function(){
      this.initializeDefaultSlider(BrightnessStrategy.NAME, 0, -255, 255)
    }

    BrightnessStrategy.prototype.execute = function(imgData, preview){

      if(!imgData)
        var imgData = this.canvasOrigin.getImageData()
      
      this.processedImageData = this.imageProcessor.processBrightness(imgData, this.currentValue)

      if(!!preview)
        this.canvasStage.draw(this.processedImageData)
      else{
        this.canvasOrigin.putImageData(this.processedImageData)
        this.updateAllStrategies(this.canvasOrigin.getImageData(), true)
      }
    }






// --------------------------------------
    return BrightnessStrategy
  })()
  return module.exports = BrightnessStrategy
})