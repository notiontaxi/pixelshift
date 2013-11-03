/*
Class for outline and threshold class

Florian Wokurka (2013)
https://github.com/notiontaxi
*/

"use strict"

define(['text!templates/task-areas.html','text!templates/menu-bar.html' , 'js/Canvas', 'js/ImageProcessor', 'js/FileProcessor', 'js/CanvasGui'], function(contentTemplate, menuTemplate, Canvas, ImageProcessor, FileProcessor, CanvasGui) {

var Areas, _ref, module,


  module = function() {}
  Areas = (function(_super){
    __extends(Areas, CanvasGui);
// --------------------------------------



    function Areas(containerIdentifier){    

      // render templates
      $(containerIdentifier).html($(menuTemplate))
      $(containerIdentifier).append($(contentTemplate))

      Areas.__super__.constructor("#canvas-container")

      this.imageProcessor = new ImageProcessor()
      this.fileProcessor = new FileProcessor()

      this.initializeTools()

      this.addEventListeners()
    }


    Areas.prototype.updateThreshold = function(threshold){

      var imgDataLeft = this.leftCanvas.getImageData()

      // compute threshold automatically, if not set          multiplycation cause input is 0-100
      threshold = typeof threshold !== 'undefined' ? threshold*2.55 : this.imageProcessor.computeThreshold(imgDataLeft)

      this.rightCanvas.copy(this.leftCanvas, false)
      this.rightCanvas.putImageData(this.imageProcessor.processThreshold(threshold, imgDataLeft))

      return threshold
    }


    Areas.prototype.initializeTools = function(){


      // Automatic threshold button
      $("#action-flood-stack").click(
        function(event, ui){
          this.rightCanvas.copy(this.leftCanvas, false)
          window.maxDepth = 0;
          var start = new Date().getTime();
          var newImg = this.imageProcessor.processFloodFill(this.leftCanvas.getImageData(), this.leftCanvas.getImageWidth(), 'depth')
          var end = new Date().getTime();
          var time = end - start;
          this.rightCanvas.putImageData(newImg)      
          $( "#algo-times" ).html("CPU time: "+time+" ms | Max stack: "+window.maxDepth);
        }.bind(this)
      )

      // Outline button
      $("#action-flood-queue").click(
        function(event, ui){
          this.rightCanvas.copy(this.leftCanvas, false)
          window.maxWidth = 0;
          var start = new Date().getTime();
          var newImg = this.imageProcessor.processFloodFill(this.leftCanvas.getImageData(), this.leftCanvas.getImageWidth(), 'breadth')
          var end = new Date().getTime();
          var time = end - start;
          this.rightCanvas.putImageData(newImg)      
          $( "#algo-times" ).html("CPU time: "+time+" ms | Max width: "+window.maxWidth);
        }.bind(this)
      )   

      // Outline button
      $("#action-flood-sequential").click(
        function(event, ui){
          this.rightCanvas.copy(this.leftCanvas, false)
          window.maxWidth = 0;
          var start = new Date().getTime();
          var newImg = this.imageProcessor.processFloodFill(this.leftCanvas.getImageData(), this.leftCanvas.getImageWidth())
          var end = new Date().getTime();
          var time = end - start;
          this.rightCanvas.putImageData(newImg)      
          $( "#algo-times" ).html("CPU time: "+time+" ms | Max width: "+window.maxWidth);
        }.bind(this)
      )   


      // Outline button
      $("#upload-image").click(
        function(event, ui){
          event.stopPropagation()
          event.preventDefault()
          $('input[type="file"]').click()
        }.bind(this))

      $("#save-image").click(
        function(event, ui){
          event.stopPropagation()
          event.preventDefault()
          // close drop down in menu
          $("#save-image").parent().parent().parent().removeClass("open")
          this.fileProcessor.saveCanvasToDisk(this.rightCanvas.getElement()[0])
      
      }.bind(this)) 

    }

    Areas.prototype.addEventListeners = function(){

      document.getElementById('action-upload').addEventListener('change', 
        function(evt){
          var file = evt.target.files[0] // FileList object
          this.fileProcessor.loadFileFromFilesystem(URL.createObjectURL(file), this.leftCanvas.drawImage, this.leftCanvas)
        }.bind(this), false);

    }

// --------------------------------------
    return Areas
  })()
  return module.exports = Areas
})