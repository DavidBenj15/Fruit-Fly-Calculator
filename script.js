let fileText;
let convFactor;
let xCoordsArray = [];
let yCoordsArray = [];
let distancesArray = [];
let resultsTable;
let averageDistance;
let submitButton = document.getElementById("submit__button");
let messageP = document.getElementById('message__p');

//Reads the uploaded file, converts it to text, and calls processData function.
//Also sets the conversion factor.
function getFile() {
    let file = document.getElementById('file__input');
    if (file.files.length) {
        let reader = new FileReader();
        reader.onload = function(e) {
            if (resultsTable) {
                resultsTable.remove();
                xCoordsArray = [];
                yCoordsArray = [];
                distancesArray = [];
            }
            let tableDiv = document.getElementById('table__div');
            resultsTable = document.createElement('table');
            resultsTable.classList.add('results__table');
            tableDiv.append(resultsTable);
            let th1 = document.createElement('th');
            th1.innerText = 'Obj X -> Obj Y';
            let th2 = document.createElement('th');
            th2.innerText = 'Distance in Units';
            resultsTable.append(th1, th2);

            convFactor = document.getElementById('ratio__input').value;
            convFactor = Number(convFactor);
            fileText = e.target.result;
            processData(fileText);
            let fileName = file.value.split('\\').pop();
            messageP.innerText = `New Distances Calculated for ${fileName}`;
            messageP.removeAttribute('class');
            messageP.classList.add('success__message');
            file.value = '';
        }
        reader.readAsBinaryString(file.files[0]);
        tablePresent = true;
    }
    else {
        messageP.innerText = 'Error: No file selected';
        messageP.removeAttribute('class');
        messageP.classList.add('error__message');
    }
}

//Parses data and calls objToObj function.
function processData(data) {
    const data2 = data.replaceAll('\r', '');
    let row = data2.split('\n').slice(0, -1);
    row.forEach(row => {
        const columns = row.split('\t');
        const x = columns[0];
        let y = columns[1];
        xCoordsArray.push(x);
        yCoordsArray.push(y);
    })
    console.log(xCoordsArray, yCoordsArray);
    if (xCoordsArray.length === yCoordsArray.length) {
        console.log('Coordinates acquired');
    }
    else { 
        console.log('Error: Coordinate pair(s) missing a value')
        messageP.innerText = 'Error: Coordinate pair(s) missing a value';
        messageP.removeAttribute('class');
        messageP.classList.add('error__message');
    }
    objToObj(xCoordsArray, yCoordsArray);
}

//Distance function using pythagorean formula
function dist(x1, y1, x2, y2) {
    return Math.sqrt((x2 - x1)*(x2 - x1) + (y2 - y1)*(y2 - y1));
}

function average(numberArray) {
    let sum = 0;
    for (let i = 0; i < numberArray.length; i++) {
        console.log(numberArray[i], typeof numberArray[i]);
        sum = sum + numberArray[i];
    }
    averageDistance = sum / numberArray.length;
    averageDistance = averageDistance.toString();
    console.log('AAAAAAAAAAAAAh');
    console.log(averageDistance);
}

//Creates combinations between objects, calls the dist function, and adds data to the table.
function objToObj(xArray, yArray) {
    for(let k = 1; k < xArray.length; k++) {
        for(let i = 1; i < xArray.length; i++) {
            if (k + i > xArray.length) {
                //Do nothing
            }
            else {
                let el = `Obj ${k} -> Obj ${k + i}`;
                let a = k - 1;
                let b = k + i - 1;
                let distance = dist(Number(xArray[a]), Number(yArray[a]), Number(xArray[b]), Number(yArray[b]));
                if (convFactor) {
                    distance = distance / convFactor;
                }
                distancesArray.push(distance);
                distance = distance.toString();
                
                //Adds data to table
                let tr = document.createElement('tr');
                resultsTable.append(tr);
                tdObj = document.createElement('td');
                tdObj.innerText = el;
                
                tdDist = document.createElement('td');
                tdDist.innerText = distance;
                
                tr.append(tdObj, tdDist);
            }
        }
    }
    let avgRow = document.createElement('tr');
    resultsTable.append(avgRow);
    let avgLabel = document.createElement('td');
    avgLabel.innerText = 'Average Distance:';
    let avg = document.createElement('td');
    average(distancesArray);
    avg.innerText = averageDistance;
    avgRow.append(avgLabel, avg);
}

