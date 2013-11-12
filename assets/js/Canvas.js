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

    /**
    * records last change for undo()
    */
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

          pixelRevets.push({
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
    * Updates this canvas ba the properties of the passed canvas
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
        this.scaling = scale        
        this.getContext().scale(scale, scale)
        this.getContext().drawImage(newCanvas, this.imageXOffset*1/scale, this.imageYOffset*1/scale)

        this.getContext().restore()
      }
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




