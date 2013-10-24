/*
Main class

Florian Wokurka (2013)
https://github.com/notiontaxi
*/

"use strict"

define(['text!templates/task_outline.html', 'js/Canvas', 'js/DragNDrop'], function(template, Canvas, DragNDrop) {

  var Outline, module;
  module = function() {}
  Outline = (function(){
  //__extends(Outline, Superclass);
// --------------------------------------



  function Outline(){
    
    
    //Main.__super__.constructor.call(this);
  }

  Outline.prototype.initialize = function(){


    this.leftCanvas = new Canvas('canvas-left')
    this.rightCanvas = new Canvas('canvas-right')

    this.initializeGui()

    DragNDrop(this.leftCanvas, this.leftCanvas.drawImage)
  }

  Outline.prototype.renderAndAppendTo = function(identifier){
    $(identifier).html($(template))
    this.initialize()

  }

  Outline.prototype.computeTreshold = function(){
    return 0
  }

  Outline.prototype.updateTreshold = function(treshold){
    var imgDataLeft = this.leftCanvas.getImageData()

    this.rightCanvas.copy(this.leftCanvas, false)
    this.rightCanvas.putImageData(this.processTreshold(imgDataLeft, treshold))
  }

  Outline.prototype.outline = function(treshold){
    var imgDataLeft = this.leftCanvas.getImageData()

    this.rightCanvas.copy(this.leftCanvas, false)
    this.rightCanvas.putImageData(this.processTreshold(imgDataLeft, treshold))
  }  

  Outline.prototype.processTreshold = function(imgDataLeft, treshold){
    return imgDataLeft
  }

  Outline.prototype.initializeGui = function(){

    // Treshold slider
    $( "#slider-0" ).slider(
      {
        range: "min",
        value: 10,
        min: 10,
        max: 1000,
        slide: function( event, ui ) {
          $( "#slider-0-output" ).html(ui.value );
          this.updateTreshold(ui.value)
        }.bind(this)
      }
    );

    // Automatic treshold button
    $("#action-automatic-treshold").click(
      function(event, ui){
        this.updateTreshold(this.computeTreshold())
      }.bind(this)
    )


    // Outline button
    $("#action-outline").click(
      function(event, ui){
        this.outline()
      }.bind(this)
    )    
  }




// --------------------------------------
    return Outline
  })()
  return module.exports = Outline
})