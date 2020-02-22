//d3 = require("d3")

var svgWidth = 3000, svgHeight = 1000, barPadding = 2, scale=svgHeight/20;


d3.csv("../data/simpledat.csv", conversor, accessor)


function conversor(d){

    return {
      area: d.area,
      pop: parseInt(d.pop.replace(",","")),
      potatoes: +d.potatoes
    };

}

function accessor(error,data){
      if(error){
        console.log(error);
      }else{
        console.log(data);

        var barWidth = svgWidth/data.length;

        var svg = d3.select('svg')
           .attr("width", svgWidth)
           .attr("height", svgHeight);

        var groups = svg.selectAll("g")
            .data(data)
            .enter()
            .append("g");

        groups.append("rect")
            .attr("x", (d,i) => i*(barWidth))
            .attr("y", d => svgHeight - d.pop/scale)
            .attr("height", function(d) {
                return d.pop/scale;
            })
            .attr("width", barWidth-barPadding);

        groups.append("text")
            .text(d => d.area)
            .attr('x',(d,i) => i*(barWidth))
            .attr('y', 50)
            .attr("transform", d => "rotate(0)");

      return data;
      }
}




// this is just displaying a static svg i created folloing part one of https://medium.com/@mbostock/command-line-cartography-part-1-897aa8f8ca2c
d3.select("#vanmap").append("image")
    .attr("xlink:href","../data/van-albers.svg")
    .attr("width", 500)
    .attr("height", 500)
