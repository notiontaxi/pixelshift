/*
Class for outline and threshold class

Florian Wokurka (2013)
https://github.com/notiontaxi
*/

"use strict"

define(['text!templates/task-vectorizer.html', 'js/ImageProcessingTask'], function(contentTemplate, ImageProcessingTask) {

var VectorizerTask, _ref, module,


  module = function() {}
  VectorizerTask = (function(_super){
    __extends(VectorizerTask, ImageProcessingTask);
// --------------------------------------



    function VectorizerTask(containerIdentifier,canvasOrigin, canvasStage, canvasShown,imageProcessor){    

      VectorizerTask.__super__.constructor(canvasOrigin, canvasStage, canvasShown, imageProcessor)
      // render templates
      $(containerIdentifier).append($(contentTemplate))
      this.init()
    }

    VectorizerTask.prototype.appendToMenuBar = function(){
      this.appendToLGMenuBar('Vectorizer', 'action-menu-vectorizer', 'image-actions-list')
      this.appendToSDMenuBar('Vectorizer', 'action-menu-vectorizer', 'image-actions-list-sd')  
    }   

    VectorizerTask.prototype.addMenuBarAction = function(){
      $(".action-menu-vectorizer").click(
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


    VectorizerTask.prototype.initializeTools = function(){

      // Automatic threshold button
      $("#action-show-paths").click(
        function(event, ui){
          var result = this.imageProcessor.processPathFinding(this.canvasOrigin.getImageData(), this.canvasOrigin.getImageWidth())
          this.canvasStage.paths = result.paths
          this.canvasStage.filter = result.filter
          this.canvasStage.pathType = 'dfsds'
          $("#path-count").html(result.message)
        }.bind(this)
      )

    }


// --------------------------------------
    return VectorizerTask
  })()
  return module.exports = VectorizerTask
})