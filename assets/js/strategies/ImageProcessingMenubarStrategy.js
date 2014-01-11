/*
ImageProcessingMenubarStrategy class

Florian Wokurka (2013)
https://github.com/notiontaxi
*/

"use strict"

define(['js/strategies/ImageProcessingStrategy'], function(ImageProcessingStrategy) {

var ImageProcessingMenubarStrategy, _ref, module,


  module = function() {}
  ImageProcessingMenubarStrategy = (function(_super){
  __extends(ImageProcessingMenubarStrategy, ImageProcessingStrategy)
// --------------------------------------


    function ImageProcessingMenubarStrategy(canvases, imageProcessor){
      this.className = "ImageProcessingMenubarStrategy"
      ImageProcessingMenubarStrategy.__super__.constructor(canvases, imageProcessor)
      this.changed = false
    }


    ImageProcessingMenubarStrategy.prototype.init = function(){
        this.initializeTools()
        this.appendToMenuBar(this.label, this.name)
        this.addMenuBarAction(this.name)
    }

    ImageProcessingMenubarStrategy.prototype.addMenuBarAction = function(){

      var name = this.name

      $(".action-menu-"+name).click(
      function(event, ui){
        event.stopPropagation()
        event.preventDefault()
        $(".dropdown").removeClass("open")
        $("."+name+"-controls").slideToggle()
      })

      $("."+name+"-controls").click(function(){
        console.log('click')
        if(this.isEnabled()){
          this.cancel()
          this.slideToggle()
        }
      }.bind(this)).children().click(function(e) {
        return false; // prevent childs to do this action
      })

      $("."+name+"-controls").parent().click(function(){
        console.log('click')
        event.stopPropagation()
        event.preventDefault()
        return false
      })
    }     

    ImageProcessingStrategy.prototype.isEnabled = function(){
      return $("."+this.name+"-controls").attr("enabled") === "true" ? true : false
    }

    ImageProcessingStrategy.prototype.enable = function(enable){
      $("."+this.name+"-controls").setAttribute("enabled", enable)
    }         

    ImageProcessingStrategy.prototype.slideToggle = function(){
      $("."+this.name+"-controls").slideToggle()
    }

    ImageProcessingMenubarStrategy.prototype.initializeTools = function(){
      console.error("initalizeTools() not implementet jet")
    }

    // is called in Context.js -> run over stacked startegies
    ImageProcessingMenubarStrategy.prototype.setOnChangeAction = function(action, obj){
      this.onChangeAction = action
      this.refObj = obj
    }

    ImageProcessingMenubarStrategy.prototype.initializeDefaultSlider = function(name, value, min, max){

      this.okButton = $("#"+name+"-ok")
      this.nokButton = $("#"+name+"-nok")

      // brightness slider
      $( "#"+name+"-slider" ).slider(
        {
          range: "min",
          value: value,
          min: min,
          max: max,
          slide: function( event, ui ) {
            $( "#"+name+"-slider-output" ).html(ui.value)
            this.currentValue = ui.value
            this.changed = true

            this.okButton.show()
            this.nokButton.show()

            if(!!this.onChangeAction)
              this.onChangeAction(this.refObj, true)

          }.bind(this)
        }
      )

      this.okButton.hide()
      this.okButton.removeClass('hidden')
      this.okButton.click({_this: this}, this.proceed)

      this.nokButton.hide()
      this.nokButton.removeClass('hidden')
      this.nokButton.click({_this: this}, this.cancel)
    }

    // set all values to 0 and repaint with remaining filters
    ImageProcessingMenubarStrategy.prototype.cancel = function(event, ui){

      var _this
      if(this.className === 'ImageProcessingMenubarStrategy')
        _this = this
      else
        _this = event.data._this

      _this.currentValue = 0
      $( "#"+_this.name+"-slider" ).slider({value: 0})
      $( "#"+_this.name+"-slider-output" ).html(0)

      if(!!_this.onChangeAction)
       _this.onChangeAction(_this.refObj, true)

      _this.okButton.hide()
      _this.nokButton.hide()

      _this.changed = false   
    }

    ImageProcessingMenubarStrategy.prototype.proceed = function(event, ui){   

      var _this
      if(this.className == 'ImageProcessingMenubarStrategy')
        _this = this
      else
        _this = event.data._this

      _this.execute(null, false)
      // reset all values to 0
      _this.currentValue = 0
      $( "#"+_this.name+"-slider" ).slider({value: _this.currentValue})
      $( "#"+_this.name+"-slider-output" ).html(0)
      _this.changed = false

      _this.okButton.hide()
      _this.nokButton.hide()
    }

    /**
    * Regular Menu bar
    */
    ImageProcessingMenubarStrategy.prototype.appendToMenuBar = function(label, name){
      this.appendToLGMenuBar(label, 'action-menu-'+name, 'image-actions-list')
      this.appendToSDMenuBar(label, 'action-menu-'+name, 'image-actions-list-sd')  
    }

    ImageProcessingMenubarStrategy.prototype.appendToLGMenuBar = function(text, className, typeName){
      var li = $('<li/>')

      var a = $('<a/>', 
            {
                href: '#'
              , text: text
              , class: className
            }
          ).appendTo(li)

      li.appendTo('.'+typeName)
    }

    ImageProcessingMenubarStrategy.prototype.appendToSDMenuBar = function(text, className, typeName){

      var li = $('<li/>');
      var button = $('<button/>', 
            {
                text: text
              , class: className+' btn btn-default small-menu-btn'
            }
          ).appendTo(li)

      var span = $('<span/>', 
          {
            class: '' // later be used for icons
          }
        ).appendTo(button)

      li.appendTo('.'+typeName)
    }



// --------------------------------------
    return ImageProcessingMenubarStrategy
  })()
  return module.exports = ImageProcessingMenubarStrategy
})