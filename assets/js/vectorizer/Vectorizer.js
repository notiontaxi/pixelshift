/*
Class for outline and threshold class

Florian Wokurka (2013)
https://github.com/notiontaxi
*/

"use strict"

define(['js/vectorizer/Path'], function(Path) {

var Vectorizer, _ref, module,


  module = function() {}
  Vectorizer = (function(_super){
  // __extends(, );
// --------------------------------------



    function Vectorizer(containerIdentifier){  
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


// --------------------------------------
    return Vectorizer
  })()
  return module.exports = Vectorizer
})