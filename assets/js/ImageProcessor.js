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

      if(imageData.data[i] === lookFor){
        if(imageData.data[upperLeft] !== 255)
          currentColors.push({color: this.getPixelRgb(imageData, upperLeft), pos: upperLeft})
        if(imageData.data[upper] !== 255)
          currentColors.push({color: this.getPixelRgb(imageData, upper), pos: upper})
        if(imageData.data[upperRight] !== 255)
          currentColors.push({color: this.getPixelRgb(imageData, upperRight), pos: upperRight})
        if(imageData.data[left] !== 255)
          currentColors.push({color: this.getPixelRgb(imageData, left), pos: left})

        if(currentColors.length === 0){
          this.setPixelToRgb(imageData, i, colors.getRandomColor().values) // new label
        }else{
          this.setPixelToRgb(imageData, i, currentColors[0].color) // get existing color
          if(currentColors.length > 1)
            for(var j = 1; j < currentColors.length; j++)
              if(currentColors[0].color.colorName != currentColors[j].color.colorName)
                collisions.push({
                    a: currentColors[j] 
                  , b: currentColors[0]}
                  )
        }
      }       
    }
    /*
    if(collisions.length !== 0){
      var sets = new Array()
      var set = new Array()
      var foundSomething = false
      var foundA = false
      var foundB = false
      set.push(collisions[0].a.color.colorName)
      set.push(collisions[0].b.color.colorName)
      sets.push(set)

      // solve colissions
      for(var i = 1; i < collisions.length; i++){
        for(var j = 0; j < sets.length; j++){
          var currentSet = sets[j]
          if(currentSet.indexOf(collisions[i].b.color.colorName) !== -1){
            if(currentSet.indexOf(collisions[i].a.color.colorName) === -1){
              currentSet.push(collisions[i].a.color.colorName)
              foundSomething = true
              break
            }
          }else if(currentSet.indexOf(collisions[i].a.color.colorName) !== -1){
            if(currentSet.indexOf(collisions[i].b.color.colorName) === -1){
              currentSet.push(collisions[i].b.color.colorName)
              foundSomething = true
              break
            }
          }

        }
        if(!foundSomething){
          var newSet = new Array()
          newSet.push(collisions[i].a.color.colorName)
          newSet.push(collisions[i].b.color.colorName)
          sets.push(newSet)  
        }else{
          foundSomething = false
        }
      }

      var newSets = new Array()
      newSets.push(sets.shift())

      while(sets.length > 0){
        var lastInNewSets = newSets[newSets.length-1]
        for(var i = 0; i < lastInNewSets.length; i++){
          var lookFor = lastInNewSets[i]
          for(var j = 0; j < sets.length; j++){
            if(sets[j].indexOf(lookFor) !== -1){
              newSets[newSets.length-1] = arrayUnique(sets[j].concat(lastInNewSets))
              sets.splice(j, 1)
            }
          }
        }
      }


      console.log(newSets)
      */


  }



// --------------------------------------
    return ImageProcessor
  })()
  return module.exports = ImageProcessor
})



