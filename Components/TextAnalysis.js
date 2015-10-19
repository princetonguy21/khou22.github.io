var reader = new FileReader(); //New reader
var readerOutput = "Default String"; //Declare global
var doneReading = false;
var numberOfFiles = 1;
var currentFile = 0;
reader.onload = function(e) { //Callback if reader is used
  rawText = reader.result; //Stores the results
  // console.log(rawText)
  
  if (document.getElementById('NoFormat').checked || document.getElementById('Analyze').checked) {
    readerOutput = rawText;
  }
  if (document.getElementById("FacebookMessageData").checked) {
    var frontSplit = "Kevin Hou"
    if (document.getElementById("FacebookName").value) {
      frontSplit = document.getElementById("FacebookName").value;
    }
    console.log("Format: Facebook Message Data")
    console.log("Name: " + frontSplit)
    var front = rawText.split(frontSplit); //Split at the front
    // console.log(front)
    var back = [];
    var percentageDone = 0;
    for (var i = 0; i < front.length; i++) {
      percentageDone = 100 * (i/front.length);
      console.log(percentageDone);
      var temp = front[i].split("</p>");
      // console.log(temp[0])
      var final = temp[0];
      if (temp[0].indexOf("<p>")) {
        if (temp[0].split("<p>")[1]) { //If it exists
          final = temp[0].split("<p>")[1];
        } else {
          final = "3RR0R";
        }
      } else {
        final = "3RR0R";
      }
      // console.log(final); //Split again and get the last bit (the message)
      if (final != "3RR0R") { //If not an error
        back.push(final);
      }
    }
    for (var i = 0; i < back.length; i++) {
      readerOutput += " " + back[i];
    }
  }
  // console.log("File Reader Complete"); //Feedback
  // console.log(readerOutput)
  // console.log(readerOutput)
  currentFile++; //Next file
  // console.log("Next file");
  doneReading = true;
}

var textFile = null,
 makeTextFile = function (text) {
  var data = new Blob([text], {type: 'text/plain'});

  // If we are replacing a previously generated file we need to
  // manually revoke the object URL to avoid memory leaks.
  if (textFile !== null) {
    window.URL.revokeObjectURL(textFile);
  }

  textFile = window.URL.createObjectURL(data);

  return textFile;
};

var waitInterval;

var StrToArray = function(data) {
  // console.log(data);
  var strArray = [];
  var splitAt = [" ", "-", "<", ">", "&#039;"]; //What constitutes a new word
  var array1 = data.split(splitAt[0]);
  for (var i = 0; i < array1.length; i++) {
    strArray.push(array1[i]); //First split
  }
  for (var z = 1; z < splitAt.length; z++) { //All other splits
    for (var i = 0; i < strArray.length; i++) {
      if (strArray[i].indexOf(splitAt[z])) {
        var array = strArray[i].split(splitAt[z]);
        for (var j = 0; j < array.length; j++) {
          strArray.push(array[j]);
        }
        strArray.splice(i, 1); //Remove element
      }
    }
  }
  // console.log(strArray); //Feedback
  return(strArray); //Return array
};

