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

    ImageProcessingMenubarStrategy.MENU_TYP_FILTER = 'image'
    ImageProcessingMenubarStrategy.MENU_TYP_FILTER = 'filter'

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
        this.slideToggle()
      }.bind(this))

      $("."+name+"-controls").click(function(){
        if(this.isVisible()){
          this.cancel()
          this.slideToggle()
        }
      }.bind(this)).children().click(function(e) {
        return false; // prevent childs to do this action
      })

    }     

    // ImageProcessingStrategy.prototype.isEnabled = function(){
    //   return $("."+this.name+"-controls").attr("enabled") === "true" ? true : false
    // }

    ImageProcessingStrategy.prototype.isVisible = function(){
      return $("."+this.name+"-controls").is(':visible')
    }

    ImageProcessingStrategy.prototype.enable = function(enable){
      $("."+this.name+"-controls").setAttribute("enabled", enable)
    }         

    ImageProcessingStrategy.prototype.slideToggle = function(){
      // TODO: maka that nice
      var dir = $("#right-panel-small-device").position().left
      var MenuSliderIsVisible = dir < $('body').width()/2 ? true : false

      if(MenuSliderIsVisible){
        $("#right-panel-small-device").animate({left: "100%"}, "fast", function(){
          if(window.isSmallDevice){
            $(".controls").slideUp("fast")
          }
          $("."+this.name+"-controls").slideToggle("fast")
        }.bind(this));
      }else{
        $("."+this.name+"-controls").slideToggle("fast")
        if(window.isSmallDevice){
          $(".controls").slideUp("fast")
        }
      }

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
              this.updateAllStrategies(true)

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

    ImageProcessingMenubarStrategy.prototype.updateAllStrategies = function(preview){
      this.onChangeAction(this.refObj, preview)
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

      _this.reset = true
      _this.changed = false

      // run all filters whit this set to 0 (reset)
      if(!!_this.onChangeAction){
       _this.onChangeAction(_this.refObj, true)
      }

      _this.reset = false
      _this.okButton.hide()
      _this.nokButton.hide()
    
    }

    ImageProcessingMenubarStrategy.prototype.proceed = function(event, ui){   

      var _this
      if(this.className == 'ImageProcessingMenubarStrategy')
        _this = this
      else
        _this = event.data._this

      _this.changed = false

      // execute filter on origin canvas and rund other filters in previewmode in execute()
      _this.execute(null, false)
      // reset all values to 0
      _this.currentValue = 0
      $( "#"+_this.name+"-slider" ).slider({value: _this.currentValue})
      $( "#"+_this.name+"-slider-output" ).html(0)
      

      _this.okButton.hide()
      _this.nokButton.hide()
    }

    /**
    * Regular Menu bar
    */
    ImageProcessingMenubarStrategy.prototype.appendToMenuBar = function(label, name){
      this.appendToLGMenuBar(label, 'action-menu-'+name, this.menuTyp+'-actions-list')
      this.appendToSDMenuBar(label, 'action-menu-'+name, this.menuTyp+'-actions-list-sd')  
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