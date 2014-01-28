/*
Class for contrast manipulation

Florian Wokurka (2013)
https://github.com/notiontaxi
*/

"use strict"

define(['text!templates/task-contrast.html','js/strategies/ImageProcessingMenubarStrategy'], function(contentTemplate, ImageProcessingMenubarStrategy) {

var ContrastStrategy, _ref, module,


  module = function() {}
  ContrastStrategy = (function(_super){
  __extends(ContrastStrategy, ImageProcessingMenubarStrategy)
// --------------------------------------

  ContrastStrategy.NAME = 'contrast'
  ContrastStrategy.LABEL = 'Contrast'

    function ContrastStrategy(canvases, imageProcessor){
      this.name = ContrastStrategy.NAME
      this.label = ContrastStrategy.LABEL
      this.menuTyp = ImageProcessingMenubarStrategy.MENU_TYP_FILTER
      ContrastStrategy.__super__.constructor(canvases, imageProcessor)

      // render templates
      $(".controls-wrapper").append($(contentTemplate))
      this.init()
      this.currentValue = 0
      this.changed = false
      this.onChangeAction = null      
    }

    ContrastStrategy.prototype.initializeTools = function(){
      this.initializeDefaultSlider(ContrastStrategy.NAME, 0, -255, 255)
    }

    ContrastStrategy.prototype.execute = function(imgData, preview){

      if(!imgData)
        var imgData = this.canvasOrigin.getImageData()

      this.processedImageData = this.imageProcessor.processContrast(imgData, this.currentValue)

      if(!!preview)
        this.canvasStage.draw(this.processedImageData)
      else{
        this.canvasOrigin.putImageData(this.processedImageData)
        this.updateAllStrategies(this.canvasOrigin.getImageData(), true)
      }
    }






// --------------------------------------
    return ContrastStrategy
  })()
  return module.exports = ContrastStrategy
})