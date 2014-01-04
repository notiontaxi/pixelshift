/*
Class for outline and threshold class

Florian Wokurka (2013)
https://github.com/notiontaxi
*/

"use strict"

define(['js/vectorizer/Edge', 'js/math/Vector'], function(Edge, Vector) {

var Path, _ref, module,


  module = function() {}
  Path = (function(_super){

// --------------------------------------



    function Path(isOutline, imageData, imageWidth){   
      this.isOutline = isOutline
      this.straightPaths = Array()
      this.allowedPoints = null
      this.straighPoints = null

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

    Path.prototype.getAllowedPoints = function(){
      if(this.allowedPoints == null)
        if(this.edges.length <= 5)
          this.allowedPoints = this.edges
        else
          this.allowedPoints = this.getFilteredPoints(this.allowed)

      return this.allowedPoints
    }
    Path.prototype.getStraightPoints = function(){
      if(this.straightPoints == null)
        if(this.edges.length <= 4)
          this.straightPoints = this.edges
        else
          this.straightPoints = this.getFilteredPoints(this.straight)

      return this.straightPoints
    }    

    Path.prototype.getBezierPath = function(curveLimit){
      var allowedPoints = this.getAllowedPoints()

      var bezierPath = Array()
      var currentCurve = {
          p1: {x:0, y:0}
        , p2: {x:0, y:0}
        , cp1: {x:0, y:0}
        , cp2: {x:0, y:0}
      }
      var modulo = allowedPoints.length - 1

      var currentPointA, currentPointB, currentPointC, bezierPointA, bezierPointB, controllPointA, controllPointB, alpha, 
          v, a, normal, substracted, distance

      for(var i = 0; i < allowedPoints.length-1; i++){
        currentPointA  = allowedPoints[i % modulo].gaussCoords
        currentPointB  = allowedPoints[(i+1) % modulo].gaussCoords
        currentPointC  = allowedPoints[(i+2) % modulo].gaussCoords
        bezierPointA   = {  
                            x: currentPointA.x + ((currentPointB.x - currentPointA.x)/2), 
                            y: currentPointA.y + ((currentPointB.y - currentPointA.y)/2)
                         }
        bezierPointB   = {  
                            x: currentPointC.x + ((currentPointB.x - currentPointC.x)/2), 
                            y: currentPointC.y + ((currentPointB.y - currentPointC.y)/2)
                         }

        v = new Vector({x:0,y:0},currentPointB)
        a = new Vector({x:0,y:0},bezierPointA)

        normal = Vector.normal(bezierPointA, bezierPointB)
        Vector.normalizedPositive(normal)

        substracted = new Vector({x:0,y:0},{x:0,y:0})
        Vector.substract(v,a,substracted)

        distance = Vector.dot(normal, substracted)
        distance = distance < 0 ? distance*-1 : distance

        alpha = (4/3) * ((distance - .5) / distance)
        alpha = alpha < curveLimit ? curveLimit : alpha


        controllPointA   = {  
                            x: bezierPointA.x + ((currentPointB.x - bezierPointA.x)*alpha), 
                            y: bezierPointA.y + ((currentPointB.y - bezierPointA.y)*alpha)
                         }
        controllPointB   = {  
                            x: bezierPointB.x + ((currentPointB.x - bezierPointB.x)*alpha), 
                            y: bezierPointB.y + ((currentPointB.y - bezierPointB.y)*alpha)
                         }
        /*                 
        console.log(currentPointA)
        console.log(currentPointB)
        console.log(currentPointC)
        console.log(bezierPointA)
        console.log(bezierPointB)
        v.print()
        a.print()
        console.log(distance)
        console.log(alpha)
        console.log(controllPointA)
        console.log(controllPointB)
        */

        bezierPath.push(
          {
              p1:   bezierPointA
            , p2:   bezierPointB
            , cp1:  controllPointA
            , cp2:  controllPointB
            , alpha: alpha
          }
        )
      }

      return bezierPath
    }


    Path.prototype.getFilteredPoints = function(filter){
        
        var points = this.edges

        for(var k = 0; k < filter.length; k++){

          var filteredPoints = Array()
          var result = null
          var currentIndex = k 
          var currentkey = Infinity
          var startKey = filter[k]

          var startOver = false
          var moveOn = true
          var i = 0
          
          do{

            if(currentkey <= startKey)
              startOver = true

            // close path and exit
            if(currentkey >= startKey && startOver){
              moveOn = false
              if(currentkey != startKey)
                filteredPoints.push(filteredPoints[0])
              if(currentkey <= startKey)
                filteredPoints.push(points[filter[currentIndex]])  

            }else{
              // push next point
              filteredPoints.push(points[filter[currentIndex]])           
            }

            currentIndex = filter[currentIndex] 
            currentkey = filter[currentIndex]
            i++
          }while(moveOn && i < filter.length)


          if(result == null || result.length > filteredPoints.length)
            result = filteredPoints
        }
      
      return result
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

    Path.prototype.computeExtendedPaths = function(straight, allowed){
      this.straight = straight
      this.allowed = allowed
      this.getStraightPoints()
      this.getAllowedPoints()
    }


// --------------------------------------
    return Path
  })()
  return module.exports = Path
})