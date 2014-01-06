/*
CanvasGui class

Florian Wokurka (2013)
https://github.com/notiontaxi
*/

"use strict"

define(['text!templates/canvas-gui.html', 
  'text!templates/menu-bar.html', 
  'text!templates/menu-bar-small-device.html', 
  'js/FileProcessor', 
  'js/ImageProcessor', 
  'js/Canvas', 
  'js/DragNDrop',
  'js/Toolbar'], function(canvasGuiTemplate, menuTemplate, menuTemplateSmallDevice,FileProcessor, ImageProcessor, Canvas, DragNDrop, Toolbar) {

  var CanvasGui, _ref, module;
  module = function() {}
  CanvasGui = (function(){

// --------------------------------------


  // tell wehre the menu should be rendered and where i can find the canvas
  function CanvasGui(canvasContainerIdentifier){

    this.menuContainerIdentifier = "#menu-container"
    this.canvasOriginIdentifier = "canvas-origin"
    this.canvasStageIdentifier = "canvas-stage"
    this.canvasShownIdentifier = "canvas-shown"

    this.canvasWrapId = "#dragg-container"
    this.toolbar =  new Toolbar('#toolbar .content')

    $(canvasContainerIdentifier).html($(canvasGuiTemplate))
    $(this.menuContainerIdentifier).html($(menuTemplate))
    $(this.menuContainerIdentifier).append($(menuTemplateSmallDevice))
    $(this.menuContainerIdentifier+" .small-device").hide()

    this.wasBigMenu = true

    this.canvasOrigin = new Canvas(this.canvasOriginIdentifier, true)
    this.canvasStage = new Canvas(this.canvasStageIdentifier)
    this.canvasShown = new Canvas(this.canvasShownIdentifier)

    this.canvasOrigin.addClone(this.canvasStage)
    this.canvasStage.addClone(this.canvasShown)

    this.canvasStage.setParent(this.canvasOrigin)
    this.canvasShown.setParent(this.canvasStage)

    this.fileProcessor = new FileProcessor()
    this.imageProcessor = new ImageProcessor()

    this.addEventListeners()
    this.initializeTools()
    this.initializeEditFunctionality()
    this.initializeViewFunctionality()
    this.addKeyBindings()

    this.initializeSmallDevicesMenu()

    this.initialize()
  }

  CanvasGui.prototype.initialize = function(){
    this.wasSmallLayout = false
    this.wasMediumLayout = false
    this.wasLargeLayout = false

    this.updateLayout()

    var dragNDrop = new DragNDrop(this.canvasShown, this.canvasOrigin.drawImage, this.canvasOrigin)
  }

  CanvasGui.prototype.updateLayout = function(){
    var width = window.outerWidth

    if(width < 992 && !this.wasSmallLayout){
      this.canvasShown.updateSize(400,320)
      $(this.canvasWrapId).css({"width":"400px", "height":"320px"})
      this.toggleMenu() 
      this.wasSmallLayout = true
      this.wasMediumLayout = this.wasLargeLayout = false
      this.canvasStage.copyToClones(true)
      //console.log("Setting layout to s")
    } else if(width >= 992 && width < 1200 && !this.wasMediumLayout){
      this.canvasShown.updateSize(700,560)
      $(this.canvasWrapId).css({"width":"700px", "height":"560px"})
      if(this.wasSmallLayout)
        this.toggleMenu() 
      this.wasMediumLayout = true
      this.wasSmallLayout = this.wasLargeLayout = false
      this.canvasStage.copyToClones(true)
      //console.log("Setting layout to m")
    } else if(width >= 1200 && !this.wasLargeLayout){
      this.canvasShown.updateSize(800,640)
      $(this.canvasWrapId).css({"width":"800px", "height":"640px"})
      if(this.wasSmallLayout)
        this.toggleMenu()
      this.wasLargeLayout = true
      this.wasSmallLayout = this.wasMediumLayout = false
      this.canvasStage.copyToClones(true)
      //console.log("Setting layout to l")
    }
  }  

  CanvasGui.prototype.toggleMenu = function(){
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

  CanvasGui.prototype.initializeSmallDevicesMenu = function(){

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

  CanvasGui.prototype.addEventListeners = function(){

    // redirect click on own button to invisible input field
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
        this.fileProcessor.saveCanvasToDisk(this.canvasOrigin.getHtmlElementCopy())
    
    }.bind(this))   

    // load image, when filename was changed
    var changeFile = function(evt){
      var file = evt.target.files[0] // FileList object
      this.canvasStage.zoomReset()
      this.fileProcessor.loadFileFromFilesystem(URL.createObjectURL(file), this.canvasOrigin.drawImage, this.canvasOrigin)
      // remove and add in order to load the same image again
      $('#action-upload').remove()
      $("<input type='file' name='image' id='action-upload' accept='image/*' class='hide' />").change(changeFile).appendTo($('#container'));
    }.bind(this)

    document.getElementById('action-upload').addEventListener('change', changeFile, this)

    window.onresize=function() {
      if (this.reset){clearTimeout(this.reset)};
        this.reset = setTimeout(function(){this.updateLayout()}.bind(this),200);
    }.bind(this)    
  }

  

  CanvasGui.prototype.initializeTools = function(){

    $(".action-grayscale").click(
      function(event, ui){
        event.stopPropagation()
        event.preventDefault()
        var newImg = this.imageProcessor.processGrayscale(this.canvasOrigin.getImageData(), this.canvasOrigin.getImageWidth())
        this.canvasOrigin.putImageData(newImg)
        this.canvasStage.draw()
    }.bind(this))    

    $(".action-bitmap").click(
      function(event, ui){
        event.stopPropagation()
        event.preventDefault()
        var newImg = this.imageProcessor.processThreshold(this.imageProcessor.computeThreshold(this.canvasOrigin.getImageData()) ,this.canvasOrigin.getImageData())
        this.canvasOrigin.putImageData(newImg)
        this.canvasStage.draw()
    }.bind(this))  

    $(".action-invert").click(
      function(event, ui){
        event.stopPropagation()
        event.preventDefault()
        var newImg = this.imageProcessor.processInvertColors(this.canvasOrigin.getImageData(), this.canvasOrigin.getImageWidth())
        this.canvasOrigin.putImageData(newImg)
        this.canvasStage.draw()
    }.bind(this))          

    $(".action-emboss").click(
      function(event, ui){
        event.stopPropagation()
        event.preventDefault()

      var imgData = this.canvasOrigin.getFullImageData()

      this.processedImageData = this.imageProcessor.convolute( imgData,
        [ 1, 1, 1,
          1, .7, -1,
          -1, -1, -1 ]
        ,0)

        this.canvasOrigin.putImageData(this.processedImageData)
        this.canvasStage.draw()
    }.bind(this))   

    $(".action-sharpen").click(
      function(event, ui){
        event.stopPropagation()
        event.preventDefault()

      var imgData = this.canvasOrigin.getFullImageData()

      this.processedImageData = this.imageProcessor.convolute( imgData,
        [ 0, -1, 0,
          -1, 5, -1,
          0, -1, 0 ]
        ,0)

        this.canvasOrigin.putImageData(this.processedImageData)
        this.canvasStage.draw()
    }.bind(this))       

  }  

  CanvasGui.prototype.initializeEditFunctionality = function(){

    $(".action-undo").click(
      function(event, ui){
        event.stopPropagation()
        event.preventDefault()
        this.canvasOrigin.undo()
    }.bind(this))    

    $(".action-redo").click(
      function(event, ui){
        event.stopPropagation()
        event.preventDefault()
        this.canvasOrigin.redo()
    }.bind(this))          

  }    

  CanvasGui.prototype.initializeViewFunctionality = function(){

    $(".action-zoom-in").click(
      function(event, ui){
        event.stopPropagation()
        event.preventDefault()
        this.canvasStage.zoomIn()
    }.bind(this))    

    $(".action-zoom-out").click(
      function(event, ui){
        event.stopPropagation()
        event.preventDefault()
        this.canvasStage.zoomOut()
    }.bind(this))   

    $(".action-zoom-reset").click(
      function(event, ui){
        event.stopPropagation()
        event.preventDefault()
        this.canvasStage.zoomReset()
    }.bind(this))              

    $(".action-show-toolbar").click(
      function(event, ui){
        this.toolbar.show()
    }.bind(this)) 

    /*
    $(".action-show-color-picker").click(
      function(event, ui){
        this.colorpicker.show()
    }.bind(this))     
  */
  }    

  CanvasGui.prototype.addKeyBindings = function(){
     Mousetrap.bind('command+z', function(event, ui){
        event.stopPropagation()
        event.preventDefault()
        this.canvasOrigin.undo()
    }.bind(this))  

    Mousetrap.bind('command+y', function(event, ui){
        event.stopPropagation()
        event.preventDefault()
        this.canvasOrigin.redo()
    }.bind(this))  

    Mousetrap.bind('command+o', function(event, ui){
        event.stopPropagation()
        event.preventDefault()
        $('input[type="file"]').click()
      }.bind(this))

    Mousetrap.bind('command+s', function(event, ui){
        event.stopPropagation()
        event.preventDefault()
        this.fileProcessor.saveCanvasToDisk(this.canvasOrigin.getHtmlElementCopy())
    }.bind(this))

    Mousetrap.bind('+', function(event, ui){
        event.stopPropagation()
        event.preventDefault()
        this.canvasStage.zoomIn()
    }.bind(this))

    Mousetrap.bind('-', function(event, ui){
        event.stopPropagation()
        event.preventDefault()
        this.canvasStage.zoomOut()
    }.bind(this))

    Mousetrap.bind('command+0', function(event, ui){
        this.canvasStage.zoomReset()
    }.bind(this))    

    Mousetrap.bind('up', function(event, ui){
        $('.ui-slider-handle').blur()
        event.stopPropagation()
        event.preventDefault()
        this.canvasStage.moveCanvas("up")
    }.bind(this))     

    Mousetrap.bind('down', function(event, ui){
        $('.ui-slider-handle').blur()
        event.stopPropagation()
        event.preventDefault()
        this.canvasStage.moveCanvas("down")
    }.bind(this))  

    Mousetrap.bind('left', function(event, ui){
        $('.ui-slider-handle').blur()
        event.stopPropagation()
        event.preventDefault()
        this.canvasStage.moveCanvas("left")
    }.bind(this))      

    Mousetrap.bind('right', function(event, ui){
        $('.ui-slider-handle').blur()
        event.stopPropagation()
        event.preventDefault()
        this.canvasStage.moveCanvas("right")
    }.bind(this))  
  }

// --------------------------------------
    return CanvasGui
  })()
  return module.exports = CanvasGui
})