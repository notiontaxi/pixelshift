/*
Class FloodfillStrategy
for floodfill operations on canvas

Florian Wokurka (2013)
https://github.com/notiontaxi
*/

"use strict"

define(['js/strategies/ImageProcessingStrategy', 'js/Toolbar'], function(ImageProcessingStrategy, Toolbar) {

var FloodfillStrategy, _ref, module,


  module = function() {}
  FloodfillStrategy = (function(_super){
    __extends(FloodfillStrategy, ImageProcessingStrategy);
// --------------------------------------

    FloodfillStrategy.NAME = 'floodfill'

    function FloodfillStrategy(canvasOrigin, canvasStage, canvasShown,imageProcessor){    
      this.name = FloodfillStrategy.NAME
      FloodfillStrategy.__super__.constructor(canvasOrigin, canvasStage, canvasShown, imageProcessor, ImageProcessingStrategy.TYPE_TOOLBAR)
      // render templates
      


      //$(containerIdentifier).append($(contentTemplate))
      this.init()
    }

    FloodfillStrategy.prototype.execute = function(state){
      /*
      var imageData = this.imageProcessor.processFloodFill(
        this.canvasOrigin.getFullImageData(), 
        this.canvasOrigin.imageWidth, 
        'four', 
        state.totalPosition, 
        state.color)

      this.canvasOrigin._putFullImageData(imageData)
      */
      console.log('TODO: execute floodfill task')
      console.log(state)
    }

    FloodfillStrategy.prototype.appendToToolbar = function(){
      this.button = this.addToToolbar('icon-paintroll', 'toolbar-floodfill', 'floodfill', '.tool-items')
    }   

    FloodfillStrategy.prototype.addToolbarAction = function(){
      this.button.click(Toolbar.toggleActive)
    }


    FloodfillStrategy.prototype.initializeTools = function(){



    }


// --------------------------------------
    return FloodfillStrategy
  })()
  return module.exports = FloodfillStrategy
})