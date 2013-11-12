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

    function Canvas(id, keepChangesForUndo){
      
      this.id = id;
      this.cv = document.getElementById(this.id);
      this.ctx = this.cv.getContext('2d');


      this.canvasHeight = this.cv.height 
      this.canvasWidth = this.cv.width
      this.imageHeight = this.cv.height 
      this.imageWidth = this.cv.width
      this.imageXOffset = 0
      this.imageYOffset = 0

      this.gotNewImage = true

      this.ctx.font = "bold 12px sans-serif"
      this.ctx.textAlign = 'center'
      this.ctx.textBaseline = 'middle'

      this.oldImageData = this.getImageData()
      this.gotNewImage = true

      this.scaling = 1

      this.clones = new Array()
      this.undoStack = new Array()
      this.redoStack = new Array()

      this.keepChangesForUndo = keepChangesForUndo === true ? true : false
      this.storeImageInfo()
    }

    Canvas.prototype.storeImageInfo = function(){

      this.lastImageInfos = new Array()
      this.lastImageInfos["pixel"] = this.getFullImageData()
      this.lastImageInfos["size"] = {
          imageWidth: this.imageWidth
        , imageHeight: this.imageHeight
        , imageXOffset: this.imageXOffset
        , imageYOffset: this.imageYOffset
      } 

    }

    Canvas.prototype.undo = function(){

      if(this.undoStack.length !== 0){

        this.redoStack.push(this.revert(this.undoStack.pop()))

        this.copyToClones()
      }

    }

    Canvas.prototype.redo = function(){


    }

    Canvas.prototype.revert = function(allChanges){
        var redo = new Array()
        var redoPixelChanges = new Array()
        var redoSizeChanges = {
            imageWidth: this.imageWidth
          , imageHeight: this.imageHeight
          , imageXOffset: this.imageXOffset
          , imageYOffset: this.imageYOffset
        }         

        var pixelChanges = allChanges["pixel"]
        var sizeChanges = allChanges["size"]      
        var pos = 0
        var imageData = this.getFullImageData()
        console.log("undo ("+pixelChanges.length+")")

        var i
        for(i = 0; i < pixelChanges.length; i++){
          pos = pixelChanges[i].position

          var col = {
                r: imageData.data[pos]
              , g: imageData.data[pos+1]
              , b: imageData.data[pos+2]
              , a: imageData.data[pos+3]
              }

          redoPixelChanges.push({
              position: pos 
            , color: col
          })

          imageData.data[pos]   = pixelChanges[i].color.r
          imageData.data[pos+1] = pixelChanges[i].color.g
          imageData.data[pos+2] = pixelChanges[i].color.b
          imageData.data[pos+3] = pixelChanges[i].color.a

        }

        this.imageWidth = sizeChanges.imageWidth
        this.imageHeight = sizeChanges.imageHeight
        this.imageXOffset = sizeChanges.imageXOffset
        this.imageYOffset = sizeChanges.imageYOffset

        this.putFullImageData(imageData)


        redo["pixel"] = redoPixelChanges
        redo["size"] = redoSizeChanges

        return redo
    }

    Canvas.prototype.getDiff = function(imageDataNew, imageInfosOld){
      var diff = new Array()
      var allDiff = new Array()
      var rComp,gComp,bComp,aComp 
      var imageDataOld = imageInfosOld["pixel"]

      for(var i = 0; i < imageDataNew.data.length; i+=4){
        rComp = imageDataNew.data[i]   === imageDataOld.data[i]
        gComp = imageDataNew.data[i+1] === imageDataOld.data[i+1]
        bComp = imageDataNew.data[i+2] === imageDataOld.data[i+2]
        aComp = imageDataNew.data[i+3] === imageDataOld.data[i+3]

        if(!(rComp && gComp && bComp && aComp)){

          var col = {
                r: imageDataOld.data[i]
              , g: imageDataOld.data[i+1]
              , b: imageDataOld.data[i+2]
              , a: imageDataOld.data[i+3]
              }

          diff.push({
              position: i 
            , color: col
          })
        }
      }

      allDiff['pixel'] = diff
      allDiff['size'] = imageInfosOld["size"]

      return allDiff

    }

    Canvas.prototype.registerContentModification = function(bla){

      this.copyToClones()

      if(this.keepChangesForUndo){
        var diff = this.getDiff(this.getFullImageData(), this.lastImageInfos)

        if(diff['pixel'].length > 0){
          this.undoStack.push(diff)
          console.log("push diff to undo stack ("+diff['pixel'].length+")")
    
          // avoid big data mass
          if(this.undoStack.length > 20){
            this.undoStack.shift()
            console.log("remove last element in undo stack")
          }

          // set pointer to current state
          this.storeImageInfo()
        }
      }

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
      _this.registerContentModification()
    }

    Canvas.prototype.copy = function(otherCanvas, doNotDraw){

        this.updateSizeAndContentFrom(otherCanvas)

        if(!doNotDraw)
          this.registerContentModification()
      
    }

    Canvas.prototype.updateSizeAndContentFrom = function(otherCanvas, doNotDraw){

      var scaleX = (this.canvasWidth / otherCanvas.imageWidth).toFixed(4)
      var scaleY = (this.canvasHeight / otherCanvas.imageHeight).toFixed(4)

      var scale = scaleX < scaleY ? scaleX : scaleY;
      // do not scale, when original image is scmaller than canvas
      scale = scale > 1.0 ? 1.0 : scale;

      this.imageHeight  = otherCanvas.imageHeight * scale
      this.imageWidth   = otherCanvas.imageWidth * scale
      this.imageXOffset = (this.canvasWidth - this.imageWidth) / 2
      this.imageYOffset = (this.canvasHeight - this.imageHeight) / 2

      if(!doNotDraw){
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
      this.registerContentModification()
    }

    Canvas.prototype.putFullImageData = function(imageData){
      console.log(imageData.data.length)
      this.clear()
      this.getContext().putImageData(imageData,0,0)
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

    Canvas.prototype.addClone = function(clone){
      this.clones.push(clone)
    }

    Canvas.prototype.copyToClones = function(){
      if(!!this.clones)
        for(var c = 0; c < this.clones.length; c++)
          this.clones[c].copy(this)
    }
    


// --------------------------------------
    return Canvas
  })()
  return module.exports = Canvas
})




