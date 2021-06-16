//https://www.gutenberg.org/files/3300/3300-h/3300-h.htm#chap03

function WordCloud() {

    // Name for the visualisation to appear in the menu bar.
    this.name = 'Wealth of Nations: Word Cloud';

    // Each visualisation must have a unique ID with no special
    // characters.
    this.id = 'word-cloud'

    // Property to represent whether data has been loaded.
    this.loaded = false;

    // Preload the data. This function is called automatically by the
    // gallery when a visualisation is added.
    
  var marginSize = 35  
  // Layout object to store all common plot layout parameters 
  this.layout = {
        marginSize: marginSize,
        // Locations of margin positions. Left and bottom have double margin
        leftMargin: marginSize * 2,
        rightMargin: width - marginSize * 5,
        topMargin: marginSize +20,
        bottomMargin: height - marginSize * 2,
  };
    
    // Stores the raw text of the book
    var bookText;
    // Stores all the key/value pairs from text where the value is how many times a word appears in the text
    var counters = {};
    // Stores all unique words
    var keys = [];
    var words = [];
    
    this.preload = function() {
        var self = this
        bookText = loadStrings('data/book/wealth_of_nations.txt', function(srt) {
        self.loaded = true;
      })    
    };

    this.setup = function() {
        this.createWordList();
    };

    this.destroy = function(){

    };
    
    this.draw = function() {
       push();
       this.drawWords();
       noLoop();    
       pop();
    };
    
    //https://github.com/CodingTrain/website/blob/main/CodingChallenges/CC_040.1_wordcounts/P5/sketch.js
    this.createWordList = function(){
        // Join the entire text of book in to a string
        var entireText = bookText.join("\n");  
        // Tokanise words and split them based on regular expression of anything that is not an actual word: \W+
        var wordTokens = entireText.split(/\W+/);
        // Add each word token to keys array if it is a new word, if it is not a new word increase its count
        for(var i = 0; i < wordTokens.length; i++){    
            var word = wordTokens[i].toLowerCase();
            // Ignore digits from count
            if(!/\d+/.test(word)){
                if(counters[word] === undefined){
                    counters[word] = 1;
                    keys.push(word);
                }
                else{
                    counters[word]++;
                }
             }   
        }    
        // Sort the keys array in descending order
        keys.sort(descending)
        function descending(a,b){
            var counterA = counters[a];
            var counterB = counters[b];
            return counterB - counterA;
        }
    }
    
    this.drawWords = function(){
           var i = 0;
           // draw 50 words from words list
           while(words.length < 50){
               // Key is the word itself in plain text
               var key = keys[i];
               // Use key to determine if word should be drawn(added to words array)
               if(this.ignoreWord(key)){
                    // Create object to store all info about each word
                    var wordText = {text: key,
                                    x:random(this.layout.leftMargin, this.layout.rightMargin), 
                                    y:random(this.layout.topMargin,this.layout.bottomMargin),
                                    size: counters[key],
                                    length: function(){ // used to check if words overlap
                                        return textWidth(this.text);
                                    }
                                   }
                    
                    // The code below ensures there is no overlap between the words          
                    // Compare current word with others in words array. if overlapping change its x,y coordinates to somewhere else
                    var j = 0
                    while(j < words.length){ 
                        var other = words[j];
                        var d = dist(wordText.x,wordText.y, other.x, other.y);
                        if(d < ((wordText.length() + other.length()))){       
                            wordText.x = random(this.layout.leftMargin, this.layout.rightMargin);
                            wordText.y = random(this.layout.topMargin,this.layout.bottomMargin);
                        }
                        // Since the current word may overlap with other existing words' coordinates, retest overlap and if overlapping again change its x,y coordinates once more
                        var k = 0;
                        while(k < words.length){
                            var other_ = words[k];
                            var d_ = dist(wordText.x,wordText.y, other_.x, other_.y);
                            if(d_ < ((wordText.length() + other.length()))){ 
                                wordText.x = random(this.layout.leftMargin, this.layout.rightMargin);
                                wordText.y = random(this.layout.topMargin,this.layout.bottomMargin);
                            }
                            k++;
                        }
                    j++;    
                    }
                words.push(wordText);             
              }
            i++;
            } 
        // Draw the words    
        for(var k = 0; k < words.length; k++){
            textFont('Courier');
            textStyle(BOLD);
            // Size of text corresponds to the amount of time the word appears in the book
            textSize(map(words[k].size,500,2000,10,40))
            text(words[k].text,words[k].x,words[k].y)
        }
        console.log(words);               
    }
    
    // function to determine which words to ignore when drawing 
    this.ignoreWord = function(word){ 
        var wordsToIngnore = ["the","a","an","that","is","are","does","do","was","were","will","it","by","and","or","nor","either","which","of","to","well","what","upon","who",
                              "be","this","but","so","would","as","have","has","had","at","with","from","not","there","he","him","his","its","where","without","them","then",
                              "for","been","in","any","therefore","so","thus","hence","can","could","may","might","should","however","but","though",
                              "perhaps","if","such","i","these","likely","those","they","their","into"]
        for(var i = 0; i < wordsToIngnore.length; i++){
            if(word == wordsToIngnore[i]){
                return false;
            }
        }
        return true
    }
}


