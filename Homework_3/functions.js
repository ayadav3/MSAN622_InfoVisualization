function multi_series_line(svg_id, holder_id, my_height, my_width){

	var svg = d3.select("svg#" + svg_id);

    d3.select("svg#" + svg_id).selectAll("*").remove();

    var padding=100;


    //Width and height
    var width= my_width-2*padding;
    var height = my_height-2*padding;

	var parseDate = d3.time.format("%b %Y").parse;
		bisectDate = d3.bisector(function(d) { return d.date; }).left;

	var x = d3.time.scale()
	    .range([0, width]);

	var y = d3.scale.linear()
	    .range([height, 0]);

	var color = d3.scale.category10();

	var xAxis = d3.svg.axis()
	    .scale(x)
	    .orient("bottom");

	var yAxis = d3.svg.axis()
	    .scale(y)
	    .orient("left");

	var line = d3.svg.line()
	    .interpolate("basis")
	    .x(function(d) { return x(d.date); })
	    .y(function(d) { return y(d.number); });


	var svg = d3.selectAll("#"+holder_id).select("svg")
      .append("g")
      .attr("transform", "translate(" + padding + "," + padding + ")");


	d3.csv("seatbelts.csv", function(error, data) {
	  color.domain(d3.keys(data[0]).filter(function(key) { return key !== "date"; }));

	  data.forEach(function(d) {
	    d.date = parseDate(d.date);
	  });

	  var seatbelts = color.domain().map(function(name) {
	    return {
	      name: name,
	      values: data.map(function(d) {
	        return {date: d.date, number: +d[name]};
	      })
	    };
	  });

	  x.domain(d3.extent(data, function(d) { return d.date; }));

	  y.domain([
	    0,
	    d3.max(seatbelts, function(c) { return d3.max(c.values, function(v) { return v.number; }); })
	  ]);


	  svg.append("g")
	      .attr("class", "x axis")
	      .attr("transform", "translate(0," + height + ")")
	      .call(xAxis);

	  svg.append("g")
	      .attr("class", "y axis")
	      .call(yAxis)
	    .append("text")
	      .attr("transform", "rotate(-90)")
	      .attr("y", 6)
	      .attr("dy", "-6.0em")
        .attr("dx", "-"+height1/4)
	      .style("text-anchor", "end")
	      .text("Number of People Killed or Seriously Injured");

	  var city = svg.selectAll(".drivers")
	      .data(seatbelts)
	    .enter().append("g")
	      .attr("class", "drivers");

	  city.append("path")
	      .attr("class", "line")
	      .attr("d", function(d) { return line(d.values); })
	      .style("stroke", function(d) { return color(d.name); });


	  city.append("text")
	      .datum(function(d) { return {name: d.name, value: d.values[d.values.length - 1]}; })
	      .attr("transform", function(d) { return "translate(" + x(d.value.date) + "," + y(d.value.number) + ")"; })
	      .attr("x", 2)
	      .attr("dy", ".35em")
	      .text(function(d) { 
	      	if(d.name == "front"){return "Front Passengers";}
	      	else if (d.name == "rear"){return "Rear Passengers";} 
	      	else {return "Drivers";}; });
      
    var focus1 = svg.append("g")
        .attr("class", "focus")
        .style("display", "none");

    focus1.append("circle")
        .attr("r", 4.5);

    focus1.append("text")
        .attr("x", 9)
        .attr("dy", ".1em");

    var focus2 = svg.append("g")
        .attr("class", "focus")
        .style("display", "none");

    focus2.append("circle")
        .attr("r", 4.5);

    focus2.append("text")
        .attr("x", 9)
        .attr("dy", ".1em");

    var focus3 = svg.append("g")
        .attr("class", "focus")
        .style("display", "none");

    focus3.append("circle")
        .attr("r", 4.5);

    focus3.append("text")
        .attr("x", 9)
        .attr("dy", ".1em");

    svg.append("rect")
        .attr("class", "overlay")
        .attr("width", width)
        .attr("height", height)
        .on("mouseover", function() { focus1.style("display", null); focus2.style("display", null); focus3.style("display", null); })
        .on("mouseout", function() { focus1.style("display", "none");focus2.style("display", "none"); focus3.style("display", "none"); })
        .on("mousemove", mousemove);

  function mousemove() {
    var x0 = x.invert(d3.mouse(this)[0]),
        i = bisectDate(data, x0, 1),
        d0 = data[i - 1],
        d1 = data[i],
        d = x0 - d0.date > d1.date - x0 ? d1 : d0;
    focus1.attr("transform", "translate(" + x(d.date) + "," + y(d[color.domain()[0]]) + ")");
    focus1.select("text").text(d[color.domain()[0]]);

    focus2.attr("transform", "translate(" + x(d.date) + "," + y(d[color.domain()[1]]) + ")");
    focus2.select("text").text(d[color.domain()[1]]);

    focus3.attr("transform", "translate(" + x(d.date) + "," + y(d[color.domain()[2]]) + ")");
    focus3.select("text").text(d[color.domain()[2]]);

  }
  console.log(color.domain()[0])




	});

}
