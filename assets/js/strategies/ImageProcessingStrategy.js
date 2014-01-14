/*
ImageProcessingStrategy class

Florian Wokurka (2013)
https://github.com/notiontaxi
*/

"use strict"

define(['js/Toolbar'], function(Toolbar) {

var ImageProcessingStrategy, _ref, module,


  module = function() {}
  ImageProcessingStrategy = (function(_super){
  //__extends(, )
// --------------------------------------

    // is this a tool for the menu bar above or for the toolbar? 
    ImageProcessingStrategy.TYPE_MENU = 1
    ImageProcessingStrategy.TYPE_TOOLBAR = 2

    function ImageProcessingStrategy(canvases, imageProcessor, type){
      this.type = type
      this.canvasOrigin = canvases.canvasOrigin  
      this.canvasStage = canvases.canvasStage
      this.canvasShown = canvases.canvasShown
      this.canvasCloneElement = canvases.canvasCloneElement
      this.imageProcessor = imageProcessor
    }


    ImageProcessingStrategy.prototype.init = function(){

      if(this.type === ImageProcessingStrategy.TYPE_MENU){
        this.initializeTools()
        this.appendToMenuBar(this.label, this.name)
        this.addMenuBarAction(this.name)
      }else if(this.type === ImageProcessingStrategy.TYPE_TOOLBAR){
        this.appendToToolbar()
        this.addToolbarAction()
      }else{
        console.error("invalid type")
      }
    }

    ImageProcessingStrategy.prototype.addMenuBarAction = function(name){
      $(".action-menu-"+name).click(
      function(event, ui){
        event.stopPropagation()
        event.preventDefault()
        $(".dropdown").removeClass("open")
        $("."+name+"-controls").slideToggle()
      })

      $("."+name+"-controls").click(function(){
        $(this).slideToggle()
      }).children().click(function(e) {
        return false; // prevent childs to do this action
      })
    }     

    ImageProcessingStrategy.prototype.execute = function(){
      console.error("execute() not implementet jet")
    }

    ImageProcessingStrategy.prototype.initializeTools = function(){
      console.error("initalizeTools() not implementet jet")
    }

    ImageProcessingStrategy.prototype.setOnChangeAction = function(action, obj){
      this.onChangeAction = action
      this.refObj = obj
    }

    ImageProcessingStrategy.prototype.initializeDefaultSlider = function(name, value, min, max){

      this.okButton = $("#"+name+"-ok")
      this.nokButton = $("#"+name+"-nok")

      // brightness slider
      $( "#"+name+"-slider" ).slider(
        {
          range: "min",
          value: value,
          min: min,
          max: max,
          slide: function( event, ui ) {
            $( "#"+name+"-slider-output" ).html(ui.value)
            this.currentValue = ui.value
            this.changed = true

            this.okButton.show()
            this.nokButton.show()

            if(!!this.onChangeAction)
              this.onChangeAction(this.refObj, true)

          }.bind(this)
        }
      )

      this.okButton.hide()
      this.okButton.removeClass('hidden')
      this.okButton.click(
        function(event, ui){
          this.execute(null, false)
          // reset all values to 0
          this.currentValue = 0
          $( "#"+name+"-slider" ).slider({value: this.currentValue})
          $( "#"+name+"-slider-output" ).html(0)
          this.changed = false

          this.okButton.hide()
          this.nokButton.hide()
          
        }.bind(this)
      )

      this.nokButton.hide()
      this.nokButton.removeClass('hidden')
      // set all values to 0 and repaint with remaining filters
      this.nokButton.click(
        function(event, ui){

          this.currentValue = 0
          $( "#"+name+"-slider" ).slider({value: 0})
          $( "#"+name+"-slider-output" ).html(0)

          if(!!this.onChangeAction)
            this.onChangeAction(this.refObj, true)

          this.okButton.hide()
          this.nokButton.hide()

          this.changed = false
        }.bind(this)
      )
    }

    /**
    * Regular Menu bar
    */
    ImageProcessingStrategy.prototype.appendToMenuBar = function(label, name){
      this.appendToLGMenuBar(label, 'action-menu-'+name, 'image-actions-list')
      this.appendToSDMenuBar(label, 'action-menu-'+name, 'image-actions-list-sd')  
    }

    /**
    * Regular Menu bar
    */
    ImageProcessingStrategy.prototype.appendToToolbar = function(){
      this.button = this.toolbar.add(this.class, 'toolbar-'+this.name, this.name, '.tool-items')

      if(!!this.addSubmenu)
        this.addSubmenu()
    }

    

    ImageProcessingStrategy.prototype.appendToLGMenuBar = function(text, className, typeName){
      var li = $('<li/>')

      var a = $('<a/>', 
            {
                href: '#'
              , text: text
              , class: className
            }
          ).appendTo(li)

      li.appendTo('.'+typeName)
    }

    ImageProcessingStrategy.prototype.appendToSDMenuBar = function(text, className, typeName){

      var li = $('<li/>');
      var button = $('<button/>', 
            {
                text: text
              , class: className+' btn btn-default small-menu-btn'
            }
          ).appendTo(li)

      var span = $('<span/>', 
          {
            class: '' // later be used for icons
          }
        ).appendTo(button)

      li.appendTo('.'+typeName)
    }

    ImageProcessingStrategy.prototype.addToolbarAction = function(){
      this.button.click({strategy: this, toolbar: this.toolbar}, this.toolbar.toggleActive)
    } 


    /**
    * implement this method, when actions on activation are needed
    * @return {bool} true, if action was successfull
    */
    ImageProcessingStrategy.prototype.activeAction = function(){
      return true
    }

    ImageProcessingStrategy.prototype.setActive = function(){

      var aktivationSuccessfull = false

      if(this.activeAction()){
        // show toolbar, if this tool has one  
        if(!!this.submenu){
          this.arrow.fadeIn(100)
          this.submenu.fadeIn(100)
        }

        this.button.addClass('mode-active')
        aktivationSuccessfull = true
      }

      return aktivationSuccessfull
    } 


    /**
    * implement this method, when actions on release are needed
    * @return {bool} true, if action was successfull
    */    
    ImageProcessingStrategy.prototype.inactiveAction = function(){
      return true
    }    

    ImageProcessingStrategy.prototype.setInactive = function(){
      var deaktivationSuccessfull = false

      if(this.inactiveAction()){

        if(!!this.submenu){
          this.arrow.hide()
          this.submenu.hide()
        }      

        this.button.removeClass('mode-active')
        deaktivationSuccessfull = true
      }

      return deaktivationSuccessfull
    }              


// --------------------------------------
    return ImageProcessingStrategy
  })()
  return module.exports = ImageProcessingStrategy
})