/*
ImageProcessingToolbarStrategy class

Florian Wokurka (2013)
https://github.com/notiontaxi
*/

"use strict"

define(['js/strategies/ImageProcessingStrategy'], function(ImageProcessingStrategy) {

var ImageProcessingToolbarStrategy, _ref, module,


 module = function() {}
  ImageProcessingToolbarStrategy = (function(_super){
  __extends(ImageProcessingToolbarStrategy, ImageProcessingStrategy)
// --------------------------------------

    // is this a tool for the menu bar above or for the toolbar? 


    function ImageProcessingToolbarStrategy(canvases, imageProcessor, toolbar){
      ImageProcessingToolbarStrategy.__super__.constructor(canvases, imageProcessor)
      this.toolbar = toolbar
    }


    ImageProcessingToolbarStrategy.prototype.init = function(){
        this.appendToToolbar()
        this.addToolbarAction()
    }

   

    ImageProcessingToolbarStrategy.prototype.execute = function(){
      console.error("execute() not implementet jet")
    }

    ImageProcessingToolbarStrategy.prototype.initializeTools = function(){
      console.error("initalizeTools() not implementet jet")
    }

    ImageProcessingToolbarStrategy.prototype.setOnChangeAction = function(action, obj){
      this.onChangeAction = action
      this.refObj = obj
    }

    /**
    * Regular Menu bar
    */
    ImageProcessingToolbarStrategy.prototype.appendToToolbar = function(){
      this.button = this.toolbar.add(this.class, 'toolbar-'+this.name, this.name, '.tool-items')

      if(!!this.addSubmenu)
        this.addSubmenu()
    }

    ImageProcessingToolbarStrategy.prototype.addToolbarAction = function(){
      this.button.click({strategy: this, toolbar: this.toolbar}, this.toolbar.toggleActive)
    } 


    /**
    * implement this method, when actions on activation are needed
    * @return {bool} true, if action was successfull
    */
    ImageProcessingToolbarStrategy.prototype.activeAction = function(){
      return true
    }

    ImageProcessingToolbarStrategy.prototype.setActive = function(){

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
    ImageProcessingToolbarStrategy.prototype.inactiveAction = function(){
      return true
    }    

    ImageProcessingToolbarStrategy.prototype.setInactive = function(){
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
    return ImageProcessingToolbarStrategy
  })()
  return module.exports = ImageProcessingToolbarStrategy
})