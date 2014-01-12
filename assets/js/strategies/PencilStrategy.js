/*
Class PencilStrategy
for pencil operations on canvas

Florian Wokurka (2013)
https://github.com/notiontaxi
*/

"use strict"

define(['js/strategies/ImageProcessingToolbarStrategy',
  'text!templates/pencilSubmenu.html'], function(ImageProcessingToolbarStrategy, Submenu) {

var PencilStrategy, _ref, module,


  module = function() {}
  PencilStrategy = (function(_super){
    __extends(PencilStrategy, ImageProcessingToolbarStrategy);
// --------------------------------------

    PencilStrategy.NAME = 'pencil'

    function PencilStrategy(canvases,imageProcessor, toolbar){    
      this.name = PencilStrategy.NAME
      this.class = 'icon-pencil'

      PencilStrategy.__super__.constructor(canvases, imageProcessor, toolbar, Submenu)
      // render templates
      
      //$(containerIdentifier).append($(contentTemplate))
      this.init()
      this.thickness = 10
    }

    PencilStrategy.prototype.execute = function(state){
      this.canvasOrigin.drawPoint(state.totalCartesianImagePosition, this.thickness, state.color)
      //this.canvasOrigin.putImageData(processedImageData)
      this.canvasOrigin.drawClones()
    }

    PencilStrategy.prototype.addSubmenuActions = function(){

      $('.'+this.name+'-submenu-content').slider(
        {
          range: "min",
          orientation: "vertical",
          value: 10,
          min: 1,
          max: 100,
          slide: function( event, ui ) {
           $( "#toolbar-pencil-submenu .output" ).html(ui.value+'px')
           this.thickness = ui.value
          }.bind(this)
        }
      )   

    }


// --------------------------------------
    return PencilStrategy
  })()
  return module.exports = PencilStrategy
})