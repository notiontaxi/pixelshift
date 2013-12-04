/*
Class for outline and threshold class

Florian Wokurka (2013)
https://github.com/notiontaxi
*/

"use strict"

define(['text!templates/task-areas.html', 'js/ImageProcessingTask'], function(contentTemplate, ImageProcessingTask) {

var AreasTask, _ref, module,


  module = function() {}
  AreasTask = (function(_super){
    __extends(AreasTask, ImageProcessingTask);
// --------------------------------------



    function AreasTask(containerIdentifier,canvasOrigin,canvasStage,canvasShown,imageProcessor){   

      AreasTask.__super__.constructor(canvasOrigin, canvasStage, canvasShown, imageProcessor)
      // render templates
      $(containerIdentifier).append($(contentTemplate))

      this.init()
    }


    ImageProcessingTask.prototype.appendToMenuBar = function(){
      this.appendToLGMenuBar('Floodfill', 'action-menu-floodfill', 'image-actions-list')
      this.appendToSDMenuBar('Floodfill', 'action-menu-floodfill', 'image-actions-list-sd')  
    }

    AreasTask.prototype.addMenuBarAction = function(){
      $(".action-menu-floodfill").click(
      function(event, ui){
        event.stopPropagation()
        event.preventDefault()
        $(".dropdown").removeClass("open")
        $(".floodfill-controls").slideToggle()
      })

      $(".floodfill-controls").click(function(){
        $(this).slideToggle()
      }).children().click(function(e) {
        return false; // prevent childs to do this action
      });


    }


    AreasTask.prototype.initializeTools = function(){

      // Automatic threshold button
      $("#action-flood-stack").click(
        function(event, ui){
          window.maxDepth = 0;
          var start = new Date().getTime();
          var newImg = this.imageProcessor.processFloodFill(this.canvasOrigin.getImageData(), this.canvasOrigin.getImageWidth(), 'four')
          var end = new Date().getTime();
          var time = end - start;
          this.canvasOrigin.putImageData(newImg)    
          $( "#algo-times" ).html("CPU time: "+time+" ms | Max stack: "+window.maxDepth);
        }.bind(this)
      )

      // Outline button
      $("#action-flood-queue").click(
        function(event, ui){
          window.maxWidth = 0;
          var start = new Date().getTime();
          var newImg = this.imageProcessor.processFloodFill(this.canvasOrigin.getImageData(), this.canvasOrigin.getImageWidth(), 'eight')
          var end = new Date().getTime();
          var time = end - start;
     
          $( "#algo-times" ).html("CPU time: "+time+" ms");

        }.bind(this)
      )   
    }


// --------------------------------------
    return AreasTask
  })()
  return module.exports = AreasTask
})