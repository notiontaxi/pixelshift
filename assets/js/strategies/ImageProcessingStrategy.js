/*
ImageProcessingStrategy class

Florian Wokurka (2013)
https://github.com/notiontaxi
*/

"use strict"

define([], function() {

var ImageProcessingStrategy, _ref, module,


  module = function() {}
  ImageProcessingStrategy = (function(_super){
  //__extends(, )
// --------------------------------------

    // is this a tool for the menu bar above or for the toolbar? 
    ImageProcessingStrategy.TYPE_MENU = 1
    ImageProcessingStrategy.TYPE_TOOLBAR = 2

    function ImageProcessingStrategy(canvasOrigin, canvasStage, canvasShown, imageProcessor, type){
      this.type = type
      this.canvasOrigin = canvasOrigin  
      this.canvasStage = canvasStage
      this.canvasShown = canvasShown
      this.imageProcessor = imageProcessor
    }

    ImageProcessingStrategy.prototype.init = function(){

      this.initializeTools()
      if(this.type === ImageProcessingStrategy.TYPE_MENU){
        this.appendToMenuBar()
        this.addMenuBarAction()
      }else if(this.type === ImageProcessingStrategy.TYPE_TOOLBAR){
        this.appendToToolbar()
        this.addToolbarAction()
      }else{
        console.error("invalid type")
      }

    }    

    ImageProcessingStrategy.prototype.execute = function(){
      console.error("execute() not implementet jet")
    }

    ImageProcessingStrategy.prototype.initializeTools = function(){
      console.error("initalizeTools() not implementet jet")
    }

    /**
    * Regular Menu bar
    */
    ImageProcessingStrategy.prototype.appendToMenuBar = function(){
      console.error("appendToMenuBar() not implementet jet")
    }
     /**
    * Click actions for slide in/out
    */
    ImageProcessingStrategy.prototype.addMenuBarAction = function(){
      console.error("addMenuBarAction() not implementet jet")
    }
    /**
    * Regular Menu bar
    */
    ImageProcessingStrategy.prototype.appendToToolbar = function(){
      console.error("appendToToolbar() not implementet jet")
    }
     /**
    * Click actions for slide in/out
    */
    ImageProcessingStrategy.prototype.addToolbarAction = function(){
      console.error("addToolbarAction() not implementet jet")
    }

    ImageProcessingStrategy.prototype.addToToolbar = function(iconClass, id, mode, toolbar){

      var button = $('<button/>', 
            {
                 id: id
              ,  mode: mode
              , class: 'btn btn-default action-switch-mode'
            }
          ).prependTo(toolbar)

      var i = $('<i/>', 
          {
            class: iconClass
          }
        ).appendTo(button)

      return button
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


// --------------------------------------
    return ImageProcessingStrategy
  })()
  return module.exports = ImageProcessingStrategy
})