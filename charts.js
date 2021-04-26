function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();



function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  buildGaugeChart(newSample);
  buildBubbleChart(newSample);
  
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {

    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    console.log(data);

    // 3. Create a variable that holds the samples array. 
    var resultArray = data.samples.filter(sampleObj => {
      return sampleObj.id == sample
    });
    
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var result = resultArray[0];
    
    //  5. Create a variable that holds the first sample in the array.
    var top_ten_otu_ids = result.otu_ids.slice(0, 10).map(numericIds => {
     return 'OTU' + numericIds;
   }).reverse();

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var top_ten_sample_values = result.sample_values.slice(0, 10).reverse();
    var top_ten_otu_labels = result.otu_labels.slice(0, 10).reverse();


    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var bar_trace = [
      {
        x: top_ten_sample_values,
        y: top_ten_otu_ids,
        text: top_ten_otu_labels,
        name: "Top 10",
        type: 'bar',
        orientation: 'h'
      }
    ];

    // 8. Create the trace for the bar chart. 
    var barData = [bar_trace
      
    ];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacterial Cultures Found",
     
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot('bar', bar_trace, barLayout)
  });
}

function buildGaugeChart(sample) {
  d3.json("samples.json").then((data) => {
    

    var metadata = data.metadata;
    var resultArray = metadata.filter(sampleObj => {
      return sampleObj.id == sample
    });
    var result = resultArray[0];
    console.log(result);

    var wash_freq = result.wfreq;
    
    console.log(wash_freq);


    var gauge_trace = [
      {
        domain: { x: [0, 1], y: [0, 1] },
        value: wash_freq,
        title: {text: "<b>Belly Button Washing Frequency Speed</b><br> Scrubs per Week", font: {size: 18}},
        type: "indicator",
        mode: "gauge+number",
        gauge: {
          axis: { range: [null, 10], tickwidth: 1, tickcolor: "darkblue" },
          bar: { color: "darkblue" },
          bgcolor: "white",
          borderwidth: 2,
          bordercolor: "gray",
          steps: [
            { range: [0, 1], color: 'red' },
            { range: [1, 2], color: 'red' },
            { range: [2, 3], color: 'orange' },
            { range: [3, 4], color: 'orange' },
            { range: [4, 5], color: 'yellow' },
            { range: [5, 6], color: 'yellow' },
            { range: [6, 7], color: 'lightgreen' },
            { range: [7, 8], color: 'lightgreen' },
            { range: [8, 9], color: 'green' },
            { range: [9, 10], color: 'green' }
          ],
          threshold: {
            line: { color: "red", width: 4 },
            thickness: 0.75,
            value: 2
          }
        }
      }
    ];
    



      var gaugeLayout = {

        width: 600,
        height: 500,
        margin: { t: 25, r: 25, l: 25, b: 25 },
        paper_bgcolor: "lavender",
        font: { color: "darkblue", family: "Arial" }
    };

      Plotly.newPlot('gauge', gauge_trace, gaugeLayout)
  });
}

//  Create the buildCharts function.
function buildBubbleChart(sample) {
  // Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    console.log(data);

    //  Create a variable that holds the samples array. 
    var resultArray = data.samples.filter(sampleObj => {
      return sampleObj.id == sample
    });
    
    //  Create a variable that filters the samples for the object with the desired sample number.
    var result = resultArray[0];
    
    //   Create a variable that holds the first sample in the array.
    var otu_ids = result.otu_ids.map(numericIds => {
     return numericIds;
   }).reverse();

    // Create variables that hold the otu_ids, otu_labels, and sample_values.
    var sample_values = result.sample_values.reverse();
    var otu_labels = result.otu_labels.reverse();

    var bubble_trace = {

      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker: {
        color: otu_ids,
        size: sample_values
      }
    };
 // 1. Create the trace for the bubble chart.
    var bubbleData = [bubble_trace
   
];

// 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      showlegend: false,
};

// 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot('bubble', bubbleData, bubbleLayout)
});
}



