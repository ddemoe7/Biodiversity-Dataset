function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
    d3.json("/metadata/" + sample).then(function(sample){
  // Use d3 to select the panel with id of `#sample-metadata`
      var select = d3.select("#sample-metadata");  
    // Use `.html("") to clear any existing metadata
      select.html("");
    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
      Object.entries(data).forEach(([key,value]) =>{
        select
          .append('p').text(`${key} : ${value}`)
          .append('hr')
    });
  }) 
  }

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
d3.json("/samples/${sample}").then(function(data){

  // @TODO: Build a Bubble Chart using the sample data
  var xval = data.otu_ids;
  var yval = data.sample_values;
  var label = data.otu_labels;
  var size = data.sample_values;

  var bubbles = {
    x: xval,
    y: yval,
    label: label,
    mode: 'markers',
    marker: {
      size: size,
      color: xval
    }
  }
  var data = [bubbles];

  var layout = {
    title: "Bacteria Size",
  };
  Plotly.newPlot("bubble",data,layout);

// @TODO: Build a Pie Chart
// HINT: You will need to use slice() to grab the top 10 sample_values,
// otu_ids, and labels (10 each).

  var data = [{
    values: size.splice(0,10),
    labels: xval.splice(0,10),
    text: yval.splice(0,10),
  }]
  Plotly.newPlot('pie',data);
});
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
// Define a function that will create metadata for given sample
function buildMetadata(selection) {

  // Read the json data
  d3.json("samples.json").then((sampleData) => {

      console.log(sampleData);

      // Parse and filter the data to get the sample's metadata
      var parsedData = sampleData.metadata;
      console.log("parsed data inside buildMetadata function")
      console.log(parsedData);

      var sample = parsedData.filter(item => item.id == selection);
      console.log("showing sample[0]:");
      console.log(sample[0]);

      // Specify the location of the metadata and update it
      var metadata = d3.select("#sample-metadata").html("");

      Object.entries(sample[0]).forEach(([key, value]) => {
          metadata.append("p").text(`${key}: ${value}`);
      });

      console.log("next again");
      console.log(metadata);
  });
}

// Define a function that will create charts for given sample
function buildCharts(selection) {

  // Read the json data
  d3.json("samples.json").then((sampleData) => {

      // Parse and filter the data to get the sample's OTU data
      // Pay attention to what data is required for each chart
      var parsedData = sampleData.samples;
      console.log("parsed data inside buildCharts function")
      console.log(parsedData);

      var sampleDict = parsedData.filter(item => item.id == selection)[0];
      console.log("sampleDict")
      console.log(sampleDict);


      var sampleValues = sampleDict.sample_values; 
      var barChartValues = sampleValues.slice(0, 10).reverse();
      console.log("sample_values")
      console.log(barChartValues);

      var idValues = sampleDict.otu_ids;
      var barChartLabels = idValues.slice(0, 10).reverse();
      console.log("otu_ids");
      console.log(barChartLabels);

      var reformattedLabels = [];
      barChartLabels.forEach((label) => {
          reformattedLabels.push("OTU " + label);
      });

      console.log("reformatted");
      console.log(reformattedLabels);

      var hovertext = sampleDict.otu_labels;
      var barCharthovertext = hovertext.slice(0, 10).reverse();
      console.log("otu_labels");
      console.log(barCharthovertext);

      // Create bar chart in correct location

      var barChartTrace = {
          type: "bar",
          y: reformattedLabels,
          x: barChartValues,
          text: barCharthovertext,
          orientation: 'h'
      };

      var barChartData = [barChartTrace];

      Plotly.newPlot("bar", barChartData);

      // Create bubble chart in correct location

      var bubbleChartTrace = {
          x: idValues,
          y: sampleValues,
          text: hovertext,
          mode: "markers",
          marker: {
              color: idValues,
              size: sampleValues
          }
      };

      var bubbleChartData = [bubbleChartTrace];

      var layout = {
          showlegend: false,
          height: 600,
          width: 1000,
          xaxis: {
              title: "OTU ID"
          }
      };

      Plotly.newPlot("bubble", bubbleChartData, layout);
  });
}

// Define function that will run on page load
function init() {

  // Read json data
  d3.json("samples.json").then((sampleData) => {

      // Parse and filter data to get sample names
      var parsedData = sampleData.names;
      console.log("parsed data inside init function")
      console.log(parsedData);

      // Add dropdown option for each sample
      var dropdownMenu = d3.select("#selDataset");

      parsedData.forEach((name) => {
          dropdownMenu.append("option").property("value", name).text(name);
      })

      // Use first sample to build metadata and initial plots
      buildMetadata(parsedData[0]);

      buildCharts(parsedData[0]);

  });
}

function optionChanged(newSelection) {

  // Update metadata with newly selected sample
  buildMetadata(newSelection); 
  // Update charts with newly selected sample
  buildCharts(newSelection);
}

// Initialize dashboard on page load
init();