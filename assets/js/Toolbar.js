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
      this.toolbar = $("#toolbar")
      this.toolbar.removeClass('hidden')
      this.toolbar.draggable()
    }

   
    Toolbar.prototype.addEventListeners = function(containerIdentifier){

      $(this.colorPickerColorIdent).on('new-color', 
        function(event, color){
          $("#toolbar-foreground-color").css({'background-color': color})
      })

      $(".action-show-color-picker").click(function(){
        $('#color-picker-modal').fadeIn(300)
      })

      $(".action-close-toolbar").click(
      function(event, ui){
        this.hide()
      }.bind(this)) 

    }

    Toolbar.toggleActive = function(event){
      $(".action-switch-mode").each(function(){
        $(this).removeClass('mode-active')
      })
      $('#toolbar').attr('mode', $(this).attr('mode'))
      $(this).addClass('mode-active')
    }

    Toolbar.prototype.mode = function(){
      return this.toolbar.attr('mode')
    }

    Toolbar.prototype.show = function(){
        this.toolbar.fadeIn(300)
    }
    Toolbar.prototype.hide = function(){
      this.toolbar.fadeOut(100)    
    }


// --------------------------------------
    return Toolbar
  })()
  return module.exports = Toolbar
})