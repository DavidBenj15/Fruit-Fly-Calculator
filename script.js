let xCoordsArray = [];
let yCoordsArray = [];
let distancesArray = [];
let resultsTable;
let messageP = document.getElementById('message-p');

//TODO: add "copy to clipboard" button to table.
/*TODO: if "Error: no file..." message is already displayed,
 *and there is a successful upload, remove the message.
 */

/**
 * Reads the uploaded file
 * Calls the createResultsTable() function
 * Calls the processData() function
 * Calls the showMessage() function based on input success.
 * 
 */
function getFile() {
    const fileInput = document.getElementById('file-input');
    const tableDiv = document.getElementById('table-div');

    if (fileInput.files.length) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            if (resultsTable) {
                resultsTable.remove();
                clearArrays();
                //TODO: remove "Error: no..." message within this function.
            }

            resultsTable = createResultsTable();
            tableDiv.append(resultsTable);

            const fileText = e.target.result;
            processData(fileText);

            const fileName = fileInput.value.split('\\').pop();
            showMessage("none", fileName);
            fileInput.value = '';
        }
        
        reader.readAsText(fileInput.files[0]);
    } else {
        showMessage("no-file")
    }
}

function clearArrays() {
    xCoordsArray.length = 0;
    yCoordsArray.length = 0;
    distancesArray.length = 0;
}

/**
 * Creates the results table to be added to DOM.
 * @returns {Element} resultsTable
 */
function createResultsTable() {
    const resultsTable = document.createElement('table');
    resultsTable.classList.add('results-table');

    const th1 = document.createElement('th');
    th1.innerText = 'Obj X -> Obj Y';
    const th2 = document.createElement('th');
    th2.innerText = 'Distance in Units';

    resultsTable.append(th1, th2);
    return resultsTable;
}

/**
 * Updates "messageP" display based on "errorCode".
 * @param {string} errorCode 
 * @param {string} fileName 
 */
function showMessage(errorCode, fileName) {
    switch(errorCode) {
        case "none":
            messageP.innerText = `New Distances Calculated for ${fileName}`;
            messageP.removeAttribute('class');
            messageP.classList.add('success-message');
            break;
        case "no-file":
            messageP.innerText = 'Error: No file selected';
            messageP.removeAttribute('class');
            messageP.classList.add('error-message');
            break;
        case "missing-coord":
            console.log('Error: Coordinate pair(s) missing a value')
            messageP.innerText = 'Error: Coordinate pair(s) missing a value';
            messageP.removeAttribute('class');
            messageP.classList.add('error-message');
        default:
            console.log('Error: invalid "errorCode" parameter passed to showMessage()');
    }
}

/**
 * Parses "data" and calls objToObj function.
 * @param {string} data 
 */
function processData(data) {
    const cleanedData = data.replaceAll('\r', '');
    const rows = cleanedData.split('\n').slice(0, -1);
    
    rows.forEach(row => {
        const columns = row.split('\t');
        const x = columns[0];
        let y = columns[1];
        xCoordsArray.push(x);
        yCoordsArray.push(y);
    })
   
    if (xCoordsArray.length === yCoordsArray.length) {
        console.log('Coordinates acquired');
    }
    else { 
        showMessage("missing-coord")
    }

    objToObj(xCoordsArray, yCoordsArray);
}

/**
 * Distance function using pythagorean formula.
 * @param {number} x1 
 * @param {number} y1 
 * @param {number} x2 
 * @param {number} y2 
 * @returns distance between the 2 pairs of inputted points.
 */
function dist(x1, y1, x2, y2) {
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

/**
 * Computes the average of the numbers in "numberArray".
 * @param {Array} numberArray 
 * @returns the average of an array of distances.
 */
function average(numberArray) {
    const sum = numberArray.reduce((acc, val) => acc + val, 0);
    averageDistance = (sum / numberArray.length).toString();
    return averageDistance;
}

/**
 * Cycles through each combination of elements.
 * Calls the distance array for each combination and adds data to table.
 * Adds "Average Distance" row to table.
 * @param {Array} xArray 
 * @param {Array} yArray 
 */
function objToObj(xArray, yArray) {
    const ratioInput = Number(document.getElementById('ratio-input').value);

    for(let i = 1; i < xArray.length; i++) {
        for(let j = 1; j < xArray.length; j++) {
            if (i + j <= xArray.length) { //If not outside range
                const el = `Obj ${i} -> Obj ${i + j}`;
                const a = i - 1;
                const b = i + j - 1;
                let distance = dist(Number(xArray[a]), Number(yArray[a]), Number(xArray[b]), Number(yArray[b]));
                
                if (ratioInput) {
                    distance = distance / ratioInput;
                }

                distancesArray.push(distance);
                
                //Adds each row to table
                const tr = document.createElement('tr');
                resultsTable.append(tr);
                
                tdObj = document.createElement('td');
                tdObj.innerText = el;
                
                tdDist = document.createElement('td');
                tdDist.innerText = distance.toString();
                
                tr.append(tdObj, tdDist);
            }
        }
    }

    //Adds "Averages" row to table
    const avgRow = document.createElement('tr');
    resultsTable.append(avgRow);

    const avgLabel = document.createElement('td');
    avgLabel.innerText = 'Average Distance:';

    const avgValue = document.createElement('td');
    avgValue.innerText = average(distancesArray);

    avgRow.append(avgLabel, avgValue);
}