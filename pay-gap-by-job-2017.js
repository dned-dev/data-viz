    function PayGapByJob2017() {

    // Name for the visualisation to appear in the menu bar.
    this.name = 'Pay gap by job: 2017';

    // Each visualisation must have a typesUnique ID with no special
    // characters.
    this.id = 'pay-gap-by-job-2017';

    // Property to represent whether data has been loaded.
    this.loaded = false;

    // Graph properties.
    this.pad = 20;
    this.dotSizeMin = 15;
    this.dotSizeMax = 40;

    // Preload the data. This function is called automatically by the
    // gallery when a visualisation is added.
    this.preload = function() {
    var self = this;
    this.data = loadTable(
      './data/pay-gap/occupation-hourly-pay-by-gender-2017.csv', 'csv', 'header',
      // Callback function to set the value
      // this.loaded to true.
      function(table) {
        self.loaded = true;
      });

    };
    
    var typesUnique = []
    var jobTypes = []    
        
    this.setup = function() {

        var kolors = [color("#003f5c"),color("#456395"),color("#665191"),color("#a05195"),color("#d45087"),
                      color("#E379A6"),color("#f95d6a"),color("#ff7c43"),color("#ffa600")]    

        // Get unique job type names     
        var type = []
        var typeAll = []    
        //https://stackoverflow.com/questions/11246758/how-to-get-unique-values-in-an-array
        type = this.data.getColumn('job_type');

        for (var i = 0; i < type.length; i++) {
            typeAll.push(type[i]);
            typesUnique = [...new Set(typeAll)];
        }

        for(var i = 0; i < typesUnique.length; i++){
            jobTypes[i] = {type:typesUnique[i],kolor:kolors[i]}
        }
    
    };
        

    this.destroy = function() {
    };

    this.draw = function() {
        push();
        if (!this.loaded) {
          console.log('Data not yet loaded');
          return;
        }

        // Draw the axes.
        this.addAxes();

        var dataPoint = {type:this.data.getColumn('job_type'),
                        subType:this.data.getColumn('job_subtype'),
                        propFemale:this.data.getColumn('proportion_female'),
                        payGap:this.data.getColumn('pay_gap'),
                        numJobs:this.data.getColumn('num_jobs')}
        
        // Convert numerical data from strings to numbers.
        propFemale = stringsToNumbers(dataPoint.propFemale);
        payGap = stringsToNumbers(dataPoint.payGap);
        numJobs = stringsToNumbers(dataPoint.numJobs);


        // Set ranges for axes.
  
        // Use full 100% for x-axis (proportion of women in roles).
        var propFemaleMin = 0;
        var propFemaleMax = 100;

        // For y-axis (pay gap) use a symmetrical axis equal to the
        // largest gap direction so that equal pay (0% pay gap) is in the
        // centre of the canvas. Above the line means men are paid
        // more. Below the line means women are paid more.
        var payGapMin = -20;
        var payGapMax = 20;

        // Find smallest and largest numbers of people across all
        // categories to scale the size of the dots.
        var numJobsMin = min(numJobs);
        var numJobsMax = max(numJobs);
        

       // fill(255);
        stroke(0);
        strokeWeight(1);

        var ell_x
        var ell_y
        var ell_d
        for (i = 0; i < this.data.getRowCount(); i++) {
            // Set fill of ellipse based on job type that corresponds to a given job sub type
            for(var j = 0; j < jobTypes.length; j++){
                if(dataPoint.type[i] == jobTypes[j].type){
                    fill(jobTypes[j].kolor)
                }  
            }  
          // Draw an ellipse for each point.
          // x = propFemale
          // y = payGap
          // size = numJobs
            ell_x = map(propFemale[i], propFemaleMin, propFemaleMax,this.pad, width - this.pad)
            ell_y = map(payGap[i], payGapMin, payGapMax,height - this.pad, this.pad)
            ell_d = map(numJobs[i], numJobsMin, numJobsMax, this.dotSizeMin, this.dotSizeMax)
            ellipse(ell_x,ell_y,ell_d);
        }

        // Loop to display and info box for each data point, has to be a separate loop to avoid ellipses been drawn over the info box
        for (i = 0; i < this.data.getRowCount(); i++) {        
                ell_x = map(propFemale[i], propFemaleMin, propFemaleMax,this.pad, width - this.pad)
                ell_y = map(payGap[i], payGapMin, payGapMax,height - this.pad, this.pad)
                ell_d = map(numJobs[i], numJobsMin, numJobsMax, this.dotSizeMin, this.dotSizeMax)
                // detect when mouse is above an ellipse
              
                var mouseCheck = this.mouseCheck(ell_x,ell_y,ell_d/2);
                if(mouseCheck){
                    fill(25,25,25)
                    // rect corrsponds to text width
                    var txtWidth = textWidth("Job: " + dataPoint.subType[i])
                    // draw the info box rectangle 
                    rect(mouseX+5,mouseY+10,txtWidth+15,70)
                    fill(220)
                    
                    //text information
                    text("Job: " + dataPoint.subType[i],mouseX+10,mouseY+25)
                    var femPro = Math.round((dataPoint.propFemale[i]*100))/100
                    var pg = Math.round((dataPoint.payGap[i]*100))/100
                    text("Female Proportion: " + femPro + "%",mouseX+10,mouseY+ 40)
                    text("Pay gap: " + pg + "%",mouseX+10,mouseY+55)
                    text("Number of Jobs: " + dataPoint.numJobs[i], mouseX+10, mouseY+70 )
                    noFill()
                }
        }
        noStroke();
        
        // Draw labels for axes
        fill(120)
        textFont('Georgia');
        textSize(11)
        // x axis
        text("0%",20,390)
        text("100%",1157,390)
        text("Proportion of women",20,420)
        // y axis
        textAlign(CENTER)
        text("20",width/2,10)
        text("-20",width/2,790)
        text("Pay gap",width/2 ,775)
        noFill()
        
        // Draw labal rects and text for job types
            for(i = 0; i < jobTypes.length; i++){
                textAlign(LEFT)
                stroke(0);
                strokeWeight(1);
                textSize(12)
                fill(jobTypes[i].kolor)
                rect(35,550+i*25,15,15)
                noFill();
                text(jobTypes[i].type,55,562+i*25)  
            }
        pop();


        };

        this.addAxes = function () {
        stroke(200);

        // Add vertical line.
        line(width / 2,
             0 + this.pad,
             width / 2,
             height - this.pad);

        // Add horizontal line.
        line(0 + this.pad,
             height / 2,
             width - this.pad,
             height / 2);
        };
        
        this.mouseCheck = function(x,y,diameter){
            if (dist(mouseX,mouseY,x,y) < diameter){
                return true;
                }
            return false;
        }
    }