var TextAnalysis = React.createClass({
  getInitialState: function() {
    return {
      wordList: [],
      wordListCount: [],
      fileName: "NA",
      fileSize: 0,
      fileType: "NA",
      fileLastModified: 0,
      fileLastModifiedDate: new Date(1998, 0, 1, 7, 10, 22, 0),
      showModal: "false",
      currentPercentage: 0
    }
  },
  loadFile: function() {
    document.getElementById('downloadlink').innerHTML = "Working...";
    if (currentFile < numberOfFiles) {
      console.log("Loading file", currentFile); //Feedback
      var files = document.getElementById('selectedFile').files;
      numberOfFiles = files.length;
      var selectedFile = files[currentFile]; //Find file
      // console.log(selectedFile.size); //Feedback
      this.setState({ //Save the file details
        fileName: selectedFile.name,
        fileSize: selectedFile.size,
        fileType: selectedFile.type,
        fileLastModified: selectedFile.lastModified,
        fileLastModifiedDate: selectedFile.lastModifiedDate
      });
      waitInterval = setInterval(this.uploadComplete.bind(this), 1000); //Create artificial callback to allow reader to do its work
      reader.readAsText(selectedFile); //Use the reader
    } else {
      document.getElementById('downloadlink').innerHTML = "Compressing...";
      console.log("Done loading all files")

      clearInterval(waitInterval)
      // console.log(readerOutput.length)
      if (document.getElementById('Analyze').checked == false) { //Compressing
        console.log("Compressing...");
        var strArray = StrToArray(readerOutput)
        // *******   Word usage   *******
        console.log("Starting deconstruction")
        var uniqueWords = [];
        var uniqueWordsCount = [];
        var sortedWordsCount = [];
        // console.log("Parsing", strArray);
        var percentageDone = 0;
        for (var i = 0; i < strArray.length; i++) {
          percentageDone = 100 * (i/strArray.length);
          console.log(percentageDone);
          var foundWord = false;
          for (var j = 0; j < uniqueWords.length; j++) {
            if (strArray[i] == uniqueWords[j]) { //If find match
              uniqueWordsCount[j] = uniqueWordsCount[j] + 1; //Increase count for that word
              sortedWordsCount[j] = sortedWordsCount[j] + 1;
              foundWord = true;
            }
          }
          if (!foundWord) {
            uniqueWords.push(strArray[i]); //Add to arrays
            uniqueWordsCount.push(1);
            sortedWordsCount.push(1);
          }
        }
        // console.log(uniqueWords); //Feedback
        // console.log(uniqueWordsCount); //Feedback

        var sortedWords = [];
        sortedWordsCount.sort(function(a, b){return b-a}); //Sort down
        // console.log("Not sorted", uniqueWordsCount);
        // console.log("Sorted", sortedWordsCount);

        var indexes = [];
        document.getElementById('downloadlink').innerHTML = "Packaging...";
        console.log("Packaging...")
        percentageDone = 0;
        for (var i = sortedWordsCount.length; i >= 0; i+= -1) {
          percentageDone = 100 * ((sortedWordsCount.length - i)/sortedWordsCount.length);
          console.log(percentageDone);
          for (var j = 0; j < uniqueWordsCount.length; j++) {
            // console.log(sortedWordsCount[i], "vs", uniqueWordsCount[j])
            if (sortedWordsCount[i] == uniqueWordsCount[j]) {
              if (document.getElementById('BigData').checked) { //If doing big data
                var threshold = 10; //Default 10
                if (document.getElementById('BigDataValue').value) {
                  threshold = document.getElementById('BigDataValue').value;
                }
                if (sortedWordsCount[i] > threshold) {
                  sortedWords.push(uniqueWords[j]);
                  uniqueWordsCount.splice(j, 1);
                  uniqueWords.splice(j, 1);
                }
              } else {
                sortedWords.push(uniqueWords[j]);
                uniqueWordsCount.splice(j, 1);
                uniqueWords.splice(j, 1);
              }
            }
          }
        }

        sortedWords.reverse();
        // console.log(sortedWords, sortedWords.length);
        // console.log("Sorted", sortedWordsCount, sortedWordsCount.length);
        
        var temp = "";
        for (var i = 0; i < sortedWords.length; i++) {
          temp += sortedWords[i] + "|" + sortedWordsCount[i] + "~";
        }
        // console.log(temp)
        readerOutput = temp;
        // console.log(readerOutput)
        var link = document.getElementById('downloadlink');
        link.href = makeTextFile(readerOutput); //Create the download file
        link.style.display = 'block';
        document.getElementById('downloadlink').innerHTML = "Download";
        console.log("Download Ready");

      } else { //If analyzing
        document.getElementById('downloadlink').innerHTML = "Analyzing...";
        console.log("Analyzing...");
        var ray = readerOutput.split("~");
        console.log(ray)
        ray.splice(ray.length - 1, 1); //Cut off the undefined at the end
        var a = [];
        var b = [];
        for (var i = 0; i < ray.length; i++) {
          var ray2 = ray[i].split("|");
          a.push(ray2[0]); //Words
          b.push(ray2[1]); //Count
        }
        console.log(a)
        console.log(b)
        this.setState({
          wordList: a,
          wordListCount: b
        })
        document.getElementById('downloadlink').innerHTML = "Analysis Done";
      }
      
    }
    return false; //Prevent page auto-refresh
  },
  uploadComplete: function() {
    if (doneReading) {
      if (currentFile <= numberOfFiles) {
        doneReading = false;
        this.loadFile(); //Do it again
      } else {
        clearInterval(waitInterval)
        // console.log("Done with all files")
        // console.log(readerOutput.length)
      }
    }
  },
  toggleModal: function(input) {
    console.log("Switching to", input)
    this.setState({
      showModal: input
    });
    return false; //Prevent page auto-refresh
  },
  render: function() {
    return (
      <div>
        <div className="TA-file-input">
          <div className="TA-options">
            <form onSubmit={this.loadFile.bind(this)}>
              Select text file: <input type="file" id="selectedFile" name="text" accept="." multiple/>
              <input type="radio" name="Analysis Type" value="Analyze" id="Analyze"/> Analyze Compressed<br />
              <b>Compress: </b><br />
              <input type="radio" name="Analysis Type" value="NA" id="NoFormat"/> No Special Format<br />
              <input type="radio" name="Analysis Type" value="Facebook Messages" id="FacebookMessageData" /> Compress Facebook Messages<br />
              Exact Facebook Name: <input type="text" name="Facebook Name" placeholder="Kevin Hou" id="FacebookName" /> <br />
              <input type="checkbox" name="Big Data" value="Big Data" id="BigData" size="4" /> Big Data: <input type="text" name="Big Data Value" placeholder="10" id="BigDataValue" /><br />
              <button type="submit" Value="Analyze">Go</button>
            </form>
          </div>
          <div className="TA-download">
            <p>Open Console to View Progress</p><br />
            <a download="Compressed_Data.txt" id="downloadlink" >Ready to Receive</a>
          </div>
        </div>
        <CheckInput fileName={this.state.fileName}
          fileSize={this.state.fileSize}
          fileType={this.state.fileType}
          fileLastModified={this.state.fileLastModified}
          fileLastModifiedDate={this.state.fileLastModifiedDate}
          showModal={this.state.showModal}
          toggleModal={this.toggleModal}/>
        <Analysis wordList={this.state.wordList}
          wordListCount={this.state.wordListCount}
          toggleModal={this.toggleModal}/>
      </div>
    )
  }
});

