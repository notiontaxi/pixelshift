/*
Class PencilStrategy
for pencil operations on canvas

Florian Wokurka (2013)
https://github.com/notiontaxi
*/

"use strict"

define(['js/strategies/ImageProcessingStrategy', 'js/Toolbar'], function(ImageProcessingStrategy, Toolbar) {

var PencilStrategy, _ref, module,


  module = function() {}
  PencilStrategy = (function(_super){
    __extends(PencilStrategy, ImageProcessingStrategy);
// --------------------------------------

    PencilStrategy.NAME = 'pencil'

    function PencilStrategy(containerIdentifier,canvasOrigin, canvasStage, canvasShown,imageProcessor){    

      PencilStrategy.__super__.constructor(canvasOrigin, canvasStage, canvasShown, imageProcessor, ImageProcessingStrategy.TYPE_TOOLBAR)
      // render templates
      
      //$(containerIdentifier).append($(contentTemplate))
      this.init()
    }

    PencilStrategy.prototype.execute = function(state){
      console.log('execute pencil task')
      console.log(state)
    }

    PencilStrategy.prototype.appendToToolbar = function(){
      this.button = this.addToToolbar('icon-pencil', 'toolbar-pencil', 'pencil', '.tool-items')
    }   

    PencilStrategy.prototype.addToolbarAction = function(){
      this.button.click(Toolbar.toggleActive)
    }


    PencilStrategy.prototype.initializeTools = function(){



    }


// --------------------------------------
    return PencilStrategy
  })()
  return module.exports = PencilStrategy
})