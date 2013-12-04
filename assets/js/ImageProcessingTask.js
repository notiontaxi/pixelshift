/*
ImageProcessingTask class

Florian Wokurka (2013)
https://github.com/notiontaxi
*/

"use strict"

define([], function() {

var ImageProcessingTask, _ref, module,


  module = function() {}
  ImageProcessingTask = (function(_super){
  //__extends(, )
// --------------------------------------



    function ImageProcessingTask(canvasOrigin, canvasStage, canvasShown, imageProcessor){

      this.canvasOrigin = canvasOrigin  
      this.canvasStage = canvasStage
      this.canvasShown = canvasShown
      this.imageProcessor = imageProcessor

    }

    ImageProcessingTask.prototype.init = function(){
      this.initializeTools()
      this.appendToMenuBar()
      this.addMenuBarAction()
    }    

    ImageProcessingTask.prototype.initializeTools = function(){
      console.error("initalizeTools() not implementet jet")
    }

    /**
    * Regular Menu bar
    */
    ImageProcessingTask.prototype.appendToMenuBar = function(){
      console.error("appendToMenuBar() not implementet jet")
    }


     /**
    * Click actions for slide in/out
    */
    ImageProcessingTask.prototype.addMenuBarAction = function(){
      console.error("addMenuBarAction() not implementet jet")
    }     

    ImageProcessingTask.prototype.appendToLGMenuBar = function(text, className, typeName){
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

    ImageProcessingTask.prototype.appendToSDMenuBar = function(text, className, typeName){

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
    return ImageProcessingTask
  })()
  return module.exports = ImageProcessingTask
})