(function() {
    let startTime;
    let LastNode = document.querySelectorAll(".timestamp, timestamp-received").length
    let currentNode = 0;
    
    function startTimer() {
          // Start the timer
          startTime = Date.now();
          console.log("Start Timer" + Date.now())
  
          // Clear the clipboard
          navigator.clipboard
              .writeText(``)
              .then(() => {
                  console.log("Cleared clipboard!")
              })
              .catch(err => {
                  console.log('Something went wrong', err);
              }
          );
  
          // add mutation observer to detect new message
          let messagewindow = document.querySelector("#messageWindow")
          console.log("Start Observer")
          let observer = new MutationObserver(function(mutations) {
              mutations.forEach(function(mutation) {
                  endTimer(LastNode, observer);
                  LastNode = document.querySelectorAll(".timestamp, timestamp-received").length
              });
          });
          observer.observe(messagewindow, {
              childList: true,
              subtree: true
          });
  
    }
  
    function endTimer(LastNode, observer) {
          // Get the current node
          currentNode = document.querySelectorAll(".timestamp, timestamp-received").length
          let lastNode = document.querySelectorAll(".sc-message")[currentNode - 1];
          
          // check if the last node has child node with class "sc-message--content sent"
  
          if (currentNode === LastNode || currentNode < LastNode) {
              return;
          }
  
  
        //   console.log("last node: " + lastNode.querySelector(".sent"))
        //   console.log(`last node null ? ${lastNode.querySelector(".sent") != null}`)
        //   console.log(`last node undefined ? ${ lastNode.querySelector(".sent") == undefined}`)
        //   console.log(`last node is node ${lastNode.querySelector(".sent") instanceof Node}`)
  
          if (lastNode.querySelector(".sent")) {
              return;
          }
  
          // Stop the timer and calculate the elapsed time
          const endTime = Date.now();
          const timeInterval = (endTime - startTime) / 1000; // Convert milliseconds to seconds
          console.log("End Timer and the time is " + timeInterval)
  
          // Copy the text to clipboard
          let lastRespond = document.querySelectorAll(".sc-message--text")
          let respondText = lastRespond[lastRespond.length-1].innerText
          let second = Math.round(timeInterval*100)/100+0.5
          navigator.clipboard
              .writeText(`${respondText}\t${second}`)
              .then(() => {
                  setTimeout(() => {
                  console.log("Copied to clipboard!")
                  console.log("Sleep for 1 second, then run the next round automation")
                  GLOBAL_answerList.push(`${respondText}\t${second}`)
                  runAutomation();
                  console.log("start counter")
                  if (GLOBAL_counter === GLOBAL_questionList.length) {
                        console.log("All questions are answered")

                  }else {
                    setTimeout(() => {startTimer()}, 500);;
                  }}, 1000);
              })
              .catch(err => {
                  console.log('Something went wrong', err);
              });
  
          // Disconnect 
          
          console.log("Observer Disconnected")
          
      }

    function runAutomation() {
        GLOBAL_questionList =  ['我想上廁所，廁所喺邊度？', '我想急尿？', '我要喂奶，育嬰室喺邊度？']
        var questions = GLOBAL_questionList;
        var inputBox = document.querySelector("#form .sc-textarea");
        var button = document.querySelector("#form .sc-user-input--send-icon-wrapper")
        if (inputBox.length === 0) {
            console.log("No input box found")
        }
        if (button.length === 0) {
            console.log("No button found")
        }
        inputBox.value = questions[GLOBAL_counter]
        if (GLOBAL_StartedAutomate === false) {
            GLOBAL_StartedAutomate = true;
            startTimer();
        }
        if (GLOBAL_counter < questions.length) {
            GLOBAL_counter++;
        } else {
            navigator.clipboard
            .writeText(GLOBAL_answerList.join('\n'))
            .then(() => {
                console.log("Copied to clipboard!")
            })
            .catch(err => {
                console.log('Something went wrong', err);
            });
            return;
        }
        var event = new Event('input', { bubbles: true });
        inputBox.dispatchEvent(event);
        button.click();

    }
        // GLOBAL_questionList = [];
        GLOBAL_answerList = [];
        GLOBAL_StartedAutomate = false;
        GLOBAL_counter = 0;

        document.body.addEventListener('keydown', function(event) {
        if (event.key === 'Enter' || event.key === 'R' || event.key === 'r') {
            startTimer();
        }else if (event.key === 'A' || event.key === 'a'){
            runAutomation();
        } 

    });
        console.log("Added")
    })();


    (function() {
        // Override console.log to capture messages
        const originalConsoleLog = console.log;
        const consoleMessages = [];
        
        console.log = function(...args) {
            consoleMessages.push(args.join(' '));
            originalConsoleLog.apply(console, args);
        };
    
        // Global variables
        let GLOBAL_answerList = [];
        let GLOBAL_counter = 0;
        let startTime = null;
        let previousResponse = '';
        let previousQuestion = '';
        
        function startAutomation() {
            if (GLOBAL_counter >= GLOBAL_questionList.length) {
                // All questions have been processed
                // Copy all responses to clipboard
                const allResponses = GLOBAL_answerList.join('\n');
                navigator.clipboard.writeText(allResponses)
                    .then(() => {
                        console.log("All responses copied to clipboard!");
                    })
                    .catch(err => {
                        console.log('Something went wrong', err);
                    });
                return;
            }
            
            const question = GLOBAL_questionList[GLOBAL_counter];
            previousQuestion = question;
            sendMessage(question);
            
            startTime = Date.now();
            console.log("Start Timer: " + startTime);
            
            // Track console messages and screen updates
            let initialDOMState = document.body.innerHTML;
            let messageCheckInterval = setInterval(() => {
                let currentDOMState = document.body.innerHTML;
                let newConsoleMessage = consoleMessages[consoleMessages.length - 1];
                
                // Check if screen updated and new console message is not equal to previous response or sent message
                if (currentDOMState !== initialDOMState &&
                    newConsoleMessage !== previousResponse &&
                    newConsoleMessage !== previousQuestion) {
                    
                    clearInterval(messageCheckInterval);
                    endTimer(newConsoleMessage);
                }
            }, 100); // Check every 100 milliseconds
        }
        
        function sendMessage(message) {
            // Simulate typing and sending a message
            let inputBox = document.querySelector("#form .sc-textarea");
            let sendButton = document.querySelector("#form .sc-user-input--send-icon-wrapper");
            
            if (!inputBox || !sendButton) {
                console.log("Input box or send button not found.");
                return;
            }
            
            inputBox.value = message;
            let inputEvent = new Event('input', { bubbles: true });
            inputBox.dispatchEvent(inputEvent);
            sendButton.click();
            console.log("Sent message: " + message);
        }
        
        function endTimer(newResponse) {
            const endTime = Date.now();
            const timeElapsed = (endTime - startTime) / 1000; // in seconds
            previousResponse = newResponse;
            console.log("Received response: " + newResponse);
            console.log("End Timer. Time interval: " + timeElapsed + " seconds");
            
            // Copy response and time to clipboard
            let responseEntry = `${newResponse}\t${timeElapsed}`;
            GLOBAL_answerList.push(responseEntry);
            
            // Wait for 1 second before starting the next round
            console.log("Sleep for 1 second, then run the next round automation at "  + Date());
            setTimeout(()=>{
                GLOBAL_counter++;
                startAutomation();
                console.log("Restore at"  + Date());
            }, 4000);
        }
        
        // Add event listener for keydown events
        document.body.addEventListener('keydown', function(event) {
            if (event.key.toLowerCase() === 'a') {
                console.log("Starting automation...");
                startAutomation();
            } 
        });
        
        console.log("Script initialized. Press 'A' to start automation.");
    })();
