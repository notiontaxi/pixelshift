/*
MenuGui class

Florian Wokurka (2013)
https://github.com/notiontaxi
*/

"use strict"

define(['text!templates/menu-bar.html', 'text!templates/menu-bar-small-device.html', 'js/FileProcessor', 'js/ImageProcessor', 'js/Canvas'], function(menuTemplate, menuTemplateSmallDevice,FileProcessor, ImageProcessor, Canvas) {

  var MenuGui, _ref, module;
  module = function() {}
  MenuGui = (function(){

// --------------------------------------


  // tell wehre the menu should be rendered and where i can find the canvas
  function MenuGui(menuContainerIdentifier, canvasIdentifier, canvasIdentifier2){

    this.menuContainerIdentifier = menuContainerIdentifier
    $(menuContainerIdentifier).html($(menuTemplate))
    $(this.menuContainerIdentifier).append($(menuTemplateSmallDevice))
    $(this.menuContainerIdentifier+" .small-device").hide()

    this.wasBigMenu = true

    this.canvas = new Canvas(canvasIdentifier, true)
    this.shownCanvas = new Canvas(canvasIdentifier2)

    this.canvas.addClone(this.shownCanvas)

    this.fileProcessor = new FileProcessor()
    this.imageProcessor = new ImageProcessor()

    this.addEventListeners()
    this.initializeTools()
    this.initializeEditFunctionality()
    this.initializeViewFunctionality()
    this.addKeyBindings()
    this.makeItDraggable()
    this.initializeSmallDevicesMenu()
  }

  MenuGui.prototype.toggleMenu = function(){
    if(this.wasBigMenu){
      $(this.menuContainerIdentifier+" .big-device").hide()
      $(this.menuContainerIdentifier+" .menu-small-device").show()
    }
    else{
      $(this.menuContainerIdentifier+" .big-device").show()
      $(this.menuContainerIdentifier+" .menu-small-device").hide()
    }

    this.wasBigMenu = !this.wasBigMenu 
  }

  MenuGui.prototype.initializeSmallDevicesMenu = function(){

    $("#file-actions-list-sd-btn").click(
      function(event, ui){
        event.stopPropagation()
        event.preventDefault()
        $('.file-actions-list-sd').slideToggle()
      }.bind(this))
    $('.file-actions-list-sd').hide()

    $("#image-actions-list-sd-btn").click(
      function(event, ui){
        event.stopPropagation()
        event.preventDefault()
        $('.image-actions-list-sd').slideToggle()
      }.bind(this))
    $('.image-actions-list-sd').hide()

    $("#edit-actions-list-sd-btn").click(
      function(event, ui){
        event.stopPropagation()
        event.preventDefault()
        $('.edit-actions-list-sd').slideToggle()
      }.bind(this))
    $('.edit-actions-list-sd').hide()

    $("#view-actions-list-sd-btn").click(
      function(event, ui){
        event.stopPropagation()
        event.preventDefault()
        $('.view-actions-list-sd').slideToggle()
      }.bind(this))
    $('.view-actions-list-sd').hide()        

    $('.menu-small-device').hide()
  }

  MenuGui.prototype.addEventListeners = function(){

    // Outline button
    $(".action-upload-image").click(
      function(event, ui){
        event.stopPropagation()
        event.preventDefault()
        $('input[type="file"]').click()
      }.bind(this))

    $(".action-save-image").click(
      function(event, ui){
        event.stopPropagation()
        event.preventDefault()
        this.fileProcessor.saveCanvasToDisk(this.canvas.getHtmlElementCopy())
    
    }.bind(this))   
       
    document.getElementById('action-upload').addEventListener('change', 
      function(evt){
        var file = evt.target.files[0] // FileList object
        this.fileProcessor.loadFileFromFilesystem(URL.createObjectURL(file), this.canvas.drawImage, this.canvas)
      }.bind(this), false);
  }

  MenuGui.prototype.initializeTools = function(){

    $(".action-grayscale").click(
      function(event, ui){
        event.stopPropagation()
        event.preventDefault()
        var newImg = this.imageProcessor.processGrayscale(this.canvas.getImageData(), this.canvas.getImageWidth())
        this.canvas.putImageData(newImg)
    }.bind(this))    

    $(".action-bitmap").click(
      function(event, ui){
        event.stopPropagation()
        event.preventDefault()
        var newImg = this.imageProcessor.processThreshold(this.imageProcessor.computeThreshold(this.canvas.getImageData()) ,this.canvas.getImageData())
        this.canvas.putImageData(newImg)
    }.bind(this))  

    $(".action-invert").click(
      function(event, ui){
        event.stopPropagation()
        event.preventDefault()
        var newImg = this.imageProcessor.processInvertColors(this.canvas.getImageData(), this.canvas.getImageWidth())
        this.canvas.putImageData(newImg)
    }.bind(this))          

  }  

  MenuGui.prototype.initializeEditFunctionality = function(){

    $(".action-undo").click(
      function(event, ui){
        event.stopPropagation()
        event.preventDefault()
        this.canvas.undo()
    }.bind(this))    

    $(".action-redo").click(
      function(event, ui){
        event.stopPropagation()
        event.preventDefault()
        this.canvas.redo()
    }.bind(this))          

  }    

  MenuGui.prototype.initializeViewFunctionality = function(){

    $(".action-zoom-in").click(
      function(event, ui){
        event.stopPropagation()
        event.preventDefault()
        this.shownCanvas.zoomIn()
        this.updateDragBoundaries()
    }.bind(this))    

    $(".action-zoom-out").click(
      function(event, ui){
        event.stopPropagation()
        event.preventDefault()
        this.shownCanvas.zoomOut()
        this.updateDragBoundaries()
    }.bind(this))   

    $(".action-zoom-reset").click(
      function(event, ui){
        event.stopPropagation()
        event.preventDefault()
        this.shownCanvas.zoomReset()
        this.updateDragBoundaries()
    }.bind(this))              

  }    

  MenuGui.prototype.addKeyBindings = function(){
     Mousetrap.bind('command+z', function(event, ui){
        event.stopPropagation()
        event.preventDefault()
        this.canvas.undo()
    }.bind(this))  

    Mousetrap.bind('command+y', function(event, ui){
        event.stopPropagation()
        event.preventDefault()
        this.canvas.redo()
    }.bind(this))  

    Mousetrap.bind('command+o', function(event, ui){
        event.stopPropagation()
        event.preventDefault()
        $('input[type="file"]').click()
      }.bind(this))

    Mousetrap.bind('command+s', function(event, ui){
        event.stopPropagation()
        event.preventDefault()
        this.fileProcessor.saveCanvasToDisk(this.canvas.getHtmlElementCopy())
    }.bind(this))

    Mousetrap.bind('+', function(event, ui){
        event.stopPropagation()
        event.preventDefault()
        this.shownCanvas.zoomIn()
        this.updateDragBoundaries()
    }.bind(this))

    Mousetrap.bind('-', function(event, ui){
        event.stopPropagation()
        event.preventDefault()
        this.shownCanvas.zoomOut()
        this.updateDragBoundaries()
    }.bind(this))

    Mousetrap.bind('command+0', function(event, ui){
        event.stopPropagation()
        event.preventDefault()
        this.shownCanvas.zoomReset()
        this.updateDragBoundaries()
    }.bind(this))            

  }

  MenuGui.prototype.makeItDraggable = function(){
    $( "#canvas-shown" ).draggable({ containment: this.getUpdatedDragBoundaries()})
  }

  MenuGui.prototype.updateDragBoundaries = function(){
    $( "#canvas-shown" ).draggable({ containment: this.getUpdatedDragBoundaries()})
  }

  MenuGui.prototype.getUpdatedDragBoundaries = function(){

    var boundaries = new Array()

    if(this.shownCanvas.currentScale !== 1){
      
      //console.log(this.shownCanvas.canvasHeight * this.shownCanvas.currentScale)
      boundaries.push(
        - this.shownCanvas.canvasWidth * this.shownCanvas.currentScale
        + $( "#canvas-shown" ).parent().width()
        + $( "#canvas-shown" ).parent().offset().left 
      )
      boundaries.push(
        - this.shownCanvas.canvasHeight * this.shownCanvas.currentScale
        + $( "#canvas-shown" ).parent().height() 
        + $( "#canvas-shown" ).parent().offset().top
      )
      boundaries.push(
        $( "#canvas-shown" ).parent().offset().left       
      )
      boundaries.push(
          $( "#canvas-shown" ).parent().offset().top
      )
      //console.log(boundaries)
    }else{
      // put max upper left and min lower right position for the left upper edge to one position (not movable)
      boundaries.push($( "#canvas-shown" ).parent().offset().left)
      boundaries.push($( "#canvas-shown" ).parent().offset().top)
      boundaries.push($( "#canvas-shown" ).parent().offset().left)
      boundaries.push($( "#canvas-shown" ).parent().offset().top)
    }
      return boundaries
  }

 

// --------------------------------------
    return MenuGui
  })()
  return module.exports = MenuGui
})