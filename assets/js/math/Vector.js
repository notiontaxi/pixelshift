/*
Vector Class with position information

Florian Wokurka (2013)
https://github.com/notiontaxi
*/

"use strict"

define([], function() {

var Vector, _ref, module,


  module = function() {}
  Vector = (function(_super){

// --------------------------------------



    /**
    * Point format: {x:number, y:number}
    */
    function Vector(pointA, pointB){   
      
      this.position = pointA

      // for the potrace implementation use pointA = 0,0
      this.x = pointB.x - pointA.x
      this.y = pointB.y - pointA.y

    }
  

    Vector.prototype.print = function(){
      console.log('position: ('+this.position.x+','+this.position.y+')')  
      console.log('direction: ('+this.x+','+this.y+')')
    }

    Vector.prototype.length = function() {
        return Math.sqrt((this.x * this.x) + (this.y * this.y));
    }

    Vector.prototype.subtractSelf = function(v, out) {
        this.x -= v.x
        this.y -= v.y
    }

    Vector.prototype.addSelf = function(v, out) {
        this.x += v.x 
        this.y += v.y
    }

    Vector.prototype.scaleSelf = function(scale, out) {
        this.x *= scale
        this.y *= scale
    }

    Vector.prototype.normalizedSelf = function() {
        var iLen = 1 / this.length()
        this.x *= iLen; this.y *= iLen
    }


    /**
    * STATIC context
    */
    Vector.substract = function(v1, v2, out) {
        out.x = v1.x - v2.x
        out.y = v1.y - v2.y
    }

    Vector.add = function(v, out) {
        out.x = this.x + v.x 
        out.y = this.y + v.y
    }

    Vector.scale = function(scale, out) {
        out.x = this.x * scale
        out.y = this.y * scale
        return out
    }

    Vector.normalizedPositive = function(out) {
        var iLen = 1 / out.length()
        out.x = out.x * iLen
        out.y = out.y * iLen
        out.x = out.x < 0 ? out.x * -1 : out.x
        out.y = out.y < 0 ? out.y * -1 : out.y
        return out
    }

    Vector.dot = function(v1, v2) {
      return v1.x * v2.x + v1.y * v2.y
    }

    Vector.normal = function(p1, p2){
      var vNew = new Vector({x:0,y:0}, {x:p2.y - p1.y, y: -(p2.x - p1.x)})
      return vNew
    }

    /**
      Imagine a 3d vector with z = 0
          v1.y * v2.z - v1.z * v2.y,
          v1.z * v2.x - v1.x * v2.z,
          v1.x * v2.y - v1.y * v2.x
    */
    Vector.crossValue = function(v1, v2) {
      return v1.x * v2.y - v1.y * v2.x
    }

    Vector.getVector = function(v1, v2, out){
      out.x = v2.x - v1.x
      out.y = v2.y - v1.y
    }

    Vector.copyAintoB = function(v1, out){
      out.x = v1.x
      out.y = v1.y      
    }

    Vector.setToNull = function(out){
      out.x = 0
      out.y = 0
      out.position.x = 0
      out.position.y = 0
    }


// --------------------------------------
    return Vector
  })()
  return module.exports = Vector
})