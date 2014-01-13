/*
Class FloodfillStrategy
for floodfill operations on canvas

Florian Wokurka (2013)
https://github.com/notiontaxi
*/

"use strict"

define([
  'text!templates/floodfillSubmenu.html',
  'js/strategies/ImageProcessingToolbarStrategy', 
  ], function(Submenu ,ImageProcessingToolbarStrategy) {

var FloodfillStrategy, _ref, module,


  module = function() {}
  FloodfillStrategy = (function(_super){
  __extends(FloodfillStrategy, ImageProcessingToolbarStrategy)
// --------------------------------------

    FloodfillStrategy.NAME = 'floodfill'

    function FloodfillStrategy(canvases, imageProcessor, toolbar){    
      this.name = FloodfillStrategy.NAME
      this.class = 'icon-paintroll'
      FloodfillStrategy.__super__.constructor(canvases, imageProcessor, toolbar, Submenu)

      this.init()

      this.variance = 0
    }

    FloodfillStrategy.prototype.mousedown = function(state){
      
      var imgData = this.canvasOrigin.getImageData()

      var processedImageData = this.imageProcessor.processFloodFill(
        imgData,
        this.canvasOrigin.imageWidth,
        'four',
        state.totalImagePosition,
        state.color,
        this.variance)

      this.canvasOrigin.putImageData(processedImageData)
      this.canvasOrigin.drawClones()
    }
    FloodfillStrategy.prototype.mousemove = function(state){

    }    
    FloodfillStrategy.prototype.mouseup = function(state){

    }      

    FloodfillStrategy.prototype.addSubmenuActions = function(){

      $('.'+this.name+'-submenu-content').slider(
        {
          range: "min",
          orientation: "vertical",
          value: 10,
          min: 0,
          max: 100,
          slide: function( event, ui ) {
        
           $( "#toolbar-floodfill-submenu .output" ).html(ui.value+'%')
           this.variance = ui.value
          }.bind(this)
        }
      )

    }


// --------------------------------------
    return FloodfillStrategy
  })()
  return module.exports = FloodfillStrategy
})