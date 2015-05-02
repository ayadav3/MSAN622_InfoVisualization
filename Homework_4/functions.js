
function dsBar_Chart(data){

    data.sort(function(a,b){return d3.ascending(a.count, b.count);});

  var   width = 500,
       height = 800;


var color = d3.scale.quantize().domain([data.length,0])
    .range(colorbrewer.Dark2[data.length+1]);

  var margin = {top: 300, right: 20, bottom: 80, left: 90};
    var svg = d3.select("#bar_chart")
       .append("svg")              
       .data([data])                   
           .attr("width", width)           
           .attr("height", height)
          .append("g")                
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    
    var   width = width  - margin.left - margin.right,
        height = height - margin.top - margin.bottom;

    var x = d3.scale.ordinal()
        .rangeRoundBands([0, width], .1);

    var y = d3.scale.linear()
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .ticks(data.length+1);

    var formatxAxis = d3.format(",");


    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .tickFormat(formatxAxis)
        .ticks(5);


      x.domain(data.map(function(d) { return d.category; }));
      y.domain([0, d3.max(data, function(d) { 

        return d.count; 
      })]);

      var gx=svg.append("g")
          .attr("class", "x axis")
          .style("fill","black")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis)
          .selectAll("text")  
            .style("text-anchor", "end")
            .style("font-size",12)
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", function(d) {
                return "rotate(-90)" 
                });


     var gy = svg.append("g")
          .attr("class", "y axis")
          .call(yAxis);

    gy.append("text")
      .attr("transform", "rotate(-90)")
      .attr("dy", "-4.0em")
      .attr("dx", "-"+height/3)
      .style("text-anchor", "end") .style("font-size",15)
      .text("Number of Movies");





    var rect=svg.selectAll(".bar")
      .data(data)
    .enter().append("rect")
    .attr("fill", function(d, i) { return color(i); } ) 
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.category); })
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(d.count); })
      .attr("height", function(d) { return height - y(d.count); })
      .on("click", update);




    svg.append("text")
        .attr("x", (width / 2))             
        .attr("y", 0 - (margin.top / 9))
        .attr("text-anchor", "middle")  
        .attr("id","lineChartTitle1") 
        .text("Breakup of Movies by Genre");


  function update(d, i) {

        updateLine1Chart(d.category, color(i))
        updateLine2Chart(d.category, color(i));
        
       
  }



  }



function datasetLineChartChosen(group) {
  var ds = [];
  for (x in datasetLineRatingsChart) {
     if(datasetLineRatingsChart[x].group==group){
      ds.push(datasetLineRatingsChart[x]);
     } 
    }

  return ds;
}

function dsLineChartBasics() {

  var margin = {top: 70, right: 10, bottom: 20, left: 150},
      width = 600 - margin.left - margin.right,
      height = 350 - 150 - margin.bottom
      ;
    
    return {
      margin : margin, 
      width : width, 
      height : height
    }     
    ;
}


function dsLineRatingsChart() {
  
  var firstDatasetLineChart = datasetLineChartChosen(group);    
  
  var basics = dsLineChartBasics();
  
  var margin = basics.margin,
    width = basics.width,
     height = basics.height
    ;

  var xScale = d3.scale.linear()
        .domain(d3.extent(firstDatasetLineChart, function(d) { return +d.category; }) ) 
      .range([0, width])
      ;

  var yScale = d3.scale.linear()
      .domain([0, d3.max(firstDatasetLineChart, function(d) { return d.count; })])
      .range([height, 0])
      ;

  var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient("bottom");

  var formatxAxis = d3.format("");

  xAxis.tickFormat(formatxAxis).ticks(10);





var yAxis = d3.svg.axis()
    .scale(yScale)
    .orient("left");

yAxis.tickFormat(formatxAxis).ticks(5);
  


  var line = d3.svg.line()
      .x(function(d) { return xScale(d.category); })
      .y(function(d) { return yScale(d.count); });
  
  var svg = d3.select("#lineChart2").append("svg")
      .datum(firstDatasetLineChart)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      

  svg.append("g")
      .attr("class", "x axis_line")
      .attr("transform", "translate(" + margin.left + "," + (height +margin.top) + ")")
      .call(xAxis)
      .selectAll("text") 
      .style("font-size",12);



  gy=svg.append("g")
      .attr("class", "y axis_line")
      .attr("transform", "translate(" + margin.left + "," + margin.top+ ")")
      .call(yAxis);

    gy.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "-2.71em")
      .style("text-anchor", "end")
      .text("Average Rating");
      
  var plot = svg
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
      .attr("id", "ratingLineChartPlot")
      ;

   
  var dsLength=firstDatasetLineChart.length;
      
  plot.append("path")
      .attr("class", "line")
      .attr("d", line)  
    .attr("stroke", "lightgrey")
      ;
    


  svg.append("text")
    .text("Averate Ratings over the years")
    .attr("id","lineChartTitle1") 
    .attr("x",margin.left + ((width + margin.right)/2))
    .attr("y", 40)
    ;



}


