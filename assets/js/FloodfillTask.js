/*
Class for outline and threshold class

Florian Wokurka (2013)
https://github.com/notiontaxi
*/

"use strict"

define(['js/ImageProcessingTask', 'js/Toolbar'], function(ImageProcessingTask, Toolbar) {

var FloodfillTask, _ref, module,


  module = function() {}
  FloodfillTask = (function(_super){
    __extends(FloodfillTask, ImageProcessingTask);
// --------------------------------------



    function FloodfillTask(containerIdentifier,canvasOrigin, canvasStage, canvasShown,imageProcessor){    

      FloodfillTask.__super__.constructor(canvasOrigin, canvasStage, canvasShown, imageProcessor, ImageProcessingTask.TYPE_TOOLBAR)
      // render templates
      
      //$(containerIdentifier).append($(contentTemplate))
      this.init()
    }

    FloodfillTask.prototype.appendToToolbar = function(){
      this.button = this.addToToolbar('icon-paintroll', 'toolbar-floodfill', 'floodfill', '.tool-items')
    }   

    FloodfillTask.prototype.addToolbarAction = function(){
      this.button.click(Toolbar.toggleActive)
    }


    FloodfillTask.prototype.initializeTools = function(){



    }


// --------------------------------------
    return FloodfillTask
  })()
  return module.exports = FloodfillTask
})