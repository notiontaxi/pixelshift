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



  function Context(canvasOrigin){
    this.canvasOrigin = canvasOrigin
    this.oneClickStrategies = Array()
    this.StackableStrategies = Array()
  }


  Context.prototype.addOneClickStrategy = function(strategy){
      this.oneClickStrategies.push(strategy)
  }
  Context.prototype.addStackableStrategy = function(strategy){
      this.StackableStrategies.push(strategy)
      strategy.setOnChangeAction(this.runStackedStrategies, this)
  }  

  Context.prototype.oneClickStrategy = function(mode){
    var result = null

    // search for currently active strategy and return it
    for(var i = 0; i < this.oneClickStrategies.length; i++)
      if(this.oneClickStrategies[i].name === mode)
        result = this.oneClickStrategies[i]
    

    if(!result)
      console.error('no matching strategy found')

    return result
  }

  Context.prototype.runStackedStrategies = function(_this, preview){

    if(!_this)
      var _this = this

    _this.imageData = _this.canvasOrigin.getFullImageData()

    for(var i = 0; i < _this.StackableStrategies.length; i++)
      if(_this.StackableStrategies[i].changed){
        _this.StackableStrategies[i].execute(_this.imageData, preview)
      }
    
  }




// --------------------------------------
    return Context
  })()
  return module.exports = Context
})



