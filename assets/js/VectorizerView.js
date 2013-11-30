/*
Class for outline and threshold class

Florian Wokurka (2013)
https://github.com/notiontaxi
*/

"use strict"

define(['text!templates/task-vectorizer.html', 'js/ImageProcessor', 'js/CanvasGui'], function(contentTemplate, ImageProcessor, CanvasGui) {

var VectorizerView, _ref, module,


  module = function() {}
  VectorizerView = (function(_super){
    __extends(VectorizerView, CanvasGui);
// --------------------------------------



    function VectorizerView(containerIdentifier){    

      // render templates
      $(containerIdentifier).append($(contentTemplate))

      this.initializeTools()
      this.appendToMenuBar()

    }

    VectorizerView.prototype.appendToMenuBar = function(){
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

    VectorizerView.prototype.addMenuBarAction = function(){
      $("#action-menu-vectorizer").click(
      function(event, ui){
        event.stopPropagation()
        event.preventDefault()
        $(".dropdown").removeClass("open")
        $(".vectorizer-controls").slideToggle()
      })

      $(".vectorizer-controls").click(function(){
        $(this).slideToggle()
      }).children().click(function(e) {
        return false; // prevent childs to do this action
      });


    }


    VectorizerView.prototype.initializeTools = function(){

      // Automatic threshold button
      $("#action-show-paths").click(
        function(event, ui){
          var result = this.imageProcessor.processPathFinding(this.canvasOrigin.getImageData(), this.canvasOrigin.getImageWidth())
          $("#path-count").html(result.message)
          this.canvasOrigin.putImageData(result.imageData)
        }.bind(this)
      )

    }


// --------------------------------------
    return VectorizerView
  })()
  return module.exports = VectorizerView
})