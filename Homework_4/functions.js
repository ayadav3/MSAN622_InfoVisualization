/*
############# Bar Chart ###################
-------------------------------------------
*/

function dsBar_Chart(data){

   // console.log(data);

    data.sort(function(a,b){return d3.ascending(a.count, b.count);});

  var   width = 500,
       height = 800;


var color = d3.scale.quantize().domain([data.length,0])
    .range(colorbrewer.Dark2[data.length+1]);

  var margin = {top: 300, right: 20, bottom: 80, left: 90};
    var svg = d3.select("#bar_chart")
       .append("svg")              //create the SVG element inside the <body>
       .data([data])                   //associate our data with the document
           .attr("width", width)           //set the width and height of our visualization (these will be attributes of the <svg> tag
           .attr("height", height)
          .append("g")                //make a group to hold our bar chart
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
        // console.log(d.measure);
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
      .attr("dy", "-5.0em")
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
      .attr("height", function(d) { return height - y(d.count); });

    rect.on("click", update);




    svg.append("text")
        .attr("x", (width / 3))             
        .attr("y", 0 - (margin.top / 6))
        .attr("text-anchor", "middle")  
        .style("font-size", "16px") 
        .text("Select a genre by clicking on a bar");


  function update(d, i) {
  
        /* update bar chart when user selects bar of the bar chart */
        //updateBarChart(dataset[i].category);
        // console.log(d);
        updateLine1Chart(d.category, color(i));
        updateLine2Chart(d.category, color(i));
        
       
  }


// ##########################################################################################################################
  }


/*
############# Votes Line Chart ###################
-------------------------------------------
*/





/*
############# Ratings Line Chart ##################
-------------------------------------------
*/







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


function dsLineRatingsChart() {

  console.log(group);
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
      //.x(function(d, i) { return xScale(i); })
      .y(function(d) { return yScale(d.count); })
      ;
  
  var svg = d3.select("#lineChart2").append("svg")
      .datum(firstDatasetLineChart)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      // create group and move it so that margins are respected (space for axis and title)

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

    /* descriptive titles as part of plot -- start */
  var dsLength=firstDatasetLineChart.length;

  // plot.append("text")
  //   .text(firstDatasetLineChart[dsLength-1].measure)
  //   .attr("id","lineChartTitle2")
  //   .attr("x",width/2)
  //   .attr("y",height/2) 
  //   ;
  /* descriptive titles -- end */
      
  plot.append("path")
      .attr("class", "line")
      .attr("d", line)  
      // add color
    .attr("stroke", "lightgrey")
      ;
    


  svg.append("text")
    .text("Averate Ratings over the years")
    .attr("id","lineChartTitle1") 
    .attr("x",margin.left + ((width + margin.right)/2))
    .attr("y", 11)
    ;



}




 /* ** UPDATE CHART ** */
 
/* updates bar chart on request */
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
     
  /* descriptive titles as part of plot -- start */
  var dsLength=currentDatasetLineChart.length;
  
  // plot.select("text")
  //   .text(currentDatasetLineChart[dsLength-1].measure)
  //   ;
  /* descriptive titles -- end */
     
  plot
  .select("path")
    .transition()
    .duration(750)          
     .attr("class", "line")
     .attr("d", line) 
     // add color
    .attr("stroke", colorChosen)
     ;
     

     
     // path
     // .selectAll("title")
     // .text(function(d) { return d.category + ": " + formatAsInteger(d.measure); })   
     // ;  

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

  console.log(group);
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
      //.x(function(d, i) { return xScale(i); })
      .y(function(d) { return yScale(d.count); })
      ;
  
  var svg = d3.select("#lineChart2").append("svg")
      .datum(firstDatasetLineChart)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      // create group and move it so that margins are respected (space for axis and title)

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
      .text("Average Number of Votes");
      
  var plot = svg
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
      .attr("id", "votesLineChartPlot")
      ;

    /* descriptive titles as part of plot -- start */
  var dsLength=firstDatasetLineChart.length;

  // plot.append("text")
  //   .text(firstDatasetLineChart[dsLength-1].measure)
  //   .attr("id","lineChartTitle2")
  //   .attr("x",width/2)
  //   .attr("y",height/2) 
  //   ;
  /* descriptive titles -- end */
      
  plot.append("path")
      .attr("class", "line")
      .attr("d", line)  
      // add color
    .attr("stroke", "lightgrey")
      ;
    


  svg.append("text")
    .text("Averate Votes over the years")
    .attr("id","lineChartTitle1") 
    .attr("x",margin.left + ((width + margin.right)/2))
    .attr("y", 11)
    ;



}




 /* ** UPDATE CHART ** */
 
/* updates bar chart on request */
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
     
  /* descriptive titles as part of plot -- start */
  var dsLength=currentDatasetLineChart.length;
  
  // plot.select("text")
  //   .text(currentDatasetLineChart[dsLength-1].measure)
  //   ;
  /* descriptive titles -- end */
     
  plot
  .select("path")
    .transition()
    .duration(750)          
     .attr("class", "line")
     .attr("d", line) 
     // add color
    .attr("stroke", colorChosen)
     ;
     

     
     // path
     // .selectAll("title")
     // .text(function(d) { return d.category + ": " + formatAsInteger(d.measure); })   
     // ;  

}