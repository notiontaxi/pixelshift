/*
Class for outline and threshold class

Florian Wokurka (2013)
https://github.com/notiontaxi
*/

"use strict"

define(['js/math/Vector'], function(Vector) {

var Edge, _ref, module,


  module = function() {}
  Edge = (function(_super){

// --------------------------------------


    Edge.EDGETYPE_LEFT = 1
    Edge.EDGETYPE_BOTTOM = 2
    Edge.EDGETYPE_RIGHT = 3
    Edge.EDGETYPE_TOP = 4

    /**
    *
    */
    function Edge(type, pixelFilled, pixelEmpty, imageWidth){   
      this.type = type 
      this.pixelFilled = pixelFilled
      this.pixelEmpty = pixelEmpty

      this.computeGaussCoords(imageWidth)
      //this.vector = new Vector(this.gaussCoords, {x: 0, y:0})

      if(pixelEmpty > pixelFilled)
        if(pixelEmpty === pixelFilled + 4)
          this.side = 'left'
        else
          this.side = 'upper'
      else
        'other'
    }

    Edge.prototype.computeGaussCoords = function(imageWidth){

      var pos = Math.floor(this.pixelFilled/4)

      this.gaussCoords = {
          x: pos%imageWidth
        , y: Math.ceil(pos/imageWidth) - 1
      }
    } 


    Edge.prototype.equals = function(otherEdge){
      if(   otherEdge.pixelFilled == this.pixelFilled 
         && otherEdge.pixelEmpty  == this.pixelEmpty)
        return true
      else
        return false
    }


// --------------------------------------
    return Edge
  })()
  return module.exports = Edge
})