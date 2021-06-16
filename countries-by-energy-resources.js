/*
Parts of the code of the energySources function have been adapted from:
https://github.com/CodingTrain/website/blob/main/CodingChallenges/CC_057_Earthquake_Viz/P5/sketch.js
*/

function CountryResources() {

    // Name for the visualisation to appear in the menu bar.
    this.name = 'Countries by Energy Resources';

    // Each visualisation must have a unique ID with no special
    // characters.
    this.id = 'countries-by-energy-resources';

    // Property to represent whether data has been loaded.
    this.loaded = false;

    var earthMap;
    // Preload the data. This function is called automatically by the
    // gallery when a visualisation is added.
    this.preload = function() {
        var self = this;
        this.data = loadTable(
          './data/country/resourcesData.csv', 'csv', 'header',
          // Callback function to set the value
          // this.loaded to true.
          function(table) {
            self.loaded = true;
          });
           earthMap = loadImage('./assets/earthMap.png');
    };
    
    this.setup = function() {
         
        if (!this.loaded) {
            console.log('Data not yet loaded');
        return;
        }

        // Create a select DOM element.
        this.select = createSelect();
        this.select.position(350, 40);

        // Fill the options with the resource name.
        var resources = this.data.columns;
        // First entry is empty.
        for (var i = 4; i < resources.length; i++) {
          this.select.option(resources[i]);
        }       
    };

    this.destroy = function() {
        this.select.remove();
    };

    
    //create colors object to represent the different resources
    let kolors = {'Petrol': color(55, 58, 54, 150), 
                  'Gas': color(11, 178, 209, 150),
                  'Coal': color(52, 16, 0, 150),
                  'Uranium': color(161, 222, 95,150)
                 }

    this.draw = function() {
        if (!this.loaded) {
          console.log('Data not yet loaded');
          return;
        }
        this.eneryResources();

    };
    
    // Function to draw each country's energy resource as an ellipse
    this.eneryResources = function(){
    push();
    translate(width/2, height/2);
    imageMode(CENTER);
    image(earthMap,0,0);
    
    // Set world center to coordinates 0,0
    var centerLon = 0; 
    var centerLat = 0; 
    
    var resourceSelected =  this.select.value();
    
    for(var i = 0; i <= this.data.getRowCount()-1 ; i++){
        // Get data only of countries that have a resource value 
        if(this.data.get(i,'resourceSelected') == ""){
            continue;
        }
        // Get the latitude and longitude of the current country
        var latitude = this.data.get(i,'latitude');
        var longitude = this.data.get(i,'longitude');
        
        // Get largest value of a given resrouce in a column to map it to the diameter of the ellipse
        var resource = this.data.getColumn(resourceSelected);
        maxResource = max(resource);
        
        // Size of an ellipse corresponds to how much a country has of it
        var ellSize = this.data.get(i,resourceSelected)
        
        // Map the ellipse size to normailze the data
        var diameter = map(ellSize, 0, maxResource, 0 , 2500);
        //correct ellSize geometrically 
        diameter = sqrt(diameter);
        
        // Get the coordinates for the center of each country  
        var mapX = convertToMapX(longitude) - convertToMapX(centerLon);
        var mapY = convertToMapY(latitude) - convertToMapY(centerLat);
        
        // Draw ellipses 
        noStroke();
        fill(kolors[resourceSelected]);    
        ellipse(mapX,mapY,diameter);
        
        // Adjust mouseX and mouseY to translated coordinates 
        var newMouseX = mouseX - width/2;
        var newMouseY = mouseY - height/2;
        
        // Get information from raw data to display when mouse is over an ellipse
        var country = this.data.get(i,'name');
        var quantity = this.data.get(i,resourceSelected);    
        
        var mouseCheck = this.mouseCheck(newMouseX,newMouseY,mapX,mapY,diameter/2);
        // Draw text information when mouse hovers over an ellipse
        if(mouseCheck){
            push(); 
            fill(kolors[resourceSelected])
            stroke(1)
            textSize(15);
            var tWidth = textWidth(this.data.get(i,resourceSelected));
            textAlign(LEFT,TOP);
            text(country,mouseX - width/2 + 10,mouseY - height/2+10) 
            if(resourceSelected == 'Petrol'){
              text(quantity+" Billion Barrels",mouseX - width/2 + 10,mouseY - height/2+25)   
            }
            else if(resourceSelected == 'Gas'){
                text(quantity+" Trillion Cubic Feet",mouseX - width/2 + 10,mouseY - height/2+25) 
            }
            else if(resourceSelected == 'Coal'){
                text(quantity+" Million Tonnes",mouseX - width/2 + 10,mouseY - height/2+25) 
            }
            else if(resourceSelected == 'Uranium'){
                text(quantity+" Tonnes",mouseX - width/2 + 10,mouseY - height/2+25) 
            } 
            pop();
        }
    }
    
      
  pop();
    }
    
    // Detect mouse over ellipse
    this.mouseCheck = function(mouseX,mouseY,x,y,diameter){
        if (dist(mouseX,mouseY,x,y) < diameter){
            return true;
            }
        return false;
    }

    var zoomLevel = 1.2;
    // Formulas for converting real world coordinates to locations on map image 
    //https://en.wikipedia.org/wiki/Web_Mercator_projection#Formulas
    function convertToMapX(lon){
        return ((256 / PI) * pow(2,zoomLevel)) * radians(lon) + PI;
    }
    
    function convertToMapY(lat){
        return (256 / PI) * pow(2,zoomLevel)*(PI - log(tan(PI/4 + radians(lat)/2)));
    }
       
}

