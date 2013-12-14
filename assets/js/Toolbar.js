/*
Toolbar class

Florian Wokurka (2013)
https://github.com/notiontaxi
*/

"use strict"

define(['text!templates/toolbar.html'], function(toolbarTemplate) {

  var Toolbar, _ref, module;
  module = function() {}
  Toolbar = (function(){

// --------------------------------------


  // tell wehre the menu should be rendered and where i can find the canvas
    function Toolbar(containerIdentifier){
      this.containerIdentifier = containerIdentifier
      this.colorPickerColorIdentifier = "#color-picker-color"

      this.addEventListeners()
      this.initialize()
    }

    Toolbar.prototype.initialize = function(){
      $(this.containerIdentifier).append($(toolbarTemplate))
    }

   
    Toolbar.prototype.addEventListeners = function(containerIdentifier){

      

      $('#color-picker-color').on('new-color', 
        function(event, color){
          $('#foreground-color-btn').css({'background-color': color})
      })

      /*
      $(".action-upload-image").click(
        function(event, ui){
          event.stopPropagation()
          event.preventDefault()
          this.canvasStage.zoomReset()
          $('input[type="file"]').click()
        }.bind(this))
      */  
    }

    Toolbar.prototype.initializeTools = function(){
      /*
      $(".action-grayscale").click(
        function(event, ui){
          event.stopPropagation()
          event.preventDefault()
          var newImg = this.imageProcessor.processGrayscale(this.canvasOrigin.getImageData(), this.canvasOrigin.getImageWidth())
          this.canvasOrigin.putImageData(newImg)
      }.bind(this))    
      */
    }


// --------------------------------------
    return Toolbar
  })()
  return module.exports = Toolbar
})