/*
Main class

Florian Wokurka (2013)
https://github.com/notiontaxi
*/

"use strict"

define(['text!templates/task_outline.html','text!templates/menu-bar.html' , 'js/Canvas', 'js/ImageProcessor', 'js/FileProcessor', 'js/CanvasGui'], function(contentTemplate, menuTemplate, Canvas, ImageProcessor, FileProcessor, CanvasGui) {

var Outline, _ref, module,


  module = function() {}
  Outline = (function(_super){
    __extends(Outline, CanvasGui);
// --------------------------------------



    function Outline(identifier){    

      // render templates
      $(identifier).html($(menuTemplate))
      $(identifier).append($(contentTemplate))

      this.initialize()

      Outline.__super__.constructor(this.leftCanvas, this.rightCanvas)
      //Outline.__super__.constructor.apply(this, args);
    }

    Outline.prototype.initialize = function(){

      this.imageProcessor = new ImageProcessor()
      this.fileProcessor = new FileProcessor()

      this.leftCanvas = new Canvas('canvas-left')
      this.rightCanvas = new Canvas('canvas-right')

      this.initializeTools()

      this.addEventListeners()
    }


    Outline.prototype.updateThreshold = function(threshold){

      var imgDataLeft = this.leftCanvas.getImageData()

      // compute threshold automatically, if not set          multiplycation cause input is 0-100
      threshold = typeof threshold !== 'undefined' ? threshold*2.55 : this.imageProcessor.computeThreshold(imgDataLeft)

      this.rightCanvas.copy(this.leftCanvas, false)
      this.rightCanvas.putImageData(this.imageProcessor.processThreshold(threshold, imgDataLeft))

      return threshold
    }


    Outline.prototype.initializeTools = function(){

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
          var treshhold = this.updateThreshold()/2.55
          $( "#slider-0" ).slider('option',{value: Math.round(treshhold)});
          $( "#slider-0-output" ).html(Math.round(treshhold));
        }.bind(this)
      )


      // Outline button
      $("#action-dilation").click(
        function(event, ui){
          var newImg = this.imageProcessor.processDilation(this.rightCanvas.getImageData(), this.rightCanvas.getImageWidth())
          this.rightCanvas.putImageData(newImg)
        }.bind(this)
      )   

      // Outline button
      $("#action-erosion").click(
        function(event, ui){
          var newImg = this.imageProcessor.processErosion(this.rightCanvas.getImageData(), this.rightCanvas.getImageWidth())
          this.rightCanvas.putImageData(newImg)
        }.bind(this)
      )   

      // Outline button
      $("#action-outline").click(
        function(event, ui){
          var newImg = this.imageProcessor.processOutline(this.rightCanvas.getImageData(), this.rightCanvas.getImageData() ,this.rightCanvas.getImageWidth())
          this.rightCanvas.putImageData(newImg)
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