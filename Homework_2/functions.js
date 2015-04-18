
function bubble_chart(svg_id,holder_id,height,width) {


	var svg = d3.select("svg#" + svg_id);

    d3.select("svg#" + svg_id).selectAll("*").remove();


        // ColorBrewer
    var colors = {
        "maroon":   "#b03060",
        "blue":   "#377eb8",
        "purple": "#984ea3",
        "green":  "#4daf4a",
        "orange": "#ff7f00"
    };

      var padding=100;


      //Width and height
      var w = width-2*padding;
      var h = height-2*padding;


// Various accessors that specify the four dimensions of data to visualize.
function x(d) { return d['income']; }
function y(d) { return d['life_exp']; }
function radius(d) { return +d['population']; }
function color(d) { return d['region']; }
function key(d) { return d['state']; }

var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    return "<span style='color:white'>State: " + key(d) + "<br>Population: "+radius(d)+  "</span>";
  })

//Create SVG element
    var svg = d3.selectAll("#"+holder_id).select("svg")
      .append("g")
      .attr("transform", "translate(" + padding + "," + padding + ")");
// Create SVG element (remember use normal CSS style attributes)

svg.style("border-color", colors.black);
svg.style("border-width", 1);
svg.style("border-style", "solid");

svg.call(tip);

// Defines a sort order so that the smallest dots are drawn on top.
function order(a, b) {
  return radius(b) - radius(a);
}


d3.csv("state_x77.csv", function(error, dataset){

      
      x_data=dataset.map(function(d) { return +x(d); });
      y_data=dataset.map(function(d) { return +y(d);; });
      r_data=dataset.map(function(d) { return +radius(d); });
      col_data=dataset.map(function(d) { return +color(d); });

      //console.log(x_data);
      //console.log(dataset);
      //Create scale functions

        var rScale = d3.scale.linear()
       .domain([d3.min(r_data),d3.max(r_data)])
       .range([w/200, w/20]);

      // find radius of the most most left and bottom points to shift axis.
      minx_radius=radius(dataset.sort(function(a,b) {return - x(b) + x(a)})[1] ) 
      miny_radius=radius(dataset.sort(function(a,b) {return - y(b) + y(a)})[1] ) 

      var xScale = d3.scale.log()
       .domain([d3.min(x_data)-100,d3.max(x_data)])
       .range([0, w ]);


      var yScale = d3.scale.linear()
       .domain([d3.min(y_data)-1,d3.max(y_data)])
       .range([h, 0]);




      var colorScale = d3.scale.category10();


      //Define X axis
      var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient("bottom")
        .ticks(12, d3.format(",d"));

      //Define Y axis
      var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient("left")
        .ticks(5);

        // Add a dot per nation. Initialize the data at 1800, and set the colors.
      var dot = svg.append("g")
      .attr("class", "dots")
      .selectAll(".dot")
      .data(dataset)
      .enter().append("circle")
      .attr("class", "dot")
      .attr("cx", function(d) {
            return xScale( x(d));
      })
      .attr("cy", function(d) {
            return yScale(y(d));
      })
      .style("fill", function(d) { return colorScale(color(d)); })
      .attr("r", function(d) {
            return rScale(radius(d));
      })
      .attr("data-legend",function(d) { return color(d)})
      .sort(order)
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide);



      legend = svg.append("g")
      .attr("class","legend")
      .attr("transform","translate(50,30)")
      .style("font-size","12px")
      .call(d3.legend);


      // Add an x-axis label.
      svg.append("text")
      .attr("class", "x label")
      .attr("text-anchor", "end")
      .attr("x", w/2+w/5)
      .attr("y", h+h/8)
      .text("income per capita (dollars)");

      //Add a y-axis label.
      svg.append("text")
      .attr("class", "y label")
      .attr("text-anchor", "end")
      .attr("y", -h/6)
      .attr("x", -h/6)
      .attr("dy", ".75em")
      .attr("transform", "rotate(-90)")
      .text("life expectancy (years)");


      //Create X axis
      svg.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0," + h + ")")
      .call(xAxis);
                  
      //Create Y axis
      svg.append("g")
      .attr("class", "axis")
      .call(yAxis);

      svg.append("text")
      .attr("x", (w / 2))             
      .attr("y", 0 - (padding / 2))
      .attr("text-anchor", "middle")  
      .style("font-size", "16px") 
      .text("US States: Health and Wealth");

      });
}

