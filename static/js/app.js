 // Assign URL to constant
 const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

 // Create sample selector
 let dropdown = d3.select("#selDataset");

 // Use D3 library to read in samples.json from the URL
 d3.json(url).then(data => {
     // Log on console for verification
     console.log(data);

     // Iterate through JSON to collect each sample's data
     for (let i = 0; i < data["names"].length; i++) {
         let id = data["names"][i];
         dropdown
             .append("option")
             .text(id)
             .attr("value", id);
     }

     // Set the default selected value to the first option
     d3.select("option").property("selected", true);

     // Define a function to handle dropdown change
     function handleDropdownChange() {
         // Get the selected value
         let id = dropdown.property("value");

         // Log on console for verification
         console.log("Selected ID:", id);

    
            // define the variables to hold data for charts
            let sampleData = data["samples"].filter(item => (item["id"] === id))[0];
            let out_ids = sampleData["otu_ids"];
            let sample_values = sampleData["sample_values"];
            let labels = sampleData["otu_labels"];
            let topOtu = out_ids.slice(0, 10).map(ids => "OTU" + String(ids)).reverse();
            let topValues = sample_values.slice(0, 10).reverse();
            let topLabels = labels.slice(0, 10).reverse();

            //log on console for verification
            console.log(topOtu);
            console.log(topValues);
            console.log(topLabels);
    
            // define the variables to hold metadata
            let meta_data = data["metadata"].filter(item => (item["id"] === parseInt(id)))[0];
            let ethnic = meta_data["ethnicity"];
            let sex = meta_data["gender"];
            let location = meta_data["location"];
            let age = meta_data["age"];
            let bbtype = meta_data["bbtype"];
            let washes = meta_data["wfreq"]
            
            //log on console for verification
            console.log(ethnic);
            console.log(sex);
            console.log(location);
    
            // Create a horizontal bar chart with a dropdown menu to display the top 10 OTUs found in that individual.
            let barchart = d3.select("#bar")

            //Clean out any previous data from the plot
            barchart.selectAll("*").remove();
    
            let config = {
                responsive: true
    
            }
            //Define Trace
            let barT = {
                x: topValues,
                y: topOtu,
                type: "bar",
                orientation: "h",
                marker: {
                    color: "#1f77b4"
                },
                hovertext: topLabels,
            };
            //Define Layout
            let barL = {
                title: `Top 10 OTUS for Subject #${id}`,
                xaxis: {
                    title: "Values in Sample"
                },
                font: {
                    color: "black"
                }
            };
            //Plot
            Plotly.newPlot("bar", [barT], barL, config);
    
            // Create a bubble chart that displays each sample.
            let bubblechart = d3.select("#bubble")

             //Clean out any previous data from the plot
             bubblechart.selectAll("*").remove();
    
             //Define Trace
             let bubbleT = {
                x: out_ids,
                y: sample_values,
                text: labels,
                mode: "markers",
                marker: {
                    size: sample_values,
                    sizeref: 2 * Math.max(...sample_values) / (90 ** 2),
                    sizemode: "area",
                    color: out_ids,
                    colorscale: 'Earth'
                },
            };
            //Define Layout
            let bubbleL = {
                title: `OTUs Present in Subject #${id}`,
                xaxis: {
                    title: "OTU ID"
                },
                yaxis: {
                    title: "Sample Values"
                },
                font: {
                    color: "black"
                }
            };
            //Plot
            Plotly.newPlot("bubble", [bubbleT], bubbleL, config);
    
            // Display the sample metadata, i.e., an individual's demographic information.
            let person_data = d3.select("#sample-metadata");
                        
            //Clean out any previous data from the plot
            person_data.selectAll("*").remove();

            // Display each key-value pair from the metadata JSON object somewhere on the page.
            person_data.append("p").text("Id: " + id);
            person_data.append("p").text("Ethnicity: " + ethnic);
            person_data.append("p").text("Gender: " + sex);
            person_data.append("p").text("Age: " + age);
            person_data.append("p").text("Location: " + location);
            person_data.append("p").text("bbtype: " + bbtype);
            person_data.append("p").text("wfreq: " + washes);
    
            // Bonus
            // Link with Guage
            let gaugechart = d3.select("#gauge")
    
            // Delete values for gauge graph when the ID gets changed
            gaugechart.selectAll("*").remove();
    
             //Define Trace
            let gaugeT = {
                type: "indicator",
                mode: "gauge",
                value: washes,
                colorscale: "black",
                title: {
                    text: "Wash Belly Button <br> Frequency"
                },
                gauge: {
                    bar: {
                        thickness: 0.45,
                        colorscale: "Earth"
                    },
                    axis: {
                        range: [null, 10],
                        tickvals: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
                        visible: true,
                        ticks: "inside"
                    }
                }
            };
            //Define Layout    
            let gaugeL = {
                margin: {
                    l: 10,
                    r: 10,
                },
                font: {
                    color: "black"
                }
            };
            //Plot
            Plotly.newPlot("gauge", [gaugeT], gaugeL, config)
        }   // Call the handleDropdownChange function when the dropdown selection changes
        dropdown.on("change", handleDropdownChange);

        // Call the function once initially to process the default selected value
        handleDropdownChange();
    });