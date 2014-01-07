/*
Class PencilStrategy
for pencil operations on canvas

Florian Wokurka (2013)
https://github.com/notiontaxi
*/

"use strict"

define(['js/strategies/ImageProcessingStrategy',
  'js/lib/jCrop/jquery.Jcrop.min'], function(ImageProcessingStrategy, JCrop) {

var CropStrategy, _ref, module,


  module = function() {}
  CropStrategy = (function(_super){
    __extends(CropStrategy, ImageProcessingStrategy);
// --------------------------------------

    CropStrategy.NAME = 'crop'

    function CropStrategy(canvasOrigin, canvasStage, canvasShown,imageProcessor){    
      this.name = CropStrategy.NAME
      CropStrategy.__super__.constructor(canvasOrigin, canvasStage, canvasShown, imageProcessor, ImageProcessingStrategy.TYPE_TOOLBAR)
      // render templates
      var that = this
      //$(containerIdentifier).append($(contentTemplate))
      this.init(
        {
          onActiveAction: function(){
            console.log('crop action')
            this.canvasShown.getElement().Jcrop({
              onChange: function(c){
                that.selectedArea = {
                    x1: c.x
                  , y1: c.y
                  , x2: c.x2
                  , y2: c.y2
                  , width: c.w
                  , height: c.h
                }
              }
            })
          }.bind(this)
      })
      this.thickness = 10
    }

    CropStrategy.prototype.execute = function(state){
      this.canvasShown.getElement()
      //this.canvasOrigin.putImageData(processedImageData)
      //this.canvasOrigin.drawClones()
    }

    CropStrategy.prototype.appendToToolbar = function(){
      this.button = this.addToToolbar('icon-'+this.name, 'toolbar-'+this.name, this.name, '.tool-items')
      //this.submenu = $('#toolbar-'+this.name+'-submenu').append($(Submenu))
      this.arrow = $(this.button).find('.toolbar-submenu-arrow')

    }   




// --------------------------------------
    return CropStrategy
  })()
  return module.exports = CropStrategy
})