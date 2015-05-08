var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 750 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;





var svg = d3.select("#svg_placeholder1").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv("bar_chart.csv", function(error, data) {

  data.forEach(function(d) {
    d.Food = +d.Food;
    d.Coal_Oil = +d.Coal_Oil;
    d.Chemicals = +d.Chemicals;
    d.Marine_Products = +d.Marine_Products;
    d.Non_Food_Agri_Products = +d.Non_Food_Agri_Products;
    d.Metal_Minerals = +d.Metal_Minerals;
  });

var padding = 25;
var yScale = d3.scale.linear()
            .domain(d3.extent(data, function(d){return d.Food;}))
            .range([height,padding]);
console.log(yScale)
var xScale = d3.scale.ordinal()
            .domain(data.map(function(d){ return d.Continent;}))
            .rangeRoundBands([padding,width-padding],.5);

var key = function(d){return d.Continent};
var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(yScale)
    .orient("left");

  // x.domain(data.map(function(d) { return d.Continent; }));
  // y.domain([0, d3.max(data, function(d) { return d.Food; })]);

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
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Million Dollars (USD)");

  svg.selectAll(".bar")
      .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return xScale(d.Continent); })
      .attr("width", xScale.rangeBand())
      .attr("y", function(d) { return yScale(d.Food); })
      .attr("height", function(d) { console.log(yScale(d.Food));return height - yScale(d.Food); });



  // d3.select("input").on("change", change);



  // var sortTimeout = setTimeout(function() {
  //   d3.select("input").property("checked", true).each(change);
  // }, 2000);

  // function change() {
  //   clearTimeout(sortTimeout);

  //   // Copy-on-write since tweens are evaluated after a delay.
  //   var x0 = x.domain(data.sort(this.checked
  //       ? function(a, b) { return b.Food - a.Food; }
  //       : function(a, b) { return d3.ascending(a.Continent, b.Continent); })
  //       .map(function(d) { return d.Continent; }))
  //       .copy();

  //   svg.selectAll(".bar")
  //       .sort(function(a, b) { return x0(a.Continent) - x0(b.Continent); });

  //   var transition = svg.transition().duration(750),
  //       delay = function(d, i) { return i * 50; };

  //   transition.selectAll(".bar")
  //       .delay(delay)
  //       .attr("x", function(d) { return x0(d.Continent); });

  //   transition.select(".x.axis")
  //       .call(xAxis)
  //     .selectAll("g")
  //       .delay(delay);
  // }

  d3.selectAll("select").
      on("change", function() {
      
        var value= this.value;

        if(value=="food"){
          var x_value = function(d){return d.Food;};
          //var color = function(d){return d.bus_change < 0 ? "negative" : "positive";};
          var y_value = function(d){
              return yScale(Math.max(0, d.Food)); 
            };
            var height_value = function(d){
              return Math.abs(yScale(d.Food) - yScale(0));
            };  
        }
        else if(value=="chemical"){
          var x_value = function(d){return d.Chemicals;};
         // var color = function(d){return d.dr_change < 0 ? "negative" : "positive";};
          var y_value = function(d){
              return yScale(Math.max(0, d.Chemicals)); 
            };
            var height_value = function(d){
              return Math.abs(yScale(d.Chemicals) - yScale(0)); 
            };  
        }
        else if(value=="marine"){
          var x_value = function(d){return d.Marine_Products;};
         // var color = function(d){return d.dr_change < 0 ? "negative" : "positive";};
          var y_value = function(d){
              return yScale(Math.max(0, d.Marine_Products)); 
            };
            var height_value = function(d){
              return Math.abs(yScale(d.Marine_Products) - yScale(0)); 
            };  
        }
        else if(value=="petrol"){
          var x_value = function(d){return d.Coal_Oil;};
         // var color = function(d){return d.dr_change < 0 ? "negative" : "positive";};
          var y_value = function(d){
              return yScale(Math.max(0, d.Coal_Oil)); 
            };
            var height_value = function(d){
              return Math.abs(yScale(d.Coal_Oil) - yScale(0)); 
            };  
        }
        else if(value=="metal"){
          var x_value = function(d){return d.Metal_Minerals;};
         // var color = function(d){return d.dr_change < 0 ? "negative" : "positive";};
          var y_value = function(d){
              return yScale(Math.max(0, d.Metal_Minerals)); 
            };
            var height_value = function(d){
              return Math.abs(yScale(d.Metal_Minerals) - yScale(0)); 
            };  
        }

        //Update y scale
        yScale.domain(d3.extent(data, x_value));

        //Update with correct data
        var rect = svg.selectAll("rect").data(data, key);
        rect.exit().remove();

        //Transition chart to new data
        rect
        .transition()
        .duration(1000)
        .ease("linear")
        .each("start", function(){
          d3.select(this)
          .attr("width", "0.2")
        })
        .attr({
            x: function(d){
              return xScale(d.Continent);
            },
            y: y_value,
            width: xScale.rangeBand(),
            height: height_value
              
        });

        //Update y-axis
        svg.select(".y.axis")
          .transition()
          .duration(1000)
          .ease("linear")
          .call(yAxis);
      });
});

