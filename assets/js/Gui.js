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


  function Gui(canvas, fileProcessor, coordSys){
    this.canvas = canvas;
    this.fileProcessor = fileProcessor;

    this.bindEvents();

    $('#container').tooltip();

    this.resizeContainer()
  }

  Gui.prototype.bindEvents = function(){
    $('#visualization-mode').click(function(e){
      this.switchViewTo(e.target.id);
    }.bind(this));

    dropZone = document.getElementById('canvas-overlay');
    dropZone.addEventListener('drop', function(event){var val = this.fileProcessor.processFile(event, this.start, this)}.bind(this), false);
    dropZone.addEventListener('dragover', function(event){this.showDragOver(event, true)}.bind(this), false);
    dropZone.addEventListener('dragleave', function(event){this.showDragOver(event, false)}.bind(this), false);

     window.onresize = function(e){
      this.canvas.updateSize(function(){this.draw()}.bind(this));
      
     }.bind(this);  
  }



  // pass thet to be in own context again
  Gui.prototype.start = function(data, that){

    if(!!data){
      that.data = data
      that.mode = $('#mode').html()
      
      that.draw(mode)
    }

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



