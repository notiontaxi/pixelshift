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


    Areas.prototype.updateThreshold = function(threshold){

      var imgDataLeft = this.canvas.getImageData()

      // compute threshold automatically, if not set          multiplycation cause input is 0-100
      threshold = typeof threshold !== 'undefined' ? threshold*2.55 : this.imageProcessor.computeThreshold(imgDataLeft)

      this.rightCanvas.copy(this.canvas, false)
      this.rightCanvas.putImageData(this.imageProcessor.processThreshold(threshold, imgDataLeft))

      return threshold
    }


    Areas.prototype.initializeTools = function(){


      // Automatic threshold button
      $("#action-flood-stack").click(
        function(event, ui){
          this.rightCanvas.copy(this.canvas, false)
          window.maxDepth = 0;
          var start = new Date().getTime();
          var newImg = this.imageProcessor.processFloodFill(this.canvas.getImageData(), this.canvas.getImageWidth(), 'depth')
          var end = new Date().getTime();
          var time = end - start;
          this.rightCanvas.putImageData(newImg)      
          $( "#algo-times" ).html("CPU time: "+time+" ms | Max stack: "+window.maxDepth);
        }.bind(this)
      )

      // Outline button
      $("#action-flood-queue").click(
        function(event, ui){
          this.rightCanvas.copy(this.canvas, false)
          window.maxWidth = 0;
          var start = new Date().getTime();
          var newImg = this.imageProcessor.processFloodFill(this.canvas.getImageData(), this.canvas.getImageWidth(), 'breadth')
          var end = new Date().getTime();
          var time = end - start;
          this.rightCanvas.putImageData(newImg)      
          $( "#algo-times" ).html("CPU time: "+time+" ms | Max width: "+window.maxWidth);
        }.bind(this)
      )   

      // Outline button
      $("#action-flood-sequential").click(
        function(event, ui){
          this.rightCanvas.copy(this.canvas, false)
          window.maxWidth = 0;
          var start = new Date().getTime();
          var newImg = this.imageProcessor.processFloodFill(this.canvas.getImageData(), this.canvas.getImageWidth())
          var end = new Date().getTime();
          var time = end - start;
          this.rightCanvas.putImageData(newImg)      
          $( "#algo-times" ).html("CPU time: "+time+" ms");
        }.bind(this)
      )   

    }


// --------------------------------------
    return Areas
  })()
  return module.exports = Areas
})