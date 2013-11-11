/*
Class for outline and threshold class

Florian Wokurka (2013)
https://github.com/notiontaxi
*/

"use strict"

define(['text!templates/task-areas.html', 'js/ImageProcessor', 'js/CanvasGui'], function(contentTemplate, ImageProcessor, CanvasGui) {

var Areas, _ref, module,


  module = function() {}
  Areas = (function(_super){
    __extends(Areas, CanvasGui);
// --------------------------------------



    function Areas(containerIdentifier){    

      // render templates
      $(containerIdentifier).html($(contentTemplate))

      Areas.__super__.constructor("#canvas-container")

      this.initializeTools()
    }


    Areas.prototype.initializeTools = function(){

      // Automatic threshold button
      $("#action-flood-stack").click(
        function(event, ui){
          window.maxDepth = 0;
          var start = new Date().getTime();
          var newImg = this.imageProcessor.processFloodFill(this.canvas.getImageData(), this.canvas.getImageWidth(), 'four')
          var end = new Date().getTime();
          var time = end - start;
          this.canvas.putImageData(newImg)      
          $( "#algo-times" ).html("CPU time: "+time+" ms | Max stack: "+window.maxDepth);
        }.bind(this)
      )

      // Outline button
      $("#action-flood-queue").click(
        function(event, ui){
          window.maxWidth = 0;
          var start = new Date().getTime();
          var newImg = this.imageProcessor.processFloodFill(this.canvas.getImageData(), this.canvas.getImageWidth(), 'eight')
          var end = new Date().getTime();
          var time = end - start;
          this.canvas.putImageData(newImg)      
          $( "#algo-times" ).html("CPU time: "+time+" ms | Max width: "+window.maxWidth);
        }.bind(this)
      )   
 

    }


// --------------------------------------
    return Areas
  })()
  return module.exports = Areas
})