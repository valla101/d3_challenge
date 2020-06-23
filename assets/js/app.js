// Defining Chart Parameters
var svgWidth = 1000;
var svgHeight = 600;

var margin = { top: 20, right: 40, bottom: 75, left: 75 };

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

  var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Reading CSV File
d3.csv("assets/data/data.csv").then(function(Data) {
    console.log(Data);
    var healthcare_arr = [];
    var poverty_arr = [];
    Data.forEach(item => {
        state_smokers = +item.smokes;
        state_age = +item.age;
        state_poverty = +item.poverty;
        state_healthcare = +item.healthcare;
        state = item.state;
        console.log(item.state, [item.smokes,item.age],[item.poverty, item.healthcare]);
        // console.log(d3.max(Data, item => item.healthcare));
        healthcare_arr.push(state_healthcare);
        poverty_arr.push(state_poverty);
    });

    console.log(healthcare_arr);
    console.log(`Max Healthcare ${d3.max(healthcare_arr)}`);
    console.log(`Min Healthcare ${d3.min(healthcare_arr)}`);
    console.log(poverty_arr);
    console.log(`Max Poverty ${d3.max(poverty_arr)}`);
    console.log(`Min Poverty ${d3.min(poverty_arr)}`);

    // scaling for each axis
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(poverty_arr) -1 , d3.max(poverty_arr)])
        .range([0, width]);

    var yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(healthcare_arr)])
        .range([height, 0]);

        // Create axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);


      
    // chartGroup.append("g")
    // .attr("transform", `translate(0, ${height})`)
    // .call(bottomAxis);

    // chartGroup.append("text")
    //   .attr("transform", `translate(${width / 2 - 25}, ${height + margin.top + 30})`)
    //   .attr("class", "axisText")
    //   .text("In Poverty (%)");
    
    // Add x-axis
    chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

    var labels_group_x = chartGroup.append("g")
    .attr("transform", `translate(${width / 2 - 50}, ${height + margin.top + 10})`)

    // Add x-axis labels
    labels_group_x.append("text")
    .attr("class", "axisText") 
    .attr("x", 50)
    .attr("y", 5)
    .text("In Poverty (%)");

    // Add x-axis labels
    labels_group_x.append("text")
    .attr("x",0)
    .attr("y",30)
    .attr("class", "axisText") 
    .text("Household Median Income");

      // Add y1-axis to the left side of the display
    chartGroup.append("g")
    .call(leftAxis);

    // append y axis label
    // chartGroup.append("g")
    // .attr("transform", "rotate(-90)")
    // .attr("y", 0 - margin.left)
    // .attr("x", 0 - (height / 2) - 50)
    // .attr("dy", "1em")

    // append y axis label group
    var labels_group_y = chartGroup.append("g")
    .attr("transform", "rotate(-90)")

    // appending y axis label
    labels_group_y.append("text")
    .classed("axis-text", true)
    .attr("y", 0 - margin.left + 25)
    .attr("x", 0 - (height / 2) - 50)
    .attr("dy", "1em")
    .text("Lacks Healthcare (%)");

    // appending y axis label
    labels_group_y.append("text")
    .classed("axis-text", true)
    .attr("y", 0 - margin.left -5)
    .attr("x", 0 - (height / 2) - 20)
    .attr("dy", "1em")
    .text("Obesity (%)");

  /*Create and place the "blocks" containing the circle and the text */  
  var line1 = chartGroup.selectAll("g")
  .data(Data)
  .enter()
  .append("g")

  line1.selectAll("circle")
  .data(Data)
  .enter()
  .append("circle")
  .attr("cx", d => xLinearScale(d.poverty))
  .attr("cy", d => yLinearScale(d.healthcare))
  .attr("r", 12)
  .attr("fill", "orange")
  .attr("opacity", ".20");
  
  line1.selectAll("text")
  .data(Data)
  .enter()
  .append("text")
  .attr("x", d => xLinearScale(d.poverty)-10)
  .attr("y", d => yLinearScale(d.healthcare)+5)
  .text(d => d.abbr);

  var line1 = chartGroup.selectAll("circle")
  .data(Data)
  .enter()
  .append("circle")
  .attr("cx", d => xLinearScale(d.poverty))
  .attr("cy", d => yLinearScale(d.healthcare))
  .attr("r", 7)
  .attr("fill", "red")
  .attr("opacity", ".45");

    
    console.log(Data);
});