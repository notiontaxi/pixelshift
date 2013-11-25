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

    /**
    * @constructor
    * Organizes operations for a canvas elment
    *
    * @param {String} id canvas id in DOM
    * @param {boolean} keepChangesForUndo Changes will be reorded for undo() if true
    */
    function Canvas(id, keepChangesForUndo){
      
      this.id = id;
      this.cv = document.getElementById(this.id);
      this.ctx = this.cv.getContext('2d');

      // TESTing 
      this.ctx.webkitImageSmoothingEnabled = false

      this.canvasHeight = this.cv.height 
      this.halfCanvasHeight = this.canvasHeight/2
      this.canvasWidth = this.cv.width
      this.halfCanvasWidth = this.canvasWidth/2
      this.imageHeight = this.cv.height 
      this.imageWidth = this.cv.width
      this.imageXOffset = 0
      this.imageYOffset = 0

      this.visibleArea = {
          x1: 0
        , y1: 0
        , x2: this.canvasWidth        
        , y2: this.canvasHeight
      }

      this.gotNewImage = true

      this.ctx.font = "bold 12px sans-serif"
      this.ctx.textAlign = 'center'
      this.ctx.textBaseline = 'middle'

      this.oldImageData = this.getImageData()
      this.gotNewImage = true

      this.currentScale = 1
      this.positionX = 0
      this.positionY = 0

      this.clones = new Array()
      this.undoStack = new Array()
      this.redoStack = new Array()

      this.keepChangesForUndo = keepChangesForUndo === true ? true : false
      this.storeImageInfo()

      this.parent = null
    }

    Canvas.prototype.setParent = function(parent){
      this.parent = parent
    }


    Canvas.prototype.zoomIn = function(){
      if(this.currentScale < 50){
        switch(this.currentScale){
          case 1:
            this.currentScale = 2
            break
          case 2:
            this.currentScale = 4
            break
          case 4:
            this.currentScale = 5
            break
          case 5:
            this.currentScale = 8
            break
          case 8:
            this.currentScale = 10
            break                 
          case 10:
            this.currentScale = 16
            break                 
          case 16:
            this.currentScale = 20
            break              
        }
        this.draw()
      }
    }

    Canvas.prototype.zoomOut = function(){
      
      if(this.currentScale > 1.00){
        switch(this.currentScale){
          case 20:
            this.currentScale = 16
            break
          case 16:
            this.currentScale = 10
            break
          case 10:
            this.currentScale = 8
            break
          case 8:
            this.currentScale = 5
            break
          case 5:
            this.currentScale = 4
            break                 
          case 4:
            this.currentScale = 2
            break                 
          case 2:
            this.currentScale = 1
            break              
        }
        console.log(this.currentScale)
        if(this.currentScale < 2)
          this.zoomReset()
        else
          this.draw()
      }

    }

    Canvas.prototype.zoomReset = function(){
        this.positionX = 0
        this.positionY = 0
        this.currentScale = 1
        this.parent.copyToClones()
    }

    Canvas.prototype.moveCanvas = function(direction){

      if(this.currentScale !== 1){
        var canvas = this.getElement()
        var pixelPerMove = 10*this.currentScale

        switch(direction){
          case "up":
            this.positionY+=pixelPerMove
            this.getElement().css({'top': this.positionY+"px"})
            break
          case "down":
            this.positionY-=pixelPerMove
            this.getElement().css({'top': this.positionY+"px"})
            break
          case "left":
            this.positionX+=pixelPerMove
            this.getElement().css({'left': this.positionX+"px"})
            break
          case "right":
            this.positionX-=pixelPerMove
            this.getElement().css({'left': this.positionX+"px"})
            break
        }
      
        this.draw()
      }
    }


    Canvas.prototype.computeVisibleArea = function(){

      var halfW = (this.halfCanvasWidth / this.currentScale) 
      var halfH = (this.halfCanvasHeight / this.currentScale)

      this.visibleArea.x1 = Math.round((halfW * (this.currentScale -1) - this.positionX/this.currentScale))
      this.visibleArea.y1 = Math.round((halfH * (this.currentScale -1) - this.positionY/this.currentScale))

      this.visibleArea.x2 = Math.floor(this.visibleArea.x1 + halfW*2)
      this.visibleArea.y2 = Math.floor(this.visibleArea.y1 + halfH*2)

      //this.offsetOnEndOfRow = (this.canvasWidth - ((this.visibleArea.x2 - this.visibleArea.x1) * this.currentScale)) % this.currentScale
      //console.log(this.offsetOnEndOfRow)
    }

    /**
    * Updates the visible area depending on scale
    *
    */
    Canvas.prototype.draw = function(){

      
      this.computeVisibleArea()
      var area = this.parent.getAreaPixels(this.visibleArea)
      this.setAreaPixels(area)      
      this.drawGrid()
      this.drawColoredGrid()

      this.copyToClones(true)
    }


    Canvas.prototype.drawColoredGrid = function(){

      var data = this.getFullImageData()

      for(var i = 0; i < data.data.length; i+=4){
          // im grid
          if(data.data[i] == 200){
            if(data.data[i+4] == 253 ||
               data.data[i-4] == 253 ||
               data.data[i-this.canvasWidth*4] == 253 ||
               data.data[i+this.canvasWidth*4] == 253){

                data.data[i] = 0
                data.data[i+1] = 201
                data.data[i+2] = 255  

            }if(data.data[i+4+1] == 253 ||
               data.data[i-4+1] == 253 ||
               data.data[i-this.canvasWidth*4+1] == 253 ||
               data.data[i+this.canvasWidth*4+1] == 253){

                data.data[i] = 255
                data.data[i+1] = 50
                data.data[i+2] = 0  
            }
          }
      }

      for(var i = 0; i < data.data.length; i+=4){
          // im grid
          if(data.data[i+1] == 50 || data.data[i+1] == 201){
            if(data.data[i+4] != 0 &&
               data.data[i-4] != 0 &&
               data.data[i-this.canvasWidth*4] != 0 &&
               data.data[i+this.canvasWidth*4] != 0){

                data.data[i] = 200
                data.data[i+1] = 200
                data.data[i+2] = 200  

            }if(data.data[i+4+1] != 0 &&
               data.data[i-4+1] != 0 &&
               data.data[i-this.canvasWidth*4+1] != 0 &&
               data.data[i+this.canvasWidth*4+1] != 0){

                data.data[i] = 200
                data.data[i+1] = 200
                data.data[i+2] = 200  
            }
          }
          else if(data.data[i] == 253 || data.data[i+1] == 253) {

                data.data[i] = 180
                data.data[i+1] = 180
                data.data[i+2] = 180  
          }
      }

      this._putFullImageData(data)
    }

    Canvas.prototype.drawGrid = function(){
      var data = this.getFullImageData()

      for(var i = 4*this.currentScale; i < data.data.length; i+= 4*this.currentScale){
            data.data[i] = 200
            data.data[i+1] = 200
            data.data[i+2] = 200           
      }

      for(var i = 0; i < data.data.length; i += 4*this.currentScale*this.canvasWidth){
        for(var j = 0; j < this.canvasWidth*4; j+=4 ){
            data.data[i+j] = 200
            data.data[i+j+1] = 200
            data.data[i+j+2] = 200           
        }
      }


      this._putFullImageData(data)
    }

    Canvas.prototype.getAreaPixels = function(visibleArea){

      var allPixels = this.getFullImageData()
      var pixels = Array()

      // i.e (800*160*4 + 200*4) = 520000 = 200th pixel in row 160
      var start = this.canvasWidth * 4 * visibleArea.y1  + visibleArea.x1 * 4
      // i.e. (800*4*480 + 600*4) = 1538400 = 600th pixek in row 480
      var end   = this.canvasWidth * 4 * (visibleArea.y2-1) + visibleArea.x2 * 4
      var rowLength = (visibleArea.x2 - visibleArea.x1) * 4
      var rowIncrement = this.canvasWidth * 4
      var i, j

      var pixel = 0
      var rows = 0
      var width = 0

      for(i = start; i < end; i+=rowIncrement){
        for(j = i; j < i + rowLength; j++){
          pixels.push(allPixels.data[j])
          width++
        }
        rows++
      }

      return {
          pixels: pixels
        , height: rows
        , width: width/rows/4
      }
    }

    Canvas.prototype.setAreaPixels = function(area){
      var allPixels = this.getFullImageData()

      var pixelJumpWidth = 4*this.currentScale

      var i, j
      var r = 1
      var k = 0

      for(i = 0; i < area.pixels.length; i+=4){
        for(j = 0; j < this.currentScale; j++){
          allPixels.data[k ] = area.pixels[i]
          allPixels.data[k +1] = area.pixels[i+1]
          allPixels.data[k +2] = area.pixels[i+2]
          allPixels.data[k +3] = area.pixels[i+3]
          k+=4
        }

        // end of row
        if(i % (area.width * 4) == 0 && i != 0){
          if(r < this.currentScale){
            i -= area.width * 4
            r++
          }
          else{
            r = 1
          }

          //i += this.offsetOnEndOfRow * 4
        }

      }

      this._putFullImageData(allPixels)
    }

    /**
    * records last change for revert()
    */
    Canvas.prototype.storeImageInfo = function(){

      //console.log("Storing image info")

      this.lastImageInfos = new Array()
      this.lastImageInfos["pixel"] = this.getFullImageData()
      this.lastImageInfos["size"] = {
          imageWidth: this.imageWidth
        , imageHeight: this.imageHeight
        , imageXOffset: this.imageXOffset
        , imageYOffset: this.imageYOffset
      } 

    }

    /**
    * Reverts the last image modification
    * Can be used, when 'keepChangesForUndo' in constructor was set to true
    */
    Canvas.prototype.undo = function(){
      if(this.undoStack.length !== 0){
        this.redoStack.push(this.revert(this.undoStack.pop()))
        this.copyToClones()
      }
    }

    /**
    * Reverts the last undo()
    */
    Canvas.prototype.redo = function(){
      if(this.redoStack.length !== 0){
        this.undoStack.push(this.revert(this.redoStack.pop()))
        this.copyToClones()
      }
    }

    /**
    * Reverts te passed changes (used by undo() and redo())
    * @param {Object} The changes (for object details look at storeImageInfo())
    * @returns {Object} allChanges The changes for reversal
    */
    Canvas.prototype.revert = function(allChanges){

        var revert = new Array()
        var pixelRevets = new Array()
        var sizeReverts = {
            imageWidth: this.imageWidth
          , imageHeight: this.imageHeight
          , imageXOffset: this.imageXOffset
          , imageYOffset: this.imageYOffset
        }         

        var pixelChanges = allChanges["pixel"]
        var sizeChanges = allChanges["size"]      
        var pos = 0
        var imageData = this.getFullImageData()
        var x = 0

        if(pixelChanges[0] === 'diff'){
          console.log("undo using diff strategy")
          pixelRevets.push('diff')
          for(var i = 1; i < pixelChanges.length; i+=2){
            pos = pixelChanges[i]

            pixelRevets.push(pos)
            
            x=imageData.data[pos]
            x=x<<8
            x+=imageData.data[pos+1]
            x=x<<8
            x+=imageData.data[pos+2]
            x=x<<8
            x+=imageData.data[pos+3]      
            pixelRevets.push(x)


            x = pixelChanges[i+1]
            imageData.data[pos+3] = x&(255)
            x=x>>8
            imageData.data[pos+2] = x&(255)
            x=x>>8
            imageData.data[pos+1] = x&(255)
            x=x>>8
            imageData.data[pos]   = x&(255)
          }
        }else if(pixelChanges[0] === 'ImagaData'){
            console.log("undo using ImagaData strategy")
            pixelRevets.push('ImagaData')
            pixelRevets.push(this.getFullImageData().data)
            var lastPixels = pixelChanges[1]
          for(var i = 1; i < lastPixels.length; i++){
            imageData.data[i] = lastPixels[i]
          }
        }

        this.imageWidth = sizeChanges.imageWidth
        this.imageHeight = sizeChanges.imageHeight
        this.imageXOffset = sizeChanges.imageXOffset
        this.imageYOffset = sizeChanges.imageYOffset

        this._putFullImageData(imageData)

        revert["pixel"] = pixelRevets
        revert["size"] = sizeReverts

        return revert
    }

    /**
    * Finds the deviations between the passed ImageData 
    * @param {ImageData} imageDataNew the new ImageData
    * @param {ImageData} imageInfosOld the old ImagaData
    * @returns {Object} Object with differences between the two passed ImageDatas
    */
    Canvas.prototype.getDiff = function(imageDataNew, imageInfosOld){

      var diff = new Array()
      diff.push('diff');
      var allDiff = new Array()
      var rComp,gComp,bComp,aComp 
      var imageDataOld = imageInfosOld["pixel"]
      var x = 0

      for(var i = 0; i < imageDataNew.data.length; i+=4){
        rComp = imageDataNew.data[i]   === imageDataOld.data[i]
        gComp = imageDataNew.data[i+1] === imageDataOld.data[i+1]
        bComp = imageDataNew.data[i+2] === imageDataOld.data[i+2]
        aComp = imageDataNew.data[i+3] === imageDataOld.data[i+3]

        if(!(rComp && gComp && bComp && aComp)){

          x=imageDataOld.data[i]
          x=x<<8
          x+=imageDataOld.data[i+1]
          x=x<<8
          x+=imageDataOld.data[i+2]
          x=x<<8
          x+=imageDataOld.data[i+3]

          diff.push(i) // position
          diff.push(x)   // r,g,b,a
        }
      }

      // store the original ImagaData if the changed pixels are to much (for less ram)
      if(diff.length*4 > imageDataNew.data.length){
        //console.log("store diff using ImagaData strategy")
        diff.length = 0
        diff[0] = 'ImagaData'
        diff[1] = imageDataOld.data
      }else{
        //console.log("store diff using diff strategy")
      }

      allDiff['pixel'] = diff
      allDiff['size'] = imageInfosOld["size"]

      return allDiff

    }

    /**
    * This method should be called, when there is a change in the image.
    * The canges will be passed to the clones and recorded for undo()
    *  -> if 'keepChangesForUndo' in constructor was set to true
    *
    */
    Canvas.prototype.registerContentModification = function(){

      this.copyToClones()

      // empty redo stack
      this.redoStack.length = 0

      if(this.keepChangesForUndo){
        var diff = this.getDiff(this.getFullImageData(), this.lastImageInfos)

        if(diff['pixel'].length > 0){
          this.undoStack.push(diff)
          //console.log("push diff to undo stack ("+diff['pixel'].length+")")
    
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

    /**
    * Draws the passed ImageData into _this canvas
    *
    * Set the second parameter, when the metod is passed to a callback
    * @param {ImageData} img image to draw
    * @param {canvas} _this The canvas onto the image shall be drawn 
    *
    */
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

    /**
    * @private
    * Copies the content (including scales) from the passed canvas to this canvas. 
    * For internal usage, if u want to copy a canvas use copy()
    * @param {Canvas} otherCanvas 
    * @param {boolean} doNotDraw 
    */
    Canvas.prototype._copy = function(otherCanvas, doNotDraw){
        this.copy(otherCanvas)
        if(!doNotDraw)
          this.registerContentModification()
    }

    /** 
    * Updates this canvas by the centent of the passed canvas
    * Regarding width, height, offsets (x,y) and pixelinformations
    *
    * @param {Canvas} otherCanvas  the canvas this should be updated to
    * @param {boolean} doNotDraw  true if width, height and offsets shold be set only
    */
    Canvas.prototype.copy = function(otherCanvas, doNotDraw){

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
        this.getContext().scale(scale, scale)
        this.getContext().drawImage(newCanvas, this.imageXOffset*1/scale, this.imageYOffset*1/scale)

        this.getContext().restore()
      }
      this.copyToClones()
    }


    /** 
    * Updates this canvas by the centent of the passed canvas
    * Regarding width, height and pixelinformations
    *
    * @param {Canvas} otherCanvas  the canvas this should be updated to
    * @param {boolean} doNotDraw  true if width, height and offsets shold be set only
    */
    Canvas.prototype.fullCopy = function(otherCanvas, doNotDraw){

      var scaleX = (this.canvasWidth / otherCanvas.canvasWidth).toFixed(4)
      var scaleY = (this.canvasHeight / otherCanvas.canvasHeight).toFixed(4)

      var scale = scaleX < scaleY ? scaleX : scaleY;
      // do not scale, when original image is scmaller than canvas
      scale = scale > 1.0 ? 1.0 : scale;

      this.imageHeight  = otherCanvas.canvasHeight * scale
      this.imageWidth   = otherCanvas.canvasWidth * scale

      if(!doNotDraw){
        // save current context state, to restore changes in scaling later
        this.getContext().save()
        var newCanvas = $("<canvas>")
            .attr("width", otherCanvas.canvasWidth)
            .attr("height", otherCanvas.canvasHeight)[0];
        newCanvas.getContext("2d").putImageData(otherCanvas.getFullImageData(), 0, 0);

        this.clear()      
        this.getContext().scale(scale, scale)
        this.getContext().drawImage(newCanvas, 0, 0)

        this.getContext().restore()
      }
      this.copyToClones()
    }



    /**
    * Returns the ImageData of this canvas without the image borders (the pure image)
    * @returns {ImageData} ImageData without borders
    */
    Canvas.prototype.getImageData = function(){
      return this.getContext().getImageData(this.imageXOffset,this.imageYOffset,this.imageWidth, this.imageHeight)
    }

    /**
    * Returns the ImageData of this canvas including the image borders (whole canvas content)
    * @returns {ImageData} ImageData of this canvas
    */
     Canvas.prototype.getFullImageData = function(){
      return this.getContext().getImageData(0,0,this.canvasWidth, this.canvasHeight)
    }   

    /**
    * Returns a copy as a new HTML5 canvas element
    * @returns {HTML5 Canvas} copy of this canvas
    */
    Canvas.prototype.getHtmlElementCopy = function(){
      var newCanvas = $("<canvas>")
        .attr("width", this.imageWidth)
        .attr("height", this.imageHeight)[0]

      newCanvas.getContext("2d").putImageData(this.getImageData(), 0, 0)

      return newCanvas
    }

    /**
    * Returns the DOM HTML5 canvas element representation of this canvas
    * @returns {HTML5 Canvas} representation in DOM of this canvas
    */
    Canvas.prototype.getElement = function(){
      return $('#'+this.id)
    }

    Canvas.prototype.getContext = function(){
      return this.ctx;
    }


    /*
    * Writes the passed imageData to this canvas, regarding the offsets
    */
    Canvas.prototype.putImageData = function(imageData){
      this.clear()
      this.getContext().putImageData(imageData,this.imageXOffset,this.imageYOffset)
      this.registerContentModification()
    }

    /**
    * @private
    * Paint over the whole canvas, ignoring the offset. 
    * @param {ImageData} imageData
    */
    Canvas.prototype._putFullImageData = function(imageData){
      this.clear()
      this.getContext().putImageData(imageData,0,0)
    }    

    Canvas.prototype.updateSize = function(width, height) {  
      this.ctx.canvas.width = this.canvasWidth = width
      this.ctx.canvas.height = this.canvasHeight = height
    }

    /*
    * highlight for dragover
    */
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


    /**
    * Draws a line into the canvas
    * @param {Object} startPoint Object with x and y coordinate of start point
    * @param {Object} endPoint Object with x and y coordinate of end point
    */
    Canvas.prototype.drawLine = function(startPoint, endPoint){
      this.ctx.moveTo(startPoint.x,startPoint.y);
      this.ctx.lineTo(endPoint.x,endPoint.y);
      this.ctx.stroke();
    }

    /**
    * Draws a line into the canvas
    * @param {String} text 
    * @param {Object} pos Object with x and y coordinate of the center (pivot point)
    * @param {String} color
    * @param {float} rot clockwise rotation in radian (45° = Math.PI/4, 90° = Math.PI/2, 180° = Math.PI, a.s.o.) 
    */
    Canvas.prototype.drawText = function(text, pos, color, rot){
      this.ctx.font = "bold 12px sans-serif"
      this.ctx.textAlign = 'center'
      this.ctx.textBaseline = 'middle'
      // cut if its a number
      if(!isNaN(text*2))
        text = text.toFixed(1)

      this.ctx.fillStyle = color;

      if(!!rot){
        this.ctx.save()
        this.ctx.translate(pos.x, pos.y)
        this.ctx.rotate(rot)
        this.ctx.fillText(text, 0, 0)
        this.ctx.restore()
      }
      else
        this.ctx.fillText(text, pos.x, pos.y);
    }

    /**
    * @returns {integer} The width of the image in the canvas (without potential borders)
    */
    Canvas.prototype.getImageWidth = function(){
      return this.imageWidth
    }

    /**
    * @returns {integer} The height of the image in the canvas (without potential borders)
    */
    Canvas.prototype.getImageHeight = function(){
      return this.imageHeight
    }

    Canvas.prototype.getCanvasWidth = function(){
      return this.canvasWidth
    }

    Canvas.prototype.getCanvasHeight = function(){
      return this.canvasHeight
    }    

    /**
    * @param {Canvas} adds the passed Canvas to the list of 
    * clones, which will be updated on every modification of image content
    */
    Canvas.prototype.addClone = function(clone){
      this.clones.push(clone)
    }

    Canvas.prototype.copyToClones = function(full){
      if(!!this.clones)
        for(var c = 0; c < this.clones.length; c++)
          if(full)
            this.clones[c].fullCopy(this)
          else 
            this.clones[c].copy(this)
    }
    


// --------------------------------------
    return Canvas
  })()
  return module.exports = Canvas
})




