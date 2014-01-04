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
      this.toolbar.hide()
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

    Toolbar.toggleActive = function(event, obj){
      $(".action-switch-mode").each(function(){
        $(this).removeClass('mode-active')
      })
      $('#toolbar').attr('mode', $(obj).attr('mode'))
      $(obj).addClass('mode-active')
    }

    Toolbar.toggleSubmenu = function(submenu, arrow){
      $(".toolbar-submenu").each(function(){
        $(this).hide()
      })
      $('.toolbar-submenu-arrow').each(function(){
        $(this).hide()
      })
      arrow.fadeIn(100)
      submenu.fadeIn(100)

    }

    Toolbar.prototype.foregroundColor = function(){
      var color = $(this.buttonIdent).css('background-color')

      var start = color.indexOf("(") +1
      var stop = color.indexOf(")") 
      color = color.substring(start,stop)
      var colors = color.split(",")

      return {r: parseInt(colors[0]), 
              g: parseInt(colors[1]), 
              b: parseInt(colors[2]), 
              a: 255}

      //return $('this.buttonIdent').css('background-color')
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