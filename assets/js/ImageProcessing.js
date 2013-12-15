/*
Class for outline and threshold class

Florian Wokurka (2013)
https://github.com/notiontaxi
*/

"use strict"

define(['text!templates/image-processing.html','js/OutlineTask','js/VectorizerTask', 'js/FloodfillTask','js/CanvasGui', 'js/test/Test','js/Toolbar'], function(contentTemplate, OutlineTask, VectorizerTask, FloodfillTask, CanvasGui, Test, Toolbar) {

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
      this.initToolbar()

      new OutlineTask(   ".controls-wrapper", this.canvasOrigin, this.canvasStage, this.canvasShown, this.imageProcessor)
      new VectorizerTask(".controls-wrapper", this.canvasOrigin, this.canvasStage, this.canvasShown, this.imageProcessor)
      new FloodfillTask( ".controls-wrapper", this.canvasOrigin, this.canvasStage, this.canvasShown, this.imageProcessor)
      

      var test = new Test()
      test.vector()
    }

    ImageProcessing.prototype.initToolbar = function(){
      this.toolbar = new Toolbar('#toolbar-modal .content')
      $("#toolbar-modal").draggable()
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