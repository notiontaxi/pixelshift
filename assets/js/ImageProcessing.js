/*
Class for outline and threshold class

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
  'js/strategies/ContrastStrategy',
  'js/CanvasGui', 
  'js/test/Test',
  'js/Toolbar',
  'js/Context'], function(contentTemplate, 
    OutlineStrategy, 
    VectorizerStrategy, 
    FloodfillStrategy,
    PencilStrategy,
    BrightnessStrategy, 
    ContrastStrategy,
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
      this.context = new Context()

      this.brightness = new BrightnessStrategy(this.canvasOrigin, this.canvasStage, this.canvasShown, this.imageProcessor)
      this.context.addStrategy(this.brightness)      

      this.contrast = new ContrastStrategy(this.canvasOrigin, this.canvasStage, this.canvasShown, this.imageProcessor)
      this.context.addStrategy(this.contrast)       

      this.outline = new OutlineStrategy(this.canvasOrigin, this.canvasStage, this.canvasShown, this.imageProcessor)
      this.context.addStrategy(this.outline)

      this.vector = new VectorizerStrategy(this.canvasOrigin, this.canvasStage, this.canvasShown, this.imageProcessor)
      this.context.addStrategy(this.vector)

      this.floodfill = new FloodfillStrategy(this.canvasOrigin, this.canvasStage, this.canvasShown, this.imageProcessor)
      this.context.addStrategy(this.floodfill)

      this.pencil = new PencilStrategy(this.canvasOrigin, this.canvasStage, this.canvasShown, this.imageProcessor)
      this.context.addStrategy(this.pencil)

      this.initCanvasStrategies()
    }

    ImageProcessing.prototype.initCanvasStrategies = function(){
      this.canvasShown.getElement().click(
        function(event){
          // get strategy funcion (execute), call it and pass curent state
            this.context.strategy(this.toolbar.mode()).execute(this.state(event))
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
            //, totalCoords: this.canvasShown.coordinateToUnzoomedSystem(event) 
            , mouse: mouseCoords
            , totalImagePosition: totalImagePosition
          }
    }


    /*
    Canvas.prototype.clickAction = function(event){
      var absoluteCoords = this.mouseCoords(event)
      var relativeCoords = this.coordinateToUnzoomedSystem(absoluteCoords)
      console.log(absoluteCoords)
      console.log(relativeCoords)
      this.drawPoint(absoluteCoords, 5)
    }
    }*/

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
        //color = color.replace('b', 'ba')  
        //color = color.replace(')', ', 125)')  
        $('#toolbar-foreground-color').css({'background-color': color})
      })

      $("#color-picker-modal").draggable()

    }




// --------------------------------------
    return ImageProcessing
  })()
  return module.exports = ImageProcessing
})