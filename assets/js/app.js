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

var chosenXAxis = "in_poverty";

// function used for updating x-scale var upon click on axis label
function xScale(Data, chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
  .domain([d3.min(Data, d => d[chosenXAxis]) * 0.8,
  d3.max(Data, d => d[chosenXAxis]) * 1.2
  ])
  .range([0, width]);

  return xLinearScale;

};

// function used for updating xAxis var upon click on axis label
function renderAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
};

// function used for updating circles group with a transition to
// new circles
function renderCircles(line1, newXScale, chosenXAxis) {

  line1.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]));

  return line1;
};

// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, line1) {

  var label;

  if (chosenXAxis === "in_poverty") {
    label = "In Poverty (%)";
  }
  else {
    label = "Household Median Income";
  }

  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([50, 150])
    .html(function(d) {
      return (`${d.state} <br>${label} ${d.poverty} ${d[chosenXAxis]}`);
    });

  line1.call(toolTip);

  line1.on("mouseover", function(Data) {
    toolTip.show(Data);
  })
    // onmouseout event
    .on("mouseout", function(Data, Index) {
      toolTip.hide(Data);
    });

  return line1;
}

// Reading CSV File
d3.csv("assets/data/data.csv").then(function(Data, err) {
  if (err) throw err;

  console.log(Data);
  var healthcare_arr = [];
  var poverty_arr = [];
  Data.forEach(data => {
      state_smokers = +data.smokes;
      state_age = +data.age;
      state_poverty = +data.poverty;
      state_healthcare = +data.healthcare;
      state = data.state;
      // console.log(item.state, [item.smokes,item.age],[item.poverty, item.healthcare]);
      // console.log(d3.max(Data, item => item.healthcare));
      healthcare_arr.push(state_healthcare);
      poverty_arr.push(state_poverty);
  });

    // scaling for each axis
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(poverty_arr) -1 , d3.max(poverty_arr)])
        .range([0, width]);
    
    // var xLinearScale = xScale(Data, chosenXAxis);
    // console.log(chosenXAxis);

    // var yLinearScale = d3.scaleLinear()
    // .domain([0, d3.max(Data, d=> d.healthcare)])
    // .range([height, 0]);

    var yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(healthcare_arr)])
        .range([height, 0]);

        // Create axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);
    
    // Add x-axis
    var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);
    
    // Add y1-axis to the left side of the display
    chartGroup.append("g")
    .call(leftAxis);

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
    // .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", 12)
    .attr("fill", "orange")
    .attr("opacity", ".20");
    
    line1.selectAll("text")
    .data(Data)
    .enter()
    .append("text")
    .attr("x", d => xLinearScale(d.poverty)-10)
    // .attr("x", d => xLinearScale(d[chosenXAxis]))
    .attr("y", d => yLinearScale(d.healthcare)+5)
    .text(d => d.abbr);

    var labels_group_x = chartGroup.append("g")
    .attr("transform", `translate(${width / 2 - 50}, ${height + margin.top + 10})`)

    // Add x-axis labels
    var poverty_label_x = labels_group_x.append("text")
    .attr("class", "axisText") 
    .attr("x", 50)
    .attr("y", 5)
    .attr("value", "in_poverty")
    .classed("active", true) 
    .text("In Poverty (%)");

    // Add x-axis labels
    var median_income_label_x = labels_group_x.append("text")
    .attr("x",0)
    .attr("y",30)
    .attr("value", "median_income") // value to grab for event listener
    .attr("class", "axisText")
    .classed("inactive", true)
    .text("Household Median Income");

    // append y axis label group
    var labels_group_y = chartGroup.append("g")
    .attr("transform", "rotate(-90)")

    // appending y axis label
    var healthcare_label_y = labels_group_y.append("text")
    .classed("axis-text", true)
    .attr("y", 0 - margin.left + 25)
    .attr("x", 0 - (height / 2) - 50)
    .attr("dy", "1em")
    .text("Lacks Healthcare (%)");

    // appending y axis label
    var obesity_label_y =labels_group_y.append("text")
    .classed("axis-text", true)
    .attr("y", 0 - margin.left -5)
    .attr("x", 0 - (height / 2) - 20)
    .attr("dy", "1em")
    .text("Obesity (%)");

  var line1 = updateToolTip(chosenXAxis, line1);

  // x axis labels event listener
  labels_group_x.selectAll("text")
  .on("click", function() {
    // get value of selection
    var value = d3.select(this).attr("value");
    if (value !== chosenXAxis) {

      // replaces chosenXAxis with value
      chosenXAxis = value;

      // console.log(chosenXAxis)

      // functions here found above csv import
      // updates x scale for new data
      xLinearScale = xScale(Data, chosenXAxis);

      // updates x axis with transition
      xAxis = renderAxes(xLinearScale, xAxis);

      // updates circles with new x values
      line1 = renderCircles(line1, xLinearScale, chosenXAxis);

      // updates tooltips with new info
      line1 = updateToolTip(chosenXAxis, line1);

      // changes classes to change bold text
      if (chosenXAxis === "median_income") {
        poverty_label_x
          .classed("active", true)
          .classed("inactive", false);
          median_income_label_x
          .classed("active", false)
          .classed("inactive", true);
      }
      else {
        poverty_label_x
          .classed("active", false)
          .classed("inactive", true);
        median_income_label_x
          .classed("active", true)
          .classed("inactive", false);
      }
    }
  });

});