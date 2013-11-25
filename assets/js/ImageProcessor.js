/*
ImageProcessor class

Florian Wokurka (2013)
https://github.com/notiontaxi
*/

"use strict"

define(['js/Histogram', 'js/helper/Colors', 'js/Path'], function(Histogram, ColorHelper, Path) {

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


  ImageProcessor.prototype.processPathFinding = function(imageData, imageWidth){

    var paths = Array()
    var outside = true
    var foundInner = false

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
        last = 2
        outside = true
        foundInner = false
        console.log(i)
        whiteToBlack = false
        blackToGreen = false
        greenToBlack = false
        whiteToGreen = false   
        blackToWhite = false     
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

        var path = new Path(true, imageData, imageWidth)
        path.findPath(i)
        outside = false
        greenToBlack = true

        var edges = path.getEdges()
        for(var e = 0; e < edges.length; e++){
          //imageData.data[edges[e].pixelFilled+1] = 255
          imageData.data[edges[e].pixelEmpty]    = 253
        }
        newPath = true
        paths.push(path)
      }else if(imageData.data[i] == 255 && !outside && !foundInner && blackToWhite){
        var path = new Path(false, imageData, imageWidth)
        console.log('start inner')
        path.findPath(i)
        console.log('finished inner')
        blackToGreen = true
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

      /*
      if(i == (24*45 + 19*4)){
        console.log('last '+last)
        console.log('outside '+outside)
        console.log('foundInner '+foundInner)
        console.log('whiteToBlack '+whiteToBlack)
        console.log('blackToGreen '+blackToGreen)
        console.log('greenToBlack '+greenToBlack)
        console.log('whiteToGreen '+whiteToGreen)       
      }
      */

    }  

    /*
    imageData.data[24*45 + 19*4] = 255
    imageData.data[24*45 + 19*4+1] = 0
    imageData.data[24*45 + 19*4+2] = 0

    imageData.data[20] = 255
    imageData.data[24*45 + 19*4+1] = 0
    imageData.data[24*45 + 19*4+2] = 0    
    */
    console.log(paths.length)

    return imageData
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

    if(type == "four"){
      for (var i = 0; i < imageData.data.length; i+=4)
        if (imageData.data[i] == 0){
          label = colors.getRandomColor().values
          this.floodFillStack(imageData, imageWidth, i, 0, label)
        }
      }else if(type == "eight"){
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

  // regards the for pixels around the curent pixel (upper. lower, left, right) / uses stack
  ImageProcessor.prototype.floodFillStack = function(imageData, imageWidth, position, lookFor, label){
    var s = Array()
    var currPixPos
    var lastPixel = imageData.data.length - 4
    s.push(position)
    while(s.length > 0){
      currPixPos = s.pop() // stack
      if(imageData.data[currPixPos] === lookFor && currPixPos > 0 && currPixPos < lastPixel){
        imageData.data[currPixPos] = label.r
        imageData.data[currPixPos+1] = label.g
        imageData.data[currPixPos+2] = label.b
        s.push(currPixPos - 4) // left
        s.push(currPixPos + 4) // right
        s.push(currPixPos - imageWidth*4) // upper
        s.push(currPixPos + imageWidth*4) // lower
        window.maxDepth = (s.length > window.maxDepth) ? s.length : window.maxDepth
      }
    }
  }

  // regards the eight pixels around the curent pixel / uses queue
  ImageProcessor.prototype.floodFillBreadth = function(imageData, imageWidth, position, lookFor, label){
    var s = Array()
    var replacements = Array()
    var currPixPos
    var lastPixel = imageData.data.length - 4
    s.push(position)
    while(s.length > 0){
      currPixPos = s.shift() // queue
      if(imageData.data[currPixPos] === lookFor && currPixPos > 0 && currPixPos < lastPixel){
        imageData.data[currPixPos] = label.r
        imageData.data[currPixPos+1] = label.g
        imageData.data[currPixPos+2] = label.b
        s.push(currPixPos - 4) // left
        s.push(currPixPos + 4) // right
        s.push(currPixPos - imageWidth*4) // upper
        s.push(currPixPos + imageWidth*4) // lower
        s.push(currPixPos - imageWidth*4 - 4) // upper left
        s.push(currPixPos - imageWidth*4 + 4) // upper right
        s.push(currPixPos + imageWidth*4 - 4) // lower left
        s.push(currPixPos + imageWidth*4 + 4) // lower right
        window.maxWidth = (s.length > window.maxWidth) ? s.length : window.maxWidth
      }
    }
  }


// --------------------------------------
    return ImageProcessor
  })()
  return module.exports = ImageProcessor
})



