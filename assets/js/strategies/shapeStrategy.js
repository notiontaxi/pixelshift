/*
Class shapeStrategy
for pencil operations on canvas

Florian Wokurka (2013)
https://github.com/notiontaxi
*/

"use strict"

define(['js/strategies/ImageProcessingToolbarStrategy',
  'text!templates/shapeSubmenu.html'], function(ImageProcessingToolbarStrategy, Submenu) {

var shapeStrategy, _ref, module,


  module = function() {}
  shapeStrategy = (function(_super){
    __extends(shapeStrategy, ImageProcessingToolbarStrategy);
// --------------------------------------

    shapeStrategy.NAME = 'shape'

    function shapeStrategy(canvases,imageProcessor, toolbar){    
      this.name = shapeStrategy.NAME
      this.class = 'icon-checkbox-unchecked'

      shapeStrategy.__super__.constructor(canvases, imageProcessor, toolbar, Submenu)
      // render templates
      
      //$(containerIdentifier).append($(contentTemplate))
      this.init()
      this.thickness = 10
      this.shape = 'rectangle'
      this.fromCartesian = {x:0,y:0}
      this.fromCanvas = {x:0,y:0}

      this.filledCheckbox = $('#toolbar-shape-filled')[0]
    }

    shapeStrategy.prototype.mousedown = function(state){
      //this.canvasOrigin.drawPoint(state.totalCartesianImagePosition, this.thickness, state.color)

      //this.canvasOrigin.ctx.beginPath()
      this.fromCartesian.x = state.totalCartesianImagePosition.x
      this.fromCartesian.y = state.totalCartesianImagePosition.y



      this.fromCanvas.x = state.mouse.x
      this.fromCanvas.y = state.mouse.y
      console.log(this.thickness * this.canvasStage.currentScale)
      this.cloneCtx.lineWidth = this.thickness * this.canvasStage.currentScale
      this.cloneCtx.strokeStyle = "rgba("+state.color.r+", "+state.color.g+", "+state.color.b+", "+state.color.a+")"
      this.cloneCtx.fillStyle = "rgba("+state.color.r+", "+state.color.g+", "+state.color.b+", "+state.color.a+")"

      this.started = true
    }
    shapeStrategy.prototype.mousemove = function(state){
      if (this.started) {
          this.x = Math.min(state.mouse.x,  this.fromCanvas.x),
          this.y = Math.min(state.mouse.y,  this.fromCanvas.y),
          this.w = Math.abs(state.mouse.x - this.fromCanvas.x),
          this.h = Math.abs(state.mouse.y - this.fromCanvas.y)

        this.cloneCtx.clearRect(0, 0, this.canvasCloneElement[0].width, this.canvasCloneElement[0].height)

        if (!!this.w && !!this.h){
          if(this.filledCheckbox.checked)
            this.cloneCtx.fillRect(this.x, this.y, this.w, this.h)
          else
            this.cloneCtx.strokeRect(this.x, this.y, this.w, this.h)
        }
      }
    }
    shapeStrategy.prototype.mouseup = function(state){
      if (this.started) {

        this.x = Math.min(state.totalCartesianImagePosition.x,  this.fromCartesian.x),
        this.y = Math.min(state.totalCartesianImagePosition.y,  this.fromCartesian.y),
        this.w = Math.abs(state.totalCartesianImagePosition.x - this.fromCartesian.x),
        this.h = Math.abs(state.totalCartesianImagePosition.y - this.fromCartesian.y)        

        if (!!this.w && !!this.h){
          if(this.filledCheckbox.checked){
            this.canvasOrigin.ctx.fillStyle = "rgba("+state.color.r+", "+state.color.g+", "+state.color.b+", "+state.color.a+")" 
            this.canvasOrigin.ctx.fillRect(this.x, this.y, this.w, this.h)
          }
          else{
            this.canvasOrigin.ctx.lineWidth = this.thickness
            this.canvasOrigin.ctx.strokeStyle = "rgba("+state.color.r+", "+state.color.g+", "+state.color.b+", "+state.color.a+")"            
            this.canvasOrigin.ctx.strokeRect(this.x, this.y, this.w, this.h)
          }
        }

        this.started = false
        this.cloneCtx.clearRect(0, 0, this.canvasCloneElement[0].width, this.canvasCloneElement[0].height)

        this.canvasOrigin.drawFirstClone()
        this.canvasOrigin.registerContentModification()
      }
    }    

    shapeStrategy.prototype.activeAction = function(){

      this.cloneCtx = this.canvasCloneElement[0].getContext('2d')
      //destCtx.drawImage(this.canvasShown.getElement()[0], 0, 0)
      //this.canvasShown.getElement().hide()

      return true
    }

    shapeStrategy.prototype.addSubmenuActions = function(){

      $('.'+this.name+'-submenu-content').slider(
        {
          range: "min",
          orientation: "vertical",
          value: 10,
          min: 1,
          max: 100,
          slide: function( event, ui ) {
           $( '#toolbar-'+this.name+'-submenu .output' ).html(ui.value+'px')
           this.thickness = ui.value
          }.bind(this)
        }
      )   

    }


// --------------------------------------
    return shapeStrategy
  })()
  return module.exports = shapeStrategy
})