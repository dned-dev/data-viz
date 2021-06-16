// --------------------------------------------------------------------
// Data processing helper functions.
// --------------------------------------------------------------------
function sum(data) {
  var total = 0;

  // Ensure that data contains numbers and not strings.
  data = stringsToNumbers(data);

  for (let i = 0; i < data.length; i++) {
    total = total + data[i];
  }

  return total;
}

function mean(data) {
  var total = sum(data);

  return total / data.length;
}

function sliceRowNumbers (row, start=0, end) {
  var rowData = [];

  if (!end) {
    // Parse all values until the end of the row.
    end = row.arr.length;
  }

  for (i = start; i < end; i++) {
    rowData.push(row.getNum(i));
  }

  return rowData;
}

function stringsToNumbers (array) {
  return array.map(Number);
}

function findMin(_table){
    var table = _table;
    var values = [];
    var nums = [];
    //put all the values from the data into an array
    for(var i = 1; i < table.getRows().length; i++){
       for(var j = 2; j < table.columns.length; j++){
           if(table.get(i,j) != 0){
               values.push(table.get(i,j))
           }      
       }
    }

    var nums = stringsToNumbers(values)
    //search for min value in array
    var min = nums[0]
    for(var i = 0; i < nums.length; i++){
        if(nums[i] < min){
            min = nums[i]
        }
    }      
   return min;       
}

function search(arr,str){
 for(var i = 1; i < arr.length; i+=2){
     if(arr[i] == str){
         return i;
     }
 }
 return -1;     
}

// --------------------------------------------------------------------
// Plotting helper functions
// --------------------------------------------------------------------

function drawAxis(layout, colour=0) {
  stroke(color(colour));

  // x-axis
  line(layout.leftMargin,
       layout.bottomMargin,
       layout.rightMargin,
       layout.bottomMargin);

  // y-axis
  line(layout.leftMargin,
       layout.topMargin,
       layout.leftMargin,
       layout.bottomMargin);
}

function drawAxisLabels(xLabel, yLabel, layout) {
  fill(0);
  noStroke();
  textAlign('center', 'center');

  // Draw x-axis label.
  text(xLabel,
       (layout.plotWidth() / 2) + layout.leftMargin,
       layout.bottomMargin + (layout.marginSize * 1.5));

  // Draw y-axis label.
  push();
  translate(layout.leftMargin - (layout.marginSize * 1.5),
            layout.bottomMargin / 2);
  rotate(-PI / 2);
  text(yLabel, 0, 0);
  pop();
}

function drawYAxisTickLabels(min, max, layout, mapFunction,
                             decimalPlaces) {
  // Map function must be passed with .bind(this).
  var range = max - min;
  var yTickStep = range / layout.numYTickLabels;

  fill(0);
  noStroke();
  textAlign('right', 'center');

  // Draw all axis tick labels and grid lines.
  for (i = 0; i <= layout.numYTickLabels; i++) {
    var value = min + (i * yTickStep);
    var y = mapFunction(value);

    // Add tick label.
    text(value.toFixed(decimalPlaces),
         layout.leftMargin - layout.pad,
         y);

    if (layout.grid) {
      // Add grid line.
      stroke(200);
      line(layout.leftMargin, y, layout.rightMargin, y);
    }
  }
}

function drawXAxisTickLabel(value, layout, mapFunction) {
  // Map function must be passed with .bind(this).
  var x = mapFunction(value);

  fill(0);
  noStroke();
  textAlign('center', 'center');

  // Add tick label.
  text(value,
       x,
       layout.bottomMargin + layout.marginSize / 2);

  if (layout.grid) {
    // Add grid line.
    stroke(220);
    line(x,
         layout.topMargin,
         x,
         layout.bottomMargin);
  }
}

function mouseCheck(_mouseX,_mouseY,x,y,diameter){
    if (dist(_mouseX,_mouseY,x,y) < diameter){
        return true;
        }
    return false;
}
