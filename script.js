$(document).ready(function() {

//global variables
    //vars to keep track of find status
    let found = 0;
    let missing = 5;
    let mollyFound = false;
    let mollyFoundBefore = false;
    
    //timer vars
    let timer;
    let counter = 0;
    let seconds = 00;
    let minutes = 00;
    let hours = 00;

    //vars to store Molly's coordinates
    let mollyXYOne = {X: 96, Y: 76, found: false}; //bottom right
    let mollyXYTwo = {X: 29, Y: 10, found: false}; //top left
    let mollyXYThree = {X: 55, Y: 29, found: false}; //top middle
    let mollyXYFour = {X: 27, Y: 83, found: false}; //bottom left
    let mollyXYFive = {X: 76, Y: 25, found: false}; //top right
    let mollyXYArr = [mollyXYOne, mollyXYTwo, mollyXYThree, mollyXYFour, mollyXYFive];

//check if Molly found on image click
    $('.find-img').on("click", function(event) {

        //start timer, if not already started
        if (counter === 0) {
            resetState(".start-btn", ".reset-btn");
            startTimer();
        }
        
        //get position of image on page
        const offset = $(this).offset();
        let mollyX; let mollyY;
        let clickX; let clickY;
        let clickXPercent; let clickYPercent;

        //set position of molly on page (in percent)
        for (let i = 0; i < 5; i++) {
            mollyFound = false;
            mollyFoundBefore = false;

            //get XY coordinates of molly
            mollyX = mollyXYArr[i].X;
            mollyY = mollyXYArr[i].Y;

            //substract position of page and get XY co-ordinates of click on image
            clickX = event.pageX - offset.left;
            clickY = event.pageY - offset.top;

            //get location of click in percentage to account for image resizing
            clickXPercent = (clickX / $(this).width()) * 100;
            clickYPercent = (clickY / $(this).height()) * 100;
            
            //returns XY% click (uncomment to get position of future mollys added)
            // console.log("X%: ", Math.round(clickXPercent));
            // console.log("Y%: ", Math.round(clickYPercent));
        
            //check if image click is within expected coordinates
            if ((clickXPercent >= mollyX - 3 && clickXPercent <= mollyX + 3) && (clickYPercent >= mollyY - 3 && clickYPercent <= mollyY + 3)) {
                //molly found, check if she was found before
                if (mollyXYArr[i].found === true) {
                    mollyFoundBefore = true;
                } else {
                    //update found var in object
                    mollyXYArr[i].found = true;
                    mollyFound = true;
                }
                
                break; //exit loop
            }
        }
        
        //set messaging as appropriate
        if (mollyFound === true) {
            //update found counts
            found++;
            missing--;
            $(".found").text(found);
            $(".missing").text(missing);

            //found messaging
            if (missing === 0) {
                //stop timer if found all
                resetTimer();

                $(".modal-text").text(`Wow great job! You've found all the missing Mollys in ${hours > 0 ? `${hours} ${hours > 1 ? `hours` : `hour`} and` : ''} ${minutes > 0 ? `${minutes} ${minutes > 1 ? `minutes` : `minute`} and` : ''} ${seconds} seconds, that's gotta be a new record!`);
                
                //reset vars and buttons
                resetState(".start-btn", ".reset-btn", true);
                
            } else if (missing === 1) {
                $(".modal-text").text(`You've found her! Now only one more Molly to find! Can you find her?`);
                
            } else {
                $(".modal-text").text(`You've found her! Now only ${missing} Mollys are missing! Can you find her again?`);
            }            
        
        } else if (mollyFoundBefore === true) {
            //previously found msg
            $(".modal-text").text(`You've already found this Molly silly! Look for the Mollys you haven't found yet!`);
        
        } else {
            //nothing found msg
            $(".modal-text").text('Nope, no missing Mollys here! Try again!');
        }

        //show modal with messaging
        $("#modal").show();
    });

//event listener - start timer
    $(".start-btn").on("click", function() {
        //clear vars, update button state
        resetState(".start-btn", ".reset-btn");

        //start timer
        startTimer(); 
    });

//event listener - reset timer
    $(".reset-btn").on("click", function() {
        //clear vars, update button state
        resetState(".reset-btn", ".start-btn");
        
        //reset timer
        resetTimer(); 
    });

//event listener - close modal on exit click
    $(".modal-close").on("click", function() {
        $(".modal").hide();
    });

//start timer function
    function startTimer() {
        //set timer
        setTimeout(function() {
        timer = setInterval(function(){
            counter++;
            seconds++;
            
            //calculate hours, mins and secs
            if (seconds == 60) {
                minutes++;
                seconds = 00;
            }

            if (minutes == 60) {
                hours++;
                minutes = 00;
            }

            //update timer on page in 2 digits
            $('.counter').text(
                hours.toLocaleString(undefined, {minimumIntegerDigits: 2}) + ":" +
                minutes.toLocaleString(undefined, {minimumIntegerDigits: 2}) + ":" + 
                seconds.toLocaleString(undefined, {minimumIntegerDigits: 2})
            );

        }, 1000);
        });
    }

//stop and reset timer function
    function resetTimer(stop) {
        //clear timer
        window.clearInterval(timer);
    }

//reset vars to 0, update timer buttons functionality
    function resetState(disableBtn, enableBtn, won) {
        //reset vars
        found = 0;
        missing = 5;
        counter = 0;
        seconds = 00;
        minutes = 00;
        hours = 00;        
        
        //if reset, clear time and vars (if won game, just stop the clock)
        if (!won) {
            $('.counter').text("00:00:00");
            $(".found").text(found);
            $(".missing").text(missing);
        }

        for (let i = 0; i < 5; i++) {
            mollyXYArr[i].found = false;
        }

        //set active/inactive button states and format
        if (!won) { 
            $(".reset-btn, .start-btn").toggleClass("btn-highlight");
        }
        $(enableBtn).prop("disabled", false);
        $(disableBtn).prop("disabled", true);
    }

}); // end of document ready
