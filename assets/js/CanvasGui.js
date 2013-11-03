/*
Main class

Florian Wokurka (2013)
https://github.com/notiontaxi
*/

"use strict"

define(['text!templates/canvas-gui.html', 'js/DragNDrop', 'js/Canvas'], function(canvasGuiTemplate, DragNDrop, Canvas) {

  var CanvasGui, module;
  module = function() {}
  CanvasGui = (function(){
// --------------------------------------



  function CanvasGui(canvasContainerIdentifier){

    $(canvasContainerIdentifier).html($(canvasGuiTemplate))

    this.leftCanvas = new Canvas('canvas-left')
    this.rightCanvas = new Canvas('canvas-right')

    this.initialize()
    this.addEventListeners()
  }


  CanvasGui.prototype.initialize = function(){
    this.wasSmallLayout = false
    this.wasMediumLayout = false
    this.wasLargeLayout = false

    this.updateLayout()

    var dragNDrop = new DragNDrop(this.leftCanvas, this.leftCanvas.drawImage)
  }


  CanvasGui.prototype.updateLayout = function(){

    var width = window.outerWidth

    if(width < 992 && !this.wasSmallLayout){
      this.leftCanvas.updateSize(310,310)
      this.rightCanvas.updateSize(310,310)
      this.wasSmallLayout = true
      this.wasMediumLayout = this.wasLargeLayout = false
      //console.log("Setting layout to s")
    } else if(width >= 992 && width < 1200 && !this.wasMediumLayout){
      this.leftCanvas.updateSize(430,430)
      this.rightCanvas.updateSize(430,430)
      this.wasMediumLayout = true
      this.wasSmallLayout = this.wasLargeLayout = false
      //console.log("Setting layout to m")
    } else if(width >= 1200 && !this.wasLargeLayout){
      this.leftCanvas.updateSize(530,530)
      this.rightCanvas.updateSize(530,530)
      this.wasLargeLayout = true
      this.wasSmallLayout = this.wasMediumLayout = false
      //console.log("Setting layout to l")
    }
  }

  CanvasGui.prototype.addEventListeners = function(){

    window.onresize=function() {
      if (this.reset){clearTimeout(this.reset)};
        this.reset = setTimeout(function(){this.updateLayout()}.bind(this),200);
    }.bind(this)

  }

// --------------------------------------
    return CanvasGui
  })()
  return module.exports = CanvasGui
})