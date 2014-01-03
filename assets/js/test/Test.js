/*
Test class

Florian Wokurka (2013)
https://github.com/notiontaxi
*/

"use strict"

define(['js/math/Vector'], function(Vector) {

var Test, _ref, module,


  module = function() {}
  Test = (function(_super){

// --------------------------------------



    function Test(){   


    }
  

    Test.prototype.vector = function(){
      var msg = ''
      var val = -1

      var pointA = {x:10, y:10}
      var pointB = {x:90, y:120} 
      var pointC = {x:0, y:0}
      var pointD = {x:200, y:200}

      var vecA = new Vector(pointA, pointB)
      var vecB = new Vector(pointC, pointD)
      var testMe = new Vector({x:0, y:0},{x:0, y:0})


      msg = (vecA.x == 80 && vecA.y == 110) ? 'passed' : 'not passed'
      console.log("constructor, dir: "+msg)

      msg = (vecA.position.x == 10 && vecA.position.y == 10) ? 'passed' : 'not passed'
      console.log("constructor, pos: "+msg)      

      val = Vector.crossValue(vecA, vecB)
      msg = val == -6000  ? 'passed' : 'not passed'
      console.log("crossValue: "+msg)    

      val = Vector.getVector(vecA, vecB, testMe)
      msg = testMe.x == 120 && testMe.y == 90 ? 'passed' : 'not passed'
      console.log("getVector: "+msg) 

      val = Vector.copyAintoB(vecA, testMe)
      vecA.x = 99
      msg = testMe.x == 80 && testMe.y == 110 ? 'passed' : 'not passed'
      vecA.x = 10
      console.log("copy: "+msg)       

      Vector.setToNull(testMe)
      msg = testMe.x == 0 && testMe.y == 0 && 
            testMe.position.x == 0 && testMe.position.y == 0 ? 'passed' : 'not passed'
      console.log("setToNull: "+msg)         


      var point1 = {x: 1, y: 3}
      var point2 = {x: 3, y: 0.5}

      var v = new Vector({x:0,y:0},{x:3,y:4})
      var a = new Vector({x:0,y:0},{x:3,y:.5})

      var normal = Vector.normal(point1, point2)  
      Vector.normalizedPositive(normal)

      var substracted = new Vector({x:0,y:0},{x:0,y:0})
      Vector.substract(v,a,substracted)

      var distance = Vector.dot(normal, substracted)

      msg = distance == 2.186432666440485 ? 'passed' : 'not passed'
      console.log("distance to line (includeing normalizedPositive, dot and substracted): "+msg)                

    }

  


// --------------------------------------
    return Test
  })()
  return module.exports = Test
})