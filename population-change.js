function PopulationChange() {

  // Name for the visualisation to appear in the menu bar.
  this.name = 'Population Change';

  // Each visualisation must have a unique ID with no special
  // characters.
  this.id = 'population-change';

  var marginSize = 35;

  // Layout object to store all common plot layout parameters and
  // methods.
  this.layout = {
    marginSize: marginSize,
    // Locations of margin positions. Left and bottom have double margin
    leftMargin: marginSize * 2,
    rightMargin: width - marginSize * 4,
    topMargin: marginSize +20,
    bottomMargin: height - marginSize * 2,
  };
  // Property to represent whether data has been loaded.
  this.loaded = false;

  // Preload the data. This function is called automatically by the
  // gallery when a visualisation is added.

  // Array to store flag images     
  var flagImages = []; 
  // Container for country bars    
  var countryBars;
  var dataYear;
  var silderYear;
  var silderYearCheck = false; 
  var silderSpeed;     
  var silderSpeedCheck = false;  
  var animationStart = true;   
  var animationButton;    
    
  this.preload = function() {
    var self = this;
    this.data = loadTable(
      './data/country/populationData.csv', 'csv', 'header',
      // Callback function to set the value
      // this.loaded to true.
      function(table) {
        self.loaded = true;
      });    
  };
 

    
  this.setup = function() {
     // Store flag image and country code for each country in flagImages
     for(var i = 0; i < this.data.getRowCount(); i++){
            j = i * 2
            var code = this.data.get(i,'Code')
            flagImages[j] = loadImage('./assets/countryFlags/'+code+'.png');
            flagImages[j+1] = code;     
      }
      
    // Get first and last year  
    this.startYear = this.data.columns[2]
    this.endYear = this.data.columns[this.data.getColumnCount()-1] 
    
    // Intial year of data  
    dataYear = this.startYear;
    
    // Sliders to control start and end years. Default to
      
    //speed slider, negative values so that the slider increases speed when sliding from left to right
    this.speedSlider = createSlider(-60,
                                    -5,
                                    -30,
                                    1);
    this.speedSlider.position(445, 775);

    // Time slider
    this.timeSlider = createSlider(this.startYear,
                                  this.endYear,
                                  this.startYear,
                                  1);
    this.timeSlider.position(445, 750);
   
    // Add event listeners to catch when the user changes the year on the years slider
    this.timeSlider.elt.addEventListener("mousedown",function(){silderYearCheck = true})
    this.timeSlider.elt.addEventListener("mouseup",function(){silderYearCheck = false})
      
    // Create button to stop and start the animation  
    animationButton = createButton('stop');
    animationButton.position(620, 750)    
      
    // Start the animation and change text of button depending on user input  
    animationButton.elt.addEventListener("click", function(){
      animationStart = !animationStart
      if(!animationStart){
       animationButton.html('Continue')
      }
      else{
        animationButton.html('Stop')
        }      
    });
    
  };

    
  this.destroy = function() {
    this.speedSlider.remove();
    this.timeSlider.remove();
    animationButton.remove(); 
    dataYear = this.startYear;
  };

    

  this.draw = function() {
   
    if (!this.loaded) {
      console.log('Data not yet loaded');
      return;
    }
    
   push()
    
     // Set animation speed based on speed slider value, countinue animation if button check is true
      if(frameCount % this.speedSlider.value()==0 && animationStart){
         dataYear++
     }

      // Repeate animation if year exceeds the range of years in the data
      if(dataYear >this.endYear){
          dataYear = this.startYear
      }
      
      // Set the year based on the years slider
      if(silderYearCheck == true){
          dataYear = this.timeSlider.value()
      }
 
      this.drawGrid()
      this.populateBars(this.data)
      for(var i = 0; i < countryBars.length;i++){
          if(i<20){
              countryBars[i].draw(i);
          }    
      }
    
    // Display year  
    textSize(50)  
    textStyle(BOLD);
    fill(0,0,0,200)  
    text(dataYear,950,780)
      
    // Text for the speed and year slider  
    textSize(15)  
    text('Year: ',70, 756)
    text('Speed: ',70, 781)   
    pop()  
      
  };
    
     this.populateBars = function(data){
        
        var minValue = findMin(data);
       
        // Create array to store bar object for each country
        countryBars = [];

          // Populate the countryBars array
          for(var i = 0; i < data.getRowCount(); i++){
              //get row data for each country 
              var row = data.getRow(i);
              //get the name of each country 
              var name = row.getString("Country")
              //get the code of each country for the flag image
              var flagCode = row.getString("Code")
              //create a new country bar object by passing the name and code of the country     
              var bar = new this.CountryBar(name, flagCode)
              //get poplation value to use when drawing the length of a bar
              var value = row.getNum(String(dataYear));
              //set the length of each bar to corresponds to the value(amount) of population by the setLenght methods of bar
              bar.setLenght(value,minValue)
              //add new country object to countryBars[]
              countryBars.push(bar);        
          }
        // Sort the bar country objects in countryBars[] based on the lenght to get the rank of each country every year
         countryBars.sort(function(a, b){
             return parseFloat(b.length) - parseFloat(a.length)})
          // Set the rank for each country bar now that the countryBars[] is sorted
          for(var i = 0; i < countryBars.length; i++){
              countryBars[i].setRank(i);
              countryBars[i].setColor(color(random(0,255),random(0,255),random(0,255)));
          }    

    }
    
    // Variables for easier reference and less space 
    var startX = this.layout.leftMargin;  
    var endXGrid = this.layout.rightMargin;
    var endX =   this.layout.rightMargin - marginSize*2;
    var endY = this.layout.topMargin;
    var startY = this.layout.bottomMargin;
    
    // Constructor for a given country's bar on the graph 
    this.CountryBar = function(name,flagCode){
        
        this.name = name;
        this.flagCode = flagCode;
         
        // Postion of country bar
        this.pos = createVector(startX,endY)
        //lenght of bar corresponds to country's poplation
        this.length;
        this.rank = 0;
        
        // Methods to set the length,rank and color of each bar
        this.setLenght = function(value,_minValue){
            this.length = map(value,_minValue,2000000000, startX - marginSize*2 ,endX) //2 Billion is the max population in the graph
        }
        
        this.setRank = function(value){
            this.rank = value;
        }
        
        this.setColor = function(kolor){
            this.color = kolor;
        }
        // The draw method 
        this.draw = function(rank){
            
            // The vertical distance between the country bars 
            var verticalSepration = (startY - endY)/20;
            var yPos = this.pos.y + 10 +  rank * verticalSepration
            fill(200);
            strokeWeight(2);
            rect(this.pos.x, yPos ,this.length, 20)
            
            // Draw country name
            strokeWeight(1);
            fill(0);
            text(this.name ,this.pos.x + this.length +35, yPos + 14);
       
            // Draw country flags
            var flagIndex = search(flagImages,flagCode)
            var flagImg = flagImages[flagIndex-1] 
            var nameLength = textWidth(this.name) +15
            image(flagImg,this.pos.x + this.length+5, yPos+1)
          
        }

    }
    
    this.drawGrid = function(){
    push();
    fill(0)
    textSize(12)
    textAlign(LEFT)  
    strokeWeight(2)
    
    // Horizontal distance between the lines going down
    var inc = (abs(startX - endXGrid)/20)

    for(var i = 0; i < 21; i++){
        // Adjust text to million
        if(i < 10){
           text(i*100+"M",startX + i * inc,endY - 5) 
        }
        // Adjust text to billion
        else if(i >= 10){
            text(i/10+"B",startX + i * inc,endY - 5)  
        }
        push()
        stroke(220);
        // Draw lines going down
        line(startX + i * inc, endY , startX + i * inc, startY);
        pop();

    }  
       stroke(220);
       // Top axis
       line(startX,endY,endXGrid,endY);
       // Bottom axis
       line(startX,startY,endXGrid,startY);
     
    stroke(100)
    pop();  
    }
            
}
