function TechDiversityRace() {

  // Name for the visualisation to appear in the menu bar.
  this.name = 'Tech Diversity: Race';

  // Each visualisation must have a unique ID with no special
  // characters.
  this.id = 'tech-diversity-race';

  // Property to represent whether data has been loaded.
  this.loaded = false;

  // Preload the data. This function is called automatically by the
  // gallery when a visualisation is added.
  this.preload = function() {
    var self = this;
    this.data = loadTable(
      './data/tech-diversity/race-2018.csv', 'csv', 'header',
      // Callback function to set the value
      // this.loaded to true.
      function(table) {
        self.loaded = true;
      });
  };

  this.setup = function() {
    if (!this.loaded) {
      console.log('Data not yet loaded');
      return;
    }


    // Create a select DOM element.
    this.select = createSelect();
    this.select.position(350, 45);
    // prompt text
//    this.prompt = createP('Use the selector to change company view');
//    this.prompt.parent("#app")
      
    // Fill the options with all company names.
    var companies = this.data.columns;
    // First entry is empty.
    for (let i = 1; i < companies.length; i++) {
      this.select.option(companies[i]);
    }
  };

  this.destroy = function() {
   this.select.remove();
//   this.prompt.remove();
  };
  
    angleMode(RADIANS) 
  // Create a new pie chart object.
  this.pie = new PieChart(width / 2, height / 2, width * 0.4);

  this.draw = function() {
    push();
    if (!this.loaded) {
      console.log('Data not yet loaded');
      return;
    }

    // Get the value of the company we're interested in from the
    // select item.
    var companyName = this.select.value();

    // Get the column of raw data for companyName.
    var col = this.data.getColumn(companyName);
    //console.log(col)

    // Convert all data strings to numbers.
    col = stringsToNumbers(col);

    // Copy the row labels from the table (the first item of each row).
    var labels = this.data.getColumn(0);

    // Colour to use for each category.
    var colours = [color(45, 135, 187), color(246, 109, 68), color(100, 194, 166),  color(170, 222, 167),color(254, 174, 101), color(230, 246, 157)];

    // Make a title.
    var title = 'Employee diversity at ' + companyName;

    // Draw the pie chart!
    this.pie.draw(col, labels, colours, title);
      
    // Draw the info bars
    this.quickBars(col, labels, colours)
    pop();
  };
    
    this.quickBars = function(col, labels, colours){
        this.dataPoints = []
        this.dataPoints = col;
        // sort data for company in descending order to draw bars from largest to smallest 
        this.dataPoints.sort(function(a, b){return b-a});
        
        for(var i = 0; i < this.dataPoints.length; i ++){
            fill(colours[i])
            stroke(0)
            // bar height corresponts to percentage 
            rect((width*0.25 + 120 * i ), height * 0.9, 75,-map(this.dataPoints[i],0,100,0,150))
            
            // draw the percentage values
            textSize(15)
            fill(40)
            var num = this.dataPoints[i]
            text(Math.round(num * 100) / 100 + "%", width * 0.28 + 120 * i, height * 0.9 + 25)
        }
        
    }
}
