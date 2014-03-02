/*
CanvasGui class

Florian Wokurka (2013)
https://github.com/notiontaxi
*/

"use strict"

define([
    'text!templates/canvas-gui.html', 
    'text!templates/menu-bar.html', 
    'text!templates/menu-bar-small-device.html', 
    'text!templates/footer-small-device.html', 
    'text!templates/header-small-device.html', 
    'text!templates/left-panel-small-device.html',     
    'text!templates/right-panel-small-device.html', 
    'js/FileProcessor', 
    'js/ImageProcessor', 
    'js/Canvas', 
    'js/DragNDrop',
    'js/Toolbar'], 
  function(
    canvasGuiTemplate, 
    menuTemplate, 
    menuTemplateSmallDevice,
    footerTemplateSmallDevice,
    headerTemplateSmallDevice,
    leftPanelSmallDevice,
    rightPanelSmallDevice,
    FileProcessor, 
    ImageProcessor, 
    Canvas, 
    DragNDrop, 
    Toolbar
    ) {

  var CanvasGui, _ref, module;
  module = function() {}
  CanvasGui = (function(){

// --------------------------------------


  // tell wehre the menu should be rendered and where i can find the canvas
  function CanvasGui(canvasContainerIdentifier){

    this.menuContainerIdentifier = "#menu-container"
    this.containerIdentifier = "#container"
    this.overlayElementsIdentifier = "#overlay-elements"
    this.canvasOriginIdentifier = "canvas-origin"
    this.canvasStageIdentifier = "canvas-stage"
    this.canvasShownIdentifier = "canvas-shown"

    this.canvasWrapId = "#dragg-container"
    this.toolbar =  new Toolbar('#toolbar .content')

    $(canvasContainerIdentifier).html($(canvasGuiTemplate))

    $(this.menuContainerIdentifier).html($(menuTemplate))

    
    $(this.overlayElementsIdentifier).append($(headerTemplateSmallDevice))
    $(this.overlayElementsIdentifier).append($(footerTemplateSmallDevice))
    $(this.overlayElementsIdentifier).append($(leftPanelSmallDevice))
    $(this.overlayElementsIdentifier).append($(rightPanelSmallDevice))

    $("#right-panel-small-device").append($(menuTemplateSmallDevice))
    

    this.wasBigMenu = true
    this.wasSmallLayout = this.wasMediumLayout = this.wasSmallLayout = false

    var viewport
    this.updateViewport()

    this.canvasOrigin = new Canvas(this.canvasOriginIdentifier, true)
    this.canvasStage = new Canvas(this.canvasStageIdentifier)
    this.canvasShown = new Canvas(this.canvasShownIdentifier)
    this.canvasShownClone = this.canvasShown.createClone('canvas-shown-clone')

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
  }

  CanvasGui.prototype.initialize = function(){
    this.wasSmallLayout = false
    this.wasMediumLayout = false
    this.wasLargeLayout = false

    var dragNDrop = new DragNDrop(this.canvasShown, this.canvasOrigin.drawImage, this.canvasOrigin)

    this.updateLayout()
  }

  CanvasGui.prototype.updateViewport = function(){
    this.viewport = {
      width  : $(window).width(),
      height : $(window).height()
    }
  }

  CanvasGui.prototype.updateLayout = function(){
    var width = window.outerWidth
    var height

    this.updateViewport()

    if(width < 992 && !this.wasSmallLayout){
      $("#footerLink").hide()
      width = Math.floor(this.viewport.width - 20)
      height = Math.floor(this.viewport.height*.71 - 30)

      this.updateCanvasSizes(width,height)
      
      $(this.canvasWrapId).css({"width": ""+width+"px", "height":""+(height+20)+"px"})
      this.toggleControlls()
      this.wasSmallLayout = true
      this.wasMediumLayout = this.wasLargeLayout = false
      
      //console.log("Setting layout to s")
    } else if(width >= 992 && width < 1200 && !this.wasMediumLayout){
      $("#footerLink").show()

      this.updateCanvasSizes(700,560)

      $(this.canvasWrapId).css({"width":"700px", "height":"560px"})
      if(this.wasSmallLayout)
        this.toggleControlls() 
      this.wasMediumLayout = true
      this.wasSmallLayout = this.wasLargeLayout = false
      
      //console.log("Setting layout to m")
    } else if(width >= 1200 && !this.wasLargeLayout){
      $("#footerLink").show()

      this.updateCanvasSizes(800,640)

      $(this.canvasWrapId).css({"width":"800px", "height":"640px"})
      if(this.wasSmallLayout)
        this.toggleControlls()
      this.wasLargeLayout = true
      this.wasSmallLayout = this.wasMediumLayout = false
      
      //console.log("Setting layout to l")
    }

    this.canvasStage.draw()
    this.canvasStage.copyToClones(true)

    updateGreyPanels()

  }

  CanvasGui.prototype.updateCanvasSizes = function(width, height){
    this.canvasShown.updateSize(width, height)
    this.canvasStage.updateSize(width, height)

    $('#canvas-shown-clone').css({"width":""+width+"px", "height":""+height+"px"})
    $('#canvas-shown-clone')[0].width = width
    $('#canvas-shown-clone')[0].height = height
    
  }

  CanvasGui.prototype.toggleControlls = function(){
    if(this.wasBigMenu){
      $(".big-device").hide()
      $(".small-device").show()
      $(".content-container").removeClass("big-device-options")
      $(".content-container").addClass("small-device-options")

      $(".controls-wrapper").removeClass("big-device-options")
      $(".controls-wrapper").addClass("small-device-options")   

      $(".controls").removeClass("big-device-options")
      $(".controls").addClass("small-device-options")      
    }
    else{
      $(".big-device").show()
      $(".small-device").hide()
      $(".content-container").removeClass("small-device-options")
      $(".content-container").addClass("big-device-options")

      $(".controls-wrapper").removeClass("small-device-options")
      $(".controls-wrapper").addClass("big-device-options")  

      $(".controls").removeClass("small-device-options")
      $(".controls").addClass("big-device-options")            
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

    $('.small-device-button.action-toggle-panel.left-panel').click(
      function(event, ui){
        var dir = $("#left-panel-small-device").position().left
        var amount = dir < 0 ? '0%' : '-80%'
        $("#left-panel-small-device").animate({left: amount})
      }
    )

    $('.small-device-button.action-toggle-panel.right-panel').click(
      function(event, ui){
        var dir = $("#right-panel-small-device").position().left
        var amount = dir > $('body').width()/2 ? '20%' : '100%' 
        $("#right-panel-small-device").animate({left: amount});
      }
    )


    $('.small-device').hide()
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

    $(".action-clear").click(
      function(event, ui){
        event.stopPropagation()
        event.preventDefault()
        this.canvasOrigin.clearFull()
        this.canvasStage.draw()
    }.bind(this))  

    $(".action-grayscale").click(
      function(event, ui){
        event.stopPropagation()
        event.preventDefault()
        var newImg = this.imageProcessor.processGrayscale(this.canvasOrigin.getImageData(), this.canvasOrigin.getImageWidth())
        this.canvasOrigin.putImageData(newImg)
    }.bind(this))    

    $(".action-bitmap").click(
      function(event, ui){
        event.stopPropagation()
        event.preventDefault()
        var newImg = this.imageProcessor.processThreshold(this.imageProcessor.computeThreshold(this.canvasOrigin.getImageData()) ,this.canvasOrigin.getImageData())
        this.canvasOrigin.putImageData(newImg)
    }.bind(this))  

    $(".action-invert").click(
      function(event, ui){
        event.stopPropagation()
        event.preventDefault()
        var newImg = this.imageProcessor.processInvertColors(this.canvasOrigin.getImageData(), this.canvasOrigin.getImageWidth())
        this.canvasOrigin.putImageData(newImg)
    }.bind(this))          

    $(".action-emboss").click(
      function(event, ui){
        event.stopPropagation()
        event.preventDefault()

      var imgData = this.canvasOrigin.getImageData()

      this.processedImageData = this.imageProcessor.convolute( imgData,
        [ 1, 1, 1,
          1, .7, -1,
          -1, -1, -1 ]
        )

        this.canvasOrigin.putImageData(this.processedImageData)
    }.bind(this))   

    $(".action-sharpen").click(
      function(event, ui){
        event.stopPropagation()
        event.preventDefault()

      var imgData = this.canvasOrigin.getImageData()

      this.processedImageData = this.imageProcessor.convolute( imgData,
        [ 0, -1, 0,
          -1, 5, -1,
          0, -1, 0 ]
        )

        this.canvasOrigin.putImageData(this.processedImageData)
    }.bind(this))  

    $(".action-highpass").click(
      function(event, ui){
        event.stopPropagation()
        event.preventDefault()

      var imgData = this.canvasOrigin.getImageData()

      // laplace sharpen
      this.processedImageData = this.imageProcessor.convolute( imgData,
        [ 0, -1, 0,
          -1, 9, -1,
          0, -1, 0 ]
        )

        this.canvasOrigin.putImageData(this.processedImageData)
    }.bind(this)) 

    $(".action-lowpass").click(
      function(event, ui){
        event.stopPropagation()
        event.preventDefault()

      var imgData = this.canvasOrigin.getImageData()
      var sixteenthPart = 1/16

      this.processedImageData = this.imageProcessor.convolute( imgData,
        [ .025, .15, .025,
          .15,  .3,  .15,
          .025, .15, .025 ]
        )

        this.canvasOrigin.putImageData(this.processedImageData)
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
        event.stopPropagation()
        event.preventDefault()
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
      console.log("y")
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