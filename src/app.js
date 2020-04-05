
var svgWidth = 400, svgHeight = 300, barPadding = 2, scale=svgHeight;
var dataglobal;
var worldglobal;
var yearglobal = "2001";
var dimensionglobal = "pop";

//d3.csv("../data/simpledat.csv", parser, accessor)
d3.csv("../data/realdatat.csv", real_parser, accessor)
//d3.csv("../data/realdata.csv", real_parser, priceaccessor)

function parser(d){

    return {
      area: d.area,
      pop: parseInt(d.pop.replace(",","")),
      potatoes: +d.potatoes
    };
}

function real_parser(d){
    //console.log(d);
    return {
      area: d.area,
      pop2001: +d.TotalPop2001,
      price2001: +d.AverageValueofDwelling2001,
      pop2006: +d.TotalPop2006,
      price2006: +d.AverageValueofDwelling2006,
      pop2016: +d.TotalPop2016,
      price2016: +d.AverageValueofDwelling2016,
    };
}



function accessor(error,data){
      if(error){
        console.log(error);
      }else{
        d3.json("../data/van-noestdt.json", map)
        function map(err, world)
        {
          if(err){
            console.log(err)
          }else{
            dataglobal = data;
            worldglobal = world;
            plotmap();
          }
        }
    }
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



function plotmap(){
  d3.select("svg").remove();

  console.log("drawing map for " + dimensionglobal + yearglobal );
  var dim = dimensionglobal+yearglobal;
  let dimension_data = dataglobal.map(d => d[dim]);
  let dim_data = dimension_data.slice(0,-2);//removes values for entire city/area of vancouver
  var dim_max = Math.max(...dim_data);
  console.log("dim max is "+dim_max);
  var dim_min = Math.min(...dimension_data);
  var dim_range = dim_max - dim_min;
  console.log("dim range is "+dim_range);

  var width = 900,height = 600;

  var mapsvg = d3.select( "#vanmap" )
    .append( "svg" )
    .attr( "width", width )
    .attr( "height", height );

  var tooltip = d3.select("#vanmap").append('div')
    .attr("class", "hidden tooltip");

  // Projection
  var projection = d3.geoMercator().fitExtent([[10, 10], [800 - 10, 600 - 10]], worldglobal)

  var geoPath = d3.geoPath()
    .projection(projection);

  var areas = mapsvg.append("g")
    .selectAll("path")
    .data(worldglobal.features)
    .enter()
    .append("path")
    .attr( "d", geoPath )
    .attr("class",d=>d.properties.name)
    .attr('fill', "#0f4c75")
    .attr('fill-opacity',set_opacity)
    .on("mousemove", draw_tooltip)
	  .on("mouseout", () =>	tooltip.classed("hidden", true));

  function draw_tooltip(d)
  {
    var mouse = d3.mouse(mapsvg.node()).map( d => parseInt(d) )
    tooltip.classed("hidden", false)
      .attr("style", "left: " + (mouse[0] + 10) + "px; top:" + (mouse[1] + 10) + "px")
            .html(d.properties.name + "<br/>" + "<b>Population: </b>" + get_value(d) + "<br/>" + "<img src=https://cartocdn-gusc.global.ssl.fastly.net/vadimmarusin/api/v1/map/vadimmarusin@4fe53f5a@f8498f1d75c31bf8b0635194ec4bee7a:1544837817179/1/11/323/700.png>");
  }

  function get_value(d){
    for ( let i = 0; i < 22; i++){
      var dataset1 = dataglobal[i].area.replace("-", " ")
      var dataset2 = d.properties.name.replace("-"," ")
        if((dataset1) == (dataset2)){
            value = dimension_data[i]
            return value
        }
    }
  }

    function set_opacity(d){
      for ( let i = 0; i < 22; i++){
          var dataset1 = dataglobal[i].area.replace("-", " ")
      		var dataset2 = d.properties.name.replace("-"," ")
            if(dataset1 == dataset2){
              //console.log(dim_range);
              return "" + (((dimension_data[i]/dim_range)))
            }else if(i == 21){
              return "0";
            }
        }
      }
}


// Options for dropdown
var listOptions = ["Population", "Market Value"]

// Init button
var dropdownButton = d3.select("#dropdown")
	.append("select")

// Add options to button
dropdownButton // Add a button
  .selectAll('Options')
 	.data(listOptions)
  .enter()
	.append('option')
  .text(function (d) { return d; }) // text showed in the menu
  .attr("value", function (d) { return d; }) // value returned is one of the items in the list

 // Listens for the change
 dropdownButton.on("change", function(d)
 {
	var selectedOption = d3.select(this).property("value")
	updateMap(selectedOption)
	// console.log(selectedOption)
 })

function updateMap(updatOption)
{
 if (updatOption.localeCompare("Market Value") == 0)
 {
   dimensionglobal = "price"
	 plotmap();
 }
 else {
   dimensionglobal = "pop"
   plotmap();
 }
}

 // Sliders
// d3.select("#mySlider").on("change", function(d)
// {
	// selectedValue = this.value //recovers slider value
	// // console.log(selectedValue)
	// changeYear(selectedValue)
	// plotmap();
// })

function changeYear(year)
{
	if (year == 2001)
	{
		document.getElementById("h2").innerHTML = "2001";
		console.log("Chose year 2001")
		yearglobal = "2001";
	}
	else if (year == 2006)
	{
		document.getElementById("h2").innerHTML = "2006";
		console.log("Chose year 2006")
		yearglobal = "2006";
	}
	else {
		document.getElementById("h2").innerHTML = "2016";
		console.log("Chose year 2016")
		yearglobal = "2016";
	}
	plotmap();
}