function small_multiples(svg_id,holder_id,height,width) {


	var svg = d3.select("svg#" + svg_id);

    d3.select("svg#" + svg_id).selectAll("*").remove();

    var size = 200,
    padding = 30;
    padding_bottm=80



      //Width and height
      var width = width-2*padding;
      var width = height-2*padding;

  var x = d3.scale.linear()
      .range([padding / 2, size - padding / 2]);

  var y = d3.scale.linear()
      .range([size - padding / 2, padding / 2]);

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom")
      .ticks(8);

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left")
      .ticks(8);

  var color = d3.scale.category10();

  d3.csv("state_x77.csv", function(error, data) {
    var domainByTrait = {},
        traits = d3.keys(data[0]).filter(function(d) { return (d == "grad") || (d == "murder") || (d == "life_exp") ; }),
        n = traits.length;

    traits.forEach(function(trait) {
      domainByTrait[trait] = d3.extent(data, function(d) { return +d[trait]; });
    });

    xAxis.tickSize(size * n);
    yAxis.tickSize(-size * n);

    var brush = d3.svg.brush()
        .x(x)
        .y(y)
        .on("brushstart", brushstart)
        .on("brush", brushmove)
        .on("brushend", brushend);

    var svg = d3.selectAll("#"+holder_id).select("svg")
        .attr('class','svg2')
        .attr("width", size * n + padding)
        .attr("height", size * n + padding)
      .append("g")
        .attr("transform", "translate(" + padding + "," + padding / 2 + ")")

    svg.selectAll(".x.axis2")
        .data(traits)
      .enter().append("g")
        .attr("class", "x axis2")
        .attr("transform", function(d, i) { return "translate(" + (n - i - 1) * size + ",0)"; })
        .each(function(d) { x.domain(domainByTrait[d]); d3.select(this).call(xAxis); });

    svg.selectAll(".y.axis2")
        .data(traits)
      .enter().append("g")
        .attr("class", "y axis2")
        .attr("transform", function(d, i) { return "translate(0," + i * size + ")"; })
        .each(function(d) { y.domain(domainByTrait[d]); d3.select(this).call(yAxis); });

      svg.append("text")
        .attr("x", (size*traits.length / 2))             
        .attr("y", 0 - (padding / 2)*0.6)
        .attr("text-anchor", "middle")  
        .style("font-size", "16px") 
        .text("Scatter Plot Matrix (Income, Life Expectancy, Graduates)");

    var cell = svg.selectAll(".cell")
        .data(cross(traits, traits))
      .enter().append("g")
        .attr("class", "cell")
        .attr("transform", function(d) { return "translate(" + (n - d.i - 1) * size + "," + d.j * size + ")"; })
        .each(plot);

    // Titles for the diagonal.
    cell.filter(function(d) { return d.i === d.j; }).append("text")
        .attr("x", padding)
        .attr("y", padding)
        .attr("dy", ".71em")
        .text(function(d) { return d.x; });





    cell.call(brush);

    function plot(p) {
      var cell = d3.select(this);

      x.domain(domainByTrait[p.x]);
      y.domain(domainByTrait[p.y]);

      cell.append("rect")
          .attr("class", "frame2")
          .attr("stroke-width", "2px")
          .attr("x", padding / 2)
          .attr("y", padding / 2)
          .attr("width", size - padding)
          .attr("height", size - padding);

      cell.selectAll("circle")
          .data(data)
        .enter().append("circle")
          .attr("cx", function(d) { return x(d[p.x]); })
          .attr("cy", function(d) { return y(d[p.y]); })
          .attr("r", 3)
          .style("fill", function(d) { return color(d.region); });
    }

    var brushCell;

    // Clear the previously-active brush, if any.
    function brushstart(p) {
      if (brushCell !== this) {
        d3.select(brushCell).call(brush.clear());
        x.domain(domainByTrait[p.x]);
        y.domain(domainByTrait[p.y]);
        brushCell = this;
      }
    }

    // Highlight the selected circles.
    function brushmove(p) {
      var e = brush.extent();
      svg.selectAll("circle").classed("hidden", function(d) {
        return e[0][0] > d[p.x] || d[p.x] > e[1][0]
            || e[0][1] > d[p.y] || d[p.y] > e[1][1];
      });
    }

    // If the brush is empty, select all circles.
    function brushend() {
      if (brush.empty()) svg.selectAll(".hidden").classed("hidden", false);
    }

    function cross(a, b) {
      var c = [], n = a.length, m = b.length, i, j;
      for (i = -1; ++i < n;) for (j = -1; ++j < m;) c.push({x: a[i], i: i, y: b[j], j: j});
      return c;
    }

    d3.select(self.frameElement).style("height", size * n + padding + 20 + "px");
  });


}

