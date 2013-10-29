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
        _this.imageHeight = img.height * (_this.cv.width/img.width)
        _this.imageWidth = _this.cv.width

        if(_this.imageHeight < _this.cv.height){
          _this.imageYOffset = (_this.cv.height - _this.imageHeight) / 2
        }
      }else{
        _this.imageHeight = _this.cv.height
        _this.imageWidth = img.width * (_this.cv.height/img.height)

        if(_this.imageWidth < _this.cv.width){
          _this.imageXOffset = (_this.cv.width - _this.imageWidth) / 2
        }
             
      }
      _this.gotNewImage = true
      _this.clear()
      _this.getContext().drawImage(img, _this.imageXOffset, _this.imageYOffset, _this.imageWidth, _this.imageHeight)
    }

    Canvas.prototype.copy = function(otherCanvas, draw){
      this.imageHeight = otherCanvas.imageHeight
      this.imageWidth = otherCanvas.imageWidth
      this.imageXOffset = otherCanvas.imageXOffset
      this.imageYOffset = otherCanvas.imageYOffset

      if(draw)
        this.putImageData(otherCanvas.getImageData(), this.imageXOffset, this.imageYOffset)
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

    Canvas.prototype.putImageData = function(imageData){
      this.clear()
      this.getContext().putImageData(imageData,this.imageXOffset,this.imageYOffset);
    }

    Canvas.prototype.updateSize = function(width, height, func) {

      this.ctx.canvas.width  = width
      this.ctx.canvas.height = height
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

    Canvas.prototype.getWidth = function(){
      return this.imageWidth - this.imageXOffset
    }

    Canvas.prototype.getHeight = function(){
      return this.imageHeight - this.imageYOffset
    }    


// --------------------------------------
    return Canvas
  })()
  return module.exports = Canvas
})




