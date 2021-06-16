function PayGapTimeSeries() {

  // Name for the visualisation to appear in the menu bar.
  this.name = 'Pay gap: 1997-2017';

  // Each visualisation must have a unique ID with no special
  // characters.
  this.id = 'pay-gap-timeseries';

  // Title to display above the plot.
  this.title = 'Gender Pay Gap: Average difference between male and female pay.';

    // Names for each axis.
  this.xAxisLabel = 'year';
  this.yAxisLabel = '%';

  var marginSize = 35;

  // Layout object to store all common plot layout parameters and
  // methods.
  this.layout = {
    marginSize: marginSize,

    // Locations of margin positions. Left and bottom have double margin
    // size due to axis and tick labels.
    leftMargin: marginSize * 2,
    rightMargin: width - marginSize,
    topMargin: marginSize+20,
    bottomMargin: height - marginSize * 2,
    pad: 5,

    plotWidth: function() {
      return this.rightMargin - this.leftMargin;
    },

    plotHeight: function() {
      return this.bottomMargin - this.topMargin;
    },

    // Boolean to enable/disable background grid.
    grid: true,

    // Number of axis tick labels to draw so that they are not drawn on
    // top of one another.
    numXTickLabels: 20,
    numYTickLabels: 8,
  };

  // Property to represent whether data has been loaded.
  this.loaded = false;

  // Preload the data. This function is called automatically by the
  // gallery when a visualisation is added.
  this.preload = function() {
    var self = this;
    this.data = loadTable(
      './data/pay-gap/all-employees-hourly-pay-by-gender-1997-2017.csv', 'csv', 'header',
      // Callback function to set the value
      // this.loaded to true.
      function(table) {
        self.loaded = true;
      });

  };

  this.setup = function() {
    push();  
    // Font defaults.
    textSize(16);

    // Set min and max years: assumes data is sorted by date.
    this.startYear = this.data.getNum(0, 'year');
    this.endYear = this.data.getNum(this.data.getRowCount() - 1, 'year');

    // Find min and max pay gap for mapping to canvas height.
    this.minPayGap = 0;         // Pay equality (zero pay gap).
    this.maxPayGap = max(this.data.getColumn('pay_gap'));
    pop();
  };

  this.destroy = function() {
        this.frameCount = 0;
  };

  this.frameCount = 0;
    
  this.draw = function() {
      push();  
    if (!this.loaded) {
      console.log('Data not yet loaded');
      return;
    }
      
    // Draw the title above the plot.
    this.drawTitle();

    // Draw all y-axis labels.
    drawYAxisTickLabels(this.minPayGap,
                        this.maxPayGap,
                        this.layout,
                        this.mapPayGapToHeight.bind(this),
                        0);

    // Draw x and y axis.
    drawAxis(this.layout);

    // Draw x and y axis labels.
    drawAxisLabels(this.xAxisLabel,
                   this.yAxisLabel,
                   this.layout);

    // Plot all pay gaps between startYear and endYear using the width
    // of the canvas minus margins.
    var previous = {'year': this.data.getNum(0, 'year'),'payGap': this.data.getNum(0, 'pay_gap')}
    var numYears = this.endYear - this.startYear;
    var current;
    var yearCount = 0;
        // Loop over all rows and draw a line from the previous value to
        // the current.
        for (var i = 0; i < this.data.getRowCount(); i++) {

          // Create an object to store data for the current year.
           current = {
            // Convert strings to numbers.
            'year': this.data.getNum(i, 'year'),
            'payGap': this.data.getNum(i, 'pay_gap')
          };
            
          if (previous != null) {
            // Draw line segment connecting previous year to current
            // year pay gap.
            stroke(15);
              
             fill(131, 212, 117)  
                beginShape();
                    vertex(this.mapYearToWidth(previous.year)+1, this.mapPayGapToHeight(previous.payGap));
                    vertex(this.mapYearToWidth(previous.year)+1, this.layout.bottomMargin);
                    vertex(this.mapYearToWidth(current.year)-1, this.layout.bottomMargin)
                    vertex(this.mapYearToWidth(current.year)-1, this.mapPayGapToHeight(current.payGap));
                endShape();
                // The number of x-axis labels to skip so that only
                // numXTickLabels are drawn.
                var xLabelSkip = ceil(numYears / this.layout.numXTickLabels);

                // Draw the tick label marking the start of the previous year.
                if (i % xLabelSkip == 0) {
                  drawXAxisTickLabel(previous.year, this.layout,
                                     this.mapYearToWidth.bind(this));
                }
                  yearCount++;
              }

          // Assign current year to previous year so that it is available
          // during the next iteration of this loop to give us the start
          // position of the next line segment.
            
            if (yearCount >= this.frameCount) {
                break;
            }
            
            // variables to save on space
            var prevHeight = this.mapYearToWidth(previous.year)
            var currHeight = this.mapYearToWidth(current.year)                
            //detect when user hovers above a shape(bar)
            if(mouseX > prevHeight &&
               mouseX < currHeight &&
               mouseY > (this.mapPayGapToHeight(previous.payGap) + this.mapPayGapToHeight(current.payGap))/2 &&
               mouseY < this.layout.bottomMargin
              ){
                push()
                //redraw shape with darker color
                fill(71, 152, 57)  
                beginShape();
                    vertex(prevHeight+1, this.mapPayGapToHeight(previous.payGap));
                    vertex(prevHeight+1, this.layout.bottomMargin);
                    vertex(currHeight-1, this.layout.bottomMargin)
                    vertex(currHeight-1, this.mapPayGapToHeight(current.payGap));
                endShape();
                //draw percentage on top
                textSize(12)
                textAlign(LEFT)
                var txtPrev = (Math.round(previous.payGap*100)/100)+"%"
                var txtCurr = (Math.round(current.payGap*100)/100)+"%"
                fill("red")
                text(txtPrev,prevHeight-16, this.mapPayGapToHeight(previous.payGap)-10)
                text(txtCurr,currHeight-15, this.mapPayGapToHeight(current.payGap)-10)   
                pop()
               }
    
          previous = current;
        
        }
          pop();
    
         this.frameCount+=0.1;
      
  };
    


  this.drawTitle = function() {
    fill(0);
    noStroke();
    textAlign('center', 'center');

    text(this.title,
         (this.layout.plotWidth() / 2) + this.layout.leftMargin,
         this.layout.topMargin - (this.layout.marginSize / 2));
  };

  this.mapYearToWidth = function(value) {
    return map(value,
               this.startYear,
               this.endYear,
               this.layout.leftMargin,   // Draw left-to-right from margin.
               this.layout.rightMargin);
  };

  this.mapPayGapToHeight = function(value) {
    return map(value,
               this.minPayGap,
               this.maxPayGap,
               this.layout.bottomMargin, // Smaller pay gap at bottom.
               this.layout.topMargin);   // Bigger pay gap at top.
  };
}
