/*
Class for outline and threshold class

Florian Wokurka (2013)
https://github.com/notiontaxi
*/

"use strict"

define(['text!templates/task-vectorizer.html', 'js/ImageProcessor', 'js/CanvasGui'], function(contentTemplate, ImageProcessor, CanvasGui) {

var Vectorizer, _ref, module,


  module = function() {}
  Vectorizer = (function(_super){
    __extends(Vectorizer, CanvasGui);
// --------------------------------------



    function Vectorizer(containerIdentifier){    

      // render templates
      $(containerIdentifier).append($(contentTemplate))

      this.initializeTools()
      this.appendToMenuBar()

    }

    Vectorizer.prototype.appendToMenuBar = function(){
      var li = $('<li/>')

      var a = $('<a/>', 
            {
                href: '#'
              , text: 'Vectorizer'
              , id: 'action-menu-vectorizer'
            }
          ).appendTo(li)

      li.appendTo('.image-actions-list')

      this.addMenuBarAction()
    }

    Vectorizer.prototype.addMenuBarAction = function(){
      $("#action-menu-vectorizer").click(
      function(event, ui){
        $(".vectorizer-controls").slideToggle()
      })

      $(".vectorizer-controls").click(function(){
        $(this).slideToggle()
      }).children().click(function(e) {
        return false; // prevent childs to do this action
      });


    }


    Vectorizer.prototype.initializeTools = function(){

      // Automatic threshold button
      $("#action-show-paths").click(
        function(event, ui){
          var newImg = this.imageProcessor.processPathFinding(this.canvasOrigin.getImageData(), this.canvasOrigin.getImageWidth())
          this.canvasOrigin.putImageData(newImg)
          this.canvasStage.zoomIn()
        }.bind(this)
      )

    }


// --------------------------------------
    return Vectorizer
  })()
  return module.exports = Vectorizer
})