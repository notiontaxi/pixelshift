/*
Class for outline and threshold class

Florian Wokurka (2013)
https://github.com/notiontaxi
*/

"use strict"

define(['text!templates/image-processing.html','js/OutlineTask', 'js/AreasTask','js/VectorizerTask','js/CanvasGui', 'js/test/Test'], function(contentTemplate, OutlineTask, AreasTask, VectorizerTask, CanvasGui, Test) {

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

      new OutlineTask(".controls-wrapper", this.canvasOrigin, this.canvasStage, this.canvasShown, this.imageProcessor)
      new AreasTask(".controls-wrapper", this.canvasOrigin, this.canvasStage, this.canvasShown, this.imageProcessor)
      new VectorizerTask(".controls-wrapper", this.canvasOrigin, this.canvasStage, this.canvasShown, this.imageProcessor)

      var test = new Test()
      test.vector()
    }

    ImageProcessing.prototype.initColorPicker = function(){


      $('.modalbox-wrapper').hide()
      $('.modalbox-wrapper').removeClass('hidden')

      var f = $.farbtastic('#picker')
      var p = $('#picker')
      var selected;
      $('.colorwell')
        .each(function () { f.linkTo(this)})
        // for different colors
        /*
        .focus(function() {
          if (selected) {
            $(selected).css('opacity', 0.75).removeClass('colorwell-selected');
          }
          f.linkTo(this);
          p.css('opacity', 1);
          $(selected = this).css('opacity', 1).addClass('colorwell-selected');
        });
        */

      $('.farbtastic').addClass('center-block');

      $(".action-close-modal").click(function(e){
        $('#color-picker-modal').hide()
        var color = $('#color-picker-color').css('background-color')
        $('.color-chooser-button').css({'background-color': color})
        color = color.replace('rgb', 'rgba')
        color = color.replace(')', ', 0.5)')
        $('.color-chooser-button').css({'color': color})
      })

      $("#color-picker-modal").draggable()

    }




// --------------------------------------
    return ImageProcessing
  })()
  return module.exports = ImageProcessing
})