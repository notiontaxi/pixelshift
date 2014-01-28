/*
Class for blur effect

Florian Wokurka (2013)
https://github.com/notiontaxi
*/

"use strict"

define(['text!templates/task-blur.html','js/strategies/ImageProcessingMenubarStrategy', 'js/lib/StackBlur'], function(contentTemplate, ImageProcessingMenubarStrategy, StackBlur) {

var BlurStrategy, _ref, module,


  module = function() {}
  BlurStrategy = (function(_super){
  __extends(BlurStrategy, ImageProcessingMenubarStrategy)
// --------------------------------------

  BlurStrategy.NAME = 'blur'
  BlurStrategy.LABEL = 'Blur'

    function BlurStrategy(canvases, imageProcessor){
      this.name = BlurStrategy.NAME
      this.label = BlurStrategy.LABEL
      this.menuTyp = ImageProcessingMenubarStrategy.MENU_TYP_FILTER
      BlurStrategy.__super__.constructor(canvases, imageProcessor)

      // render templates
      $(".controls-wrapper").append($(contentTemplate))
      this.init()
      this.currentValue = 0
      // will be updated in superclass (cancel() and proceed())
      this.changed = false
      this.onChangeAction = null
    }

    BlurStrategy.prototype.initializeTools = function(){
      this.initializeDefaultSlider(BlurStrategy.NAME, 0, 0, 180)
    }

    BlurStrategy.prototype.execute = function(imgData, preview){
      console.log(imgData)
      if(!imgData)
        var imgData = this.canvasOrigin.getImageData()
      
      if(!!preview){
        this.processedImageData = stackBlurImage(imgData, this.canvasStage.imageWidth, this.canvasStage.imageHeight, this.currentValue, false )
        this.canvasStage.draw(this.processedImageData)
      }
      else{
        this.processedImageData = stackBlurImage(imgData, this.canvasOrigin.imageWidth, this.canvasOrigin.imageHeight, this.currentValue, false )
        this.canvasOrigin.putImageData(this.processedImageData)
        this.updateAllStrategies(this.canvasOrigin.getImageData(), true)
      }

    }



// --------------------------------------
    return BlurStrategy
  })()
  return module.exports = BlurStrategy
})