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
      
      //this.runTests()

    }

    ImageProcessing.prototype.initContext = function(){
      this.context = new Context(this.canvasOrigin)

      // Menubar
      this.brightness = new BrightnessStrategy(this.canvasOrigin, this.canvasStage, this.canvasShown, this.imageProcessor)
      this.context.addStackableStrategy(this.brightness)

      this.contrast = new ContrastStrategy(this.canvasOrigin, this.canvasStage, this.canvasShown, this.imageProcessor)
      this.context.addStackableStrategy(this.contrast)

      this.blur = new BlurStrategy(this.canvasOrigin, this.canvasStage, this.canvasShown, this.imageProcessor)
      this.context.addStackableStrategy(this.blur)

      this.outline = new OutlineStrategy(this.canvasOrigin, this.canvasStage, this.canvasShown, this.imageProcessor)

      this.vector = new VectorizerStrategy(this.canvasOrigin, this.canvasStage, this.canvasShown, this.imageProcessor)


      // Toolbar
      this.floodfill = new FloodfillStrategy(this.canvasOrigin, this.canvasStage, this.canvasShown, this.imageProcessor, this.toolbar)
      this.context.addOneClickStrategy(this.floodfill)

      this.pencil = new PencilStrategy(this.canvasOrigin, this.canvasStage, this.canvasShown, this.imageProcessor, this.toolbar)
      this.context.addOneClickStrategy(this.pencil)

      this.crop = new CropStrategy(this.canvasOrigin, this.canvasStage, this.canvasShown, this.imageProcessor, this.toolbar)
      this.context.addOneClickStrategy(this.crop)      

      this.initCanvasStrategies()
    }
  


    ImageProcessing.prototype.initCanvasStrategies = function(){
      this.canvasShown.getElement().click(
        function(event){
          // get strategy funcion (execute), call it and pass current state
            this.context.oneClickStrategy(this.toolbar.mode()).execute(this.state(event))
        }.bind(this))
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