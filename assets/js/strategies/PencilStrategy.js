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
      this.started = false
    }

    PencilStrategy.prototype.mousedown = function(state){
      //this.canvasOrigin.drawPoint(state.totalCartesianImagePosition, this.thickness, state.color)
      this.recordMouseState(state)
      this.cloneCtx.beginPath()
      this.cloneCtx.moveTo(state.mouse.x, state.mouse.y)
      this.cloneCtx.lineWidth = this.thickness * this.canvasStage.currentScale
      this.cloneCtx.strokeStyle = "rgba("+state.color.r+", "+state.color.g+", "+state.color.b+", "+state.color.a+")"
      this.started = true
    }

    PencilStrategy.prototype.mousemove = function(state){
      if (this.started) {
       this.cloneCtx.lineTo(state.mouse.x, state.mouse.y)
       this.recordMouseState(state)
       this.cloneCtx.stroke()
      }
    }    
    PencilStrategy.prototype.mouseup = function(state){
      if (this.started) {
        this.started = false
        this.cloneCtx.closePath()
        this.cloneCtx.clearRect(0, 0, this.canvasCloneElement[0].width, this.canvasCloneElement[0].height)     
        this.drawLineOnOrigin()   
      }
    }   

    PencilStrategy.prototype.drawLineOnOrigin = function(){

      var currentState = this.recordedMouseStates.pop()

      this.canvasOrigin.ctx.lineWidth = this.thickness
      this.canvasOrigin.ctx.strokeStyle = "rgba("+currentState.color.r+", "+currentState.color.g+", "+currentState.color.b+", "+currentState.color.a+")"
      this.canvasOrigin.ctx.beginPath()
      this.canvasOrigin.ctx.moveTo(currentState.totalCartesianImagePosition.x, currentState.totalCartesianImagePosition.y)

      if(this.recordedMouseStates.length === 0){
        this.canvasOrigin.ctx.arc(currentState.totalCartesianImagePosition.x, currentState.totalCartesianImagePosition.y, Math.round(this.thickness/2), 0, 2 * Math.PI, false)
        this.canvasOrigin.ctx.fillStyle = "rgba("+currentState.color.r+", "+currentState.color.g+", "+currentState.color.b+", "+currentState.color.a+")"
        this.canvasOrigin.ctx.fill()
      }else{
        do{
          this.canvasOrigin.ctx.lineTo(currentState.totalCartesianImagePosition.x, currentState.totalCartesianImagePosition.y)
          this.canvasOrigin.ctx.stroke()       
        }while(currentState = this.recordedMouseStates.pop())
      }

      this.canvasOrigin.ctx.closePath()
      this.canvasOrigin.registerContentModification()
      this.canvasOrigin.drawFirstClone()
      this.clearRecordedMouseStates()
    } 



    PencilStrategy.prototype.activeAction = function(){

      this.cloneCtx = this.canvasCloneElement[0].getContext('2d')

      return true
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
           $( '#toolbar-'+this.name+'-submenu .output' ).html(ui.value+'px')
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