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

    shapeStrategy.RECTANGLE = 1
    shapeStrategy.CIRCLE    = 2
    shapeStrategy.ELLYPSE   = 3
    shapeStrategy.LINE      = 4

    function shapeStrategy(canvases,imageProcessor, toolbar){    
      this.name = shapeStrategy.NAME
      this.class = 'icon-checkbox-unchecked'

      shapeStrategy.__super__.constructor(canvases, imageProcessor, toolbar, Submenu)
      this.init()
      this.thickness = 10
      this.shape = 'rectangle'

      this.addKeyHandlings()

      this.filledCheckbox = $('#toolbar-shape-filled')[0]
    }

    shapeStrategy.prototype.mousedown = function(state){
      this.setFromCoordinates(state)

      this.setSelectedShape()

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
            if(this.shape == shapeStrategy.RECTANGLE)
              this.handleRectangleDraw(this.filledCheckbox.checked, this.moveShape, this.x, this.y, this.w, this.h)
            else if(this.shape == shapeStrategy.CIRCLE)
              this.handleCircleDraw(this.filledCheckbox.checked, this.moveShape, this.x, this.y, this.w, this.h)
            else if(this.shape == shapeStrategy.ELLYPSE)
              this.handleEllypseDraw(this.filledCheckbox.checked, this.moveShape, this.x, this.y, this.w, this.h)
            else if(this.shape == shapeStrategy.LINE)
              this.handleLineDraw(this.filledCheckbox.checked, this.moveShape, this.x, this.y, this.w, this.h)
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

    shapeStrategy.prototype.handleRectangleDraw = function(filled, move, x, y, w, h){
      if(filled)
        this.cloneCtx.fillRect(this.x, this.y, this.w, this.h)
      else
        this.cloneCtx.strokeRect(this.x, this.y, this.w, this.h)
    }
    shapeStrategy.prototype.handleCircleDraw = function(filled, move, x, y, w, h){
      this.cloneCtx.beginPath()

      if(move){
        this.fromCanvas.x += w
        this.fromCanvas.y += h
      }

      this.cloneCtx.arc(this.fromCanvas.x,this.fromCanvas.y,this.w,0,2*Math.PI)
      this.cloneCtx.closePath()

      if(filled){
        this.cloneCtx.fill()
      }
      else{
        this.cloneCtx.stroke()
      }
    }

    shapeStrategy.prototype.drawEllipse = function(ctx, x, y, w, h) {
      var kappa = .5522848,
      ox = (w / 2) * kappa, // control point offset horizontal
      oy = (h / 2) * kappa, // control point offset vertical
      xe = x + w,           // x-end
      ye = y + h,           // y-end
      xm = x + w / 2,       // x-middle
      ym = y + h / 2;       // y-middle

      ctx.beginPath();
      ctx.moveTo(x, ym);
      ctx.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
      ctx.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
      ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
      ctx.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
      ctx.closePath();
      ctx.stroke();
    }  

    shapeStrategy.prototype.setSelectedShape = function(){

        var x = document.getElementsByName('shape')
        var result = 0

        for(var k = 0; k < x.length; k++)
          if(x[k].checked)
            result = parseInt(x[k].value)
          
        if(result !== 0)
          this.shape = result

        return result
    } 

    shapeStrategy.prototype.addKeyHandlings = function(){

      Mousetrap.bind('space', function(event, ui){
          event.stopPropagation()
          event.preventDefault()
          this.moveShape = true
      }.bind(this), 'keydown')  

      Mousetrap.bind('space', function(event, ui){
          event.stopPropagation()
          event.preventDefault()
          this.moveShape = false
      }.bind(this), 'keyup')    

    }

    shapeStrategy.prototype.activeAction = function(){

      this.cloneCtx = this.canvasCloneElement[0].getContext('2d')
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