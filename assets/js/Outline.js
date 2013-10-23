/*
Main class

Florian Wokurka (2013)
https://github.com/notiontaxi
*/

"use strict"

define(['text!templates/task_outline.html', 'js/Canvas', 'js/FileProcessor', 'js/Gui'], function(template, Canvas, FileProcessor, Gui) {

  var Outline, module;
  module = function() {}
  Outline = (function(){
  //__extends(Outline, Superclass);
// --------------------------------------



  function Outline(){
    
    
    //Main.__super__.constructor.call(this);
  }

  Outline.prototype.initialize = function(){


    this.leftCanvas = new Canvas('canvas-left')
    this.rightCanvas = new Canvas('canvas-right')

    Gui(this.leftCanvas, new FileProcessor)
  }

  Outline.prototype.renderAndAppendTo = function(identifier){
    $(identifier).html($(template))
    this.initialize()
    $( "#slider" ).slider();
    $( "#slider1" ).slider();
    $( "#slider2" ).slider();
  }


// --------------------------------------
    return Outline
  })()
  return module.exports = Outline
})