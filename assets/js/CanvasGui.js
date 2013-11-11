/*
Main class

Florian Wokurka (2013)
https://github.com/notiontaxi
*/

"use strict"

define(['text!templates/canvas-gui.html', 'js/DragNDrop', 'js/Canvas', 'js/MenuGui'], function(canvasGuiTemplate, DragNDrop, Canvas, MenuGui) {

  var CanvasGui, _ref, module;
  module = function() {}
  CanvasGui = (function(){
    __extends(CanvasGui, MenuGui);
// --------------------------------------



  function CanvasGui(canvasContainerIdentifier){

    $(canvasContainerIdentifier).html($(canvasGuiTemplate))

    CanvasGui.__super__.constructor("#menu-container","canvas-hidden", "canvas-shown")

    this.initialize()
    this.addEventListeners()
  }


  CanvasGui.prototype.initialize = function(){
    this.wasSmallLayout = false
    this.wasMediumLayout = false
    this.wasLargeLayout = false

    this.updateLayout()

    var dragNDrop = new DragNDrop(this.canvas, this.canvas.drawImage)
  }


  CanvasGui.prototype.updateLayout = function(){

    var width = window.outerWidth

    if(width < 992 && !this.wasSmallLayout){
      //this.canvas.updateSize(310,310)
      this.shownCanvas.updateSize(330,264)
      this.wasSmallLayout = true
      this.wasMediumLayout = this.wasLargeLayout = false
      //console.log("Setting layout to s")
    } else if(width >= 992 && width < 1200 && !this.wasMediumLayout){
      //this.canvas.updateSize(430,430)
      this.shownCanvas.updateSize(700,560)
      this.wasMediumLayout = true
      this.wasSmallLayout = this.wasLargeLayout = false
      //console.log("Setting layout to m")
    } else if(width >= 1200 && !this.wasLargeLayout){
      //this.canvas.updateSize(530,530)
      this.shownCanvas.updateSize(800,640)
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