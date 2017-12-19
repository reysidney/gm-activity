$('#footer').show();

$('#footerbuttondown').on('click', shrink);
$('#footerbuttonup').on('click', expand);

  
function shrink() {
    if ((document.getElementById("footer").style.height = "440px")) {
        document.getElementById("footer").style.height = "30px";
        document.getElementById("footerbuttondown").style.visibility = "hidden";
        document.getElementById("footerbuttonup").style.visibility = "visible";
        document.getElementById("footercont").style.opacity = "0";
        document.getElementById("footercont").style.visibility = "hidden";
    }
}
  
function expand() {
    if ((document.getElementById("footer").style.height = "30px")) {
        document.getElementById("footer").style.height = "440px";
        document.getElementById("footerbuttondown").style.visibility = "visible";
        document.getElementById("footerbuttonup").style.visibility = "hidden";
        document.getElementById("footercont").style.opacity = "1";
        document.getElementById("footercont").style.visibility = "visible";
    }
}

function processSampleData() {
    var array = [];
    var type = [];
    for(var i in sampleData) {
        if(sampleData[i].type)
            array.push({
                    label : sampleData[i].type,
                    y: 1 ,
                    legendText: sampleData[i].type,
                });
    }
    var result = [];
    array.forEach(function(value) {
        var existing = result.filter(function(v, i) {
            return v.legendText == value.legendText;
        });
        if (existing.length) {
            var existingIndex = result.indexOf(existing[0]);
            result[existingIndex].y += value.y;
        } else {
            result.push(value);
        }
    });
    return result;
}

window.onload = function() { 
    chartData = processSampleData();
    console.log(chartData);
	$("#chartContainer").CanvasJSChart({ 
		title: { 
			text: "Restaurant Types in Cebu",
			fontSize: 24
		}, 
		axisY: { 
			title: "Restaurant Type" 
		}, 
		legend :{ 
			verticalAlign: "center", 
			horizontalAlign: "right" 
		}, 
		data: [ 
		{ 
			type: "pie", 
			showInLegend: true, 
			toolTipContent: "{label} <br/> {y} restaurants", 
			indexLabel: "{y} restaurants", 
			dataPoints: chartData
		} 
		] 
	}); 
} 
  