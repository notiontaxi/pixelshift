/*
Class PencilStrategy
for pencil operations on canvas

Florian Wokurka (2013)
https://github.com/notiontaxi
*/

"use strict"

define([
  'text!templates/cropSubmenu.html',
  'js/strategies/ImageProcessingToolbarStrategy',
  'js/lib/jCrop/jquery.Jcrop.min'], function(
    Submenu,
    ImageProcessingToolbarStrategy, 
    JCrop) {

var CropStrategy, _ref, module,


  module = function() {}
  CropStrategy = (function(_super){
    __extends(CropStrategy, ImageProcessingToolbarStrategy);
// --------------------------------------

    CropStrategy.NAME = 'crop'

    function CropStrategy(canvases,imageProcessor, toolbar){    
      this.name = CropStrategy.NAME
      this.class = 'icon-crop'

      CropStrategy.__super__.constructor(canvases, imageProcessor, toolbar, Submenu)
      // render templates
      var that = this
      var minSize = Array()
      minSize[0] = 1
      minSize[1] = 1

      this.init()
    }

    CropStrategy.prototype.execute = function(state){
      this.canvasShown.getElement()
      //this.canvasOrigin.putImageData(processedImageData)
      //this.canvasOrigin.drawClones()
    }

    CropStrategy.prototype.addSubmenuActions = function(){

    }


    CropStrategy.prototype.inactiveAction = function(){
      this.jCropApi.destroy()
      this.canvasShown.getElement().show()

      hideGreyPanels()

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
     
      showGreyPanels()

      return true
    }



// --------------------------------------
    return CropStrategy
  })()
  return module.exports = CropStrategy
})