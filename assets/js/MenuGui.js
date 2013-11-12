/*
MenuGui class

Florian Wokurka (2013)
https://github.com/notiontaxi
*/

"use strict"

define(['text!templates/menu-bar.html', 'js/FileProcessor', 'js/ImageProcessor', 'js/Canvas'], function(menuTemplate, FileProcessor, ImageProcessor, Canvas) {

  var MenuGui, _ref, module;
  module = function() {}
  MenuGui = (function(){

// --------------------------------------


  // tell wehre the menu should be rendered and where i can find the canvas
  function MenuGui(menuContainerIdentifier, canvasIdentifier, canvasIdentifier2){

    $(menuContainerIdentifier).html($(menuTemplate))

    this.canvas = new Canvas(canvasIdentifier, true)
    this.shownCanvas = new Canvas(canvasIdentifier2)

    this.canvas.addClone(this.shownCanvas)

    this.fileProcessor = new FileProcessor()
    this.imageProcessor = new ImageProcessor()

    this.addEventListeners()
    this.initializeTools()
    this.initializeEditFunctionality()
  }

  MenuGui.prototype.addEventListeners = function(){

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
        this.fileProcessor.saveCanvasToDisk(this.canvas.getFullSizeElement())
    
    }.bind(this))   
       

    document.getElementById('action-upload').addEventListener('change', 
      function(evt){
        var file = evt.target.files[0] // FileList object
        this.fileProcessor.loadFileFromFilesystem(URL.createObjectURL(file), this.canvas.drawImage, this.canvas)
      }.bind(this), false);

  }

  MenuGui.prototype.initializeTools = function(){

    $("#action-grayscale").click(
      function(event, ui){
        event.stopPropagation()
        event.preventDefault()
        var newImg = this.imageProcessor.processGrayscale(this.canvas.getImageData(), this.canvas.getImageWidth())
        this.canvas.putImageData(newImg)
    }.bind(this))    

    $("#action-bitmap").click(
      function(event, ui){
        event.stopPropagation()
        event.preventDefault()
        var newImg = this.imageProcessor.processThreshold(this.imageProcessor.computeThreshold(this.canvas.getImageData()) ,this.canvas.getImageData())
        this.canvas.putImageData(newImg)
    }.bind(this))  

    $("#action-invert").click(
      function(event, ui){
        event.stopPropagation()
        event.preventDefault()
        var newImg = this.imageProcessor.processInvertColors(this.canvas.getImageData(), this.canvas.getImageWidth())
        this.canvas.putImageData(newImg)
    }.bind(this))          

  }  

  MenuGui.prototype.initializeEditFunctionality = function(){

    $("#action-undo").click(
      function(event, ui){
        event.stopPropagation()
        event.preventDefault()
        this.canvas.undo()
    }.bind(this))    

    $("#action-redo").click(
      function(event, ui){
        event.stopPropagation()
        event.preventDefault()
        this.canvas.redo()
    }.bind(this))          

  }    

// --------------------------------------
    return MenuGui
  })()
  return module.exports = MenuGui
})