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

      this.delta = {
          x: 0
        , y: 0
      }

      this.addKeyHandlings()

      this.filledCheckbox = $('#toolbar-shape-filled')[0]
    }

    shapeStrategy.prototype.mousedown = function(state){
      this.setFromCoordinates(state)

      this.setSelectedShape()

      this.cloneCtx.lineWidth = this.thickness * this.canvasStage.currentScale
      this.cloneCtx.strokeStyle = "rgba("+state.color.r+", "+state.color.g+", "+state.color.b+", "+state.color.a+")"
      this.cloneCtx.fillStyle = "rgba("+state.color.r+", "+state.color.g+", "+state.color.b+", "+state.color.a+")"

      this.canvasOrigin.ctx.lineWidth = this.thickness
      this.canvasOrigin.ctx.fillStyle = "rgba("+state.color.r+", "+state.color.g+", "+state.color.b+", "+state.color.a+")"
      this.canvasOrigin.ctx.strokeStyle = "rgba("+state.color.r+", "+state.color.g+", "+state.color.b+", "+state.color.a+")"      

      this.started = true
    }
    shapeStrategy.prototype.mousemove = function(state){
      if (this.started) {
          this.updateCurrentPosition(state)

          if(this.moveShape){
            this.correctStartPositions(state)    
          }else{
            this.updateWidthAndHeight(state)
          }

        this.cloneCtx.clearRect(0, 0, this.canvasCloneElement[0].width, this.canvasCloneElement[0].height)
        
        if (!!this.w && !!this.h){
          this.handleDrawing(false)
        }
      }
    }
    shapeStrategy.prototype.mouseup = function(state){
      if (this.started) {       

        if (!!this.w && !!this.h){
          this.handleDrawing(true, state)
        }

        this.started = false
        this.cloneCtx.clearRect(0, 0, this.canvasCloneElement[0].width, this.canvasCloneElement[0].height)

        this.canvasOrigin.drawFirstClone()
        this.canvasOrigin.registerContentModification()
      }
    } 

    shapeStrategy.prototype.handleDrawing = function(finalDraw, state){

      var ctx

      if(finalDraw){
        // needs to be fixed
        this.x = Math.min(state.totalCartesianImagePosition.x,  this.fromCartesian.x)
        this.y = Math.min(state.totalCartesianImagePosition.y,  this.fromCartesian.y)
        this.w = Math.abs(state.totalCartesianImagePosition.x - this.fromCartesian.x)
        this.h = Math.abs(state.totalCartesianImagePosition.y - this.fromCartesian.y)
        ctx = this.canvasOrigin.ctx 
      }else{
        ctx = this.cloneCtx
      }

      if(this.shape == shapeStrategy.RECTANGLE)
        this.handleRectangleDraw(this.filledCheckbox.checked, ctx)
      else if(this.shape == shapeStrategy.CIRCLE)
        this.handleCircleDraw(this.filledCheckbox.checked, ctx)
      else if(this.shape == shapeStrategy.ELLYPSE)
        this.handleEllypseDraw(this.filledCheckbox.checked, ctx)
      else if(this.shape == shapeStrategy.LINE)
        this.handleLineDraw(this.filledCheckbox.checked, ctx)     

    }
    shapeStrategy.prototype.handleRectangleDraw = function(filled, ctx){
      if(filled)
        ctx.fillRect(this.x, this.y, this.w, this.h)
      else
        ctx.strokeRect(this.x, this.y, this.w, this.h)
    }  
    shapeStrategy.prototype.handleCircleDraw = function(filled, ctx){

      ctx.beginPath()
      ctx.arc(this.fromCanvas.x,this.fromCanvas.y,this.w,0,2*Math.PI)
      ctx.closePath()

      if(filled){
        ctx.fill()
      }else{
        ctx.stroke()
      }
    }

    shapeStrategy.prototype.correctStartPositions = function(state){
      this.delta.x = state.mouse.x - (this.w + this.fromCanvas.x)
      this.delta.y = state.mouse.y - (this.h + this.fromCanvas.y)
      this.fromCanvas.x += this.delta.x    
      this.fromCanvas.y += this.delta.y
      this.fromCartesian.x += this.delta.x * this.canvasStage.currentScale
      this.fromCartesian.y += this.delta.y * this.canvasStage.currentScale        
    }
    shapeStrategy.prototype.updateWidthAndHeight = function(state){
      this.w = Math.abs(state.mouse.x - this.fromCanvas.x)
      this.h = Math.abs(state.mouse.y - this.fromCanvas.y)      
    }
    shapeStrategy.prototype.updateCurrentPosition = function(state){
      this.x = Math.min(state.mouse.x,  this.fromCanvas.x)
      this.y = Math.min(state.mouse.y,  this.fromCanvas.y)      
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