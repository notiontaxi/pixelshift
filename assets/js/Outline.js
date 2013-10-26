/*
Main class

Florian Wokurka (2013)
https://github.com/notiontaxi
*/

"use strict"

define(['text!templates/task_outline.html', 'js/Canvas', 'js/DragNDrop', 'js/ImageProcessor', 'js/FileProcessor'], function(template, Canvas, DragNDrop, ImageProcessor, FileProcessor) {

  var Outline, module;
  module = function() {}
  Outline = (function(){
  //__extends(Outline, Superclass);
// --------------------------------------



  function Outline(){
    
    
    //Main.__super__.constructor.call(this);
  }

  Outline.prototype.initialize = function(){

    this.imageProcessor = new ImageProcessor()
    this.fileProcessor = new FileProcessor()

    this.leftCanvas = new Canvas('canvas-left')
    this.rightCanvas = new Canvas('canvas-right')

    this.initializeGui()

    DragNDrop(this.leftCanvas, this.leftCanvas.drawImage)

    this.addEventListeners()
  }

  Outline.prototype.renderAndAppendTo = function(identifier){
    $(identifier).html($(template))
    this.initialize()

  }

  Outline.prototype.updateThreshold = function(threshold){

    var imgDataLeft = this.leftCanvas.getImageData()

    // compute threshold automatically, if not set          multiplycation cause input is 0-100
    threshold = typeof threshold !== 'undefined' ? threshold*2.55 : this.imageProcessor.computeThreshold(imgDataLeft)

    this.rightCanvas.copy(this.leftCanvas, false)
    this.rightCanvas.putImageData(this.imageProcessor.processThreshold(threshold, imgDataLeft))
  }

  Outline.prototype.outline = function(threshold){

  }  

  Outline.prototype.initializeGui = function(){

    // threshold slider
    $( "#slider-0" ).slider(
      {
        range: "min",
        value: 50,
        min: 0,
        max: 100,
        slide: function( event, ui ) {
          $( "#slider-0-output" ).html(ui.value);
          this.updateThreshold(ui.value)
        }.bind(this)
      }
    );

    // Automatic threshold button
    $("#action-automatic-threshold").click(
      function(event, ui){
        this.updateThreshold()
      }.bind(this)
    )


    // Outline button
    $("#action-outline").click(
      function(event, ui){
        this.outline()
      }.bind(this)
    )   

    // Outline button
    $("#upload-image").click(
      function(event, ui){
        $('input[type="file"]').click()
      }.bind(this)
    ) 

  }

  Outline.prototype.addEventListeners = function(){
    document.getElementById('action-upload').addEventListener('change', 
      function(evt){
        var file = evt.target.files[0] // FileList object
        this.fileProcessor.loadFileFromFilesystem(URL.createObjectURL(file), this.leftCanvas.drawImage, this.leftCanvas)
      }.bind(this), false);
  }



// --------------------------------------
    return Outline
  })()
  return module.exports = Outline
})