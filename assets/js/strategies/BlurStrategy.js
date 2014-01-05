/*
Class for blur effect

Florian Wokurka (2013)
https://github.com/notiontaxi
*/

"use strict"

define(['text!templates/task-blur.html','js/strategies/ImageProcessingStrategy', 'js/lib/StackBlur'], function(contentTemplate, ImageProcessingStrategy, StackBlur) {

var BlurStrategy, _ref, module,


  module = function() {}
  BlurStrategy = (function(_super){
  __extends(BlurStrategy, ImageProcessingStrategy)
// --------------------------------------

  BlurStrategy.NAME = 'blur'
  BlurStrategy.LABEL = 'Blur'

    function BlurStrategy(canvasOrigin, canvasStage, canvasShown,imageProcessor){
      this.name = BlurStrategy.NAME
      BlurStrategy.__super__.constructor(canvasOrigin, canvasStage ,canvasShown, imageProcessor, ImageProcessingStrategy.TYPE_MENU)

      // render templates
      $(".controls-wrapper").append($(contentTemplate))
      this.init(BlurStrategy.LABEL, BlurStrategy.NAME)
    }


    BlurStrategy.prototype.updateBlur = function(blurRadius){
      this.processedImageData = stackBlurImage( this.canvasOrigin, this.canvasStage, blurRadius, false );
      this.canvasStage.draw(this.processedImageData)
    }


    BlurStrategy.prototype.addMenuBarAction = function(){
      $(".action-menu-"+BlurStrategy.NAME).click(
      function(event, ui){
        event.stopPropagation()
        event.preventDefault()
        $(".dropdown").removeClass("open")
        $("."+BlurStrategy.NAME+"-controls").slideToggle()
      })

      $("."+BlurStrategy.NAME+"-controls").click(function(){
        $(this).slideToggle()
      }).children().click(function(e) {
        return false; // prevent childs to do this action
      })
    }

    BlurStrategy.prototype.initializeTools = function(){
      // brightness slider
      $( "#"+BlurStrategy.NAME+"-slider" ).slider(
        {
          range: "min",
          value: 1,
          min: 0,
          max: 180,
          slide: function( event, ui ) {
            $( "#"+BlurStrategy.NAME+"-slider-output" ).html(ui.value)
            this.updateBlur(ui.value)
          }.bind(this)
        }
      )

      $("#"+BlurStrategy.NAME+"-ok").click(
        function(event, ui){
          if(!!this.processedImageData)
            this.canvasOrigin.putImageData(this.processedImageData)
        }.bind(this)
      )

      $("#"+BlurStrategy.NAME+"-nok").click(
        function(event, ui){
          this.canvasOrigin.drawClones()
        }.bind(this)
      )
    }



// --------------------------------------
    return BlurStrategy
  })()
  return module.exports = BlurStrategy
})