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
      BlurStrategy.__super__.constructor(canvases, imageProcessor)

      // render templates
      $(".controls-wrapper").append($(contentTemplate))
      this.init()
      this.currentValue = 0
      this.changed = false
      this.onChangeAction = null      
    }

    BlurStrategy.prototype.initializeTools = function(){
      this.initializeDefaultSlider(BlurStrategy.NAME, 0, 0, 180)
    }

    BlurStrategy.prototype.execute = function(imgData, preview){
      
      if(!imgData)
        var imgData = this.canvasOrigin.getFullImageData()
      
      if(!!preview){
        this.processedImageData = stackBlurImage(imgData, this.canvasStage, this.currentValue, false )
        this.canvasStage.draw(this.processedImageData)
      }
      else{
        this.processedImageData = stackBlurImage(imgData, this.canvasOrigin, this.currentValue, false )
        this.canvasOrigin.putImageData(this.processedImageData)
      }

    }



// --------------------------------------
    return BlurStrategy
  })()
  return module.exports = BlurStrategy
})