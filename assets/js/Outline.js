/*
Class for outline and threshold class

Florian Wokurka (2013)
https://github.com/notiontaxi
*/

"use strict"

define(['text!templates/task-outline.html','js/CanvasGui'], function(contentTemplate, CanvasGui) {

var Outline, _ref, module,


  module = function() {}
  Outline = (function(_super){
    __extends(Outline, CanvasGui);
// --------------------------------------



    function Outline(containerIdentifier){    

      // render templates
      $(containerIdentifier).html($(contentTemplate))

      Outline.__super__.constructor("#canvas-container")

      this.initializeTools()
    }


    Outline.prototype.updateThreshold = function(threshold){

      var imgDataLeft = this.canvas.getImageData()

      // compute threshold automatically, if not set          multiplycation cause input is 0-100
      threshold = typeof threshold !== 'undefined' ? threshold*2.55 : this.imageProcessor.computeThreshold(imgDataLeft)

      this.rightCanvas.copy(this.canvas, false)
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

    }



// --------------------------------------
    return Outline
  })()
  return module.exports = Outline
})