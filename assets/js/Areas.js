/*
Class for outline and threshold class

Florian Wokurka (2013)
https://github.com/notiontaxi
*/

"use strict"

define(['text!templates/task-areas.html', 'js/ImageProcessor', 'js/CanvasGui'], function(contentTemplate, ImageProcessor, CanvasGui) {

var Areas, _ref, module,


  module = function() {}
  Areas = (function(_super){
    __extends(Areas, CanvasGui);
// --------------------------------------



    function Areas(containerIdentifier){    

      // render templates
      $(containerIdentifier).append($(contentTemplate))

      this.initializeTools()
      this.appendToMenuBar()
    }

    Areas.prototype.appendToMenuBar = function(){
      var li = $('<li/>')

      var a = $('<a/>', 
            {
                href: '#'
              , text: 'Floodfill'
              , id: 'action-menu-floodfill'
            }
          ).appendTo(li)

      li.appendTo('.image-actions-list')

      this.addMenuBarAction()
    }

    Areas.prototype.addMenuBarAction = function(){
      $("#action-menu-floodfill").click(
      function(event, ui){

        $(".floodfill-controls").slideToggle()
      })

      $(".floodfill-controls").click(function(){
        $(this).slideToggle()
      }).children().click(function(e) {
        return false; // prevent childs to do this action
      });


    }

    Areas.prototype.initializeTools = function(){

      // Automatic threshold button
      $("#action-flood-stack").click(
        function(event, ui){
          window.maxDepth = 0;
          var start = new Date().getTime();
          var newImg = this.imageProcessor.processFloodFill(this.canvas.getImageData(), this.canvas.getImageWidth(), 'four')
          var end = new Date().getTime();
          var time = end - start;
          this.canvas.putImageData(newImg)    
          $( "#algo-times" ).html("CPU time: "+time+" ms | Max stack: "+window.maxDepth);
        }.bind(this)
      )

      // Outline button
      $("#action-flood-queue").click(
        function(event, ui){
          window.maxWidth = 0;
          var start = new Date().getTime();
          var newImg = this.imageProcessor.processFloodFill(this.canvas.getImageData(), this.canvas.getImageWidth(), 'eight')
          var end = new Date().getTime();
          var time = end - start;
     
          $( "#algo-times" ).html("CPU time: "+time+" ms");

        }.bind(this)
      )   
 

    }


// --------------------------------------
    return Areas
  })()
  return module.exports = Areas
})