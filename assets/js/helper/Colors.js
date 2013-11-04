/*
Class for outline and threshold class

Florian Wokurka (2013)
https://github.com/notiontaxi
*/

"use strict"

define([], function() {

var Colors, module,


  module = function() {}
  Colors = (function(_super){

// --------------------------------------



    function Colors(containerIdentifier){    
      this.randomCurrentColorNr = 0
      this.generateColors()
    }


    Colors.prototype.generateColors = function(){
      this.colors = new Array()

      this.colors.push({name: 'crimson'       ,values:{r: 220 ,g:20  ,b:60}})
      this.colors.push({name: 'darkmagenta'   ,values:{r: 139 ,g:0   ,b:139}})  
      this.colors.push({name: 'darkviolet'    ,values:{r: 148 ,g:0   ,b:211}})  
      this.colors.push({name: 'royalblue'     ,values:{r: 65  ,g:105 ,b:225}})  
      this.colors.push({name: 'lightsteelblue',values:{r: 176 ,g:196 ,b:222}})  
      this.colors.push({name: 'darkturquoise' ,values:{r: 10   ,g:206 ,b:209}})  
      this.colors.push({name: 'aqua'          ,values:{r: 10   ,g:255 ,b:255}})  
      this.colors.push({name: 'lightseagreen' ,values:{r: 32  ,g:178 ,b:170}})  
      this.colors.push({name: 'aquamarine'    ,values:{r: 127 ,g:255 ,b:212}})  
      this.colors.push({name: 'lightgreen'    ,values:{r: 144 ,g:238 ,b:144}})  
      this.colors.push({name: 'darkseagreen'  ,values:{r: 143 ,g:188 ,b:143}})  
      this.colors.push({name: 'forestgreen'   ,values:{r: 34  ,g:139 ,b:34}})  
      this.colors.push({name: 'crimson'       ,values:{r: 220 ,g:20  ,b:60}}) 
      this.colors.push({name: 'red'           ,values:{r: 128 ,g:0   ,b:0}})   
      this.colors.push({name: 'strongred'     ,values:{r: 205 ,g:0   ,b:0}})                     
    }

    Colors.prototype.getColors = function(){
      return this.colors
    }

    /* r g b values between 1 and 254 */
    Colors.prototype.getRandomColor = function(){
      return {  name: 'random'   ,
                values:{
                    r: Math.round(Math.random() * 253)+1
                  , g: Math.round(Math.random() * 253)+1 
                  , b: Math.round(Math.random() * 253)+1
                },
                nr: this.randomCurrentColorNr++
              }
    }


// --------------------------------------
    return Colors
  })()
  return module.exports = Colors
})