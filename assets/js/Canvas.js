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

      this.currentScale = 1.0
      
      this.id = id
      this.keepChangesForUndo = keepChangesForUndo
      this.cv = document.getElementById(this.id)
      this.ctx = this.cv.getContext('2d')

      this.canvasHeight = this.cv.height 
      this.canvasWidth = this.cv.width
      this.imageHeight = this.cv.height 
      this.imageWidth = this.cv.width
      this.updateCurrentImageSize()

      this.visibleArea = {
          x1: 0
        , y1: 0
        , x2: this.canvasWidth        
        , y2: this.canvasHeight
      }
      this.oldVisibleWidth = this.canvasWidth
      this.oldVisibleHeight =  this.canvasHeight      

      this.pixelPerMove = 50 // change this value for bigger or smaller steps

      this.gotNewImage = true

      this.ctx.font = "bold 12px sans-serif"
      this.ctx.textAlign = 'center'
      this.ctx.textBaseline = 'middle'

      this.oldImageData = this.getImageData()
      this.gotNewImage = true

      this.scale = 1

      this.clones = new Array()
      this.undoStack = new Array()
      this.redoStack = new Array()

      this.storeImageInfo()

      this.alphaGrid = false
      this.points = null

      this.gridZoomLevel = 1

      this.originalIsBackground = false
      this.filling = true

      this.curveLimit = 1.0
      this.alpha = 0.55

      this.parent = null
    }

    /**
    * If you wanna know scale of parent i.e.
    */
    Canvas.prototype.setParent = function(parent){
      this.parent = parent
    }


    Canvas.prototype.zoomIn = function(){
      // workaround ToDo: fix issues with negative zoom
      if(!this.previeMode){
        if(this.currentScale < 50){

          if(this.currentScale < 1)
            this.currentScale = this.currentScale + 0.1
          else
            this.currentScale++

          if(this.pixelPerMove  > 4)
            this.pixelPerMove -= 4

          this.currentScale = parseFloat(this.currentScale.toFixed(1))
          this.updateCurrentImageSize()
          this.draw()
        }
      }
    }

    Canvas.prototype.zoomOut = function(){
      // workaround ToDo: fix issues with negative zoom
      if(!this.previeMode){      
        if(this.currentScale > .1){

          if(this.currentScale <= 1)
            this.currentScale -= .1
          else
            this.currentScale--

          if(this.pixelPerMove < 50 && this.currentScale < 13)
            this.pixelPerMove += 4

          this.currentScale = parseFloat(this.currentScale.toFixed(1))
          this.updateCurrentImageSize()

          if(this.currentScale === 1.00)
            this.zoomReset()

          this.draw()
        }
      }
    }


    Canvas.prototype.zoomReset = function(){
      // workaround ToDo: fix issues with negative zoom
      if(!this.previeMode){        
        this.currentScale = 1.0
        this.updateCurrentImageSize()
        this.computeVisibleArea()
        this.visibleArea.x1 = 0
        this.visibleArea.y1 = 0

        this.draw()
      }
    }

    Canvas.prototype.updateCurrentImageSize = function(){
      this.currentImageWidth  = this.imageWidth * this.currentScale
      this.currentImageHeight = this.imageHeight * this.currentScale     
    }

    /**
    * Moves the zoomed canvas (till the edge is reached)
    */
    Canvas.prototype.moveCanvas = function(direction){
      // workaround ToDo: fix issues with negative zoom
      if(!this.previeMode){
        var canvas = this.getElement()
        var width = Math.floor(this.imageWidth * this.currentScale)
        var height = Math.floor(this.imageHeight * this.currentScale)        
        var bound = 0
        switch(direction){
          case "up":
            if(this.visibleArea.y1 > 0){
              this.visibleArea.y1 -= this.pixelPerMove
              this.visibleArea.y1 = this.visibleArea.y1 < 0 ? 0 : this.visibleArea.y1
            }
            break
          case "down":
            bound = Math.floor((height - this.canvasHeight) / this.currentScale)

            if(this.visibleArea.y1 < bound){
              this.visibleArea.y1 += this.pixelPerMove
              this.visibleArea.y1 = this.visibleArea.y1 > bound ? bound : this.visibleArea.y1
            }
            break
          case "left":
            if(this.visibleArea.x1 > 0){
              this.visibleArea.x1 -= this.pixelPerMove
              this.visibleArea.x1 = this.visibleArea.x1 < 0 ? 0 : this.visibleArea.x1
            }
            break
          case "right":
            bound = Math.floor((width - this.canvasWidth) / this.currentScale)
            if(this.visibleArea.x1 < bound){
              this.visibleArea.x1 += this.pixelPerMove
              this.visibleArea.x1 = this.visibleArea.x1 > bound ? bound : this.visibleArea.x1
            }
            break
          }

          this.draw()

          this.checkVisibleBoundaries()
      }
    }

    Canvas.prototype.checkVisibleBoundaries = function(){
      var enclosement = this.CanvasEnclosesImage()

        if(enclosement.x){
          this.visibleArea.x1 = 0
        }else{
          var width = Math.floor(this.imageWidth * this.currentScale)
          var boundX = Math.floor((width - this.canvasWidth) / this.currentScale) 
          this.visibleArea.x1 = this.visibleArea.x1 < 0 ? 0 : this.visibleArea.x1
          this.visibleArea.x1 = this.visibleArea.x1 > boundX ? boundX : this.visibleArea.x1
        }

        if(enclosement.y){
          this.visibleArea.y1 = 0     
        }
        else{
          var height = Math.floor(this.imageHeight * this.currentScale) 
          var boundY = Math.floor((height - this.canvasHeight) / this.currentScale) 
          this.visibleArea.y1 = this.visibleArea.y1 < 0 ? 0 : this.visibleArea.y1
          this.visibleArea.y1 = this.visibleArea.y1 > boundY ? boundY : this.visibleArea.y1
        }
    }

    /**
    * Checks if the canvas encloses theh image in x/y direction
    */
    Canvas.prototype.CanvasEnclosesImage = function(){
      return {
          x: this.imageWidth*this.currentScale <= this.canvasWidth
        , y: this.imageHeight*this.currentScale <= this.canvasHeight
      }
    }

    Canvas.prototype.computeVisibleArea = function(){

      var width = Math.floor(this.canvasWidth / this.currentScale)
      var height = Math.floor(this.canvasHeight / this.currentScale)

      width = width > this.imageWidth ? this.imageWidth : width
      height = height > this.imageHeight ? this.imageHeight : height
      
      var widthDiff = this.oldVisibleWidth - width
      var heightDiff = this.oldVisibleHeight - height

      this.visibleArea.x1 += (widthDiff  - (widthDiff  % 2 )) / 2
      this.visibleArea.y1 += (heightDiff - (heightDiff % 2 )) / 2

      this.checkVisibleBoundaries()

      this.visibleArea.x2 = width + this.visibleArea.x1
      this.visibleArea.y2 = height + this.visibleArea.y1

      this.oldVisibleWidth = this.visibleArea.x2 - this.visibleArea.x1
      this.oldVisibleHeight = this.visibleArea.y2 - this.visibleArea.y1
    }

    /**
    * Updates the visible area depending on scale
    * If an imagedata is passed it will be rendered instead of the parents image data.
    * Use this argument for previes.
    * @param {ImageData} imageData : the image data which will be drawn (used for previews)
    */
    Canvas.prototype.draw = function(imageData){

      // positive zoom is implemented by pixe repetition, negative is calculated by parent via getImageData()

      if(!!imageData){
        this.previewImageData = imageData
        this.previeMode = true

        this.ctx.putImageData(imageData,0,0)

      }else{
        console.log(this.currentScale)
        console.log(this.id)
        var zoomAmountToPass = this.currentScale >= 1 ? 0 : this.currentScale
        imageData = this.parent.getImageData(zoomAmountToPass)
        this.previeMode = false

        if(this.currentScale < 1){
          this.clear()
          this.ctx.putImageData(imageData,0,0)
        }
        //pixel repetation and pixels of viewport
        else if(this.currentScale >= 1){
          var area = this.getAreaPixels()
          this.setAreaPixels(area)
        }

      }



      if(this.currentScale >= this.gridZoomLevel  && this.drawGrid){
        if(this.alphaGrid)
          this.drawGrid()

        if(!!this.paths){
          this.originalIsBackground = true
          this.drawBezierPaths()
          this.drawPaths()
        }else{
          this.originalIsBackground = false
        }
      }

      this.copyToClones(true)

    }


    Canvas.prototype.drawSinglePixel = function(pixel,outline,i ,withLine, secondPixel){
      var pos = this.toImageGaussianCoords(pixel.vertice)
      var gPos = {x: pos.x * this.currentScale , y: pos.y * this.currentScale  }
      var pointSize = Math.ceil((this.currentScale*2) / 15)
      var color

      if(outline)
        color = {r: 20, g: 150, b: 20, a: 255}
      else
        color = {r: 20, g: 20, b: 230, a: 255}
      
      if(withLine){
        var pos2 = this.toImageGaussianCoords(secondPixel.vertice)
        this.drawLine(gPos, {x: pos2.x * this.currentScale , y: pos2.y * this.currentScale }, 'black')
      }

      this.drawPoint(gPos, pointSize, color)
      this.drawText(i, gPos, 'white')
      gPos.y += this.currentScale/4
      gPos.y += 2
      //this.drawText('('+pixel.gaussCoords.x+','+pixel.gaussCoords.y+')', gPos, 'white')
    }

    Canvas.prototype.drawPaths = function(){
      //console.log('draw paths')
      var paths = this.paths
      var currentPath = null
      var currentPoints = null

      for(var i = 0; i < paths.length; i++){
        currentPath = paths[i]

        if(this.pathType == 'full')
          currentPoints = currentPath.edges
        else if(this.pathType == 'straight')
          currentPoints = currentPath.getStraightPoints()
        else if(this.pathType == 'allowed')
          currentPoints = currentPath.getAllowedPoints()
        if(this.pathType != 'none'){
          for(var p = 0; p < currentPoints.length; p++){
            if(p+1 < currentPoints.length )
              this.drawSinglePixel(currentPoints[p], currentPath.isOutline,p , true, currentPoints[p+1])
          }
        }
      }
    }

    Canvas.prototype.drawBezierPaths = function(){
      //console.log('draw bezier')
      var switched = Array()
      var paths = this.paths
      var currentPath 

      for(var i = 0; i < paths.length; i++){
        currentPath = paths[i].getBezierPath(this.alpha)
        this.ctx.beginPath()

        this.ctx.moveTo((currentPath[0].p1.x-this.visibleArea.x1)*this.currentScale,(currentPath[0].p1.y-this.visibleArea.y1)*this.currentScale)
        for(var p = 0; p < currentPath.length; p++){  
          if(currentPath[p].alpha < this.curveLimit)
            this.ctx.bezierCurveTo( (currentPath[p].cp1.x-this.visibleArea.x1)*this.currentScale, (currentPath[p].cp1.y-this.visibleArea.y1)*this.currentScale,
                                    (currentPath[p].cp2.x-this.visibleArea.x1)*this.currentScale, (currentPath[p].cp2.y-this.visibleArea.y1)*this.currentScale,
                                    (currentPath[p].p2.x-this.visibleArea.x1)*this.currentScale,  (currentPath[p].p2.y-this.visibleArea.y1)*this.currentScale
                                  )
          else
            this.ctx.lineTo((currentPath[p].p2.x-this.visibleArea.x1)*this.currentScale,(currentPath[p].p2.y-this.visibleArea.y1)*this.currentScale)
        }
      this.ctx.closePath()
      this.ctx.lineWidth = 5
      if(this.filling){
        this.ctx.fillStyle = paths[i].isOutline ? 'black' : 'white'
        this.ctx.fill()
      }
      this.ctx.strokeStyle = paths[i].isOutline ? 'blue' : 'red'
      this.ctx.stroke()

      }

    }    

    /**
    * pixel in image NOT in full data
    */
    Canvas.prototype.pixelWithinVisibleBounds = function(pixel){
      var coords = this.toImageGaussianCoords(pixel)
      return this.isWithinXBounds(coords.x) && this.isWithinYBounds(coords.y)
    }

    Canvas.prototype.isWithinXBounds = function(x){
      var result = x >= 0 && x <= this.canvasWidth/this.currentScale 
      return result
    }

    Canvas.prototype.isWithinYBounds = function(y){
      var result =  y >= 0 && y <= this.canvasHeight/this.currentScale 
      return result
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

    Canvas.prototype.getAreaPixels = function(){

      var allPixels
      this.computeVisibleArea()

      if(this.previeMode){
        allPixels = this.previewImageData
        var rowIncrement = this.imageWidth * 4        
      }else{
        allPixels = this.parent.getImageData()
        var rowIncrement = this.parent.imageWidth * 4
      }

      var visibleArea = this.visibleArea
      var pixels = Array()
      
      var start = rowIncrement * visibleArea.y1  + visibleArea.x1 * 4 
 
      var end   = rowIncrement * (visibleArea.y2) + visibleArea.x2 * 4 
      var rowLength = (visibleArea.x2 - visibleArea.x1) * 4 + 4
      
      var i, j
      var test = 0

      var pixel = 0
      var rows = 0
      var width = 0

      for(i = start; i < end; i+=rowIncrement){
        for(j = i; j < i + rowLength; j++){
          pixels.push(allPixels.data[j])
          if(allPixels.data[j] == 0)
            test++
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

      var pixelRepeat = this.currentScale*4  
      var positionSource = 0
      var positionDestination = 0
      var yP, yRepeat, xP, xRepeat, currentY, currentX, currentYRepeat

      for(yP = 0; yP < yPixelAmount*4; yP+=4){
        currentY = yP*this.canvasWidth*this.currentScale
        for(yRepeat = 0; yRepeat < pixelRepeat; yRepeat+=4){
          currentYRepeat = yRepeat*this.canvasWidth
          for(xP = 0; xP < xPixelAmount*4; xP+=4){
            currentX = xP*this.currentScale
            for(xRepeat = 0; xRepeat < pixelRepeat; xRepeat+=4){
              positionSource = yP*xPixelAmount + xP
              positionDestination = currentY + currentYRepeat + currentX + xRepeat

              allPixels.data[positionDestination] = area.pixels[positionSource]
              allPixels.data[positionDestination+1] = area.pixels[positionSource+1]
              allPixels.data[positionDestination+2] = area.pixels[positionSource+2]
              if(this.originalIsBackground)
                allPixels.data[positionDestination+3] = 50
              else
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
      this.lastImageInfos = new Array()
      this.lastImageInfos["pixel"] = this.getFullImageData()
      this.lastImageInfos["size"] = {
          imageWidth: this.imageWidth
        , imageHeight: this.imageHeight
      } 
    }

    /**
    * Reverts the last image modification
    * Can be used, when 'keepChangesForUndo' in constructor was set to true
    */
    Canvas.prototype.undo = function(){
      if(this.undoStack.length !== 0){
        this.redoStack.push(this.revert(this.undoStack.pop()))
        this.drawClones()
      }
    }

    /**
    * Reverts the last undo()
    */
    Canvas.prototype.redo = function(){
      if(this.redoStack.length !== 0){
        this.undoStack.push(this.revert(this.redoStack.pop()))
        this.drawClones()
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
        }         

        var pixelChanges = allChanges["pixel"]
        var sizeChanges = allChanges["size"]      
        var pos = 0
        var imageData = this.getFullImageData()
        var x = 0

        if(pixelChanges[0] === 'diff'){
          //console.log("undo using diff strategy")
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
            //console.log("undo using ImagaData strategy")
            pixelRevets.push('ImagaData')
            pixelRevets.push(this.getFullImageData().data)
            var lastPixels = pixelChanges[1]
          for(var i = 1; i < lastPixels.length; i++){
            imageData.data[i] = lastPixels[i]
          }
        }

        this.imageWidth = sizeChanges.imageWidth
        this.imageHeight = sizeChanges.imageHeight

        this._putFullImageData(imageData)
        this.storeImageInfo()

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
      diff.push('diff'); // diff strategy marker
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
        diff[0] = 'ImagaData' // imageData strategy marker
        diff[1] = imageDataOld.data
      }else{
        // keep computet diff
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

      // empty redo stack
      this.redoStack.length = 0

      if(this.keepChangesForUndo){
        var diff = this.getDiff(this.getFullImageData(), this.lastImageInfos)

        if(diff['pixel'].length > 1){
          this.undoStack.push(diff)
          //console.log("push diff to undo stack ("+diff['pixel'].length+")")
    
          // avoid big data mass
          if(this.undoStack.length > 20){
            this.undoStack.shift()
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
    Canvas.prototype.drawImage = function(img, _this, scaleToCanvas){
      if(!_this)
        var _this = this

      _this.paths = null
      _this.imageHeight = 0
      _this.imageWidth = 0

      // ToDo: no maximum image size
      // if(!!scaleToCanvas)
      // {
        if(img.width > img.height)
        {
          if(img.width >= _this.cv.width){
            _this.imageHeight = Math.round(img.height * (_this.cv.width/img.width))
            _this.imageWidth = _this.cv.width
          }else{
            _this.imageWidth = img.width
            _this.imageHeight = img.height
          }
        } else {
          if(img.height >= _this.cv.height){
            _this.imageHeight = _this.cv.height
            _this.imageWidth = Math.round(img.width * (_this.cv.height/img.height))
          }else{
            _this.imageHeight = img.height
            _this.imageWidth = img.width  
          }
        }
      // }else{
      //   _this.imageHeight = img.height
      //   _this.imageWidth = img.width
      // }

      _this.gotNewImage = true
      _this.clear()

      $("#"+_this.id).css({
          width: _this.imageWidth
        , height: _this.imageHeight
      })
      _this.cv.width = _this.imageWidth
      _this.cv.height = _this.imageHeight
      _this.getContext().drawImage(img, 0, 0, _this.imageWidth, _this.imageHeight)
      _this.registerContentModification()
      _this.drawClones()
    }

    /**
    * @private
    * Copies the content (including scales) from the passed canvas to this canvas. 
    * For internal usage, if u want to copy a canvas use copy()
    * @param {Canvas} otherCanvas 
    * @param {boolean} doNotDraw 
    */
    /*
    Canvas.prototype._copy = function(otherCanvas, doNotDraw){
        this.copy(otherCanvas)
        if(!doNotDraw)
          this.registerContentModification()
    }*/

    /** 
    * Updates this canvas by the centent of the passed canvas
    * Regarding width, height, offsets (x,y) and pixelinformations
    *
    * @param {Canvas} otherCanvas  the canvas this should be updated to
    * @param {boolean} doNotDraw  true if width, height and offsets shold be set only
    */
    Canvas.prototype.copy = function(otherCanvas, doNotDraw, scaled){

      var scaleX = (this.canvasWidth / otherCanvas.canvasWidth).toFixed(4)
      var scaleY = (this.canvasHeight / otherCanvas.canvasHeight).toFixed(4)

      this.scale = scaleX < scaleY ? scaleX : scaleY;
      // do not scale, when original image is scmaller than canvas
      this.scale = this.scale > 1.0 ? 1.0 : this.scale;
      //this.scale = this.scale  - this.scale % .5 // roud up to .5 step

      this.imageHeight  = otherCanvas.imageHeight * this.scale
      this.imageWidth   = otherCanvas.imageWidth * this.scale

      if(!doNotDraw){
        // save current context state, to restore changes in scaling later
        this.getContext().save()
        var newCanvas = $("<canvas>")
            .attr("width", otherCanvas.imageWidth)
            .attr("height", otherCanvas.imageHeight)[0];
        newCanvas.getContext("2d").putImageData(otherCanvas.getImageData(), 0, 0);

        this.clear()      
        this.getContext().scale(this.scale, this.scale)
        this.getContext().drawImage(newCanvas, 0, 0)

        this.getContext().restore()
      }
    }

    /** 
    * Updates this canvas only with image properties
    * @param {Canvas} otherCanvas  the canvas this should be updated to
    */
    Canvas.prototype.copyImageProperties = function(otherCanvas){
      this.paths        = otherCanvas.paths
      this.originalIsBackground  = otherCanvas.originalIsBackground 
      this.imageHeight  = otherCanvas.imageHeight
      this.imageWidth   = otherCanvas.imageWidth
    }    


    /** 
    * Updates this canvas by the centent of the passed canvas
    * Regarding width, height and pixelinformations
    *
    * @param {Canvas} otherCanvas  the canvas this should be updated to
    * @param {boolean} doNotDraw  true if width, height and offsets shold be set only
    */
    Canvas.prototype.fullCopy = function(otherCanvas, doNotDraw){

      var scaleX = this.canvasWidth / otherCanvas.canvasWidth
      var scaleY = this.canvasHeight / otherCanvas.canvasHeight

      this.scale = scaleX < scaleY ? scaleX : scaleY;
      // do not scale, when original image is scmaller than canvas
      this.scale = this.scale > 1.0 ? 1.0 : this.scale;
      //this.scale += .5 - this.scale % .5 // roud up to .5 step
      
      this.imageHeight  = otherCanvas.canvasHeight * this.scale
      this.imageWidth   = otherCanvas.canvasWidth * this.scale

      if(!doNotDraw){
        // save current context state, to restore changes in scaling later
        this.getContext().save()
        var newCanvas = $("<canvas>")
            .attr("width", otherCanvas.canvasWidth)
            .attr("height", otherCanvas.canvasHeight)[0];
        newCanvas.getContext("2d").putImageData(otherCanvas.getFullImageData(), 0, 0);

        this.clear()      
        this.getContext().scale(this.scale, this.scale)
        this.getContext().drawImage(newCanvas, 0, 0)

        this.getContext().restore()
      }

    }

    Canvas.prototype.copyParent = function(){

      this.putImageData(this.parent.getImageData())

    }

    /**
    * Returns the ImageData of this canvas without the image borders (the pure image)
    * @returns {ImageData} ImageData without borders
    */
    Canvas.prototype.getImageData = function(scale){
      
      var imageData

      if(isNumber(scale) && scale !== 0){
        // compute scaled image data
        imageData = this.getScaledImageData(scale)
      }else{
        this.updateCurrentImageSize()
        console.log(this.currentImageWidth+" "+this.currentImageHeight)
        console.log(this.imageWidth+" "+this.imageHeight)
        console.log(this.currentScale)
        imageData = this.getContext().getImageData(0,0,this.currentImageWidth, this.currentImageHeight)
      }

      return imageData
    }

    Canvas.prototype.getScaledImageData = function(scale){

      var img = $("#"+this.id)[0]

      var width = Math.floor(this.imageWidth * scale)
      var height = Math.floor(this.imageHeight * scale)

      var newCanvas = $("<canvas>")
          .attr("width", width)
          .attr("height", height)[0]

      var canvasContext = newCanvas.getContext("2d")
      canvasContext.drawImage(img, 0, 0, width, height)
      //canvasContext.putImageData(,0,0,0,0,width,height)

      return canvasContext.getImageData(0,0,width,height)
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
      this.gotNewImage = true
      this.clear()
      this.imageHeight = imageData.height 
      this.imageWidth = imageData.width
      this.ctx.putImageData(imageData,0,0)
      this.registerContentModification()
      this.drawClones()
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
      this.ctx.canvas.width  = this.canvasWidth  = this.oldVisibleWidth  = width
      this.ctx.canvas.height = this.canvasHeight = this.oldVisibleHeight = height       
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
      this.ctx.fillStyle="#888888"
      this.ctx.fillRect(0,0, this.ctx.canvas.width, this.ctx.canvas.height)
    }
     Canvas.prototype.clearFull = function(){
      this.ctx.fillStyle="#888888"
      this.ctx.fillRect(0,0, this.ctx.canvas.width, this.ctx.canvas.height)
      this.width = this.ctx.canvas.width
      this.height = this.ctx.canvas.height
    }    

    /**
    * Draws a point onto the canvas
    * @param {Object} position Object with x and y coordinate of start point
    * @param {Number} radius
    */
    Canvas.prototype.drawPoint = function(position, radius, color){
      this.ctx.beginPath()
      this.ctx.arc(position.x, position.y, radius, 0, 2 * Math.PI, false)
      this.ctx.fillStyle = "rgba("+color.r+", "+color.g+", "+color.b+", "+color.a+")"
      this.ctx.fill()
    }

    /**
    * Draws a line onto the canvas
    * @param {Object} startPoint Object with x and y coordinate of start point
    * @param {Object} endPoint Object with x and y coordinate of end point
    * @param {String} color 
    */
    Canvas.prototype.drawLine = function(startPoint, endPoint, color){
      var oldStyle = this.ctx.strokeStyle 
      this.ctx.strokeStyle = color
      //ythis.ctx.strokeStyle = "rgba("+color.r+", "+color.g+", "+color.b+", "+color.a+")"
      this.ctx.beginPath()
      this.ctx.lineWidth = 1
      this.ctx.moveTo(startPoint.x,startPoint.y)
      this.ctx.lineTo(endPoint.x,endPoint.y)
      //this.ctx.closePath()
      this.ctx.stroke()
      this.ctx.strokeStyle = oldStyle
    }

    /**
    * Draws a line into the canvas
    * @param {String} text 
    * @param {Object} pos Object with x and y coordinate of the center (pivot point)
    * @param {String} color
    * @param {float} rot clockwise rotation in radian (45° = Math.PI/4, 90° = Math.PI/2, 180° = Math.PI, a.s.o.) 
    */
    Canvas.prototype.drawText = function(text, pos, color, rot){
      this.ctx.font = "bold 8px sans-serif"
      this.ctx.textAlign = 'center'
      this.ctx.textBaseline = 'middle'
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

    // this method should be called in origin canvas 
    //  -> draw stage canvas (with zoom)
    //  -> copy to shown canvas
    Canvas.prototype.drawClones = function(){
      if(!!this.clones)
        for(var c = 0; c < this.clones.length; c++){
            this.clones[c].copyImageProperties(this)
            this.clones[c].draw()
          }
    }
    Canvas.prototype.drawFirstClone = function(){
      this.clones[0].copyImageProperties(this)
      this.clones[0].draw()
    }

    Canvas.prototype.coordinateToUnzoomedGaussSystem = function(absoluteCoords){
      return {
          x: Math.floor(absoluteCoords.x / this.currentScale) + this.visibleArea.x1
        , y: Math.floor(absoluteCoords.y / this.currentScale) + this.visibleArea.y1
      }
    }

    Canvas.prototype.coordinateToZoomedGaussSystem = function(absoluteCoords){
      return {
          x: Math.ceil(absoluteCoords.x - this.visibleArea.x1) * this.currentScale
        , y: Math.ceil(absoluteCoords.y - this.visibleArea.y1) * this.currentScale
      }
    }

    Canvas.prototype.toImageGaussianCoords = function(totalPosition){
      var pos = Math.floor(totalPosition/4)
      return {
          x: pos%this.imageWidth - this.visibleArea.x1
        , y: Math.ceil(pos/this.imageWidth) - 1 - this.visibleArea.y1
      }
    }

    Canvas.prototype.xyToTotalPosition = function(pos){
      return (pos.y * this.canvasWidth + pos.x) * 4
    }

    /**
    * UI -> put into a view
    */
    Canvas.prototype.mouseCoords = function (event){
        var totalOffsetX = 0;
        var totalOffsetY = 0;
        var canvasX = 0;
        var canvasY = 0;
        var currentElement = this.getElement()[0];

        do{
            totalOffsetX += currentElement.offsetLeft 
            totalOffsetY += currentElement.offsetTop
        }
        while(currentElement = currentElement.offsetParent)

        canvasX = (event.pageX - totalOffsetX)*1/this.scale
        canvasY = (event.pageY - totalOffsetY)*1/this.scale

        var total = this.xyToTotalPosition({x:canvasX, y:canvasY})

        var coords = {x:canvasX, y:canvasY, total: total}

        return coords
    } 

    Canvas.prototype.totalCanvasPosition = function(mousePos){
      var pos = this.coordinateToUnzoomedGaussSystem(mousePos)
      return (pos.y * this.canvasWidth + pos.x) * 4
    }

    Canvas.prototype.totalImagePosition = function(mousePos){
      var pos = this.coordinateToUnzoomedGaussSystem(mousePos)

      pos.x = pos.x > this.imageWidth ? this.imageWidth : pos.x
      pos.y = pos.y > this.imageHeight ? this.imageHeight : pos.y 

      return (pos.y * this.imageWidth + pos.x) * 4
    }    
    Canvas.prototype.totalCartesianImagePosition = function(mousePos){
      var pos = this.coordinateToUnzoomedGaussSystem(mousePos)

      pos.x = pos.x > this.imageWidth ? this.imageWidth : pos.x
      pos.y = pos.y > this.imageHeight ? this.imageHeight : pos.y 

      return {x: pos.x, y: pos.y}
    }    


    Canvas.prototype.createClone = function(id){
      this.clone = this.getElement().clone()
      this.clone.removeClass('relative')
      this.clone.attr('id', id)
      this.getElement().parent().append(this.clone)
      this.clone.css(
        {
            position: 'absolute'
          , left:   '0px'
          , top:    '0px'
          , width:  this.canvasWidth
          , height: this.canvasHeight
          , zIndex: 1002 
        }
      )

      return this.clone    
    }

    Canvas.prototype.destroyClone = function(id){
      this.clone.destroy()
    }    

    /**
    * Static helper
    */
    Canvas.colorEquals = function(pos1, pos2){

    }



// --------------------------------------
    return Canvas
  })()
  return module.exports = Canvas
})




