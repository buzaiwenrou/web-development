let csv_data = [];
let lowerBounds = [100.00, 95.00, 90.00, 85.00, 80.00, 75.00, 70.00, 65.00, 60.00, 55.00, 50.00, 0.00];
let histogramList = ["","","","","","","","","","","","",""];
let stats = ["","",0,0];

function init(){
    document.getElementById('fileInput').addEventListener('change', handleFileSelect, false);

    const inputElements = document.querySelectorAll('input[type="number"]');

    inputElements.forEach(input => {
        input.addEventListener('change', handleInputChange);
    });

}
function handleInputChange(){
    for (let i = 1; i < 11; i++) {
        let gradeInput = document.getElementById("grade" + i);
        let gradeValue = gradeInput.value;
        if(gradeValue > lowerBounds[i-1] || gradeValue <  lowerBounds[i+1]){
            alert("invalid input!")
            gradeInput.value = lowerBounds[i];
        }else{
            lowerBounds[i] = gradeValue;
        }
    }
    console.log(lowerBounds)
    // Get the histogram
    SortHistogram();
    // Set the histogram
    setHistogram();
}
function handleFileSelect(event){
    const reader = new FileReader()
    // reset the data
    csv_data = [];
    stats = ["","",0,0];

    reader.onload = handleFileLoad;
    reader.readAsText(event.target.files[0])
}

function handleFileLoad(event){
    const fileContent = event.target.result;

    // 1. read data line by line
    const lines = fileContent.split('\n');
    lines.forEach((line) => {

        const fields = line.split(',');

        const name = fields[0].trim();
        const grade = fields[1].replace('\r', '');

        // ignore the first line
        if(name != "Name"){
            // 2. store the data
            csv_data.push([name, parseFloat(grade)]);
        }

    });

    // 3. Get the histogram
    SortHistogram();
    // 4. Set the histogram
    setHistogram();

    // 5. Calculate the stats
    calculateStats();
}

function SortHistogram(){
    histogramList = ["","","","","","","","","","","","",""]
    for(let i=0;i<csv_data.length;i++){
        if(csv_data[i][1] == lowerBounds[0]){
            histogramList[0] = csv_data[i][0];
        }
        let isRecord = false;

        for(let j=1;j<lowerBounds.length-1;j++){
            if(csv_data[i][1]<lowerBounds[j-1] && csv_data[i][1]>=lowerBounds[j]){
                histogramList[j] += " " + csv_data[i][0] + ",";
                isRecord = true;
                break;
            }
        }

        if(isRecord == false){
            histogramList[histogramList.length-1] = csv_data[i][0];
        }
    }
}

function setHistogram(){
    for(let j=0;j<lowerBounds.length;j++){
        let nameString = histogramList[j];
        if(nameString.charAt(nameString.length-1) == ","){
            nameString = nameString.substring(0,nameString.length-1);
        }
        document.getElementById("nameList"+j).innerText = nameString;
    }
}

function calculateStats(){

    const length = csv_data.length;
    const mid = Math.floor(length/2);

    // Sort the data by grade desc
    csv_data.sort((a, b) => a[1] - b[1]);

    // 1.highest
    stats[0] = csv_data[length-1][0] + "(" + csv_data[length-1][1] + ")";
    // 2. lowest
    stats[1] = csv_data[0][0] + "(" + csv_data[0][1] + ")";

    // 3.Mean
    for (let i = 0; i < csv_data.length; i++) {
        stats[2] += csv_data[i][1];
    }
    stats[2] = (stats[2] / length).toFixed(2);

    // 4.Median
    if (length % 2 === 0) {
        stats[3] = (csv_data[mid][1] + csv_data[mid-1][1])/2;
    } else {
        stats[3] = csv_data[mid][1]
    }

    // 5.set stats
    for(let j=0;j<stats.length;j++){
        let statsString = stats[j];

        document.getElementById("stats"+j).innerText = statsString;
    }
}

