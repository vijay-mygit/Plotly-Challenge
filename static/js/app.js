d3.json("../samples.json").then((data) => {
    dropDown();
    var xValue = data["samples"][0]["otu_ids"];
    var yValue = data["samples"][0]["sample_values"];
    var hoverText = data["samples"][0]["otu_labels"];
    var metaData = data["metadata"][0];
    var washFreq = metaData["wfreq"];
    buildPlots(xValue,yValue,hoverText,metaData,washFreq);

});


function buildPlots(xValue,yValue,hoverText,metaData,washFreq){

    // Creating Demographic info
    var demoPanel = d3.select(".panel-body");
    demoPanel.html("");
    Object.entries(metaData).forEach(([key, value]) => {
        demoPanel.append("p").text(`${key}: ${value}`);
    });    

    var washFreq = metaData["wfreq"];

    // Creating Bar plot
    var labels = xValue.map(i =>`OTU ${i}`).slice(0,10);        
    var values = yValue.slice(0,10).sort((a,b)=>(a-b));
    
    var colors = ['green','blue','brown','orange','black','turquoise','gray','yellow','pink','red'];
        
    var trace1 = {
        x: values,
        y: labels.reverse(),
        text: hoverText,
        type:"bar",
        orientation:'h',
        marker: {
            color: colors
        }
    };

    var layout1 = {
        title: `Bacteria Distribution for subject Id ${document.getElementById("selDataset").value}`,
        xaxis: {title: "Bacteria Sample Values"},
        yaxis: {title:"OTU ID"}
    }
    var plotData = [trace1];
    Plotly.newPlot("bar",plotData,layout1);

    // Creating the Bubble plot
    var trace2 = {
        x:xValue,
        y:yValue,
        text:hoverText,
        mode:'markers',
        marker:{
            size: yValue,
            color: colors.reverse()
        }

    };

    var layout2 = {
        title: `Bubble plot of Bacteria Distribution for subject Id ${document.getElementById("selDataset").value}`,
        xaxis: {title: "Bacteria OTU ID"},
        yaxis: {title:"Bacteria Sample Values"}
    }

    var plotData2 = [trace2];
    Plotly.newPlot("bubble",plotData2,layout2);

    //Creating Guage plot
    var plotData3 = [
        {
          domain: { x: [0, 1], y: [0, 1] },
          value: washFreq,
          title: { text: "Scrubs per Week" },
          type: "indicator",
          mode: "gauge+number",
        //   text: [
        //     "0-1",
        //     "1-2",
        //     "2-3",
        //     "3-4",
        //     "4-5",
        //     "5-6",
        //     "6-7",
        //     "7-8",
        //     "8-9",
        //     ""
        //   ],
        //   textinfo: "text",
        //   textposition: "inside",
        //   delta: { reference: 380 },
          gauge: {
            axis: { range: [null, 9]},
            bar: { color: "darkgray" },
            steps: [
              { range: [0, 1], color: "red" },
              { range: [1, 2], color: "red" },
              {range: [2, 3], color: "red" },
              {range: [3, 4], color: "Yellow" },
              {range: [4, 5], color: "Yellow" },
              {range: [5, 6], color: "Yellow" },
              {range: [6, 7], color: "green" },
              {range: [7, 8], color: "Green" },
              {range: [8, 9], color: "green" },
            ],
            // threshold: {
            //   line: { color: "red", width: 4 },
            //   thickness: 0.75,
            //   value: 9
            // }
          }
        }
      ];
      
    var layout = { width: 600, height: 450, margin: { t: 0, b: 0 }};
    Plotly.newPlot('gauge', plotData3);

};

function dropDown(){
    d3.json("../samples.json").then((data)=>{
        var name = data.names;                
        // console.log(name);
        var idSelect = document.getElementById('selDataset')
        for (i=0;i<name.length;i++){
            var option = document.createElement("option");
            option.text = name[i];
            idSelect.add(option);            
        };        
    });
};

d3.select('#selDataset').on('change',optionChanged);

var optionChanged = function optionChanged(name) {
    d3.json("../samples.json").then((data)=> {
        var newSample = data["samples"].filter(i =>i.id == name);
        var metadataNew = data["metadata"].filter(i =>i.id == name);
        var metadata_new = metadataNew[0];
        var washFreq_new = metadata_new['wfreq'];       
        xValue = newSample[0]["otu_ids"];
        yValue = newSample[0]["sample_values"];
        hoverText = newSample[0]["otu_labels"];
        console.log(xValue);
        console.log(yValue);
        console.log(hoverText);
        console.log(washFreq_new);
        buildPlots(xValue,yValue,hoverText,metadata_new,washFreq_new);
    });
};
    








