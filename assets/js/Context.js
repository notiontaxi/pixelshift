/*
Context class
used for Strategy pattern


Florian Wokurka (2013)
https://github.com/notiontaxi
*/

"use strict"

define([], function() {

  var Context, module;
  module = function() {}
  Context = (function(){
  //__extends(Strategy, Superclass);
// --------------------------------------



  function Context(){
    this.strategies = Array()
  }


  Context.prototype.addStrategy = function(strategy){
      this.strategies.push(strategy)
  }

  Context.prototype.strategy = function(mode){
    var result = null

    for(var i = 0; i < this.strategies.length; i++)
      if(this.strategies[i].name === mode)
        result = this.strategies[i]
    

    if(!result)
      console.error('no matching strategy found')

    return result
  }




// --------------------------------------
    return Context
  })()
  return module.exports = Context
})


