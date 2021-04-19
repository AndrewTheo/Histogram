var svgNS = "http://www.w3.org/2000/svg";  


function createRect(x,y,height,width, styleClass)
{
	var bars = document.createElementNS(svgNS,"rect"); 
	bars.setAttributeNS(null, 'x', x);
    bars.setAttributeNS(null, 'y', y);
    bars.setAttributeNS(null, 'height', height);
    bars.setAttributeNS(null, 'width', width);
    bars.setAttributeNS(null, 'class', styleClass);
    document.getElementById("histogram").appendChild(bars);
    return bars;
}

function createText(x, y, message, styleClass)
{
	var newText = document.createElementNS(svgNS,"text");
	newText.setAttributeNS(null,"x",x);     
	newText.setAttributeNS(null,"y",y); 
	newText.setAttributeNS(null,"font-size","20");
	newText.setAttributeNS(null,"font-family", "'Roboto', sans-serif");
	newText.setAttributeNS(null, 'class', styleClass);
	var textNode = document.createTextNode(message);
	newText.appendChild(textNode);
	document.getElementById("histogram").appendChild(newText);
	return newText;
}

function setLayout()
{
	//leftGraphBar
    createRect(85,0,370,5);
    //BottomGraphBar
    createRect(85,370,5,900)
}


function yLabels(freqMax){
	let fullSvgHeight = 360;

	let pts = [0, Math.round(freqMax/2), freqMax];
	
	for(let point = 0; point < pts.length; point++)
	{
		let ptPercentage = pts[point] / freqMax;
		let yCord = fullSvgHeight - (fullSvgHeight*ptPercentage);
		createText(50, yCord+20, pts[point]);
	}

	let yTitle = createText(35, 250, "Frequency", "verticalText");
	yTitle .setAttributeNS(null, "transform", "rotate(-90, 35, 250)");
}

function validData(data){
	for(var i = 0; i < data.length; i++)
	{
		if(isNaN(data[i])){
			document.getElementById('userInput').style.backgroundColor = "#ff0033";
			return false; 
		}
	}
	document.getElementById('userInput').style.backgroundColor = "white";
	document.getElementById('errorMessage').style.visibility = "hidden";
	return true; 
}

function errorMessage(message){
	document.getElementById('errorMessage').innerHTML = "Error: " + message;
	document.getElementById('errorMessage').style.visibility = "visible";
}

function setupData(data){
	data = data.split(',');

	if(!validData(data)){
		errorMessage("Check Data");
		setLayout();
	}
	else
	{
		//Sturge’s Rule
		let numBins = 1 + Math.round(3.322*Math.log10(data.length));

		let minVal = Math.min(...data);
		let maxVal = Math.max(...data);

		let range = maxVal - minVal; 
		let binRange = Math.ceil((range+1)/numBins);

		let updatedRange = (numBins*binRange);

		let binData = new Array(numBins).fill(0);

		for(var i = 0; i < data.length; i++){
		  let percentage = data[i] - minVal;
		  percentage = percentage / updatedRange;
		  let binNumber = Math.floor(numBins * percentage);
		  binData[binNumber] = binData[binNumber] + 1;
		}

		createHistogram(binData, minVal, binRange, 0, Math.max(...binData));
	}
}


function createHistogram(data, minVal, binRange, freqMin, freqMax){
	setLayout()
	yLabels(freqMax);
	let totalBins = data.length;
	let sizeEachBar = Math.floor(855/totalBins);
	let startingX = 90;
	let binValue = minVal;

	for(var i = 0; i < totalBins; i++){
		let fullBarHeight = 360;
		let barPercentage = data[i] / freqMax;
		let yPosition = fullBarHeight - (fullBarHeight*barPercentage);

		createRect(startingX, yPosition+10, fullBarHeight-yPosition, sizeEachBar, "bar");
		createText(startingX-5, 397, binValue);

	    startingX = startingX + sizeEachBar;
	    binValue = binValue + binRange;
	}

	createText(startingX-5, 397, binValue)
	createText(490,430,"Bin");
}

function clearSVG()
{
	document.getElementById("histogram").innerHTML = '';
}


function loadSVG()
{
	clearSVG();
	let d = document.getElementById("userInput").value;
	setupData(d);
}


(function() {
    var starterData = "";
	var numRandomNums = 5000;
	for (var i = 0; i < numRandomNums; i++) {
	    var randomNumber = Math.floor((Math.random() * 80) + 10); 
	    if(i === numRandomNums-1){
	    	starterData += randomNumber
	    }
	    else{
	    	starterData += randomNumber+",";
	    }
	}
	setupData(starterData)
})();

