
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
  console.log(map);
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
  // console.log(world)
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
            .html(d.properties.name + "<br/>" + "<b>Population: </b>" + population_tooltip(d));
	})
	.on("mouseout", function()
	{
		tooltip.classed("hidden", true);
	});
	
	function population_tooltip(d){
      for ( let i = 0; i < 22; i++){
		var dataset1 = data[i].area.replace("-", " ")
		var dataset2 = d.properties.name.replace("-"," ")
		  
        if((dataset1) == (dataset2))
		{
		  value = (data[i].price2001)
          return value
        }
      }
    }

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
  // console.log(world)
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
            // .html(d.properties.name + "<br/>" + "<img src=http://charlesperin.net/images/charles_perin_7_5.5-4.jpg>")
			.html(d.properties.name + "<br/>" + "<b>Price: </b>" + price_tooltip(d));
	})
	.on("mouseout", function()
	{
		tooltip.classed("hidden", true);
	});
	
    // Function fixes the issue with different naming conventions for both datasets
	function price_tooltip(d){
      for ( let i = 0; i < 22; i++){
		var dataset1 = data[i].area.replace("-", " ")
		var dataset2 = d.properties.name.replace("-"," ")

        // console.log("data is", temp1)
        // console.log("properties is", d.properties.name)
		  
        if((dataset1) == (dataset2))
		{
		  value = (data[i].price2001)
          return value
        }
      }
    }

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
// Options for dropdown
var listOptions = ["Population", "Price"]

// Init button
var dropdownButton = d3.select("#dropdown")
	.append("select")
	
// Add options to button
dropdownButton // Add a button
  .selectAll('Options') // Next 4 lines add 6 options = 6 colors
 	.data(listOptions)
  .enter()
	.append('option')
  .text(function (d) { return d; }) // text showed in the menu
  .attr("value", function (d) { return d; }) // value returned is one of the items in the list

 dropdownButton.on("change", function(d)
 {
	var selectedOption = d3.select(this).property("value")
	updateMap(selectedOption)
	// console.log(selectedOption)
 })
 
 function updateMap(updatOption)
 {
	 if (updatOption.localeCompare("Price") == 0)
	 {
		 console.log("Chose Price")
		 // d3.csv("../data/realdata.csv", real_parser, priceaccessor)
	 }
	 else {
		 console.log("Chose Population")
		 // d3.csv("../data/realdata.csv", real_parser, accessor)
	 }
	 // mapsvg
	   // .transition()
	   // .duration(1000)
 }

