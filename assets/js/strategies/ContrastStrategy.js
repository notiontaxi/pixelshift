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
      this.init(ContrastStrategy.LABEL, ContrastStrategy.NAME)
    }


    ContrastStrategy.prototype.updateContrast = function(contrast){

      var imgData = this.canvasOrigin.getFullImageData()

      this.processedImageData = this.imageProcessor.processContrast(imgData, contrast)
      this.canvasStage.draw(this.processedImageData)
    }

      

    ContrastStrategy.prototype.addMenuBarAction = function(){
      $(".action-menu-"+ContrastStrategy.NAME).click(
      function(event, ui){
        event.stopPropagation()
        event.preventDefault()
        $(".dropdown").removeClass("open")
        $("."+ContrastStrategy.NAME+"-controls").slideToggle()
      })

      $("."+ContrastStrategy.NAME+"-controls").click(function(){
        $(this).slideToggle()
      }).children().click(function(e) {
        return false; // prevent childs to do this action
      })
    }

    ContrastStrategy.prototype.initializeTools = function(){

      // brightness slider
      $( "#"+ContrastStrategy.NAME+"-slider" ).slider(
        {
          range: "min",
          value: 0,
          min: -255,
          max: 255,
          slide: function( event, ui ) {
            $( "#"+ContrastStrategy.NAME+"-slider-output" ).html(ui.value)
            this.updateContrast(ui.value)
          }.bind(this)
        }
      )

      $("#"+ContrastStrategy.NAME+"-ok").click(
        function(event, ui){
          if(!!this.processedImageData)
            this.canvasOrigin.putImageData(this.processedImageData)
        }.bind(this)
      )

      $("#"+ContrastStrategy.NAME+"-nok").click(
        function(event, ui){
          this.canvasOrigin.drawClones()
        }.bind(this)
      )
    }



// --------------------------------------
    return ContrastStrategy
  })()
  return module.exports = ContrastStrategy
})