var CheckInput = React.createClass({
  render: function() {
    return (
      <div>
        <FileInputModal showModal={this.props.showModal}
          toggleModal={this.props.toggleModal}
          fileName={this.props.fileName}
          fileSize={this.props.fileSize}
          fileType={this.props.fileType}
          fileLastModified={this.props.fileLastModified}
          fileLastModifiedDate={this.props.fileLastModifiedDate}/>
        <button onClick={this.props.toggleModal.bind(this, "fileInfo")}>Show File Data</button>
      </div>
    )
  }
});

var FileInputModal = React.createClass({
  render: function() {
    if (this.props.showModal == "fileInfo") {
      return (
        <div aria-hidden="false" role="dialog" className="TA-modal">
          <div className="TA-modal-backdrop">
             </div>
          <div className="TA-modal__container">
            <div className="TA-modal__header">
              <h2>File Upload Information</h2>
            </div>
            <div className="TA-modal__content">
              <h3>File Information:</h3>
              <p>Name: <i>{this.props.fileName}</i></p>
              <p>Size: <i>{this.props.fileSize}</i></p>
              <p>Type: <i>{this.props.fileType}</i></p>
              <p>Last Modified: <i>{this.props.fileLastModified}</i></p>
              <p>Date Last Modified: <i>{this.props.fileLastModifiedDate.toString()}</i></p>
            </div>
            <div className="TA-modal__footer">
              <button onClick={this.props.toggleModal.bind(this, "false")}>Close</button>
            </div>
          </div>
        </div>
      )
    } else {
      return (
        <span>
        </span>
      )
    }
  }
})

var Analysis = React.createClass({
  render: function() {
    var counter = 0;
    var frequency = this.props.wordListCount;
    var tableNodes = this.props.wordList.map(function(word) {
      counter++;
      return (
        <tr>
          <td className="TA-word-list">{word}</td>
          <td className="TA-word-list-count">{frequency[counter - 1]}</td>
        </tr>
      );
    });
    return (
      <div>
        <table className="TA-word-list-table">
          {tableNodes}
        </table>
      </div>
    )
  }
});

var App = React.createClass({
  render: function() {
    return (
      <div>
        <h1 className="TA-header">Text Analysis App</h1>
        <br />
        <h4>By: Kevin Hou</h4>
        <b>Started:</b> October 17 2015 8:20 PST <br />
        <TextAnalysis />
        <hr />
        <b>Instructions:</b> 
        <p>This is a two step process. First <b>compress</b> your file(s):</p>
        <ol>
          <b>Regular Text</b>
          <li>Upload the file(s) by pressing the 'Choose Files' button</li>
          <li>Select the 'No Special Format' radio button</li>
          <li>If you have a slow computer, browser, massive file, or no patience, check big data to speed up the process. A high number corresponds with a faster process but less data.</li>
          <li>Click 'Go'</li>
          <li>Wait until the compression is complete (this can take a long time) then click download</li>
        </ol>
        <ol>
          <b>Facebook Message Data</b>
          <li>Download your Facebook user data if you haven't already. <a href="https://www.facebook.com/help/131112897028467/">Need help?</a></li>
          <li>Locate the 'message.htm' file in the downloaded folder <i>(root/html/message.htm)</i></li>
          <li>Change the file type to a plain text file by renaming the file to: <i>message.txt</i></li>
          <li>Open the terminal and navigate to your message.txt directory. <a href="http://mally.stanford.edu/~sr/computing/basic-unix.html">Unix Commands</a></li>
          <li>Enter the following: <i>directory-containing-file  split -b 4m messages.txt</i><br />
            It should look like this: <i>$: directory-containing-file  split -b 4m messages.txt</i></li>
          <li>Upload the file(s) by pressing the 'Choose Files' button</li>
          <li>Select the 'Compress Facebook Messages' radio button</li>
          <li>Check the 'Big Data' checkbox and enter at least '50' into the text field</li>
          <li>Click 'Go'</li>
          <li>Wait until the compression is complete (this can take a long time) then click download</li>
        </ol>
        *Checking "Big Data" cuts the words with frequencies under the specified number
        <br />
        <p>Now we can <b>analyze</b> our compressed data</p>
        <ol>
          <li>Refresh the page to clear the cache</li>
          <li>Find the downloaded, compressed folder in your downloads folder. It should be named: <i>Compressed_Data.txt</i></li>
          <li>Select the 'Analyze Compressed' radio button</li>
          <li>Click go and see what you uncover!</li>
        </ol>
      </div>
    )
  }
});

React.render(
  React.createElement(App, null),
  document.getElementById('content')
);