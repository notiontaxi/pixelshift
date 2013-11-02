/*
Main class

Florian Wokurka (2013)
https://github.com/notiontaxi
*/

"use strict"

define(['text!templates/welcome.html'], function(template) {

  var Welcome, module;
  module = function() {}
  Welcome = (function(){
  //__extends(Outline, Superclass);
// --------------------------------------



  function Welcome(identifier){
    $(identifier).html($(template))
    
    //Main.__super__.constructor.call(this);
  }

  Welcome.prototype.initialize = function(){

  }

  Welcome.prototype.renderAndAppendTo = function(){
    

  }


// --------------------------------------
    return Welcome
  })()
  return module.exports = Welcome
})