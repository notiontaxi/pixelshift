/*
Gui class

Florian Wokurka (2013)
https://github.com/notiontaxi
*/

"use strict"

define([], function() {

  var Gui, module;
  module = function() {}
  Gui = (function(){
  //__extends(Gui, Superclass);
// --------------------------------------


  function Gui(canvas, fileProcessor){
    Gui.prototype.canvas = canvas;
    Gui.prototype.fileProcessor = fileProcessor;
    Gui.prototype.dropZone = canvas.getElement()[0];

    Gui.prototype.bindEvents();

  }

  Gui.prototype.initialize = function(){

  }

  Gui.prototype.bindEvents = function(){

    this.dropZone.addEventListener('drop', function(event){var val = this.fileProcessor.processFile(event, this.start, this)}.bind(this), false);
    this.dropZone.addEventListener('dragover', function(event){this.showDragOver(event, true)}.bind(this), false);
    this.dropZone.addEventListener('dragleave', function(event){this.showDragOver(event, false)}.bind(this), false);

    /*
     window.onresize = function(e){
      this.canvas.updateSize(function(){this.draw()}.bind(this));
     
     }.bind(this);  
    */ 
  }



  // pass thet to be in own context again
  Gui.prototype.start = function(img, that){
    if(!!img){     
      img.onload = function() {
        that.canvas.drawImage(img);
      }
    }

  }

  Gui.prototype.showDragOver = function(event, onOrOff){
    event.stopPropagation();
    event.preventDefault();
    this.canvas.highlight(onOrOff);
  }

  Gui.prototype.resizeContainer = function(){
    $("#canvas-overlay").css({
      'left': this.canvas.getElement().position().left+'px',
      'top': this.canvas.getElement().position().top+'px',
      'width': this.canvas.getElement().width()+'px',
      'height': this.canvas.getElement().height()+'px'
    }); 

  }


// --------------------------------------
    return Gui
  })()
  return module.exports = Gui
})



