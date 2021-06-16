function Company(){

  // Name for the visualisation to appear in the menu bar.
  this.name = 'Top 20 Tech Companies <br> by Revenue and Employees';

  // Each visualisation must have a unique ID with no special
  // characters.
  this.id = 'top-company';

  // Property to represent whether data has been loaded.
  this.loaded = false;
    
  // Preload the data. This function is called automatically by the
  // gallery when a visualisation is added.
  this.preload = function() {
    var self = this;
    this.data = loadTable(
      './data/company/companyData.csv', 'csv', 'header',
      // Callback function to set the value
      // this.loaded to true.
      function(table) {
        self.loaded = true;
      });
  };

  var kols = []
  this.setup = function() {
        // Create random colors for lolipop
        for(var i = 0; i < this.data.getRowCount(); i++){ 
            kols.push(color(random(0,255),random(0,255),random(0,255),random(0,230)));      
        }
  };

    
  this.destroy = function(){
      // Reset animation counter to zero when vis is deselected
       animationCounter = 0;
    };

  // Counter to start and stop animation
  var animationCounter = 0;
    
  this.draw = function() { 
      
    if (!this.loaded) {
      console.log('Data not yet loaded');
      return;
    }
      
    // Call drawLoipops  
    this.drawLolipops();        
  };
  // Call draw every second for animation effect
  setInterval(this.draw(),1000);
    
    
  this.drawLolipops = function(){
    push();
    // Set degree mode   
    angleMode(DEGREES);  
    fill(139, 171, 203);
    stroke(89, 86, 74);

    // Get max value from each data category to detemaine relative size of each shape
    var revenue = this.data.getColumn('Revenue');
    revenue =  stringsToNumbers(revenue);
    maxRevenue = max(revenue);

    var employees = this.data.getColumn('Employees')
    employees =  stringsToNumbers(employees);
    maxEmployees = max(employees);


    // Iterate thourgh each row and get column data for company object
    for(var i = this.data.getRowCount()-1; i >= 0 ; i--){
        var currentCompany = {
            'name': this.data.get(i,'Company'),
            'revenue': this.data.getNum(i,'Revenue'),
            'employees': this.data.getNum(i,'Employees'),
            'kolor': kols[i]
        };      

      // Set the degree of sepraction of each lolipop     
      var degreeSeparation =  270 / (this.data.getRowCount()-1) ; 
      // Set space to edge of display    
      var edgeSpaceing = 20;

      // Use animation counter and maximum value of data set to slowly draw the lolipops
      if (animationCounter <= 400) {
        maximumValue = constrain(animationCounter * 2, 0, 400);
      } 
      else {
        var maximumValue = 400;
      }
      animationCounter+=0.05;

      // Set rate of disperstion of data points    
      var disp = 140;
      // Calculate relative size for a company's bar and circle 
      var dataSizeRevenue = (height/2-disp-edgeSpaceing) / maxRevenue;
      var dataSizeEmployees = (height/2-disp-edgeSpaceing) / maxEmployees;

          push();
            // Translate coordinates to middle of display
            translate(width / 2, height / 2 + 60);
            // Set rotation to start at 180 degrees
            rotate(degreeSeparation * i - 90); 
        
            // Draw rects 
            fill((currentCompany.kolor))
            var currentDataRevenue = currentCompany.revenue;
            // The max height of a rect is the current revenue as a proportion of the max revenue 
            var maxHeight = currentDataRevenue * dataSizeRevenue;
            // Use maximumValue and maxHeight to create the animation effect
            var rectHeight = map(maximumValue, 0, 500, 0, maxHeight);
            rect(disp, 0, rectHeight ,degreeSeparation);

            // Draw circles
            fill((currentCompany.kolor),10)
            var currentDataEmployees = currentCompany.employees;
            // The max size of an ellipse is the current employees as a proportion of the max number of employees 
            var finalSize = currentDataEmployees * dataSizeEmployees;
            // Use maximumValue and finalSize to create the animation effect
            var circleSize = map(maximumValue, 0, 500, 0, finalSize);
            ellipse(disp+rectHeight + 30, 8 , (circleSize)/1.5,(circleSize)/1.5);

            push();
            // Add display information for each company 
            // Helper variables to save code space
            var ellipCenter = rectHeight + 30
            var emps = (currentCompany.employees)/1000
            fill("black")
            // Adjusting the display orientation of the information depending on the angle
            if(i > this.data.getRowCount() - 8){             
                // Text for bottom 7 
                translate(disp, 0);
                rotate(180);            
                text(currentCompany.name,2,-2); 
                textSize(11);
                text("$"+currentCompany.revenue+"B",-40,-17);
                rotate(90); 
                textSize(12);
                text(emps.toFixed(1)+"K",-20,ellipCenter+55); 
            }
            else if(i > this.data.getRowCount() - 14){
                // Text for 7-14 companies
                translate(disp, 0);
                var wid = textWidth(currentCompany.name);
                text(currentCompany.name,-wid-2,12);
                textSize(11);
                text("$"+currentCompany.revenue+"B",disp-140,-1);
                rotate(270); 
                textSize(12);
                text(emps.toFixed(1)+"K",-25,ellipCenter+55) 
            }
            else{
                // Text for top 6
                translate(disp, 0);
                var wid = textWidth(currentCompany.name);
                text(currentCompany.name,-wid-2,12);
                textSize(11);
                text("$"+currentCompany.revenue+"B",disp-140,-1);
                rotate(-270); 
                textSize(12);
                text(emps.toFixed(1)+"K",0,-ellipCenter-55);
            }
            pop();
         pop();
    }
    pop();
    // Set back to radians to not affect other visualisations
    angleMode(RADIANS); 
      
  } 
    
}




