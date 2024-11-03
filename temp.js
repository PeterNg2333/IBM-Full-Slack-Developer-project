(function(){
    /* 
    * Override console.log to capture messages 
    * This unit will capture all console.log messages and store them in an array. 
    * And it will only log the message if it is different from the previous message or more than 1 second has passed.
    */
    // const consoleMessages = [];
    // const originalConsoleLog = console.log;
    // console.log = function(...args) {
    //     let curContent = args.join(' ');
    //     let curTime = Date.now()/1000;
    //     let previousMessage = consoleMessages[consoleMessages.length-1];
    //     let prevContent = previousMessage ? previousMessage.content : '';
    //     let prevTime = previousMessage ? previousMessage.time : 0;
    //     let timeDiff = curTime - prevTime;
    //     if (curContent !== prevContent || timeDiff > 1) { // Only log if different message or more than 1 second has passed
    //         consoleMessages.push({"content": curContent, "time": curTime});
    //     } 
    //     console.warn(`Updated consoleMessages: ${JSON.stringify(consoleMessages)}`);
    //     originalConsoleLog.apply(console, args);
    // };

    /* Global Variables */
    let QUESTION_LIST = ['我想上廁所，廁所喺邊度？', '我想急尿？']
    let ANSWER_LIST = [];
    let QUESTION_COUNTER = 0;
    let START_TIME = null;
    let PREVIOUS_RESPONSE = '';
    let CURRENT_QUESTION = '';
    let WAITING_TIME = 6000; // 6 seconds
    let INPUT_BOX = document.querySelector("#form .sc-textarea");
    let SEND_BUTTON = document.querySelector("#form .sc-user-input--send-icon-wrapper");
    const INPUT_EVENT = new Event('input', { bubbles: true });
    if (!INPUT_BOX || !SEND_BUTTON) {
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

    console.warn("Press 'a' to start the automation");

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
                    console.error('Failed to copy responses to clipboard. Please copy the following csv string manually:\n', allResponses);
                    alert("Failed to copy responses to clipboard.\nPlease copy the following csv string manually in the input box:\n" + allResponses);
                    INPUT_BOX.value = allResponses;
                    // Modify the row atrribute of INPUT_BOX to the number of lines in the allResponses
                    INPUT_BOX.setAttribute('rows', allResponses.split('\n').length);
                });
            QUESTION_COUNTER = 0;
            ANSWER_LIST = [];
            console.warn("All questions have been answered. Exiting...");
            return;
        }else {
        // If no, 
            // proceed to send the next question by sending the question and starting the timer
            console.warn(`Waiting for ${WAITING_TIME/1000} seconds before starting the next round...`);
            CURRENT_QUESTION = QUESTION_LIST[QUESTION_COUNTER];
            let waitingTime = QUESTION_COUNTER > 0? WAITING_TIME: 1000; // Wait for 1 second before sending the first question
            // Implement typing effect
            let text_length = CURRENT_QUESTION.length;
            let typing_time =  waitingTime/text_length
            for (let i=0; i<text_length; i++) {
                setTimeout(() => {
                    INPUT_BOX.value += CURRENT_QUESTION[i];
                    INPUT_BOX.dispatchEvent(INPUT_EVENT); // Dispatch input event
                }, i*typing_time);
            }
            // Wait for 1 second before sending the first question
            // Wait for <WAITING_TIME> seconds before starting the next round
            setTimeout(() => {
                INPUT_BOX.value = CURRENT_QUESTION; 
                INPUT_BOX.dispatchEvent(INPUT_EVENT); // Dispatch input event
                SEND_BUTTON.click(); 
                console.warn(`Sent message: ${CURRENT_QUESTION}`);
                INPUT_BOX.value = ''; // Clear the input box
                QUESTION_COUNTER++;
                startTimer(); 
            }, waitingTime);
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
            endTimer(observer);
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
    *    5. Stop the observer and start the next round
    *     
    */
    endTimer = (observer) => {
        console.log(`Try to end the timer at ${Date()}`);
        // Conditions to check 
        let endTime= Date.now()/1000;
        let allMsgReceived = document.querySelectorAll(".timestamp.timestamp-received");
        let allMsgSent = document.querySelectorAll(".timestamp.timestamp-sent");
        let lastNodeReceived = allMsgReceived[allMsgReceived.length - 1].parentElement.querySelector(".sc-message--text");
        let lastNodeSent = allMsgSent[allMsgSent.length - 1].parentElement.querySelector(".sc-message--text");
        let lastReceivedMsg = lastNodeReceived ? lastNodeReceived.innerText : '';
        let lastSentMsg = lastNodeSent ? lastNodeSent.innerText : '';
        let lastSentMsgEqualCurrentQuestion = lastSentMsg === CURRENT_QUESTION;
        let lastReceivedMsgNotEqualPreviousResponse = lastReceivedMsg !== PREVIOUS_RESPONSE;
        let isOnlyOneMsgReceived = allMsgReceived.length === 1;
        console.log("Checking conditions...");
        console.log(`lastSentMsg: ${lastSentMsg}, lastReceivedMsg: ${lastReceivedMsg}, lastSentMsgEqualCurrentQuestion: ${lastSentMsgEqualCurrentQuestion}`);
        console.log(`lastReceivedMsg: ${lastReceivedMsg}, PREVIOUS_RESPONSE: ${PREVIOUS_RESPONSE}, lastReceivedMsgNotEqualPreviousResponse: ${lastReceivedMsgNotEqualPreviousResponse}`);
        console.log(`isOnlyOneMsgReceived: ${isOnlyOneMsgReceived}`);

        if (lastSentMsgEqualCurrentQuestion && lastReceivedMsgNotEqualPreviousResponse && !isOnlyOneMsgReceived) {
            // Stop the timer and calculate the elapsed time
            let timeElapsed = (endTime*1000 - START_TIME) / 1000  ; // in seconds
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
            observer.disconnect();
            console.warn(`Observer stopped at ${Date()}`);
            setTimeout(() => {startAutomation();}, 1000);
        }
        return
    }

})()