function parallel_plots(svg_id,holder_id,my_height,my_width) {

	var svg = d3.select("svg#" + svg_id);
    d3.select("svg#" + svg_id).selectAll("*").remove();


	var margin = {top: 80, right: 10, bottom: 10, left: 10},
	    width = my_width- margin.left - margin.right,
	    height = my_height - margin.top - margin.bottom;


	var x = d3.scale.ordinal().rangePoints([0, width], 1),
	    y = {},
	    dragging = {};

	var line = d3.svg.line(),
	    axis = d3.svg.axis().orient("left"),
	    background,
	    foreground;

	var svg = d3.selectAll("#"+holder_id).select("svg")
	    .attr('class','svg3')
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom)
	  .append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	d3.csv("state_x77.csv", function(error, cars) {

	  // Extract the list of dimensions and create a scale for each.
	  x.domain(dimensions = d3.keys(cars[0]).filter(function(d) {
	    return ((d == "grad") || (d == "income") || (d == "life_exp") || (d == "murder")  ) && (y[d] = d3.scale.linear()
	        .domain(d3.extent(cars, function(p) { return +p[d]; }))
	        .range([height, 0]));
	  }));

	  // Add grey background lines for context.
	  background = svg.append("g")
	      .attr("class", "background")
	    .selectAll("path")
	      .data(cars)
	    .enter().append("path")
	      .attr("d", path);

	  // Add blue foreground lines for focus.
	  foreground = svg.append("g")
	      .attr("class", "foreground")
	    .selectAll("path")
	      .data(cars)
	    .enter().append("path")
	      .attr("d", path);

	  // Add a group element for each dimension.
	  var g = svg.selectAll(".dimension")
	      .data(dimensions)
	    .enter().append("g")
	      .attr("class", "dimension")
	      .attr("transform", function(d) { return "translate(" + x(d) + ")"; })
	      .call(d3.behavior.drag()
	        .origin(function(d) { return {x: x(d)}; })
	        .on("dragstart", function(d) {
	          dragging[d] = x(d);
	          background.attr("visibility", "hidden");
	        })
	        .on("drag", function(d) {
	          dragging[d] = Math.min(width, Math.max(0, d3.event.x));
	          foreground.attr("d", path);
	          dimensions.sort(function(a, b) { return position(a) - position(b); });
	          x.domain(dimensions);
	          g.attr("transform", function(d) { return "translate(" + position(d) + ")"; })
	        })
	        .on("dragend", function(d) {
	          delete dragging[d];
	          transition(d3.select(this)).attr("transform", "translate(" + x(d) + ")");
	          transition(foreground).attr("d", path);
	          background
	              .attr("d", path)
	            .transition()
	              .delay(500)
	              .duration(0)
	              .attr("visibility", null);
	        }));

	  // Add an axis and title.
	  g.append("g")
	      .attr("class", "axis3")
	      .each(function(d) { d3.select(this).call(axis.scale(y[d])); })
	    .append("text")
	      .style("text-anchor", "middle")
	      .attr("y", -9)
	      .text(function(d) { return d; });
	  svg.append("text")
	    .attr("x", (width / 2))             
	    .attr("y", 0 - (margin.top / 2))
	    .attr("text-anchor", "middle")  
	    .style("font-size", "16px") 
	    .text("Parallel Coordinates");

	  // Add and store a brush for each axis.
	  g.append("g")
	      .attr("class", "brush")
	      .each(function(d) {
	        d3.select(this).call(y[d].brush = d3.svg.brush().y(y[d]).on("brushstart", brushstart).on("brush", brush));
	      })
	    .selectAll("rect")
	      .attr("x", -8)
	      .attr("width", 16);
	});

	function position(d) {
	  var v = dragging[d];
	  return v == null ? x(d) : v;
	}

	function transition(g) {
	  return g.transition().duration(500);
	}

	// Returns the path for a given data point.
	function path(d) {
	  return line(dimensions.map(function(p) { return [position(p), y[p](d[p])]; }));
	}

	function brushstart() {
	  d3.event.sourceEvent.stopPropagation();
	}

	// Handles a brush event, toggling the display of foreground lines.
	function brush() {
	  var actives = dimensions.filter(function(p) { return !y[p].brush.empty(); }),
	      extents = actives.map(function(p) { return y[p].brush.extent(); });
	  foreground.style("display", function(d) {
	    return actives.every(function(p, i) {
	      return extents[i][0] <= d[p] && d[p] <= extents[i][1];
	    }) ? null : "none";
	  });
	}
}	