function updateLine1Chart(group, colorChosen) {

  var currentDatasetLineChart = datasetLineChartChosen(group);   

  var basics = dsLineChartBasics();
  
  var margin = basics.margin,
    width = basics.width,
     height = basics.height
    ;

  var xScale = d3.scale.linear()
      .domain([0, currentDatasetLineChart.length-1])
      .range([0, width])
      ;

  var yScale = d3.scale.linear()
      .domain([0, d3.max(currentDatasetLineChart, function(d) { return d.count; })])
      .range([height, 0])
      ;
  
  var line = d3.svg.line()
    .x(function(d, i) { return xScale(i); })
    .y(function(d) { return yScale(d.count); })
    ;

   var plot = d3.select("#ratingLineChartPlot")
    .datum(currentDatasetLineChart)
     ;
     
  var dsLength=currentDatasetLineChart.length;

     
  plot
  .select("path")
    .transition()
    .duration(750)          
     .attr("class", "line")
     .attr("d", line) 
    .attr("stroke", colorChosen)
     ;
     

}

function datasetLineVotesChartChosen(group) {
  var ds = [];
  for (x in datasetLineVotesChart) {
     if(datasetLineVotesChart[x].group==group){
      ds.push(datasetLineVotesChart[x]);
     } 
    }

  return ds;
}

function dsLineVotesChartBasics() {

  var margin = {top: 150, right: 10, bottom: 20, left: 150},
      width = 600 - margin.left - margin.right,
      height = 350 - margin.top - margin.bottom
      ;
    
    return {
      margin : margin, 
      width : width, 
      height : height
    }     
    ;
}


function dsLineVotesChart() {

  var firstDatasetLineChart = datasetLineVotesChartChosen(group);    
  
  
  var basics = dsLineVotesChartBasics();
  
  var margin = basics.margin,
    width = basics.width,
     height = basics.height
    ;

  var xScale = d3.scale.linear()
        .domain(d3.extent(firstDatasetLineChart, function(d) { return +d.category; }) ) 
      .range([0, width])
      ;

  var yScale = d3.scale.linear()
      .domain([0, d3.max(firstDatasetLineChart, function(d) { return d.count; })])
      .range([height, 0])
      ;

  var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient("bottom");

  var formatxAxis = d3.format("");

  xAxis.tickFormat(formatxAxis).ticks(10);



var yAxis = d3.svg.axis()
    .scale(yScale)
    .orient("left");

yAxis.tickFormat(formatxAxis).ticks(5);
  


  var line = d3.svg.line()
      .x(function(d) { return xScale(d.category); })
      .y(function(d) { return yScale(d.count); })
      ;
  
  var svg = d3.select("#lineChart2").append("svg")
      .datum(firstDatasetLineChart)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      

  svg.append("g")
      .attr("class", "x axis_line")
      .attr("transform", "translate(" + margin.left + "," + (height +margin.top) + ")")
      .call(xAxis)
      .selectAll("text") 
      .style("font-size",12);



  gy=svg.append("g")
      .attr("class", "y axis_line")
      .attr("transform", "translate(" + margin.left + "," + margin.top+ ")")
      .call(yAxis);

    gy.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "-3.71em")
      .style("text-anchor", "end")
      .text("Average Number of Votes");
      
  var plot = svg
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
      .attr("id", "votesLineChartPlot")
      ;

  var dsLength=firstDatasetLineChart.length;

      
  plot.append("path")
      .attr("class", "line")
      .attr("d", line)  
    .attr("stroke", "grey")
      ;
    


  svg.append("text")
    .text("Averate Votes over the years")
    .attr("id","lineChartTitle2") 
    .attr("x",margin.left + ((width + margin.right)/2))
    .attr("y", 120)
    ;



}

function updateLine2Chart(group, colorChosen) {

  var currentDatasetLineChart = datasetLineVotesChartChosen(group);   

  var basics = dsLineVotesChartBasics();
  
  var margin = basics.margin,
    width = basics.width,
     height = basics.height
    ;

  var xScale = d3.scale.linear()
      .domain([0, currentDatasetLineChart.length-1])
      .range([0, width])
      ;

  var yScale = d3.scale.linear()
      .domain([0, d3.max(currentDatasetLineChart, function(d) { return d.count; })])
      .range([height, 0])
      ;
  
  var line = d3.svg.line()
    .x(function(d, i) { return xScale(i); })
    .y(function(d) { return yScale(d.count); })
    ;

   var plot = d3.select("#votesLineChartPlot")
    .datum(currentDatasetLineChart)
     ;
     
  var dsLength=currentDatasetLineChart.length;
       
  plot
  .select("path")
    .transition()
    .duration(750)          
     .attr("class", "line")
     .attr("d", line) 

    .attr("stroke", colorChosen)
     ;
     

}