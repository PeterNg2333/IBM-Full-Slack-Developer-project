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

(function(){
    /* 
    * Override console.log to capture messages 
    * This unit will capture all console.log messages and store them in an array. 
    * And it will only log the message if it is different from the previous message or more than 1 second has passed.
    */
    const consoleMessages = [];
    const originalConsoleLog = console.log;
    console.log = function(...args) {
        let curContent = args.join(' ');
        let curTime = Date.now()/1000;
        let previousMessage = consoleMessages[consoleMessages.length-1];
        let prevContent = previousMessage ? previousMessage.content : '';
        let prevTime = previousMessage ? previousMessage.time : 0;
        let timeDiff = curTime - prevTime;
        if (curContent !== prevContent || timeDiff > 1) { // Only log if different message or more than 1 second has passed
            consoleMessages.push({content, time});
        } 
        console.warn(`Updated consoleMessages: ${JSON.stringify(consoleMessages)}`);
        originalConsoleLog.apply(console, args);
    };

    /* Global Variables */
    let QUESTION_LIST = ['我想上廁所，廁所喺邊度？', '我想急尿？', '我要喂奶，育嬰室喺邊度？', '育嬰間喺邊度？', '邊度有殘廁？']
    let ANSWER_LIST = [];
    let QUESTION_COUNTER = 0;
    let START_TIME = null;
    let PREVIOUS_RESPONSE = '';
    let CURRENT_QUESTION = '';
    let WAITING_TIME = 5000; // 5 seconds
    let INPUT_BOX = document.querySelector("#form .sc-textarea");
    let SEND_BUTTON = document.querySelector("#form .sc-user-input--send-icon-wrapper");
    const INPUT_EVENT = new Event('input', { bubbles: true });
    if (!inputBox || !sendButton) {
        console.error("Input box or send button or message window not found.");return}

    if (QUESTION_LIST.length === 0) {
        let questions = prompt("Please enter the questions separated by comma: ");
        try{
            if (questions && questions.length > 0) QUESTION_LIST = questions.split(',').map(q => q.trim());}
        catch(err) {console.error("Error parsing questions. Exiting...", err);}
    }

    /* add Event Listener to listen for keydown events */
    document.body.addEventListener('keydown', () => {
        let eventKey = event.key.toLowerCase();
        if (eventKey === 'a') {
            startAutomation();
        }
    })

    /* 
    * Function to start the automation 
    * In the first round, it will send the first question from the list
    * In the subsequent rounds, it will called by the endTimer function to send the next question until all questions are answered
    * This is recursive function that will call itself until all questions are answered
    */
    startAutomation = () => {
        // Check if all questions have been answered
        let allQuestionsAnswered = QUESTION_COUNTER >= QUESTION_LIST.length;
        if (allQuestionsAnswered){
        // If yes, 
            // Cpy all responses to clipboard and return. 
            // But if it is failed to copy due to user lost focus, it copy a csv string a alert user to copy manually
            let allResponses = ANSWER_LIST.join('\n');
            navigator.clipboard.writeText(allResponses)
                .then(() => {console.warn("All responses copied to clipboard!");})
                .catch(err => {
                    console.error('Failed to copy responses to clipboard. Please copy the following csv string manually:', allResponses);
                    alert(allResponses);
                });
        }else {
        // If no, 
            // proceed to send the next question by sending the question and starting the timer
            CURRENT_QUESTION = QUESTION_LIST[QUESTION_COUNTER];
            INPUT_BOX.value = CURRENT_QUESTION; 
            INPUT_BOX.dispatchEvent(INPUT_EVENT); // Dispatch input event
            SEND_BUTTON.click(); 
            console.warn(`Sent message: ${CURRENT_QUESTION}`);
            INPUT_BOX.value = ''; // Clear the input box
            QUESTION_COUNTER++;
            startTimer(); 
        }
        return;
    }

    /*
    * Function to start the timer
    * It will start the timer by setting the START_TIME to the current time
    * And it will track the console messages and screen updates using MutationObserver
    */
    startTimer = () => {
        // Start the timer
        START_TIME = Date.now(); 
        console.warn(`Start Timer at ${Date()}`);

        // Track console messages and screen updates by checking the message window using MutationObserver
        let messageWindow = document.querySelector("#messageWindow");
        if (!messageWindow) {console.error("Message window not found. Exiting...");return;}
        let observer = new MutationObserver(() => {
            endTimer();
        });
        observer.observe(messageWindow, {childList: true, subtree: true});
        console.warn(`Observer started... at ${Date()}`);
    }

    /*
    * Function to end the timer
    * It will called by the MutationObserver when the screen is updated
    * IF the following conditions are met:
    *     1. The last sent message node is equal to the current question
    *     2. The last received message node is not equal to the previous response or the time difference is more than 1 second
    * Then it will perform the following actions:
    *    1. Stop the timer and calculate the elapsed time
    *    2. Write the response to the Answer List
    *    3. Copy the response and time to clipboard 
    *    4. Assign the last received message to the PREVIOUS_RESPONSE
    *    5. Stop the observer and Wait for 5 seconds before starting the next round
    *     
    */
    endTimer = () => {
        console.warn(`Try to end the timer at ${Date()}`);
        // Conditions to check 
        let endTime= Date.now()/1000;
        let allMsgReceived = document.querySelectorAll(".timestamp.timestamp-received");
        let lastNodeReceived = allMsgReceived[allMsgReceived.length - 1];
        let allMsgSent = document.querySelectorAll(".timestamp.timestamp-sent");
        let lastNodeSent = allMsgSent[allMsgSent.length - 1];
        let lastReceivedMsg = lastNodeReceived ? lastNodeReceived.innerText : '';
        let lastSentMsg = lastNodeSent ? lastNodeSent.innerText : '';
        let lastSentMsgEqualCurrentQuestion = lastSentMsg === CURRENT_QUESTION;
        for (let i = consoleMessages.length - 1; i >= 0; i--) {
            let consoleMsg = consoleMessages[i];
            let consoleMsgContent = consoleMsg.content;
            let consoleMsgTime = consoleMsg.time;
            let timeDiff = endTime - consoleMsgTime;
            if (PREVIOUS_RESPONSE !== consoleMsgContent && timeDiff > 1) {
                lastReceivedMsgNotEqualPreviousResponse = true;
                break;
            }else {
                lastReceivedMsgNotEqualPreviousResponse = false;
            }
        }

        if (lastSentMsgEqualCurrentQuestion && lastReceivedMsgNotEqualPreviousResponse) {
            // Stop the timer and calculate the elapsed time
            let timeElapsed = (endTime - START_TIME) / 1000; // in seconds
            console.warn(`End Timer. Time interval: ${timeElapsed} seconds`);

            // Copy response and time to clipboard
            let responseEntry = `${lastReceivedMsg}\t${timeElapsed}`;
            ANSWER_LIST.push(responseEntry);
            navigator.clipboard.writeText(responseEntry)
                .then(() => {console.warn("Response copied to clipboard!");})
                .catch(err => {console.error('Failed to copy response to clipboard. Error:', err);});

            // Assign the last received message to the PREVIOUS_RESPONSE
            PREVIOUS_RESPONSE = lastReceivedMsg;

            // Stop the observer and Wait for 5 seconds before starting the next round
            let messageWindow = document.querySelector("#messageWindow");
            let observer = messageWindow._observer;
            observer.disconnect();
            console.warn(`Observer stopped at ${Date()}`);
            setTimeout(() => {startAutomation();}, WAITING_TIME);
        }
        return
    }

})()




