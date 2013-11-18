/*
DragNDrop class

Florian Wokurka (2013)
https://github.com/notiontaxi
*/

"use strict"

define(['js/FileProcessor'], function(FileProcessor) {

  var DragNDrop, module;
  module = function() {}
  DragNDrop = (function(){
  //__extends(DragNDrop, Superclass);
// --------------------------------------



  function DragNDrop(canvas, callback, callbackObject){
    DragNDrop.prototype.canvas = canvas;
    DragNDrop.prototype.fileProcessor = new FileProcessor()
    DragNDrop.prototype.dropZone = canvas.getElement()[0];
    DragNDrop.prototype.callback = callback;
    DragNDrop.prototype.callbackObject = callbackObject;

    DragNDrop.prototype.bindEvents();

  }


  DragNDrop.prototype.bindEvents = function(){
    this.dropZone.addEventListener('drop', function(event){var val = this.fileProcessor.processFile(event, this.start, this)}.bind(this), false);
    this.dropZone.addEventListener('dragover', function(event){this.showDragOver(event, true)}.bind(this), false);
    this.dropZone.addEventListener('dragleave', function(event){this.showDragOver(event, false)}.bind(this), false);
  }

  // pass that to be in own context again
  DragNDrop.prototype.start = function(img, that){
    if(!!img){     
      img.onload = function() {
        that.callback(img, that.callbackObject);
      }
    }
  }

  DragNDrop.prototype.showDragOver = function(event, onOrOff){
    event.stopPropagation();
    event.preventDefault();
    this.canvas.highlight(onOrOff);
  }


// --------------------------------------
    return DragNDrop
  })()
  return module.exports = DragNDrop
})



