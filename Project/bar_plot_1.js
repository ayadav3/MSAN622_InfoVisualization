

var margin = {top: 20, right: 20, bottom: 200, left: 140},
    width = 1100 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

var formatPercent = d3.format(".0%");

var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1, 1);

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    return "<strong>Export Value:</strong> <span style='color:red'>" + Math.floor(d.Value_12_13) + " million USD</span>";
  })


var svg = d3.select("#svg_placeholder1").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

svg.call(tip);

d3.csv("bar_chart_1.csv", function(error, data) {

  data.forEach(function(d) {
    d.Value_12_13 = +d.Value_12_13;
  });

  x.domain(data.map(function(d) { return d.Commodity; }));
  y.domain([0, d3.max(data, function(d) { return d.Value_12_13; })]);

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
      .selectAll("text")  
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", function(d) {
                return "rotate(-65)" 
                });;

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("million USD");

  svg.selectAll(".bar")
      .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.Commodity); })
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(d.Value_12_13); })
      .attr("height", function(d) { return height - y(d.Value_12_13); })
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide);

  d3.select("input").on("change", change);

  var sortTimeout = setTimeout(function() {
    d3.select("input").property("checked", true).each(change);
  }, 2000);

  function change() {
    clearTimeout(sortTimeout);

    // Copy-on-write since tweens are evaluated after a delay.
    var x0 = x.domain(data.sort(this.checked
        ? function(a, b) { return b.Value_12_13 - a.Value_12_13; }
        : function(a, b) { return d3.ascending(a.Commodity, b.Commodity); })
        .map(function(d) { return d.Commodity; }))
        .copy();

    svg.selectAll(".bar")
        .sort(function(a, b) { return x0(a.Commodity) - x0(b.Commodity); });

    var transition = svg.transition().duration(750),
        delay = function(d, i) { return i * 50; };

    transition.selectAll(".bar")
        .delay(delay)
        .attr("x", function(d) { return x0(d.Commodity); });

    transition.select(".x.axis")
        .call(xAxis)
        .selectAll("text")  
        .style("text-anchor", "end")
      .selectAll("g")
        .delay(delay);
  }
});
