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

      this.canvasOrigin.ctx.beginPath()
      this.canvasOrigin.ctx.moveTo(state.totalCartesianImagePosition.x, state.totalCartesianImagePosition.y)
      this.canvasOrigin.ctx.lineWidth = this.thickness
      this.canvasOrigin.ctx.strokeStyle = "rgba("+state.color.r+", "+state.color.g+", "+state.color.b+", "+state.color.a+")"
      this.started = true
    }
    PencilStrategy.prototype.mousemove = function(state){
      if (this.started) {
        this.canvasOrigin.ctx.lineTo(state.totalCartesianImagePosition.x, state.totalCartesianImagePosition.y)
        this.canvasOrigin.ctx.stroke()
        this.canvasOrigin.drawFirstClone()
      }
    }    
    PencilStrategy.prototype.mouseup = function(state){
      if (this.started) {
        this.started = false
        this.canvasOrigin.ctx.closePath()
        this.canvasOrigin.drawFirstClone()
        this.canvasOrigin.registerContentModification()
      }
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