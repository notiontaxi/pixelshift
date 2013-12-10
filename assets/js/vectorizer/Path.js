/*
Class for outline and threshold class

Florian Wokurka (2013)
https://github.com/notiontaxi
*/

"use strict"

define(['js/vectorizer/Edge'], function(Edge) {

var Path, _ref, module,


  module = function() {}
  Path = (function(_super){

// --------------------------------------



    function Path(isOutline, imageData, imageWidth){   
      this.isOutline = isOutline
      this.straightPaths = Array()

      if(isOutline)
        this.lookFor = 0
      else
        this.lookFor = 255

      this.edges = Array()
      this.imageData = imageData
      this.imageWidth = imageWidth
    }

    Path.prototype.addEdge = function(edge){
      this.edges.push(edge)
    }

    Path.prototype.getEdges = function(){
      return this.edges
    }



    Path.prototype.findPath = function(startPixel){

      this.startEdge = new Edge(Edge.EDGETYPE_LEFT, startPixel, startPixel-4 , this.imageWidth)
      this.edges.push(this.startEdge)
      var currentEdge = this.startEdge
      var notFinished = true

      while(notFinished){
        var nextEdge = this.getNextEdgeOf(currentEdge)

        this.edges.push(nextEdge)
        currentEdge = nextEdge

        if(currentEdge.equals(this.startEdge))
          notFinished = false
      }
    }

    Path.prototype.getPoints = function(){

      if(!this.points){
        var newEdges = Array()
        newEdges.push(this.edges[0])

        for(var i = 1; i < this.edges.length; i++){
          if(this.edges[i].pixelFilled != this.edges[i-1].pixelFilled)
            newEdges.push(this.edges[i])
        }
        this.points = newEdges
      }
      return this.points
    }

    Path.prototype.getFilteredPoints = function(filter){

      if(!this.filteredPoints){
        this.filteredPoints = Array()
        
        var points = this.edges
        var points
        var lastI = 0
        this.filteredPoints.push(points[0])

        for(var i = 0; i < filter.length;){
          
          //console.log('i: '+i)
          //console.log('filter[i]: '+filter[i])
          this.filteredPoints.push(points[filter[i]])
          i = filter[i]          

          if(i < lastI){
            // remove first point, is a shorter connection was found
            this.filteredPoints.shift()
            // don't star over at the begining... this would be endless
            break
          }
          lastI = i


        }

      //console.log('filter:')
      //console.log(filter)
      //this.log(this.filteredPoints)        

      }

      return this.filteredPoints
    }

    Path.prototype.getNextEdgeOf = function(edge){

      var nextEdge

      switch(edge.type){
        case Edge.EDGETYPE_LEFT:
          nextEdge = this.getNextEdgeFromLeft(edge)
          break
        case Edge.EDGETYPE_BOTTOM:
          nextEdge = this.getNextEdgeFromBottom(edge)
          break
        case Edge.EDGETYPE_RIGHT:
          nextEdge = this.getNextEdgeFromRight(edge)
          break
        case Edge.EDGETYPE_TOP:
          nextEdge = this.getNextEdgeFromTop(edge)
          break
      }


      return nextEdge
    }

    Path.prototype.getNextEdgeFromLeft = function(edge){

      var leftLowerPosition = edge.pixelFilled + this.imageWidth * 4 - 4 
      var lowerPosition = edge.pixelFilled + this.imageWidth * 4
      var edge

      if(this.imageData.data[leftLowerPosition] == this.lookFor){
        edge = this.buildEdge(Edge.EDGETYPE_TOP, leftLowerPosition, leftLowerPosition - this.imageWidth * 4)
      }else if(this.imageData.data[lowerPosition] == this.lookFor){
        edge = this.buildEdge(Edge.EDGETYPE_LEFT, lowerPosition, leftLowerPosition)
      }else{
        edge = this.buildEdge(Edge.EDGETYPE_BOTTOM, edge.pixelFilled, lowerPosition)
      }
      return edge
    }

    Path.prototype.getNextEdgeFromBottom = function(edge){
      var rightLowerPosition = edge.pixelFilled + this.imageWidth * 4 + 4 
      var rightPosition = edge.pixelFilled + 4
      var edge

      if(this.imageData.data[rightLowerPosition] == this.lookFor){
        edge = this.buildEdge(Edge.EDGETYPE_LEFT, rightLowerPosition, rightLowerPosition - 4)
      }else if(this.imageData.data[rightPosition] == this.lookFor){
        edge = this.buildEdge(Edge.EDGETYPE_BOTTOM, rightPosition, rightLowerPosition)
      }else{
        edge = this.buildEdge(Edge.EDGETYPE_RIGHT, edge.pixelFilled, rightPosition)
      }
      return edge     
    }

    Path.prototype.getNextEdgeFromRight = function(edge){
      var rightUpperPosition = edge.pixelFilled - this.imageWidth * 4 + 4 
      var upperPosition = edge.pixelFilled - this.imageWidth * 4
      var edge

      if(this.imageData.data[rightUpperPosition] == this.lookFor){
        edge = this.buildEdge(Edge.EDGETYPE_BOTTOM, rightUpperPosition, edge.pixelFilled + 4)
      }else if(this.imageData.data[upperPosition] == this.lookFor){
        edge = this.buildEdge(Edge.EDGETYPE_RIGHT, upperPosition, rightUpperPosition)
      }else{
        edge = this.buildEdge(Edge.EDGETYPE_TOP, edge.pixelFilled, upperPosition)
      }
      return edge           
    }

    Path.prototype.getNextEdgeFromTop = function(edge){
      var leftUpperPosition = edge.pixelFilled - this.imageWidth * 4 - 4 
      var leftPosition = edge.pixelFilled - 4
      var edge

      if(this.imageData.data[leftUpperPosition] == this.lookFor){
        edge = this.buildEdge(Edge.EDGETYPE_RIGHT, leftUpperPosition, leftUpperPosition + 4)
      }else if(this.imageData.data[leftPosition] == this.lookFor){
        edge = this.buildEdge(Edge.EDGETYPE_TOP, leftPosition, leftUpperPosition)
      }else{
        edge = this.buildEdge(Edge.EDGETYPE_LEFT, edge.pixelFilled, leftPosition)
      }
      return edge         
    }   

    Path.prototype.buildEdge = function(type, pixelfilled, pixelempty){

      var edge

      if(this.isOutline)
        edge = new Edge(type, pixelfilled, pixelempty, this.imageWidth)
      else
        edge = new Edge(type, pixelfilled, pixelempty, this.imageWidth)

      return edge
    }


// --------------------------------------
    return Path
  })()
  return module.exports = Path
})