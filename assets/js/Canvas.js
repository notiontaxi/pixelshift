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
      this.oldVisibleWidth = 800
      this.oldVisibleHeight = 640      

      this.gotNewImage = true

      this.ctx.font = "bold 12px sans-serif"
      this.ctx.textAlign = 'center'
      this.ctx.textBaseline = 'middle'

      this.oldImageData = this.getImageData()
      this.gotNewImage = true

      this.currentScale = 1

      this.clones = new Array()
      this.undoStack = new Array()
      this.redoStack = new Array()

      this.keepChangesForUndo = keepChangesForUndo === true ? true : false
      this.storeImageInfo()

      this.alphaGrid = true
      this.coloredGrid = false
      this.gridZoomLevel = 3

      this.parent = null
    }

    Canvas.prototype.setParent = function(parent){
      this.parent = parent
    }


    Canvas.prototype.zoomIn = function(){
      if(this.currentScale < 50){
            this.currentScale++
        this.draw()
      }
    }

    Canvas.prototype.zoomOut = function(){
      if(this.currentScale > 1.00){
        this.currentScale-- 

        if(this.currentScale === 1.00)
          this.zoomReset()
        else
          this.draw()
      }
    }


    Canvas.prototype.zoomReset = function(){
        this.currentScale = 1.00
        this.computeVisibleArea()
        this.visibleArea.x1 = 0
        this.visibleArea.y1 = 0
        this.draw()
    }

    /**
    * Moves the zoomed canvas (till the edge is reached)
    */
    Canvas.prototype.moveCanvas = function(direction){

      if(this.currentScale !== 1){
        var canvas = this.getElement()
        var pixelPerMove = 10//this.currentScale

        switch(direction){
          case "up":
            if(this.visibleArea.y1 > 0){
              this.visibleArea.y1-=pixelPerMove
              this.draw()
            }
            break
          case "down":
            if(this.visibleArea.y2 < this.canvasHeight){
              this.visibleArea.y1+=pixelPerMove
              this.draw()
            }
            break
          case "left":
            if(this.visibleArea.x1 > 0){
              this.visibleArea.x1-=pixelPerMove
              this.draw()
            }
            break
          case "right":
          if(this.visibleArea.x2 < this.canvasWidth){
            this.visibleArea.x1+=pixelPerMove
            this.draw()
          }
            break
        }
      
        
      }
    }


    Canvas.prototype.computeVisibleArea = function(){

      var width = Math.floor(this.canvasWidth / this.currentScale)
      var height = Math.floor(this.canvasHeight / this.currentScale)

      var widthDiff = this.oldVisibleWidth - width
      var heightDiff = this.oldVisibleHeight - height

      this.visibleArea.x1 += (widthDiff - (widthDiff%2)) /2
      this.visibleArea.y1 += (heightDiff- (heightDiff%2))/2

      this.visibleArea.x2 = width + this.visibleArea.x1
      this.visibleArea.y2 = height + this.visibleArea.y1

      this.oldVisibleWidth = this.visibleArea.x2 - this.visibleArea.x1
      this.oldVisibleHeight = this.visibleArea.y2 - this.visibleArea.y1

      console.log("widthDiff: "+widthDiff)
      console.log("heightDiff: "+heightDiff)
    }

    /**
    * Updates the visible area depending on scale
    *
    */
    Canvas.prototype.draw = function(){
      
      this.computeVisibleArea()
      var area = this.parent.getAreaPixels(this.visibleArea)
      this.setAreaPixels(area)

      if(this.currentScale >= this.gridZoomLevel  && this.drawGrid){
        if(this.coloredGrid)
          this.drawColoredGrid()
        else if(this.alphaGrid)
          this.drawGrid()
      }     

      this.copyToClones(true)
    }


    Canvas.prototype.drawColoredGrid = function(){
      var data = this.getFullImageData()

      // number of horizontal lines in y direction 
      var xLines = Math.floor(this.canvasWidth  / this.currentScale)
      // number of vertical lines in x direction
      var yLines = Math.floor(this.canvasHeight / this.currentScale)
      var pos = 0

      var jumpY = this.canvasWidth*4*this.currentScale
      var jumpX = this.currentScale*4

      // horizontal
      for(var xL = 0; xL <= yLines; xL++){
        for(var w = 0; w < this.canvasWidth*4; w+=4){
          // lines * jump length per line + curren pixel position 
          pos = xL*jumpY + w
         
          if((data.data[pos] == 252 && data.data[pos-this.canvasWidth*4] ==   0) ||
             (data.data[pos] ==   0 && data.data[pos-this.canvasWidth*4] == 252)){
            data.data[pos] = 255
            data.data[pos+1] = 0
            data.data[pos+2] = 0
            data.data[pos+3] = 255
          }else if((data.data[pos] == 253 && data.data[pos-this.canvasWidth*4] ==   0) ||
                   (data.data[pos] ==   0 && data.data[pos-this.canvasWidth*4] == 253)){
            data.data[pos] = 0
            data.data[pos+1] = 255
            data.data[pos+2] = 0
            data.data[pos+3] = 255
          }else{
            data.data[pos+3] -= 100
          }
          
        }
      }
      
      // vertical
      for(var h = 0; h < this.canvasHeight*4; h++){
        for(var yL = 0; yL <= xLines; yL++){
          // current height * width + current vertical line number * jump length depending on scale
          pos = h*this.canvasWidth*4 + yL*jumpX
          if((data.data[pos] == 252 && data.data[pos-4] ==   0) ||
             (data.data[pos] ==   0 && data.data[pos-4] == 252)){
            data.data[pos] = 255
            data.data[pos+1] = 0
            data.data[pos+2] = 0
            data.data[pos+3] = 255
          }else if((data.data[pos] == 253 && data.data[pos-4] ==   0) ||
                   (data.data[pos] ==   0 && data.data[pos-4] == 253)){
            data.data[pos] = 0
            data.data[pos+1] = 255
            data.data[pos+2] = 0
            data.data[pos+3] = 255
          }else{
            data.data[pos+3] -= 100
          }       
        }
      }

      this._putFullImageData(data)
    }

    Canvas.prototype.drawGrid = function(){
      var data = this.getFullImageData()

      // number of horizontal lines in y direction 
      var xLines = Math.floor(this.canvasWidth  / this.currentScale)
      // number of vertical lines in x direction
      var yLines = Math.floor(this.canvasHeight / this.currentScale)
      var pos = 0

      var jumpY = this.canvasWidth*4*this.currentScale
      var jumpX = this.currentScale*4

      // horizontal
      for(var xL = 0; xL <= yLines; xL++){
        for(var w = 0; w < this.canvasWidth*4; w+=4){
          // lines * jump length per line + curren pixel position 
          pos = xL*jumpY + w
          // reduce alpha
          data.data[pos+3] -= 100
        }
      }
      
      // vertical
      for(var h = 0; h < this.canvasHeight*4; h++){
        for(var yL = 0; yL <= xLines; yL++){
          // current height * width + current vertical line number * jump length depending on scale
          pos = h*this.canvasWidth*4 + yL*jumpX
          // reduce alpha
          data.data[pos+3] -= 100         
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

      this.clear()
      var allPixels = this.getFullImageData()
      
      // number of horizontal pixels in y direction 
      var xPixelAmount = area.width
      // number of vertical pixels in x direction
      var yPixelAmount = area.height

      var jumpY = this.canvasWidth*4*this.currentScale
      var jumpX = this.currentScale*4      
      var positionSource = 0
      var positionDestination = 0

      var yP, yRepeat, xP, xRepeat, currentY, currentX, currentYRepeat, currentXRepeat

      for(yP = 0; yP < yPixelAmount; yP++){
        currentY = yP*this.canvasWidth*4*this.currentScale
        for(yRepeat = 0; yRepeat < this.currentScale; yRepeat++){
          currentYRepeat = yRepeat*this.canvasWidth*4
          for(xP = 0; xP < xPixelAmount; xP++){
            currentX = xP*this.currentScale*4
            for(xRepeat = 0; xRepeat < this.currentScale; xRepeat++){
              currentXRepeat = xRepeat*4
              positionSource = yP*xPixelAmount*4 + xP*4
              positionDestination = currentY + currentYRepeat + currentX + currentXRepeat

              allPixels.data[positionDestination] = area.pixels[positionSource]
              allPixels.data[positionDestination+1] = area.pixels[positionSource+1]
              allPixels.data[positionDestination+2] = area.pixels[positionSource+2]
              allPixels.data[positionDestination+3] = area.pixels[positionSource+3]

            }
          }
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




