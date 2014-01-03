/*
Class PencilStrategy
for pencil operations on canvas

Florian Wokurka (2013)
https://github.com/notiontaxi
*/

"use strict"

define(['js/strategies/ImageProcessingStrategy',
  'text!templates/pencilSubmenu.html'], function(ImageProcessingStrategy, Submenu) {

var PencilStrategy, _ref, module,


  module = function() {}
  PencilStrategy = (function(_super){
    __extends(PencilStrategy, ImageProcessingStrategy);
// --------------------------------------

    PencilStrategy.NAME = 'pencil'

    function PencilStrategy(canvasOrigin, canvasStage, canvasShown,imageProcessor){    
      this.name = PencilStrategy.NAME
      PencilStrategy.__super__.constructor(canvasOrigin, canvasStage, canvasShown, imageProcessor, ImageProcessingStrategy.TYPE_TOOLBAR)
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

    PencilStrategy.prototype.appendToToolbar = function(){
      this.button = this.addToToolbar('icon-pencil', 'toolbar-pencil', 'pencil', '.tool-items')
      this.submenu = $('#toolbar-pencil-submenu').append($(Submenu))
      this.arrow = $(this.button).find('.toolbar-submenu-arrow')

      $('.pencil-submenu-content').slider(
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

      // TODO: compute this in a nicer way
      var relPos = parseInt(
                      this.button.offset().top
                    - $('#toolbar').offset().top
                    - $('#toolbar-pencil-submenu').height()/2
                    + this.button.height()/2
                     , 10 )
      this.submenu.css('top', relPos+'px')      
    }   


    PencilStrategy.prototype.initializeTools = function(){



    }


// --------------------------------------
    return PencilStrategy
  })()
  return module.exports = PencilStrategy
})