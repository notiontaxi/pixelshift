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

    function CropStrategy(canvasOrigin, canvasStage, canvasShown,imageProcessor, toolbar){    
      this.name = CropStrategy.NAME
      this.class = 'icon-crop'
      this.toolbar = toolbar
      CropStrategy.__super__.constructor(canvasOrigin, canvasStage, canvasShown, imageProcessor, ImageProcessingStrategy.TYPE_TOOLBAR)
      // render templates
      var that = this
      var minSize = Array()
      minSize[0] = 1
      minSize[1] = 1
      //$(containerIdentifier).append($(contentTemplate))
      this.init()
    }

    CropStrategy.prototype.execute = function(state){
      this.canvasShown.getElement()
      //this.canvasOrigin.putImageData(processedImageData)
      //this.canvasOrigin.drawClones()
    }


    CropStrategy.prototype.inactiveAction = function(){
      this.jCropApi.release()
      this.jCropApi.disable()
      this.jCropApi.destroy()
      this.canvasShown.getElement().show()
      return true
    }

    CropStrategy.prototype.activeAction = function(){

      this.clone = this.canvasShown.getElement().clone()
      this.clone.attr('id', 'canvas-shown-clone')
      this.canvasShown.getElement().parent().append(this.clone)
      this.clone.css(
        {
            position: 'relative'
          , left:  '0px'
          , right: '0px'
          , width: this.canvasShown.getElement().css('width')
          , height:this.canvasShown.getElement().css('height') 
        }
      )
      console.log(this.clone)
      var destCtx = this.clone[0].getContext('2d')
      destCtx.drawImage(this.canvasShown.getElement()[0], 0, 0)

      this.canvasShown.getElement().hide()

      this.jCropApi = $.Jcrop('#canvas-shown-clone',{
        onChange: function(c){
          this.selectedArea = {
              x1: c.x
            , y1: c.y
            , x2: c.x2
            , y2: c.y2
          }
        },
        onRelease: function(){
          $('.jcrop-keymgr').hide()
        }
      })
      console.log(this.jCropApi)
      return true
    }




// --------------------------------------
    return CropStrategy
  })()
  return module.exports = CropStrategy
})