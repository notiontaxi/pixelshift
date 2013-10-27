/*
ImageProcessor class

Florian Wokurka (2013)
https://github.com/notiontaxi
*/

"use strict"

define(['js/Histogram'], function(Histogram) {

  var ImageProcessor, module;
  module = function() {}
  ImageProcessor = (function(){
  //__extends(ImageProcessor, Superclass);
// --------------------------------------



  function ImageProcessor(){
    this.histogram = new Histogram();
    this.imageData = null;
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

  ImageProcessor.prototype.rgbToGreyscale = function(r,g,b){
    // The effective luminance of a pixel:
    // 0.3*RED + 0.59*GREEN + 0.11*Blue (modificated for bit shift)
    var brightness = (4*r+7*g+b*3)>>>4 // Zero-Fill Right Shift
    return brightness
  }


  ImageProcessor.prototype.processOutline = function(imageData){



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

    console.log("Computed threshold: "+currentTreshold)
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


  ImageProcessor.prototype.processDilate = function(imageData, imageWidth){
    /*
    jump 4 for r,g,b,a
    jump imageWidth for width
    */
    var secondPixelInSecondRow = (imageWidth+2)*4
    var secondLastPixelInSecondLastRow = imageData.data.length - (imageWidth+2)*4
    // dilate the Pixels
    for (var i = secondPixelInSecondRow; i <= secondLastPixelInSecondLastRow; i+=4){
      // ignore all outer pixels
      if(i/4%imageWidth !== 0 && i/4%imageWidth !== imageWidth-1){    
            // just regard red
        if (imageData.data[i] === 0){
            if (imageData.data[i-4] === 255) this.setPixelTo(imageData, i-4, 42) // left
            if (imageData.data[i+4] === 255) this.setPixelTo(imageData, i+4, 42) // right
            if (imageData.data[i-imageWidth*4] === 255) this.setPixelTo(imageData, i-imageWidth*4, 42) // upper
            if (imageData.data[i+imageWidth*4] === 255) this.setPixelTo(imageData, i+imageWidth*4, 42) // lower
        }
      }   
    }

    // reset the flagged values    
    for (var i = 0; i < imageData.data.length; i+=4)
      if (imageData.data[i] == 42)
        imageData.data[i] = imageData.data[i+1] = imageData.data[i+2] = 0
      
    return imageData;
  }

  ImageProcessor.prototype.setPixelTo = function(imageData, pixel, color){
    console.log(pixel)
    imageData.data[pixel] = imageData.data[pixel+1] = imageData.data[pixel+2] = color
  }


// --------------------------------------
    return ImageProcessor
  })()
  return module.exports = ImageProcessor
})



