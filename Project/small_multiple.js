

var margin = {top: 10, right: 40, bottom: 130, left: 140},
    width = 300- margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

var formatPercent = d3.format(".0%");

var padding = 100;
var color = d3.scale.ordinal().range(colorbrewer.Dark2[3]);

var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

// Scales. Note the inverted domain fo y-scale: bigger is up!
var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .tickFormat(formatPercent);

var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    return  d.Commodity_Category + "\t" + d.Year + "</strong><br/>" + d.USD_Value + " Billion dollars";
  })

// csv loaded asynchronously
d3.csv("multiple_chart.csv", type, function(data) {

  // Data is nested by country
  var categories = d3.nest()
      .key(function(d) { console.log(d.Commodity_Category); return d.Commodity_Category; })
      .entries(data);

  console.log(categories)

  // Parse dates and numbers. We assume values are sorted by date.
  // Also compute the maximum price per symbol, needed for the y-domain.
  // symbols.forEach(function(s) {
  //   s.values.forEach(function(d) { d.date = parse(d.date); d.price = +d.price; });
  //   s.maxPrice = d3.max(s.values, function(d) { return d.price; });
  // });

  // Compute the minimum and maximum year and percent across symbols.
  x.domain(data.map(function(d) { return d.Year; }));
  y.domain([0, d3.max(categories, function(s) { return s.values[0].USD_Value; })]);

  // Add an SVG element for each country, with the desired dimensions and margin.
  var svg = d3.select("#svg_placeholder2").selectAll("svg")
    .data(categories)
    .enter()
    .append("svg:svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + 150+ "," + 100 + ")");

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  svg.append("g")
      // Hide y axis
      // .attr("class", "y axis")
      // .call(yAxis)
    .append("text")
    .attr("x", width/2)
    .attr("y", -80)
    .attr("dy", ".71em")
    .attr("text-anchor", "middle")
    .attr("font-size", "1.3em")
    .attr("font-family","san-serif")
    .attr("font-weight","bold")
    .text(function(d) { return d.key});

  // Accessing nested data: https://groups.google.com/forum/#!topic/d3-js/kummm9mS4EA
  // data(function(d) {return d.values;}) 
  // this will dereference the values for nested data for each group
  svg.selectAll(".bar")
      .data(function(d) {return d.values;})
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.Year); })
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(d.USD_Value); })
      .attr("height", function(d) { return height - y(d.USD_Value); })
      .attr("fill", function(d) {return color(d.USD_Value)})
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide)

  svg.call(tip);

});

function type(d) {
  d.USD_Value = +d.USD_Value;
  return d;
}
