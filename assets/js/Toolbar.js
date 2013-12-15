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
      this.colorPickerColorIdent = "#color-picker-color"
      this.buttonIdent = "#toolbar-foreground-color"

      this.initialize()
      this.addEventListeners()
    }

    Toolbar.prototype.initialize = function(){
      $(this.containerIdentifier).append($(toolbarTemplate))
    }

   
    Toolbar.prototype.addEventListeners = function(containerIdentifier){


      $(this.colorPickerColorIdent).on('new-color', 
        function(event, color){
          $("#toolbar-foreground-color").css({'background-color': color})
      })

      $(".action-show-color-picker").click(function(){
        $('#color-picker-modal').fadeIn(300)
      })

      $(".action-switch-mode").click(Toolbar.toggleActive)
      //$(".mode-active")[0].getAttribute('mode')

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

    Toolbar.toggleActive = function(event){
      $(".action-switch-mode").each(function(){
        $(this).removeClass('mode-active')
      })
      $(this).addClass('mode-active')
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