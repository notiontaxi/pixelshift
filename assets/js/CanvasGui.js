/*
CanvasGui class

Florian Wokurka (2013)
https://github.com/notiontaxi
*/

"use strict"

define([
    'text!templates/canvas-gui.html', 
    'text!templates/menu-bar.html', 
    'text!templates/footer-small-device.html', 
    'text!templates/header-small-device.html', 
    'text!templates/left-panel-small-device.html',     
    'text!templates/right-panel-small-device.html',
    'text!templates/navigation-buttons.html',  
    'js/FileProcessor', 
    'js/Canvas', 
    'js/DragNDrop',
    'js/Toolbar'], 
  function(
    canvasGuiTemplate, 
    menuTemplate, 
    footerTemplateSmallDevice,
    headerTemplateSmallDevice,
    leftPanelSmallDevice,
    rightPanelSmallDevice,
    navigationsButtons,
    FileProcessor,
    Canvas, 
    DragNDrop, 
    Toolbar
    ) {

  var CanvasGui, _ref, module;
  module = function() {}
  CanvasGui = (function(){

// --------------------------------------


  // tell wehre the menu should be rendered and where i can find the canvas
  function CanvasGui(canvasContainerIdentifier, imageProcessor){

    this.menuContainerIdentifier = "#menu-container"
    this.containerIdentifier = "#container"
    this.overlayElementsIdentifier = "#overlay-elements"
    this.canvasOriginIdentifier = "canvas-origin"
    this.canvasStageIdentifier = "canvas-stage"
    this.canvasShownIdentifier = "canvas-shown"

    this.canvasWrapId = "#dragg-container"

    $(canvasContainerIdentifier).html($(canvasGuiTemplate))

    $(this.menuContainerIdentifier).html($(menuTemplate))

    $(canvasContainerIdentifier).append($(navigationsButtons))
    
    $(this.overlayElementsIdentifier).append($(headerTemplateSmallDevice))
    $(this.overlayElementsIdentifier).append($(footerTemplateSmallDevice))
    $(this.overlayElementsIdentifier).append($(leftPanelSmallDevice))
    $(this.overlayElementsIdentifier).append($(rightPanelSmallDevice))


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
    this.imageProcessor = imageProcessor

    this.addEventListeners()
    this.initializeTools()
    this.initializeEditFunctionality()
    this.initializeViewFunctionality()

    if(!window.isTouchDevice ){    
      this.addKeyBindings()
    }

    this.initTabs()

    this.initializeSmallDevicesMenu()

  }

  CanvasGui.prototype.initialize = function(){
    this.wasSmallLayout = false
    this.wasMediumLayout = false
    this.wasLargeLayout = false

    var dragNDrop = new DragNDrop(this.canvasShown, this.canvasOrigin.drawImage, this.canvasOrigin)

    this.updateLayout()
  }

  CanvasGui.prototype.initTabs = function(){
    $('#menu-tab a').click(function (e) {
      e.preventDefault()
      $(this).tab('show')
    })    
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

    if(width < 992 && !this.wasSmallLayout && window.isTouchDevice){
      $("#footerLink").hide()
      width = Math.floor(this.viewport.width - 20)
      height = Math.floor(this.viewport.height*.71 - 30)

      this.updateCanvasSizes(width,height)
      
      $(this.canvasWrapId).css({"width": ""+width+"px", "height":""+(height+20)+"px"})
      this.toggleControlls()
      this.wasSmallLayout = true
      this.wasMediumLayout = this.wasLargeLayout = false
      window.isSmallDevice = true
      
      //console.log("Setting layout to s")
    } else if(width >= 992 && width < 1200 && !this.wasMediumLayout){
      $("#footerLink").show()

      this.updateCanvasSizes(700,525)

      $(this.canvasWrapId).css({"width":"700px", "height":"525px"})
      if(this.wasSmallLayout)
        this.toggleControlls()
      this.wasMediumLayout = true
      this.wasSmallLayout = this.wasLargeLayout = false
      window.isSmallDevice = false
      
      //console.log("Setting layout to m")
    } else if(width >= 1200 && !this.wasLargeLayout){
      $("#footerLink").show()

      this.updateCanvasSizes(1100,825)

      $(this.canvasWrapId).css({"width":"1100px", "height":"825px"})
      if(this.wasSmallLayout)
        this.toggleControlls()
      this.wasLargeLayout = true
      this.wasSmallLayout = this.wasMediumLayout = false
      
      window.isSmallDevice = false
      //console.log("Setting layout to l")
    }

    this.canvasStage.draw()
    this.canvasStage.copyToClones(true)

    updateGreyPanels()

  }

  CanvasGui.prototype.updateCanvasSizes = function(width, height, all){
    this.canvasShown.updateSize(width, height)
    this.canvasStage.updateSize(width, height)

    // destroys imaga data
    if(!!all)
      this.canvasOrigin.updateSize(width, height)

    // canvas for drawing
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

      $("#small-device-menu-color .inner-content").append($("#color-picker-modal")) 
      $("#color-picker-modal").show()  

      $("#small-device-menu-painting .inner-content").append($("#toolbar")) 
      $("#toolbar .action-show-color-picker").hide()
      $("#toolbar .header").hide()
      $("#toolbar").show()
      $("#toolbar").addClass('small-device-options')           
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

      $("body").append($("#color-picker-modal"))
      $("body").append($("#toolbar"))
      $(".action-show-color-picker").show()
      $("#toolbar .header").show()
      $("#toolbar").removeClass('small-device-options')    

      $(".navigation-button").hide()
    }

    this.wasBigMenu = !this.wasBigMenu 
  }

  CanvasGui.prototype.initializeSmallDevicesMenu = function(){

    // guess what
    var that = this

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

        that.slideRightPanelIfVisible()

        var dir = $("#left-panel-small-device").position().left
        var amount = dir < 0 ? '0%' : '-80%'
        $("#left-panel-small-device").animate({left: amount})
      }
    )

    $('.small-device-button.action-toggle-panel.right-panel').click(
      function(event, ui){
        that.slideLeftPanelIfVisible()

        var dir = $("#right-panel-small-device").position().left
        var amount = dir > $('body').width()/2 ? '20%' : '100%'

        // TODO: do this in a nice way
        if(dir > $('body').width()/2){
          $('.controls').each(function(){this.click()})
        }

        $("#right-panel-small-device").animate({left: amount});
      }
    )

    $('.small-device-button.action-show-image-navigation').click(
      function(event, ui){
        that.slideLeftPanelIfVisible()
        $(".navigation-button").fadeToggle();
      }
    )

    $('.image-navigate-left').click(
      function(event, ui){
        event.stopPropagation()
        event.preventDefault()
        $('.image-navigate-left').blur()
        this.canvasStage.moveCanvas("left")
      }.bind(this)
    )
    $('.image-navigate-left').hide().removeClass('hidden')   

    $('.image-navigate-up').click(
      function(event, ui){
        event.stopPropagation()
        event.preventDefault()
        $('.image-navigate-up').blur()
        this.canvasStage.moveCanvas("up")
      }.bind(this)
    )   
    $('.image-navigate-up').hide().removeClass('hidden')  

    $('.image-navigate-right').click(
      function(event, ui){
        event.stopPropagation()
        event.preventDefault()
        $('.image-navigate-right').blur()
        this.canvasStage.moveCanvas("right")
      }.bind(this)
    )   
    $('.image-navigate-right').hide().removeClass('hidden')  

    $('.image-navigate-down').click(
      function(event, ui){
        event.stopPropagation()
        event.preventDefault()
        $('.image-navigate-down').blur()
        this.canvasStage.moveCanvas("down")
      }.bind(this)
    )  
    $('.image-navigate-down').hide().removeClass('hidden')  

    $('.small-device-button').click(
      function(){
        this.blur()
      })

    $('.small-device').hide()
  }


  CanvasGui.prototype.slideLeftPanelIfVisible = function(){
        var dir = $("#left-panel-small-device").position().left
        var visible = dir >= 0 ? true : false

        if(visible){
          $("#left-panel-small-device").animate({left: "-80%"});
        }
  }
  CanvasGui.prototype.slideRightPanelIfVisible = function(){
        var dir = $("#right-panel-small-device").position().left
        var visible = dir < $('body').width()/2 ? true : false

        if(visible){
          $("#right-panel-small-device").animate({left: "100%"});
        }
  }  

  CanvasGui.prototype.addEventListeners = function(){

    // redirect click on own button to invisible input field
    $(".action-upload-image").click(
      function(event, ui){
        event.stopPropagation()
        event.preventDefault()
        $('input[type="file"]').click()
        this.slideLeftPanelIfVisible()
      }.bind(this))

    $(".action-save-image").click(
      function(event, ui){
        event.stopPropagation()
        event.preventDefault()
        this.fileProcessor.saveCanvasToDisk(this.canvasOrigin.getHtmlElementCopy())
        this.slideLeftPanelIfVisible()
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
        this.slideRightPanelIfVisible()
    }.bind(this))  

    $(".action-grayscale").click(
      function(event, ui){
        event.stopPropagation()
        event.preventDefault()
        var newImg = this.imageProcessor.processGrayscale(this.canvasOrigin.getImageData(), this.canvasOrigin.getImageWidth())
        this.canvasOrigin.putImageData(newImg)
        this.slideRightPanelIfVisible()
    }.bind(this))    

    $(".action-bitmap").click(
      function(event, ui){
        event.stopPropagation()
        event.preventDefault()
        var newImg = this.imageProcessor.processThreshold(this.imageProcessor.computeThreshold(this.canvasOrigin.getImageData()) ,this.canvasOrigin.getImageData())
        this.canvasOrigin.putImageData(newImg)
        this.slideRightPanelIfVisible()
    }.bind(this))  

    $(".action-invert").click(
      function(event, ui){
        event.stopPropagation()
        event.preventDefault()
        var newImg = this.imageProcessor.processInvertColors(this.canvasOrigin.getImageData(), this.canvasOrigin.getImageWidth())
        this.canvasOrigin.putImageData(newImg)
        this.slideRightPanelIfVisible()
    }.bind(this))          

    $(".action-emboss").click(
      function(event, ui){
        event.stopPropagation()
        event.preventDefault()

      var imgData = this.canvasOrigin.getImageData()

      this.processedImageData = this.imageProcessor.convolute( imgData,
        [ -2, -1, 0,
          -1, 1, 1,
          0, 1, 2 ]
        )

        this.canvasOrigin.putImageData(this.processedImageData)
        this.slideRightPanelIfVisible()
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
        this.slideRightPanelIfVisible()
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
        this.slideRightPanelIfVisible()
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
        this.slideRightPanelIfVisible()
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