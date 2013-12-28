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

    function BrightnessStrategy(canvasOrigin, canvasStage, canvasShown,imageProcessor){
      this.name = BrightnessStrategy.NAME
      BrightnessStrategy.__super__.constructor(canvasOrigin, canvasStage ,canvasShown, imageProcessor, ImageProcessingStrategy.TYPE_MENU)

      // render templates
      $(".controls-wrapper").append($(contentTemplate))
      this.init(BrightnessStrategy.LABEL, BrightnessStrategy.NAME)
    }


    BrightnessStrategy.prototype.updateBrightness = function(brightness){

      var imgData = this.canvasOrigin.getFullImageData()

      this.processedImageData = this.imageProcessor.processBrightness(imgData, brightness)
      this.canvasStage.draw(this.processedImageData)
    }

      

    BrightnessStrategy.prototype.addMenuBarAction = function(){
      $(".action-menu-"+BrightnessStrategy.NAME).click(
      function(event, ui){
        event.stopPropagation()
        event.preventDefault()
        $(".dropdown").removeClass("open")
        $("."+BrightnessStrategy.NAME+"-controls").slideToggle()
      })

      $("."+BrightnessStrategy.NAME+"-controls").click(function(){
        $(this).slideToggle()
      }).children().click(function(e) {
        return false; // prevent childs to do this action
      })
    }

    BrightnessStrategy.prototype.initializeTools = function(){

      // brightness slider
      $( "#"+BrightnessStrategy.NAME+"-slider" ).slider(
        {
          range: "min",
          value: 0,
          min: -255,
          max: 255,
          slide: function( event, ui ) {
            $( "#"+BrightnessStrategy.NAME+"-slider-output" ).html(ui.value)
            this.updateBrightness(ui.value)
          }.bind(this)
        }
      )

      $("#"+BrightnessStrategy.NAME+"-ok").click(
        function(event, ui){
          if(!!this.processedImageData)
            this.canvasOrigin.putImageData(this.processedImageData)
        }.bind(this)
      )

      $("#"+BrightnessStrategy.NAME+"-nok").click(
        function(event, ui){
          this.canvasOrigin.drawClones()
        }.bind(this)
      )
    }



// --------------------------------------
    return BrightnessStrategy
  })()
  return module.exports = BrightnessStrategy
})