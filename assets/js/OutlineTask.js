/*
Class for outline and threshold class

Florian Wokurka (2013)
https://github.com/notiontaxi
*/

"use strict"

define(['text!templates/task-outline.html','js/ImageProcessingTask'], function(contentTemplate, ImageProcessingTask) {

var OutlineTask, _ref, module,


  module = function() {}
  OutlineTask = (function(_super){
  __extends(OutlineTask, ImageProcessingTask)
// --------------------------------------


    function OutlineTask(containerIdentifier, canvasOrigin, canvasStage, canvasShown,imageProcessor){

      OutlineTask.__super__.constructor(canvasOrigin, canvasStage ,canvasShown, imageProcessor)

      // render templates
      $(containerIdentifier).append($(contentTemplate))
    }


    OutlineTask.prototype.updateThreshold = function(threshold){

      var imgDataLeft = this.canvasOrigin.getImageData()

      // compute threshold automatically, if not set          multiplycation cause input is 0-100
      if(typeof threshold === 'undefined'){
        threshold = this.imageProcessor.computeThreshold(imgDataLeft)
        this.canvasOrigin.putImageData(this.imageProcessor.processThreshold(threshold, imgDataLeft))
      }else{
        threshold*2.55
        this.canvasStage.putImageData(this.imageProcessor.processThreshold(threshold, imgDataLeft))
      }

      return threshold
    }

    OutlineTask.prototype.appendToMenuBar = function(){
      var li = $('<li/>')

      var a = $('<a/>', 
            {
                href: '#'
              , text: 'Outline'
              , id: 'action-menu-outline'
            }
          ).appendTo(li)

      li.appendTo('.image-actions-list')

      this.addMenuBarAction()
    }

    OutlineTask.prototype.addMenuBarAction = function(){
      $("#action-menu-outline").click(
      function(event, ui){
        event.stopPropagation()
        event.preventDefault()
        $(".dropdown").removeClass("open")
        $(".outline-controls").slideToggle()
      })

      $(".outline-controls").click(function(){
        $(this).slideToggle()
      }).children().click(function(e) {
        return false; // prevent childs to do this action
      });
    }

    OutlineTask.prototype.initializeTools = function(){

      // threshold slider
      $( "#slider-0" ).slider(
        {
          range: "min",
          value: 50,
          min: 0,
          max: 100,
          slide: function( event, ui ) {
            $( "#slider-0-output" ).html(ui.value);
            this.updateThreshold(ui.value)
          }.bind(this)
        }
      );

      // Automatic threshold button
      $("#action-automatic-threshold").click(
        function(event, ui){
          var treshhold = this.updateThreshold()/2.55
          $( "#slider-0" ).slider('option',{value: Math.round(treshhold)});
          $( "#slider-0-output" ).html(Math.round(treshhold));
        }.bind(this)
      )


      // Outline button
      $("#action-dilation").click(
        function(event, ui){
          var newImg = this.imageProcessor.processDilation(this.canvasOrigin.getImageData(), this.canvasOrigin.getImageWidth())
          this.canvasOrigin.putImageData(newImg)
        }.bind(this)
      )   

      // Outline button
      $("#action-erosion").click(
        function(event, ui){
          var newImg = this.imageProcessor.processErosion(this.canvasOrigin.getImageData(), this.canvasOrigin.getImageWidth())
          this.canvasOrigin.putImageData(newImg)
        }.bind(this)
      )   

      // Outline button
      $("#action-outline").click(
        function(event, ui){
          var newImg = this.imageProcessor.processOutline(this.canvasOrigin.getImageData(), this.canvasOrigin.getImageData() ,this.canvasOrigin.getImageWidth())
          this.canvasOrigin.putImageData(newImg)
        }.bind(this)
      )

      $("#threshold-ok").click(
        function(event, ui){
          this.canvasOrigin.putImageData(this.canvasStage.getImageData())
        }.bind(this)
      )

      $("#threshold-nok").click(
        function(event, ui){
          this.canvasOrigin.copyToClones()
        }.bind(this)
      )

    }



// --------------------------------------
    return OutlineTask
  })()
  return module.exports = OutlineTask
})