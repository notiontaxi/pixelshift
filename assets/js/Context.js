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



  function Context(canvases){
    this.canvasOrigin = canvases.canvasOrigin
    this.canvasStage = canvases.canvasStage
    this.canvasShown = canvases.canvasShown
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

    var changes = 0

    if(!_this)
      var _this = this

    _this.imageData = _this.canvasStage.getImageData()

    for(var i = 0; i < _this.StackableStrategies.length; i++){
      if(_this.StackableStrategies[i].changed){
        _this.StackableStrategies[i].execute(_this.imageData, preview)
        changes++
      }else if(_this.StackableStrategies[i].reset){
        _this.StackableStrategies[i].execute(_this.imageData, preview)
      }
    }
      
    if(changes > 0)
      _this.canvasShown.draw(_this.imageData)
    else
      _this.canvasShown.copyParent()
  }




// --------------------------------------
    return Context
  })()
  return module.exports = Context
})



