/*
ImageProcessor class

Florian Wokurka (2013)
https://github.com/notiontaxi
*/

"use strict"

define(['js/Histogram', 'js/helper/Colors', 'js/vectorizer/Vectorizer'], function(Histogram, ColorHelper, Vectorizer) {

  var ImageProcessor, module;
  module = function() {}
  ImageProcessor = (function(){
  //__extends(ImageProcessor, Superclass);
// --------------------------------------



  function ImageProcessor(){
    this.histogram = new Histogram();
    this.imageData = null;

    this.dummyCanvas = document.createElement('canvas')
    this.dummyContext = this.dummyCanvas.getContext('2d')    
  }


  ImageProcessor.prototype.processInvertColors = function(imageData){
    for (var i = 0; i < imageData.data.length; i+=4) {
      imageData.data[i + 0] = 255 - imageData.data[i + 0];
      imageData.data[i + 1] = 255 - imageData.data[i + 1];
      imageData.data[i + 2] = 255 - imageData.data[i + 2];
    }
    return imageData;
  }

  ImageProcessor.prototype.processContrast = function(imageData, contrast) {

    var data = imageData.data
    var factor = (259 * (contrast + 255)) / (255 * (259 - contrast))

    for(var i = 0; i < data.length; i += 4){
        data[i] = (factor * ((data[i] - 128) + 128))
        data[i+1] = (factor * ((data[i+1] - 128) + 128))
        data[i+2] = (factor * ((data[i+2] - 128) + 128))
    }
    return imageData
  }

  ImageProcessor.prototype.processBrightness = function(imageData, brightness){
    var data = imageData.data

    if(brightness < 0){
      for(var i=0;i<data.length;i+=4){
        data[i] = data[i]+brightness <= 0 ? 0 : data[i]+brightness
        data[i+1] = data[i+1]+brightness <= 0 ? 0 : data[i+1]+brightness
        data[i+2] = data[i+2]+brightness <= 0 ? 0 : data[i+2]+brightness
      }
    }else if(brightness > 0){
      for(var i=0;i<data.length;i+=4){
        data[i] = data[i]+brightness >= 255 ? 255 : data[i]+brightness
        data[i+1] = data[i+1]+brightness >= 255 ? 255 : data[i+1]+brightness
        data[i+2] = data[i+2]+brightness >= 255 ? 255 : data[i+2]+brightness
      }
    }

    return imageData
  }

  ImageProcessor.prototype.processThreshold = function(threshold, imageData){
    for (var i = 0; i < imageData.data.length; i+=4) {
      // get grey value for the current Pixel
      var greyValue = this.rgbToGreyscale(imageData.data[i], imageData.data[i+1], imageData.data[i+2])
      // set the current Pixel to black or white depending on threshold
      imageData.data[i] = imageData.data[i+1] = imageData.data[i+2] = greyValue >= threshold ? 255 : 0
    }
    return imageData
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

    var bitmap = this.processThreshold(this.computeThreshold(imageData),imageData)
    var vec = new Vectorizer()
    var pathFindingResult = vec.processPathFinding(bitmap, imageWidth)
    vec.extendPaths(pathFindingResult.paths, imageWidth)

    return pathFindingResult
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

  ImageProcessor.prototype.processFloodFill = function(imageData, imageWidth, type, position, color, variance){
    var sameColor = ImageProcessor.sameColor(imageData, position, color, 0)

    if(!sameColor){
      if(type == "four")
        this.floodFillStack(imageData, imageWidth, position, color, variance)
      else if(type == "eight")
        this.floodFillBreadth(imageData, imageWidth, position, color, variance)
    }
    return imageData;
  }


  // regards the for pixels around the current pixel (upper. lower, left, right) / uses stack
  ImageProcessor.prototype.floodFillStack = function(imageData, imageWidth, position, label, variance){
    var s = Array()

    var color = ImageProcessor.getColorObject(imageData, position)
    var currPixPos
    var sameColor = false
    var lastPixel = imageData.data.length - 4

    s.push(position)

    while(s.length > 0){
      currPixPos = s.pop() // stack
      sameColor = ImageProcessor.sameColor(imageData, currPixPos, color, variance)
      if(sameColor && currPixPos >= 0 && currPixPos <= lastPixel){
        ImageProcessor.setColor(imageData, currPixPos, label)
        s.push(currPixPos - 4) // left
        s.push(currPixPos + 4) // right
        s.push(currPixPos - imageWidth*4) // upper
        s.push(currPixPos + imageWidth*4) // lower
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


  /**
  * Helper
  */
  ImageProcessor.sameColor = function(imageData, position, color, variance){
    return  imageData.data[position]   >= color.r - variance && imageData.data[position]   <= color.r + variance &&
            imageData.data[position+1] >= color.g - variance && imageData.data[position+1] <= color.g + variance &&
            imageData.data[position+2] >= color.b - variance && imageData.data[position+2] <= color.b + variance &&
            imageData.data[position+3] >= color.a - variance && imageData.data[position+3] <= color.a + variance
  }

  ImageProcessor.getColorObject = function(imageData, position){
    return {
        r: imageData.data[position]
      , g: imageData.data[position+1]
      , b: imageData.data[position+2]
      , a: imageData.data[position+3]
    }    
  }

  ImageProcessor.setColor = function(imageData, position, color){
    imageData.data[position]   = color.r
    imageData.data[position+1] = color.g
    imageData.data[position+2] = color.b
    imageData.data[position+3] = color.a
  }

  /**
  * http://en.wikipedia.org/wiki/Kernel_(image_processing) 
  *
  */
  ImageProcessor.prototype.convolute = function(pixels, weights) {

    var input = pixels.data
    var inputWidth = pixels.width
    var inputHeight = pixels.height

    // create new image data for output
    var result = this.dummyContext.createImageData(inputWidth, inputHeight)
    var output = result.data

    // matrix quantity
    var matrixSize = Math.round(Math.sqrt(weights.length))
    var halfMatrixSize = Math.floor(matrixSize/2)

    var currentR, currentG, currentB, currentA


    // iteration over all pixels
    for (var y=0; y<inputHeight; y++) {
      for (var x=0; x<inputWidth; x++) {
        var inputOffset = (y*inputWidth+x)*4;
        // calculate the weighed sum of the source image pixels that
        // fall under the convolution matrix
        currentR=0, currentG=0, currentB=0, currentA=0

        for (var matrixY=0; matrixY<matrixSize; matrixY++) {
          for (var matrixX=0; matrixX<matrixSize; matrixX++) {

            // get current position for output data depending on matrix position
            var smatrixY = y + matrixY - halfMatrixSize
            var smatrixX = x + matrixX - halfMatrixSize

            // if within image
            if (smatrixY >= 0 && smatrixY < inputHeight && smatrixX >= 0 && smatrixX < inputWidth) {

              var outputOffset = (smatrixY*inputWidth+smatrixX)*4
              // get weight for current output position and multiply all values with it
              var curentWeight = weights[matrixY*matrixSize+matrixX]
              currentR += input[outputOffset] * curentWeight
              currentG += input[outputOffset+1] * curentWeight
              currentB += input[outputOffset+2] * curentWeight
              currentA += input[outputOffset+3] * curentWeight
            }
          }
        }
        output[inputOffset]   = currentR
        output[inputOffset+1] = currentG
        output[inputOffset+2] = currentB
        output[inputOffset+3] = currentA 
      }
    }

    return result
  }



// --------------------------------------
    return ImageProcessor
  })()
  return module.exports = ImageProcessor
})



