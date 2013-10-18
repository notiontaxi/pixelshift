/*
Main class

Florian Wokurka (2013)
https://github.com/notiontaxi
*/

"use strict"

require(['text!templates/welcome.html'], function(welcome) {

  function Main(){

  }

  Main.prototype.start = function(){
    var template = $( welcome )
    $('#container').html(template)
  }

  Main.prototype.bindEvents = function(){
   $('#task_outline').click(this.taskOutlineAction)
  }  

  Main.prototype.taskOutlineAction = function(){
    require(['js/Outline'], function(Outline) {
      var outline = new Outline()
      outline.renderAndAppendTo('#container')
    })
  }

  var main = new Main()
  main.bindEvents()
  main.start()

})