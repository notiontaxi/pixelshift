/*
Histogram class

curently grayscale only

Florian Wokurka (2013)
https://github.com/notiontaxi
*/

"use strict"

define([], function() {

  var Histogram, module;
  module = function() {}
  Histogram = (function(){
  //__extends(Histogram, Superclass);
// --------------------------------------



  function Histogram(values){


    this.values = !!values ? values : 255

    this.histogram = new Array()    
  }


  Histogram.prototype.computeGreyscaleHistogram = function(imageData){

    this.generateEmptyGreyscaleHistogram()

    if(!!imageData){
      this.imageData = imageData

      for (var i = 0; i < imageData.data.length; i+=4) {
        // get grey value for the current Pixel
        var greyValue = this.rgbToGreyscale(imageData.data[i], imageData.data[i+1], imageData.data[i+2]);
        this.histogram[greyValue]++;
      }
      //console.log("Histogram data computed")
    }

    this.normalizeGreyscale()
    this.computeMaxValue()
    return this.histogram
  }

  Histogram.prototype.generateEmptyGreyscaleHistogram = function(){
    for(var i = 0; i <= this.values; i++)
      this.histogram[i] = 0

    //console.log("Empty histogram generated")
  }


  // result are values between 0.0000 and 1.00
  Histogram.prototype.normalizeGreyscale = function(){
    var totalSum = this.totalSum()

    for(var i = 0; i < this.histogram.length; i++)
      this.histogram[i] = parseFloat((this.histogram[i] / totalSum).toFixed(4))
        
    //console.log("Histogram normalized")

    return this.histogram
  }

  Histogram.prototype.computeMaxValue = function(){
    this.maxValue = 0
    for(var i = 0; i < this.histogram.length; i++){
      this.maxValue = (this.histogram[i] < this.maxValue) ? this.maxValue : this.histogram[i]
    }
        
    //console.log("Maximal value in Histogram is "+this.maxValue)   
  }

  Histogram.prototype.totalSum = function(){
    var totalSum = 0
    for(var i = 0; i < this.histogram.length; i++){
      totalSum += this.histogram[i]
    }   
    return totalSum 
  }

  Histogram.prototype.rgbToGreyscale = function(r,g,b){
    // The effective luminance of a pixel:
    // 0.3*RED + 0.59*GREEN + 0.11*Blue (modificated for bit shift)
    var brightness = (4*r+7*g+b*3)>>>4 // Zero-Fill Right Shift
    return brightness
  }  


// --------------------------------------
    return Histogram
  })()
  return module.exports = Histogram
})



