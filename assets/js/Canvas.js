/*
Canvas class

Florian Wokurka (2013)
https://github.com/notiontaxi
*/

"use strict"

define([], function() {

  var Canvas, module;
  module = function() {}
  Canvas = (function(){
// --------------------------------------

    function Canvas(id){
      
      this.id = id;
      this.cv = document.getElementById(this.id);
      this.ctx = this.cv.getContext('2d');


      this.canvasHeight = this.cv.height 
      this.canvasWidth = this.cv.width
      this.imageHeight = this.cv.height 
      this.imageWidth = this.cv.width
      this.imageXOffset = 0
      this.imageYOffset = 0

      this.gotNewImage = true;
      
      this.clear()

      this.ctx.font = "bold 12px sans-serif"
      this.ctx.textAlign = 'center'
      this.ctx.textBaseline = 'middle'

      this.oldImageData = this.getImageData()
      this.gotNewImage = true

      this.scaling = 1

    }

    Canvas.prototype.drawImage = function(img, _this){

      if(!_this)
        var _this = this

      _this.imageHeight = 0
      _this.imageWidth = 0
      _this.imageXOffset = 0
      _this.imageYOffset = 0

      if(img.width > img.height)
      {
        if(img.width >= _this.cv.width){
          _this.imageHeight = Math.round(img.height * (_this.cv.width/img.width))
          _this.imageWidth = _this.cv.width
        }else{
          _this.imageWidth = img.width
          _this.imageHeight = img.height
          _this.imageXOffset = Math.round((_this.cv.width - _this.imageWidth) / 2)
        }

        if(_this.imageHeight < _this.cv.height)
          _this.imageYOffset = Math.round((_this.cv.height - _this.imageHeight) / 2)
        
      } else {

        if(img.height >= _this.cv.height){
          _this.imageHeight = _this.cv.height
          _this.imageWidth = Math.round(img.width * (_this.cv.height/img.height))
        }else{
          _this.imageHeight = img.height
          _this.imageWidth = img.width
          _this.imageYOffset = Math.round((_this.cv.height - _this.imageHeight) / 2)    
        }

        if(_this.imageWidth < _this.cv.width)
          _this.imageXOffset = Math.round((_this.cv.width - _this.imageWidth) / 2)
        
             
      }
      _this.gotNewImage = true
      _this.clear()
      _this.getContext().drawImage(img, _this.imageXOffset, _this.imageYOffset, _this.imageWidth, _this.imageHeight)
    }

    Canvas.prototype.copy = function(otherCanvas, draw){

      var scaleX = (this.canvasWidth / otherCanvas.imageWidth).toFixed(4)
      var scaleY = (this.canvasHeight / otherCanvas.imageHeight).toFixed(4)

      var scale = scaleX < scaleY ? scaleX : scaleY;
      // do not scale, when original image is scmaller than canvas
      scale = scale > 1.0 ? 1.0 : scale;

      this.imageHeight  = otherCanvas.imageHeight * scale
      this.imageWidth   = otherCanvas.imageWidth * scale
      this.imageXOffset = (this.canvasWidth - this.imageWidth) / 2
      this.imageYOffset = (this.canvasHeight - this.imageHeight) / 2

      if(draw){
        // save current context state, to restore changes in scaling later
        this.getContext().save()
        var newCanvas = $("<canvas>")
            .attr("width", otherCanvas.imageWidth)
            .attr("height", otherCanvas.imageHeight)[0];
        newCanvas.getContext("2d").putImageData(otherCanvas.getImageData(), 0, 0);

        this.clear()
        this.scaling = scale        
        this.getContext().scale(scale, scale)
        this.getContext().drawImage(newCanvas, this.imageXOffset*1/scale, this.imageYOffset*1/scale)

        this.getContext().restore()
      }
    }

    Canvas.prototype.getFullSizeElement = function(){
      var newCanvas = $("<canvas>")
        .attr("width", this.imageWidth)
        .attr("height", this.imageHeight)[0]

      newCanvas.getContext("2d").putImageData(this.getImageData(), 0, 0)

      return newCanvas
    }

    Canvas.prototype.getElement = function(){
      return $('#'+this.id)
    }

    Canvas.prototype.getContext = function(){
      return this.ctx;
    }

    Canvas.prototype.getImageData = function(){
      return this.getContext().getImageData(this.imageXOffset,this.imageYOffset,this.imageWidth, this.imageHeight)
    }

     Canvas.prototype.getFullImageData = function(){
      return this.getContext().getImageData(0,0,this.canvasWidth, this.canvasHeight)
    }   

    Canvas.prototype.putImageData = function(imageData){
      this.clear()
      this.getContext().putImageData(imageData,this.imageXOffset,this.imageYOffset)
    }

    Canvas.prototype.updateSize = function(width, height, func) {

      
      this.ctx.canvas.width = this.canvasWidth = width
      this.ctx.canvas.height = this.canvasHeight = height

/*
      $("#canvas-overlay").css({
        'left': this.ctx.canvas.left+'px',
        'top': this.ctx.canvas.top+'px'
      })*/
      if(!!func)
        func();
    }

    Canvas.prototype.highlight = function(onOrOff){

      if (onOrOff){
        if(this.gotNewImage){
          this.oldImageData = this.getImageData()
          this.gotNewImage = false
        }

        this.ctx.fillStyle="#4A8FF0";
        this.ctx.fillRect(0,0, this.ctx.canvas.width, this.ctx.canvas.height);
      }
      else{
          this.putImageData(this.oldImageData)
          this.gotNewImage = true
      }
    }

     Canvas.prototype.clear = function(){
      this.ctx.fillStyle="grey"
      this.ctx.fillRect(0,0, this.ctx.canvas.width, this.ctx.canvas.height)
    } 

    // DRAWING

    Canvas.prototype.drawLine = function(startPoint, endPoint){
      this.ctx.moveTo(startPoint.x,startPoint.y);
      this.ctx.lineTo(endPoint.x,endPoint.y);
      this.ctx.stroke();
    }

    Canvas.prototype.drawText = function(text, pos, color,rot){
      this.ctx.font = "bold 12px sans-serif"
      this.ctx.textAlign = 'center'
      this.ctx.textBaseline = 'middle'
      // cut if its a number
      if(!isNaN(text*2))
        text = text.toFixed(1)

      this.ctx.fillStyle = color;

      // rotate text by -90 degrees
      if(rot){
        this.ctx.save()
        this.ctx.translate(pos.x, pos.y)
        this.ctx.rotate(Math.PI/2)
        this.ctx.fillText(text, 0, 0)
        this.ctx.restore()
      }
      else
        this.ctx.fillText(text, pos.x, pos.y);
    }

    Canvas.prototype.getImageWidth = function(){
      return this.imageWidth
    }

    Canvas.prototype.getImageHeight = function(){
      return this.imageHeight
    }

    Canvas.prototype.getCanvasWidth = function(){
      return this.canvasWidth
    }

    Canvas.prototype.getCanvasHeight = function(){
      return this.canvasHeight
    }    


// --------------------------------------
    return Canvas
  })()
  return module.exports = Canvas
})




