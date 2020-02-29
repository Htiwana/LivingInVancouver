
var svgWidth = 400, svgHeight = 300, barPadding = 2, scale=svgHeight;


//d3.csv("../data/simpledat.csv", parser, accessor)
d3.csv("../data/realdata.csv", real_parser, accessor)
d3.csv("../data/realdata.csv", real_parser, priceaccessor)

function parser(d){

    return {
      area: d.area,
      pop: parseInt(d.pop.replace(",","")),
      potatoes: +d.potatoes
    };
}

function real_parser(d){
    //console.log(d);
    var trait = "AverageValueofDwelling2001";
    var population2001 = makeNumber(d.TotalPop2001);
    var price2001 = makeNumber(d[trait]);
    return {
      area: d.area,
      pop2001: population2001,
      price2001: price2001
    };
}

function makeNumber(d){
  d = d.replace(",","");
  d = d.replace("$","");
  return parseInt(d);
}

function accessor(error,data){
      if(error){
        console.log(error);
      }else{
        d3.json("../data/van.json", map)
        function map(err, world)
        {
          if(err){
            console.log(err)
          }else{
            splitwork(data,world);
          }
        }
    }
}

function priceaccessor(error,data){
      if(error){
        console.log(error);
      }else{
        d3.json("../data/van.json", map)
        function map(err, world)
        {
          if(err){
            console.log(err)
          }else{
            plotpricemap(world,data);
          }
        }
    }
}

var dataglobal;
function splitwork(data,map){
  dataglobal = data;
  console.log(dataglobal);
  //plotbars(data);
  plotmap(map,data);
}

function plotbars(data){
  var barWidth = svgWidth/data.length;

  var svg = d3.select('#vanbars')
     .append("svg")
     .attr("width", svgWidth)
     .attr("height", svgHeight);

  var groups = svg.selectAll("g")
      .data(data)
      .enter()
      .append("g");

  groups.append("rect")
      .attr("x", (d,i) => i*(barWidth))
      .attr("y", d => svgHeight - ((d.pop -6000)/38000)*svgHeight)
      .attr("height", function(d) {
          return ((d.pop -6000)/38000)*svgHeight;
      })
      .attr("width", barWidth-barPadding);

  groups.append("text")
      .text(d => d.area)
      .attr('x',(d,i) => i*(barWidth))
      .attr('y', 50)
      .attr("transform", d => "rotate(0)");
}


function plotmap(world,data){
  //console.log(world)
  var width = 900,height = 600;

  var mapsvg = d3.select( "#vanmap" )
    .append( "svg" )
    .attr( "width", width )
    .attr( "height", height );

  var tooltip = d3.select("#vanmap").append('div')
    .attr("class", "hidden tooltip");

  // Projection
  var projection = d3.geoMercator().fitExtent([[10, 10], [800 - 10, 600 - 10]], world)

  var geoPath = d3.geoPath()
    .projection(projection);

  var areas = mapsvg.append("g")
    .selectAll("path")
    .data(world.features)
    .enter()
    .append("path")
    .attr( "d", geoPath )
    .attr("class",d=>d.properties.name)
    .attr('fill', "#0f4c75")
    .attr('fill-opacity',pop_opacity)

	// Tooltip on mouse over area
	.on("mousemove", function(d)
	{
		var mouse = d3.mouse(mapsvg.node()).map(function(d) {
			return parseInt(d);
		})

		tooltip.classed("hidden", false)
			.attr("style", "left: " + (mouse[0] + 15) + "px; top:" + (mouse[1] + 15) + "px")
            .text(d.properties.name);
	})
	.on("mouseout", function()
	{
		tooltip.classed("hidden", true);
	});

	// Listen to the slider
	d3.select("#mySlider").on("change", function(d){
		// Recover slide value
	    selectedValue = this.value
	})

    function pop_opacity(d){
      for ( let i = 0; i < 22; i++){
        if(data[i].area == d.properties.name){
          //console.log(data[i].pop2001);
          return "" + (((data[i].pop2001)/38000))
        }
      }
    }

    function price_opacity(d){
      for ( let i = 0; i < 22; i++){
        if(data[i].area == d.properties.name){
          //console.log(data[i].price2001);
          return "" + (((data[i].price2001)/880000))
        }
      }
    }


}

function plotpricemap(world,data){
  //console.log(world)
  var width = 900,height = 600;

  var mapsvg = d3.select( "body" )
    .append( "svg" )
    .attr( "width", width )
    .attr( "height", height );

  var tooltip = d3.select("body").append('div')
    .attr("class", "hidden tooltip");

  // Projection
  var projection = d3.geoMercator().fitExtent([[10, 10], [800 - 10, 600 - 10]], world)

  var geoPath = d3.geoPath()
    .projection(projection);

  var areas = mapsvg.append("g")
    .selectAll("path")
    .data(world.features)
    .enter()
    .append("path")
    .attr( "d", geoPath )
    .attr("class",d=>d.properties.name)
    .attr('fill', "#0f4c75")
    .attr('fill-opacity',price_opacity)

	// Tooltip on mouse over area
	.on("mousemove", function(d)
	{
		var mouse = d3.mouse(mapsvg.node()).map(function(d) {
			return parseInt(d);
		})

		tooltip.classed("hidden", false)
			.attr("style", "left: " + (mouse[0] + 15) + "px; top:" + (mouse[1] + 650) + "px")// EXTREMELY HACKY Y COORD FIX
            .text(d.properties.name);
	})
	.on("mouseout", function()
	{
		tooltip.classed("hidden", true);
	});

	// Listen to the slider
	d3.select("#mySlider").on("change", function(d){
		// Recover slide value
	    selectedValue = this.value
	})

    function pop_opacity(d){
      for ( let i = 0; i < 22; i++){
        if(data[i].area == d.properties.name){
          //console.log(data[i].pop2001);
          return "" + (((data[i].pop2001)/38000))
        }
      }
    }

    function price_opacity(d){
      for ( let i = 0; i < 22; i++){
        if(data[i].area == d.properties.name){
          //console.log(data[i].price2001);
          return "" + (((data[i].price2001)/880000))
        }
      }
    }
}
