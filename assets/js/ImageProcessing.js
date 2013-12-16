/*
Class for outline and threshold class

Florian Wokurka (2013)
https://github.com/notiontaxi
*/

"use strict"

define(['text!templates/image-processing.html',
  'js/OutlineTask',
  'js/VectorizerTask', 
  'js/FloodfillTask',
  'js/PencilTask',
  'js/CanvasGui', 
  'js/test/Test',
  'js/Toolbar',
  'js/Context'], function(contentTemplate, 
    OutlineTask, 
    VectorizerTask, 
    FloodfillTask,
    PencilTask, 
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
      
      new OutlineTask(   ".controls-wrapper", this.canvasOrigin, this.canvasStage, this.canvasShown, this.imageProcessor)
      new VectorizerTask(".controls-wrapper", this.canvasOrigin, this.canvasStage, this.canvasShown, this.imageProcessor)
      new FloodfillTask( ".controls-wrapper", this.canvasOrigin, this.canvasStage, this.canvasShown, this.imageProcessor)
      new PencilTask( ".controls-wrapper", this.canvasOrigin, this.canvasStage, this.canvasShown, this.imageProcessor)
      this.context = new Context()

      this.initCanvasStrategies()

      var test = new Test()
      test.vector()
    }

    ImageProcessing.prototype.initCanvasStrategies = function(){
      this.canvasShown.getElement().click(
        function(event){
            this.context.strategy(event, this.toolbar.mode())
        }.bind(this))
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
        $('#toolbar-foreground-color').css({'background-color': color})
      })

      $("#color-picker-modal").draggable()

    }




// --------------------------------------
    return ImageProcessing
  })()
  return module.exports = ImageProcessing
})