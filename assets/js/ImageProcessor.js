/*
ImageProcessor class

Florian Wokurka (2013)
https://github.com/notiontaxi
*/

"use strict"

define(['js/Histogram', 'js/helper/Colors'], function(Histogram, ColorHelper) {

  var ImageProcessor, module;
  module = function() {}
  ImageProcessor = (function(){
  //__extends(ImageProcessor, Superclass);
// --------------------------------------



  function ImageProcessor(){
    this.histogram = new Histogram();
    this.imageData = null;
  }


  ImageProcessor.prototype.processInvertColors = function(imageData){
    for (var i = 0; i < imageData.data.length; i+=4) {
      imageData.data[i + 0] = 255 - imageData.data[i + 0];
      imageData.data[i + 1] = 255 - imageData.data[i + 1];
      imageData.data[i + 2] = 255 - imageData.data[i + 2];
    }
    return imageData;
  }

  ImageProcessor.prototype.processThreshold = function(threshold, imageData){
    for (var i = 0; i < imageData.data.length; i+=4) {
      // get grey value for the current Pixel
      var greyValue = this.rgbToGreyscale(imageData.data[i], imageData.data[i+1], imageData.data[i+2]);
      // set the current Pixel to black or white depending on threshold
      imageData.data[i] = imageData.data[i+1] = imageData.data[i+2] = greyValue >= threshold ? 255 : 0;
    }
    return imageData;
  }

  ImageProcessor.prototype.processGrayscale = function(imageData){
    for (var i = 0; i < imageData.data.length; i+=4) {
      var greyValue = this.rgbToGreyscale(imageData.data[i], imageData.data[i+1], imageData.data[i+2])
      imageData.data[i] = imageData.data[i+1] = imageData.data[i+2] = greyValue
    }
    return imageData
  }

  ImageProcessor.prototype.rgbToGreyscale = function(r,g,b){
    // The effective luminance of a pixel:
    // 0.3*RED + 0.59*GREEN + 0.11*Blue (modificated for bit shift)
    var brightness = (5*r+8*g+b*3)>>>4 // Zero-Fill Right Shift
    return brightness
  }


  ImageProcessor.prototype.computeThreshold = function(imageData){

    var histogram = this.histogram.computeGreyscaleHistogram(imageData)
    
    var i = 0
    var anchor = 50
    var previousThreshold = 0
    var currentTreshold = 128

    var averageLeft = 0
    var averageRight = 0

    while(i++ < anchor && previousThreshold !== currentTreshold){

      // compute weights
      averageLeft = this.computeWeight(0,currentTreshold, histogram)
      averageRight = this.computeWeight(currentTreshold, 255, histogram)

      // store weight and set new
      previousThreshold = currentTreshold
      currentTreshold = Math.round((averageLeft + averageRight) / 2)

    }

    //console.log("Computed threshold: "+currentTreshold)
    return currentTreshold
  }

  // Thresholding using the Otsu's method
  ImageProcessor.prototype.computeWeight = function(from, to, histogram){
    var totalSum = 0
    var totalWeight = 0
    var average = 0

    for(var threshold = from; threshold <= to; threshold++){
      totalSum += histogram[threshold]
      totalWeight += threshold * histogram[threshold]
    }

    if(totalSum !== 0)
      average = totalWeight/totalSum
    else
      average = 0

    return average
  }

  ImageProcessor.prototype.processGreyscale = function(imageData){
    for (var i = 0; i < imageData.data.length; i+=4) {
      // get grey value for the current Pixel
      var greyValue = this.rgbToGreyscale(imageData.data[i], imageData.data[i+1], imageData.data[i+2])
      // set the current Pixel to black or white depending on threshold
      imageData.data[i] = imageData.data[i+1] = imageData.data[i+2] = greyValue
    }
    return imageData;    
  }


  ImageProcessor.prototype.processOutline = function(imageData, imageDataCopy, imageWidth){
    var originalImageData = imageData
    var erodedIMageData = this.processErosion(imageDataCopy, imageWidth)

    for (var i = 0; i < originalImageData.data.length; i+=4) {
      if(erodedIMageData.data[i] === 255 && originalImageData.data[i] === 0)
        originalImageData.data[i] = originalImageData.data[i+1] = originalImageData.data[i+2] = 0
      else
        originalImageData.data[i] = originalImageData.data[i+1] = originalImageData.data[i+2] = 255
    }    

    return originalImageData
  }


  ImageProcessor.prototype.processDilation = function(imageData, imageWidth){
    var directions = {
        left: true
      , right: true
      , up: true
      , down: true
    }
    return this.morph(imageData, imageWidth, 255, 0, directions)
  }

  ImageProcessor.prototype.processErosion = function(imageData, imageWidth){
    var directions = {
        left: true
      , right: true
      , up: true
      , down: true
    }
    return this.morph(imageData, imageWidth, 0, 255, directions)
  }  


  ImageProcessor.prototype.morph = function(imageData, imageWidth, lookFor, setTo, directions){
    /*
    jump 4 for r,g,b,a
    jump imageWidth for width
    */

    var flag = 42
    var deltaToSide = 0
    var imageHeight = imageData.data.length / imageWidth / 4
    var firstPixel = 0
    var lastPixel = imageData.data.length - 4

    // process the pixels
    for (var i = firstPixel; i <= lastPixel; i+=4){
      deltaToSide = i/4%imageWidth
      // left outer pixels
      if(deltaToSide == 0){    
        if(imageData.data[i] == setTo)
          if (directions.right && imageData.data[i+4] === lookFor) this.setPixelTo(imageData, i+4, flag)
        
      // right outer pixels
      }else if(deltaToSide == imageWidth-1){
        if(imageData.data[i] == setTo)
          if (directions.left && imageData.data[i-4] === lookFor) this.setPixelTo(imageData, i-4, flag)
      //all inner pixels
      }else{ 
        // just regard red
        if (imageData.data[i] === setTo){
            if (i >= 4 && directions.left && imageData.data[i-4] === lookFor) this.setPixelTo(imageData, i-4, flag) // left
            if (directions.right && imageData.data[i+4] === lookFor) this.setPixelTo(imageData, i+4, flag) // right
            if (i > imageWidth*4 && directions.up && imageData.data[i-imageWidth*4] === lookFor) this.setPixelTo(imageData, i-imageWidth*4, flag) // upper
            if (directions.down && imageData.data[i+imageWidth*4] === lookFor) this.setPixelTo(imageData, i+imageWidth*4, flag) // lower
        }
      }
    }   

    // reset the flagged values    
    for (var i = 0; i < imageData.data.length; i+=4)
      if (imageData.data[i] == flag)
        imageData.data[i] = imageData.data[i+1] = imageData.data[i+2] = setTo 
      
    return imageData;
  }

  ImageProcessor.prototype.setPixelTo = function(imageData, pixel, color){
    imageData.data[pixel] = imageData.data[pixel+1] = imageData.data[pixel+2] = color
  }

  ImageProcessor.prototype.setPixelToRgb = function(imageData, pixel, color){
    imageData.data[pixel] = color.r
    imageData.data[pixel+1] = color.g
    imageData.data[pixel+2] = color.b
  }  

  ImageProcessor.prototype.getPixelRgb = function(imageData, pixel){
    return{
        r: imageData.data[pixel]
      , g: imageData.data[pixel+1]
      , b: imageData.data[pixel+2]
      , colorName: imageData.data[pixel] + ' ' + imageData.data[pixel+1] + ' ' +imageData.data[pixel+2]
    }
  }   

  ImageProcessor.prototype.compareRgbColors = function(colorA, colorB){
    return colorA.r === colorB.r && colorA.g === colorB.g && colorA.b === colorB.b
  }

  ImageProcessor.prototype.processFloodFill = function(imageData, imageWidth, type){

    imageData = this.processThreshold(this.computeThreshold(imageData),imageData)

    var colors = new ColorHelper
    var label

    if(type == "depth"){
      for (var i = 0; i < imageData.data.length; i+=4)
        if (imageData.data[i] == 0){
          label = colors.getRandomColor().values
          this.floodFillStack(imageData, imageWidth, i, 0, label)
        }
      }else if(type == "breadth"){
       for (var i = 0; i < imageData.data.length; i+=4)
        if (imageData.data[i] == 0){
          label = colors.getRandomColor().values
          this.floodFillBreadth(imageData, imageWidth, i, 0, label)
        }       
      }else{
        this.floodFillSequential(imageData, imageWidth, colors)
      }
    return imageData;
  }

  ImageProcessor.prototype.floodFillStack = function(imageData, imageWidth, position, lookFor, label){
    var s = Array()
    var currPixPos
    var lastPixel = imageData.data.length - 4
    s.push(position)
    while(s.length > 0){
      currPixPos = s.pop()
      if(imageData.data[currPixPos] === lookFor && currPixPos > 0 && currPixPos < lastPixel){
        imageData.data[currPixPos] = label.r
        imageData.data[currPixPos+1] = label.g
        imageData.data[currPixPos+2] = label.b
        s.push(currPixPos - 4)
        s.push(currPixPos + 4)
        s.push(currPixPos - imageWidth*4)
        s.push(currPixPos + imageWidth*4)
        window.maxDepth = (s.length > window.maxDepth) ? s.length : window.maxDepth
      }
    }
  }

  ImageProcessor.prototype.floodFillBreadth = function(imageData, imageWidth, position, lookFor, label){
    var s = Array()
    var replacements = Array()
    var currPixPos
    var lastPixel = imageData.data.length - 4
    s.push(position)
    while(s.length > 0){
      currPixPos = s.shift()
      if(imageData.data[currPixPos] === lookFor && currPixPos > 0 && currPixPos < lastPixel){
        imageData.data[currPixPos] = label.r
        imageData.data[currPixPos+1] = label.g
        imageData.data[currPixPos+2] = label.b
        s.push(currPixPos - 4)
        s.push(currPixPos + 4)
        s.push(currPixPos - imageWidth*4)
        s.push(currPixPos + imageWidth*4)
        window.maxWidth = (s.length > window.maxWidth) ? s.length : window.maxWidth
      }
    }
  }

  ImageProcessor.prototype.floodFillSequential = function(imageData, imageWidth, colors){
    var test = new Array()
    var lookFor = 0;
    var currentLabel = colors.getRandomColor().values
    var collisions = Array()
    var currentColors = Array()
    var upperLeft, upper, upperRight, left

    // label first line
    for (var i = 0; i < imageWidth*4; i+=4){
      if(imageData.data[i] === lookFor){
        if(i > 4 && imageData.data[i-4] !== 255){
          this.setPixelToRgb(imageData,i,this.getPixelRgb(imageData, i-4)) // label from left pixel
        }else{
          currentLabel = colors.getRandomColor().values // new label
          this.setPixelToRgb(imageData, i, currentLabel)
        }
      }
    }

    // label sides
    for (var i = imageWidth*4; i < imageData.data.length; i+=imageWidth*4){
      // left side
      if(imageData.data[i] === lookFor){
        if(imageData.data[i-imageWidth*4] !== 255){
          this.setPixelToRgb(imageData,i,this.getPixelRgb(imageData, i-imageWidth*4)) // label from upper pixel
        }else{
          currentLabel = colors.getRandomColor().values // new label
          this.setPixelToRgb(imageData, i, currentLabel)
        }
      }
      // right side
      var rightPos = i+imageWidth*4-4
      if(imageData.data[rightPos] === lookFor){
        if(imageData.data[rightPos-imageWidth*4] !== 255){
          this.setPixelToRgb(imageData,rightPos,this.getPixelRgb(imageData, rightPos-imageWidth*4)) // label from upper pixel
        }else{
          currentLabel = colors.getRandomColor().values // new label
          this.setPixelToRgb(imageData, rightPos, currentLabel)
        }
      }
    }
    // all other pixels
    for (var i = imageWidth*4+4; i < imageData.data.length-4; i+=4){

      currentColors = Array()
      upperLeft = i-imageWidth*4-4
      upper = i-imageWidth*4
      upperRight = i-imageWidth*4+4
      left = i-4
      var currentColor = {color: this.getPixelRgb(imageData, i), pos: i}

      if(imageData.data[i] === lookFor){
        if(imageData.data[upperLeft] !== 255)
          currentColors.push({color: this.getPixelRgb(imageData, upperLeft), pos: upperLeft})
        if(imageData.data[upper] !== 255)
          currentColors.push({color: this.getPixelRgb(imageData, upper), pos: upper})
        if(imageData.data[upperRight] !== 255)
          currentColors.push({color: this.getPixelRgb(imageData, upperRight), pos: upperRight})
        if(imageData.data[left] !== 255){
          currentColors.push({color: this.getPixelRgb(imageData, left), pos: left})
        }

        if(currentColors.length === 0){
          this.setPixelToRgb(imageData, i, colors.getRandomColor().values) // new label
        }else{

          this.setPixelToRgb(imageData, i, currentColors[0].color) // get existing color 
                  
          if(currentColors.length > 1){
            for(var j = 1; j < currentColors.length; j++){
              if(currentColors[0].color.colorName != currentColors[j].color.colorName){
                this.addToCollisionSet(collisions, currentColors[0].color.colorName, currentColors[j].color.colorName)
              }
            }
          }

        }       
      }
    }

    // make it unique
    var uniqueCollisions = new Array()

    for(var key in collisions) {
      var temp = []

      $.each(collisions[key],function(i,v){
       if ($.inArray(v, temp) == -1) temp.push(collisions[key][i]);
      });

      uniqueCollisions[key] = temp
    }

    var replace = new Array()
    // solve collisions
    for (var i = imageWidth*4+4; i < imageData.data.length-4; i+=4){  
      if(imageData.data[i] !== 255){
        var color = imageData.data[i] + " " + imageData.data[i+1] + " " + imageData.data[i+2] 
        this.checkColor(imageData, i, color, uniqueCollisions)

        if(imageData.data[i-4] !== 255 && imageData.data[i-4] !== imageData.data[i]){
          var colorA = imageData.data[i] + " " + imageData.data[i+1] + " " + imageData.data[i+2] 
          var colorB = imageData.data[i-4] + " " + imageData.data[i-3] + " " + imageData.data[i-2] 
          replace[colorA] = colorB
        }
      }
    }

    for (var i = imageWidth*4+4; i < imageData.data.length-4; i+=4){  
      if(imageData.data[i] !== 255){

        var color = imageData.data[i] + " " + imageData.data[i+1] + " " + imageData.data[i+2] 

        if(keyInAArray(replace, color) !== -1){

          colors = (replace[color]).split(" ")
          imageData.data[i]    = colors[0]
          imageData.data[i+1]  = colors[1]
          imageData.data[i+2]  = colors[2]
        }

      }
    }

  }
      

  ImageProcessor.prototype.checkColor = function(imageData, position, color, collisions){
   
    var colors, pos

    for(var key in collisions){

      pos = inArray(collisions[key], color)

      if(pos !== -1){ 
        colors = (key).split(" ")
        imageData.data[position]    = colors[0]
        imageData.data[position+1]  = colors[1]
        imageData.data[position+2]  = colors[2]
      } 
    }
  }


 

  ImageProcessor.prototype.addToCollisionSet = function(collisions, colorA, colorB){

    //console.log(colorA + ' | ' + colorB)

    var newEntry = true
    var indexColorA, indexColorB
    var index = -1
    indexColorA = indexColorB = -1

    // is the color already an index?
    if(keyInAArray(collisions, colorA) !== -1){
      //console.log("a is a key")
      // a and be are existing as an index
      if(keyInAArray(collisions, colorB) !== -1){
        //console.log("b and a are keys")
        var newArray = collisions[colorA].concat(collisions[colorB])
        collisions[colorA] = newArray
        collisions.splice(colorB, 1)
      }
      
      collisions[colorA].push(colorB)
      newEntry = false
    }else if(keyInAArray(collisions, colorB) !== -1){
      //console.log("only b is a key")
      collisions[colorB].push(colorA)
      newEntry = false
    // is the color already part of a set?
    }else{
      for(var key in collisions){
        index++
        if(inArray(collisions[key], colorA) !== -1){
          //console.log("a in array "+key)
          indexColorA = key
          newEntry = false
        }
        if(inArray(collisions[key], colorB) !== -1){
          //console.log("b in array "+key)
          indexColorB = key
          newEntry = false
        }
      }

      if(indexColorA === indexColorB){

      }else if(indexColorA !== -1 && indexColorB !== -1){
        collisions[indexColorA] = collisions[indexColorA].concat(collisions[indexColorB])
        collisions[indexColorA].push(indexColorB)
        collisions.splice(indexColorB, 1)
      }else if(indexColorA !== -1){
        collisions[indexColorA].push(colorB)
      }else if(indexColorB !== -1){
        collisions[indexColorB].push(colorA)
      }

    }

    if(newEntry){
      collisions[colorA] = new Array()
      collisions[colorA].push(colorB)
      //console.log("new set "+colorA+" added "+colorB)
    }


    /* 
      sets.splice(j, 1)
      if(sets[j].indexOf(lookFor) !== -1)
      arrayUnique(sets[j].concat(lastInNewSets))
    */

  }


// --------------------------------------
    return ImageProcessor
  })()
  return module.exports = ImageProcessor
})



