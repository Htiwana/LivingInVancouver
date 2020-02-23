//d3 = require("d3")

var svgWidth = 3000, svgHeight = 1000, barPadding = 2, scale=svgHeight/20;


d3.csv("../data/simpledat.csv", conversor, accessor)
// d3.json("https://gist.githubusercontent.com/drlynb/234c622e2f98da7c61393cbb33573bf8/raw/8e8fa5ae3dc76d94dcca3a50e3dce41b89eb7185/vanstreets.json", map)



function conversor(d){

    return {
      area: d.area,
      pop: parseInt(d.pop.replace(",","")),
      potatoes: +d.potatoes
    };
}

// this is just displaying a static svg i created folloing part one of https://medium.com/@mbostock/command-line-cartography-part-1-897aa8f8ca2c
d3.select("#vanmap").append("image")
    .attr("xlink:href","../data/van-albers.svg")
    .attr("width", 500)
    .attr("height", 500)


function splitwork(data,map){
  plotbars(data);
  plotmap(map,data);
}


function plotbars(data){
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
}


function plotmap(world,data){

  var width = 900,height = 600;

  var mapsvg = d3.select( "body" )
      .append( "svg" )
      .attr( "width", width )
      .attr( "height", height );

  // Projection
  var projection = d3.geoMercator().fitExtent([[10, 10], [800 - 10, 600 - 10]], world)

  var geoPath = d3.geoPath()
    .projection(projection);

  areas = mapsvg.append("g")
    .selectAll("path")
    .data(world.features)
    .enter()
    .append("path")
    .attr( "d", geoPath )
    .attr("class",d=>d.properties.name)
    .attr('fill', "purple")
    .attr('fill-opacity',opacity_set);

    function opacity_set(d){
      for ( let i = 0; i < 22; i++){
        console.log(data[i].area);
        console.log(d.properties.name)
        if(data[i].area == d.properties.name){
          return "" + ((data[i].pop - 6000)/38000)
        }
      }
    }
}


function accessor(error,data){
      if(error){
        console.log(error);
      }else{
        d3.json("../data/van.json", map)
        function map(err, world)
        {
          splitwork(data,world);
        }
    }
}
