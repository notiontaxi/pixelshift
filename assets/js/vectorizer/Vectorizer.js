/*
Class for outline and threshold class

Florian Wokurka (2013)
https://github.com/notiontaxi
*/

"use strict"

define(['js/vectorizer/Path', 'js/math/Vector', 'js/test/Test'], function(Path, Vector, Test) {

var Vectorizer, _ref, module,


  module = function() {}
  Vectorizer = (function(_super){
  // __extends(, );
// --------------------------------------



    function Vectorizer(containerIdentifier){  
      this.tempVecA = new Vector({x:0, y:0},{x:0, y:0})
      this.tempVecD = new Vector({x:0, y:0},{x:0, y:0})
      this.tempVecX = new Vector({x:0, y:0},{x:0, y:0})

      this.constraintA = new Vector({x:0, y:0},{x:0, y:0})
      this.constraintB = new Vector({x:0, y:0},{x:0, y:0})   

    }

    Vectorizer.prototype.processPathFinding = function(imageData, imageWidth){

      var paths = Array()
      var outside = true
      var foundInner = false

      var inner = 0
      var outer = 0

      var whiteToBlack = false
      var blackToGreen = false
      var greenToBlack = false
      var whiteToGreen = false
      var blackToWhite = false  

      var newPath  = false
      var newLine  = true
      var last = 1 // 1 = black, 2 = white, 3 = green 

      for (var i = 0; i < imageData.data.length; i+=4) {

        newLine = (i%(imageWidth*4) == 0)
        if(newLine){
          // first one is black of known path
          if(imageData.data[i] == 0 && imageData.data[i-imageWidth*4] == 253){         
            outside = false
            foundInner = false
            //console.log('first one is black at '+i%imageWidth)
            whiteToBlack = false
            blackToGreen = false
            greenToBlack = true
            whiteToGreen = true   
            blackToWhite = false 
            last = 3
          }else{
            outside = true
            foundInner = false
            //console.log(i)
            whiteToBlack = false
            blackToGreen = false
            greenToBlack = false
            whiteToGreen = false   
            blackToWhite = false
            last = 2 
          }
        }

        if(imageData.data[i] == 0 && last == 2){
          whiteToBlack = true
        }


        if((imageData.data[i] == 252 || imageData.data[i] == 253) && last == 2){
          whiteToGreen = true
        }   

        if(imageData.data[i] == 255 && last == 1){
          blackToWhite = true
        }   

        if((imageData.data[i] == 252 || imageData.data[i] == 253) && last == 1){
          blackToGreen = true
        }
        if(imageData.data[i] == 0 && last == 3){
          greenToBlack = true
          if(whiteToGreen)
            outside = false
        } 
        if(imageData.data[i] == 255 && last == 3 && blackToGreen){
          outside = true
        }             


        if(imageData.data[i] == 0 && outside){
          //console.log('start outer')
          var path = new Path(true, imageData, imageWidth)
          path.findPath(i)
          outside = false
          greenToBlack = true
          outer++

          var edges = path.getEdges()
          for(var e = 0; e < edges.length; e++){
            //imageData.data[edges[e].pixelFilled+1] = 255
            imageData.data[edges[e].pixelEmpty]    = 253
          }
          newPath = true
          paths.push(path)
        }else if(imageData.data[i] == 255 && !outside && !foundInner && blackToWhite){
          var path = new Path(false, imageData, imageWidth)
          //console.log('start inner')
          path.findPath(i)
          //console.log('finished inner')
          blackToGreen = true
          inner++
          var edges = path.getEdges()
          for(var e = 0; e < edges.length; e++){
            imageData.data[edges[e].pixelFilled]    = 252
          }

          paths.push(path) 
          foundInner = true  
        }


        if(imageData.data[i] == 0){
          last = 1
        }else if(imageData.data[i] == 255){
          last = 2
        }else if(imageData.data[i] == 252 || imageData.data[i] == 253){
          last = 3
        }

      }  

      var result = {
          imageData: imageData
        , paths: paths
        , message: "Found "+inner+" inner and "+outer+" outer paths."
      }

      return result
  }



  /**
  * @param {Array} paths array with inline and outline paths
  */
  Vectorizer.prototype.findAllStraightPaths = function(paths, imageWidth){

    var allStraightPaths = Array()

    for(var p = 0; p < paths.length; p++){
      allStraightPaths.push(this.findSingleStraightPaths(paths[p], imageWidth))
    }
    return allStraightPaths
  }

  /**
  * @param {Path} path with Edges
  */
  Vectorizer.prototype.findSingleStraightPaths = function(path, imageWidth){
 

    var edges = path.getPoints()
    var numberOfEdges = edges.length
    var currentEdge = null
    var counterEdge = null
    var straightPaths = Array()
    var counter = 0
    this.directions = Array()

    for(var i = 0; i < numberOfEdges-1; i++){

      currentEdge = edges[i]
      Vector.setToNull(this.constraintA)
      Vector.setToNull(this.constraintB)
      
      this.directions[0] = this.directions[1] = this.directions[2] = this.directions[3] = 0
      counter = i+1

      for(var k = i+1; k < numberOfEdges; k++){

        counterEdge = edges[k]
        Vector.getVector(currentEdge.gaussCoords, counterEdge.gaussCoords, this.tempVecA)
        //console.log(i+' to '+k+':')
        //console.log(this.tempVecA)
        //console.log(this.constraintA)
        //console.log(this.constraintB)

        if(this.isStraightPath() && this.checkDirections(currentEdge))
          counter = k
        else
          break
      }
      straightPaths[i] = counter
    }
    return straightPaths
  }

  Vectorizer.prototype.isStraightPath = function(){
    var result
    var hurt =  Vector.crossValue(this.constraintA, this.tempVecA) < 0 
                ||
                Vector.crossValue(this.constraintB, this.tempVecA) > 0 
    if(!hurt){
      this.updateConstraints()
      result = true
    }
    else
    {
      result = false
    }
    return result

  }

  Vectorizer.prototype.checkDirections = function(currentEdge){
    this.directions[currentEdge.type-1] = 1
    return this.directions[0] + this.directions[1] + this.directions[2] + this.directions[3] < 4
  }

  Vectorizer.prototype.updateConstraints = function(){
    // negation of this.tempVecA.x <= 1 && this.tempVecA.y <= 1
    if(this.tempVecA.x >= 1 || this.tempVecA.x <= -1 || this.tempVecA.y >= 1 || this.tempVecA.y <= -1){
      // c0
      //console.log('update')
      if(this.tempVecA.y >= 0 && (this.tempVecA.y > 0 || this.tempVecA.x < 0))
        this.tempVecD.x = this.tempVecA.x +1
      else
        this.tempVecD.x = this.tempVecA.x -1

      if(this.tempVecA.x <= 0 && (this.tempVecA.x < 0 || this.tempVecA.y < 0))
        this.tempVecD.y = this.tempVecA.y +1
      else
        this.tempVecD.y = this.tempVecA.y -1

      if(Vector.crossValue(this.constraintA, this.tempVecD) >= 0)
        Vector.copyAintoB(this.tempVecD, this.constraintA)

      //c1
      if(this.tempVecA.y <= 0 && (this.tempVecA.y < 0 || this.tempVecA.x < 0))
        this.tempVecD.x = this.tempVecA.x +1
      else
        this.tempVecD.x = this.tempVecA.x -1

      if(this.tempVecA.x >= 0 && (this.tempVecA.x > 0 || this.tempVecA.y < 0))
        this.tempVecD.y = this.tempVecA.y +1
      else
        this.tempVecD.y = this.tempVecA.y -1

      if(Vector.crossValue(this.constraintB, this.tempVecD) <= 0)
        Vector.copyAintoB(this.tempVecD, this.constraintB)
    }
  }



// --------------------------------------
    return Vectorizer
  })()
  return module.exports = Vectorizer
})