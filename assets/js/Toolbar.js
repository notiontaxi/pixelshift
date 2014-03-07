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
      this.buttonIdent = ".toolbar-foreground-color"

      this.initialize()
      this.addEventListeners()
      this.lastActive = null
    }

    Toolbar.prototype.initialize = function(){
      $(this.containerIdentifier).append($(toolbarTemplate))
      this.toolbar = $("#toolbar")
      //this.toolbar.hide()
      this.toolbar.removeClass('hidden')

      if(!window.isTouchDevice){
        this.toolbar.draggable()
      }
    }

    Toolbar.prototype.getElement = function(){
      return this.toolbar;
    }
   
    Toolbar.prototype.addEventListeners = function(containerIdentifier){

      $(this.colorPickerColorIdent).on('new-color', 
        function(event, color){
          $(".toolbar-foreground-color").css({'background-color': color})
      })

      $(".action-show-color-picker").click(function(){
        $('#color-picker-modal').fadeIn(300)
      })

      $(".action-close-toolbar").click(
      function(event, ui){
        this.hide()
      }.bind(this)) 

    }

    Toolbar.prototype.toggleActive = function(event){

      var _this = event.data.toolbar
      var strategy = event.data.strategy       


      var deaktivationSuccessfull = true

      if(!!_this.lastActive){
        deaktivationSuccessfull = _this.lastActive.setInactive()
      }

      if(deaktivationSuccessfull){
        strategy.setActive()
        $('#toolbar').attr('mode', strategy.name)
        _this.lastActive = strategy
      }

    }


    Toolbar.prototype.foregroundColor = function(){
      var color = $($(this.buttonIdent)[0]).css('background-color')

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

    Toolbar.prototype.add = function(iconClass, id, mode, toolbar){

      var submenu = $('<div/>', 
        {
            class: 'toolbar-submenu hidden'
          , id: id+'-submenu'
        }   
      ).appendTo(toolbar)

      var container = $('<div/>', 
          {
            class: 'toolbar-item'
          }
        ).appendTo(toolbar)

      var button = $('<button/>', 
            {
                 id: id
              ,  mode: mode
              , class: 'btn btn-default action-switch-mode'
            }
          ).prependTo(container)

      var i = $('<i/>', 
          {
            class: iconClass
          }
        ).appendTo(button)

      var arrow = $('<i/>', 
          {
            class: 'icon-play3 toolbar-submenu-arrow hidden'
          }
        ).appendTo(button)

      arrow.hide()
      arrow.removeClass('hidden')
      submenu.hide()
      submenu.removeClass('hidden')      

      return button
    }     


// --------------------------------------
    return Toolbar
  })()
  return module.exports = Toolbar
})