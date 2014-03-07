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
  'lib/jCrop/jquery.Jcrop.min'], function(
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


    // not needed -> impemented in jcrop, happening on cloned canvas
    CropStrategy.prototype.mousedown = function(state){

    }
    CropStrategy.prototype.mousemove = function(state){

    }    
    CropStrategy.prototype.mouseup = function(state){

    }

    CropStrategy.prototype.addSubmenuActions = function(){

      $('.'+this.name+'-submenu-content .btn-ok').click(function(){

        var selectedArea = {
            x1 : this.canvasStage.visibleArea.x1 + Math.floor(this.selectedArea.x1 / this.canvasStage.currentScale)
          , y1 : this.canvasStage.visibleArea.y1 + Math.floor(this.selectedArea.y1 / this.canvasStage.currentScale)
          , w :  Math.ceil(this.selectedArea.w / this.canvasStage.currentScale)
          , h :  Math.ceil(this.selectedArea.h / this.canvasStage.currentScale)
        }

        var croppedArea = this.canvasOrigin.ctx.getImageData(
            selectedArea.x1
          , selectedArea.y1
            // check bounds for width and height
          , selectedArea.x1 + selectedArea.w <= this.canvasStage.imageWidth ? selectedArea.w : this.canvasStage.imageWidth - selectedArea.x1
          , selectedArea.y1 + selectedArea.h <= this.canvasStage.imageHeight ? selectedArea.h : this.canvasStage.imageHeight - selectedArea.y1
        )

        this.canvasOrigin.putImageData(croppedArea)
        this.canvasOrigin.copyToClones()
        this.inactiveAction()
        this.toolbar.lastActive.setInactive()

      }.bind(this))

    }


    CropStrategy.prototype.inactiveAction = function(){
      this.jCropApi.destroy()
      this.canvasShown.getElement().show()
      this.canvasCloneElement.show()
      hideGreyPanels()

      return true
    }

    CropStrategy.prototype.activeAction = function(){

      this.clone = this.canvasShown.getElement().clone()
      this.clone.attr('id', 'canvas-shown-crop-clone')
      this.canvasShown.getElement().parent().append(this.clone)
      this.clone.css(
        {
            position: 'relative'
          , left:  '0px'
          , top: '0px'
          , width: this.canvasShown.getElement().css('width')
          , height:this.canvasShown.getElement().css('height') 
        }
      )

      var destCtx = this.clone[0].getContext('2d')
      destCtx.drawImage(this.canvasShown.getElement()[0], 0, 0)
      this.canvasShown.getElement().hide()
      this.canvasCloneElement.hide()
      var _that = this

      this.jCropApi = $.Jcrop('#canvas-shown-crop-clone',{
        onChange: function(c){
          _that.selectedArea = {
              x1: c.x
            , y1: c.y
            , w: c.w
            , h: c.h
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