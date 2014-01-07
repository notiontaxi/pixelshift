/*
Class FloodfillStrategy
for floodfill operations on canvas

Florian Wokurka (2013)
https://github.com/notiontaxi
*/

"use strict"

define([
  'text!templates/floodfillSubmenu.html',
  'js/strategies/ImageProcessingStrategy', 
  ], function(Submenu ,ImageProcessingStrategy) {

var FloodfillStrategy, _ref, module,


  module = function() {}
  FloodfillStrategy = (function(_super){
    __extends(FloodfillStrategy, ImageProcessingStrategy);
// --------------------------------------

    FloodfillStrategy.NAME = 'floodfill'

    function FloodfillStrategy(canvasOrigin, canvasStage, canvasShown, imageProcessor){    
      this.name = FloodfillStrategy.NAME
      FloodfillStrategy.__super__.constructor(canvasOrigin, canvasStage, canvasShown, imageProcessor, ImageProcessingStrategy.TYPE_TOOLBAR)
      // render templates
      
      this.init({})

      this.variance = 0
    }

    FloodfillStrategy.prototype.execute = function(state){
      
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

    FloodfillStrategy.prototype.appendToToolbar = function(){
      this.button = this.addToToolbar('icon-paintroll', 'toolbar-floodfill', 'floodfill', '.tool-items')
      this.submenu = $('#toolbar-floodfill-submenu').append($(Submenu))
      this.arrow = $(this.button).find('.toolbar-submenu-arrow')

      $('.floodfill-submenu-content').slider(
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

      // TODO: compute this in a nicer way
      var relPos = parseInt(this.button.offset().top - $('#toolbar').offset().top + this.button.height()/2 - $('#toolbar-floodfill-submenu').height()/2 ,10)
      this.submenu.css('top', relPos+'px')

    }


// --------------------------------------
    return FloodfillStrategy
  })()
  return module.exports = FloodfillStrategy
})