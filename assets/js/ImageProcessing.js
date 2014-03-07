/*
Initialization of the image processing functionalities

Florian Wokurka (2013)
https://github.com/notiontaxi
*/

"use strict"

define(['text!templates/image-processing.html',
  'js/strategies/OutlineStrategy',
  'js/strategies/VectorizerStrategy', 
  'js/strategies/FloodfillStrategy',
  'js/strategies/PencilStrategy',
  'js/strategies/BrightnessStrategy',
  'js/strategies/BlurStrategy',
  'js/strategies/ContrastStrategy',
  'js/strategies/CropStrategy',
  'js/strategies/ShapeStrategy',
  'js/CanvasGui', 
  'js/test/Test',
  'js/Toolbar',
  'js/Context',], function(contentTemplate, 
    OutlineStrategy, 
    VectorizerStrategy, 
    FloodfillStrategy,
    PencilStrategy,
    BrightnessStrategy, 
    BlurStrategy,
    ContrastStrategy,
    CropStrategy,
    ShapeStrategy,
    CanvasGui, 
    Test, 
    Toolbar,
    Context) {

var ImageProcessing, _ref, module,


  module = function() {}
  ImageProcessing = (function(_super){
    __extends(ImageProcessing, CanvasGui);
// --------------------------------------



    function ImageProcessing(containerIdentifier){   
      // render templates
      $(containerIdentifier).html($(contentTemplate))

      ImageProcessing.__super__.constructor("#canvas-container")
      
      this.initColorPicker()
      
      this.initContext()
      
      this.initialize()
      
      //this.runTests()

    }

    ImageProcessing.prototype.initContext = function(){
      
      var canvases = 
        {
            canvasOrigin: this.canvasOrigin
          , canvasStage: this.canvasStage
          , canvasShown: this.canvasShown
          , canvasCloneElement : this.canvasShownClone
        }

      this.context = new Context(canvases)  

      // Menubar
      this.brightness = new BrightnessStrategy(canvases, this.imageProcessor)
      this.context.addStackableStrategy(this.brightness)

      this.contrast = new ContrastStrategy(canvases, this.imageProcessor)
      this.context.addStackableStrategy(this.contrast)

      this.blur = new BlurStrategy(canvases, this.imageProcessor)
      this.context.addStackableStrategy(this.blur)

      this.outline = new OutlineStrategy(canvases, this.imageProcessor)

      //this.vector = new VectorizerStrategy(canvases, this.imageProcessor)


      // Toolbar
      this.floodfill = new FloodfillStrategy(canvases, this.imageProcessor, this.toolbar)
      this.context.addOneClickStrategy(this.floodfill)

      this.pencil = new PencilStrategy(canvases, this.imageProcessor, this.toolbar)
      this.context.addOneClickStrategy(this.pencil)

      this.shape = new ShapeStrategy(canvases, this.imageProcessor, this.toolbar)
      this.context.addOneClickStrategy(this.shape)         

      // TODO: debug crop for touch device
      if(!window.isTouchDevice){
        this.crop = new CropStrategy(canvases, this.imageProcessor, this.toolbar)
        this.context.addOneClickStrategy(this.crop)    
      }

      this.initCanvasStrategies()
    }
  

    /**
    * get matching strategy funcion, call it and pass current state
    */
    ImageProcessing.prototype.initCanvasStrategies = function(){

      if(window.isTouchDevice){
        this.canvasShownClone.on('touchcancel', 
          function() {
              console.log('event cancelled!')
              console.log(event)
          }
        )

        this.canvasShownClone.touchstart(
          function(event){
            event.preventDefault()
            if(!!this.toolbar.lastActive){
              this.context.oneClickStrategy(this.toolbar.mode()).mousedown(this.state(event.originalEvent.touches[0]))
            }
          }.bind(this)
        )

        this.canvasShownClone.touchmove( 
          function(event){
            event.preventDefault()
            // console.log(  "x: "+
            //               event.originalEvent.changedTouches[0].pageX+
            //               ", y: "+
            //               event.originalEvent.changedTouches[0].pageY)
            // console.log('touch move')
            // console.log(event)
            if(!!this.toolbar.lastActive){
              this.context.oneClickStrategy(this.toolbar.mode()).mousemove(this.state(event.originalEvent.changedTouches[0]))
            }
          }.bind(this)
        )

        this.canvasShownClone.touchend(
          function(event){
            event.preventDefault()
            if(!!this.toolbar.lastActive){
              this.context.oneClickStrategy(this.toolbar.mode()).mouseup(this.state(event.originalEvent.changedTouches[0]))
            }
          }.bind(this)
        )  
      }else{
        this.canvasShownClone.mousedown(
          function(event){
            if(!!this.toolbar.lastActive)
              this.context.oneClickStrategy(this.toolbar.mode()).mousedown(this.state(event))
          }.bind(this)
        )

        this.canvasShownClone.mousemove(
          function(event){
            if(!!this.toolbar.lastActive)
              this.context.oneClickStrategy(this.toolbar.mode()).mousemove(this.state(event))
          }.bind(this)
        )

        this.canvasShownClone.mouseup(
          function(event){
            if(!!this.toolbar.lastActive)
              this.context.oneClickStrategy(this.toolbar.mode()).mouseup(this.state(event))
          }.bind(this)
        )
      }
    }

    ImageProcessing.prototype.runTests = function(){
      var test = new Test()
      test.vector()      
    }

    ImageProcessing.prototype.state = function(event){

      var mouseCoords = this.canvasShown.mouseCoords(event)
      var totalImagePosition = this.canvasStage.totalImagePosition(mouseCoords)

      return {
              color: this.toolbar.foregroundColor()
            , mouse: mouseCoords
            , totalImagePosition: totalImagePosition
            , totalCartesianImagePosition: this.canvasStage.totalCartesianImagePosition(mouseCoords)
          }
    }

    // TODO: move this to own class
    ImageProcessing.prototype.initColorPicker = function(){

      $('.modalbox-wrapper.hidden').hide()
      $('.modalbox-wrapper').removeClass('hidden')

      var f = $.farbtastic('#picker')
      var p = $('#picker')
      var selected;

      $('.colorwell').each(function () { f.linkTo(this)})
      $('.farbtastic').addClass('center-block');
      $(".action-close-color-picker").click(function(e){
        $('#color-picker-modal').hide()
        var color = $('#color-picker-color').css('background-color')
        $('#toolbar-foreground-color').css({'background-color': color})
      })

      $("#color-picker-modal").draggable()


    }



// --------------------------------------
    return ImageProcessing
  })()
  return module.exports = ImageProcessing
})