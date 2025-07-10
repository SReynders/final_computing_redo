function getinfo(id) {
    const playerNameField = document.getElementById("fname");
    if(playerNameField.value != "") {
        var playerName = playerNameField.value;
        let date = new Date();
        let dateTime = date.getTime()+365 * 24 * 60 * 60 * 1000;
        setCookie("playerName", playerName, dateTime);
        document.getElementById("form").remove();
        const urlParameters = new URLSearchParams(window.location.search);
        const gameid = urlParameters.get("uuid");
        startHunt(playerName, gameid);
    }
}
function startHunt(PlayerName,gameid)
{

    var platform="TreasureHuntApp";
    var URL = "https://codecyprus.org/th/api/start?player="+PlayerName+"&app="+platform+"&treasure-hunt-id="+gameid;
    fetch(URL)
        .then(response => response.json()) //Parse JSON text to JavaScript object
        .then(jsonObject => {
            var sessionID = jsonObject.session;
            let date = new Date();
            let dateTime = date.getTime()+365 * 24 * 60 * 60 * 1000;
            setCookie("sessionID", sessionID, dateTime);
            var numOfQuestions = jsonObject.numOfQuestions;
            getQuestion(sessionID);
        });
}
function getQuestion(sessionID){
    var URL = "https://codecyprus.org/th/api/question?session="+sessionID;
    if(document.getElementById("secondWrap") != null)
    {
        document.getElementById("secondWrap").remove();
    }
    fetch(URL)
        .then(response => response.json()) //Parse JSON text to JavaScript object
        .then(jsonObject => {
            console.log(jsonObject.requiresLocation);
            j = document.getElementById("myWraper");
            j.innerHTML += "<form id='form'>";
            i = document.getElementById("form");
            if(jsonObject.requiresLocation){
                i.innerHTML+="<p>This question requires geolocation, please wait at least 30 seconds before answering it</p>" +
                    "<br>";
            }
            if(jsonObject.completed == false) {
                document.getElementById("header").innerHTML+="<div id='QRWraper'>" +
                    "<input type='button' class='buttons' onclick='createQRReader()' value='Answer using QR Code'>" +
                    "</div>";
                if (jsonObject.questionType == "TEXT") {
                    i.innerHTML += "<div class ='textQ'>" +
                        "<label for='ans'>" + jsonObject.questionText + "</label><br>" +
                        "<input type='text' id='ans' name='ans'><br>" +
                        "<input type='button' class='buttons' getAnswer(" + JSON.stringify(sessionID) + ", " + JSON.stringify(jsonObject.questionType) + ")' value='Submit'>";
                    if (jsonObject.canBeSkipped) {
                        document.getElementsByClassName("textQ")[0]+= "<input type='button' class='buttons' onclick='skipQuestion(" + JSON.stringify(sessionID) + ")' value='Skip the question'>";
                    }
                    i.innerHTML += "</div>";
                } else if (jsonObject.questionType == "NUMERIC" || jsonObject.questionType == "INTEGER") {
                    if (jsonObject.questionType == "NUMERIC") {
                        i.innerHTML += "<div class='numericQ'>" +
                            "<label for='ans'>" + jsonObject.questionText + "</label><br>" +
                            "<input type='number' id='ans' name='ans' step='0.01'><br>" +
                            "<input type='button' class='buttons' onclick='getAnswer(" + JSON.stringify(sessionID) + ", " + JSON.stringify(jsonObject.questionType) + ")' value='Submit'>";
                        if (jsonObject.canBeSkipped) {
                            document.getElementsByClassName("numericQ")[0].innerHTML += "<input type='button' class='buttons' onclick='skipQuestion(" + JSON.stringify(sessionID) + ")' value='Skip the question'>";
                        }
                        i.innerHTML += "</div>";
                    } else {
                        i.innerHTML += "<div class='numericQ'><label for='ans'>" + jsonObject.questionText + "</label><br>" +
                            "<input type='number' id='ans' name='ans'><br>" +
                            "<input type='button' class='buttons' onclick='getAnswer(" + JSON.stringify(sessionID) + ", " + JSON.stringify(jsonObject.questionType) + ")' value='Submit'>";
                        if (jsonObject.canBeSkipped) {
                            document.getElementsByClassName("numericQ")[0].innerHTML += "<input type='button' class='buttons' onclick='skipQuestion(" + JSON.stringify(sessionID) + ")' value='Skip the question'>";
                        }
                        i.innerHTML += "</div>";
                    }
                } else {
                    if (jsonObject.questionType == "BOOLEAN") {
                        i.innerHTML += "<div class='booleanQ'>" +
                            "<p>" + jsonObject.questionText + "</p>\n" +
                            "<input type='radio' id='true' name='ans' value='True'>\n" +
                            "<label for='true'>True</label><br>\n" +
                            "<input type='radio' id='false' name='ans' value='False'>\n" +
                            "<label for='false'>False</label><br>\n " +
                            "<input type='button' class='buttons' onclick='getAnswer(" + JSON.stringify(sessionID) + ", " + JSON.stringify(jsonObject.questionType) + ")' value='Submit'>";
                        if (jsonObject.canBeSkipped) {
                            document.getElementsByClassName("booleanQ")[0].innerHTML += "<input type='button' class='buttons' onclick='skipQuestion(" + JSON.stringify(sessionID) + ")' value='Skip the question'>";
                        }
                        i.innerHTML+="</div>";
                    } else {
                        i.innerHTML += "<div class='MCQ'>" +
                            "</div><p>" + jsonObject.questionText + "</p>\n" +
                            "<input type='radio' id='A' name='ans' value='A'>\n" +
                            "<label for='A'>A</label><br>\n" +
                            "<input type='radio' id='B' name='ans' value='B'>\n" +
                            "<label for='B'>B</label><br>\n " +
                            "<input type='radio' id='C' name='ans' value='C'>\n" +
                            "<label for='C'>C</label><br>\n" +
                            "<input type='radio' id='D' name='ans' value='D'>\n" +
                            "<label for='D'>D</label><br>\n " +
                            "<input type='button' class='buttons' onclick='getAnswer(" + JSON.stringify(sessionID) + ", " + JSON.stringify(jsonObject.questionType) + ")' value='Submit'>";
                        if (jsonObject.canBeSkipped) {
                            document.getElementsByClassName("MCQ")[0].innerHTML += "<input type='button' class='buttons' onclick='skipQuestion(" + JSON.stringify(sessionID) + ")' value='Skip the question'>";
                        }
                        i.innerHTML+="</div>";
                    }

                }
                j.innerHTML += "</form>";
            }
            else{
                let param = new URLSearchParams(window.location.search);
                j.innerHTML+="<div id='end'>" +
                    "<h1 id='gameEnd'> Thanks for playing treasure hunt" +
                    "<p>You can eather start new game or check your position on leaderboard</p>" +
                    "<br>" +
                    "<input type='button' class='buttons' onclick='getLeaderBoard(" + JSON.stringify(sessionID) + ")' value='Leader board'>" +
                    "<input type='button' class='buttons' onclick='startAgain()' value='Start Again!'>" +
                    "</div>"
            }
        });
}
function getAnswer(sessionID, QType){
    if(QType == "NUMERIC" || QType == "INTEGER" || QType == "TEXT") {
        var ans = document.getElementById("ans").value;
    }
    else{
        var ans = document.querySelector('input[name="ans"]:checked').value;
    }
    var URL = "https://codecyprus.org/th/api/answer?session="+sessionID+"&answer="+ans;

    fetch(URL)
        .then(response => response.json()) //Parse JSON text to JavaScript object
        .then(jsonObject => {
            if(document.getElementById("form")) {
                document.getElementById("form").remove();
            }
            if(document.getElementById("QRWraper"))
            {
                document.getElementById("QRWraper").remove();
            }
            var Congrats = jsonObject.message;
            var scorAdjustment = jsonObject.scoreAdjustment;
            i = document.getElementById("myWraper");
            console.log(scorAdjustment);
            console.log(Congrats);
            i.innerHTML+="<div id='secondWrap'>" +
                "<h1 id='congratulation'>"+Congrats+"</h1>" +
                "<p id='scoreAdjustment'>You got "+scorAdjustment+"</p>" +
                "<input type='button' class='buttons' value='Continue' onclick='getQuestion("+JSON.stringify(sessionID)+")'>" +
                "</div>";
        });
}
function getAnswerQR(sessionID, value){

    var URL = "https://codecyprus.org/th/api/answer?session="+sessionID+"&answer="+value;

    fetch(URL)
        .then(response => response.json()) //Parse JSON text to JavaScript object
        .then(jsonObject => {
            if(document.getElementById("form")) {
                document.getElementById("form").remove();
            }
            if(document.getElementById("QRWraper"))
            {
                document.getElementById("QRWraper").remove();
            }
            var Congrats = jsonObject.message;
            var scorAdjustment = jsonObject.scoreAdjustment;
            i = document.getElementById("myWraper");
            console.log(scorAdjustment);
            console.log(Congrats);
            i.innerHTML+="<div id='secondWrap'>" +
                "<h1 id='congratulation'>"+Congrats+"</h1>" +
                "<p id='scoreAdjustment'>You got "+scorAdjustment+"</p>" +
                "<input type='button' class='buttons' value='Continue' onclick='getQuestion("+JSON.stringify(sessionID)+")'>" +
                "</div>";
        });
}
function skipQuestion(sessionID){
    var URL = "https://codecyprus.org/th/api/skip?session="+sessionID;
    fetch(URL)
        .then(response => response.json()) //Parse JSON text to JavaScript object
        .then(jsonObject => {
            if(document.getElementById("QRWraper"))
            {
                document.getElementById("QRWraper").remove();
            }
            var Congrats = jsonObject.message;
            var scorAdjustment = jsonObject.scoreAdjustment;
            document.getElementById("form").remove();
            i = document.getElementById("myWraper");
            i.innerHTML+="<div id='secondWrap'>" +
                "<h1 id='congratulation'>"+Congrats+"</h1>" +
                "<p id='scoreAdjustment'>You got "+scorAdjustment+"</p>" +
                "<input type='button' class='buttons' value='Continue' onclick='getQuestion("+JSON.stringify(sessionID)+")'>" +
                "</div>";
        });
}
function getLocation(){
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(getCurrentLocation);
    }
    else{
        alert("Activate geolocation please or change the browser");
    }
}
function getCurrentLocation(position){
    console.log(getCookie('sessionID'));
    var URL = "https://codecyprus.org/th/api/location?session="+getCookie("sessionID")+"&latitude="+JSON.stringify(position.coords.latitude)+"&longitude="+JSON.stringify(position.coords.longitude);
    console.log(URL);
    fetch(URL)
        .then(response => response.json())
        .then(jsonObject => {
        })
}
function getScore(sessionID){
    var URL = "https://codecyprus.org/th/api/score?session="+sessionID;
    fetch(URL)
        .then(response => response.json()) //Parse JSON text to JavaScript object
        .then(jsonObject => {
            var Congrats = jsonObject.player;
            var scorAdjustment = jsonObject.score;
            i = document.getElementById("myWraper");
            i+="<div id='secondWrap'>" +
                "<h1 id='congratulation'>"+Congrats+"</h1>" +
                "<p id='scoreAdjustment'>You got +"+scorAdjustment+"</p>" +
                "<input type='button' class='buttons' value='Continue' onclick='getQuestion("+sessionID+")'>" +
                "</div>";
        });
}

function getLeaderBoard(sessionID) {
    var URL = "https://codecyprus.org/th/api/leaderboard?session=" + sessionID + "&sorted";
    fetch(URL)
        .then(response => response.json()) //Parse JSON text to JavaScript object
        .then(jsonObject => {
            var players = jsonObject.leaderboard;
            document.getElementById("end").remove();
            i = document.getElementById("myWraper");
            i.innerHTML+="<div id='secondWrap'>" +
                "<h1>Your position in leaderboard is: "+findMinePosition(jsonObject, getCookie("playerName"))+"</h1>";
            let k = document.getElementById("secondWrap");
            for(let j = 0; j < 10; j++){
                k.innerHTML+= "<h2>Player № "+(j+1)+" "+jsonObject.leaderboard[j].player+" and his score is: "+jsonObject.leaderboard[j].score+"</h2>";
            }

            i.innerHTML+="<input type='button' class='buttons' onclick='startAgain()' value='Start Again!'>" +
                "</div>";
        });
}
function findMinePosition(jsonObject, playerName){
    for(let i = 0; i < jsonObject.numOfPlayers;i++)
    {
        if(JSON.stringify(jsonObject.leaderboard[i].player) === JSON.stringify(playerName))
        {
            return i+1;
        }
    }
    return null;
}
function startAgain()
{
    location.replace("https://sreynders.github.io/final_computing_redo/");
}
//Code from w3shools url="https://www.w3schools.com/js/js_cookies.asp"
function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
//Code from w3shools url="https://www.w3schools.com/js/js_cookies.asp"
function setCookie(cookieName, cookieValue, expireDays) {
    let date = new Date();
    date.setTime(date.getTime() + (expireDays * 24 * 60 * 60 * 1000));
    let expires = "expires=" + date.toUTCString();
    document.cookie = cookieName + "=" + cookieValue + ";" + expires + ";path=/";
}
function createQRReader() {
    if(document.getElementById("form")) {
        document.getElementById("form").remove();
    }
    if(document.getElementById("QRWraper")) {
        document.getElementById("QRWraper").remove();
    }
    i = document.getElementById("myWraper");
    i.innerHTML+="<div id='QRContainer'>";
    j = document.getElementById("QRContainer");
    j.innerHTML+="<video id='preview'></video>" +
        "<br>" +
        "<input type='button' class='buttons' onclick='stopQRReader()' value='Stop Scanner'>" +
        "<input type='button' class='buttons' onclick='changeTheCam()' value='Change Camera'>";
    i.innerHTML+="</div>"
    var opts = {
// Whether to scan continuously for QR codes. If false, use scanner.scan() to
// manually scan. If true, the scanner emits the "scan" event when a QR code is
// scanned. Default true.
        continuous: true,
// The HTML element to use for the camera's video preview. Must be a <video>
// element. When the camera is active, this element will have the "active" CSS
// class, otherwise, it will have the "inactive" class. By default, an invisible
// element will be created to host the video.
        video: document.getElementById('preview'),
// Whether to horizontally mirror the video preview. This is helpful when trying to
// scan a QR code with a user-facing camera. Default true.
        mirror: false,
// Whether to include the scanned image data as part of the scan result. See the
// "scan" event for image format details. Default false.
        captureImage: false,
// Only applies to continuous mode. Whether to actively scan when the tab is not
// active.
// When false, this reduces CPU usage when the tab is not active. Default true.
        backgroundScan: true,
// Only applies to continuous mode. The period, in milliseconds, before the same QR
// code will be recognized in succession. Default 5000 (5 seconds).
        refractoryPeriod: 5000,
// Only applies to continuous mode. The period, in rendered frames, between scans. A
// lower scan period increases CPU usage but makes scan response faster.
// Default 1 (i.e. analyze every frame).
        scanPeriod: 1
    };
    scanner = new Instascan.Scanner(opts);

    Instascan.Camera.getCameras().then(function (cameras) {
        if (cameras.length > 0) {
            scanner.start(cameras[0]);
        } else {
            console.error('No cameras found.');
            alert("No cameras found.");
        }
    }).catch(function (e) {
        console.error(e);
    });
    scanner.addListener('scan', function (content) {
        console.log(content);
        scanner.stop();
        document.getElementById("QRContainer").remove();
        getAnswerQR(getCookie('sessionID'), content);
    });
}
function changeTheCam(){
    Instascan.Camera.getCameras().then(function (cameras) {
        camNum++;
        if(camNum >= cameras.length){
            camNum = 0;
        }
        if (camNum < cameras.length) {
            scanner.start(cameras[camNum]);
        }
        else {
            console.error('No cameras found.');
            alert("No cameras found.");
        }
    }).catch(function (e) {
        console.error(e);
        document.write(e);
        scanner.stop();
    })
    scanner.addListener('scan', function (content) {
        console.log(content);
        scanner.stop();
        document.getElementById("content").innerHTML = content;
        getAnswerQR(getCookie('sessionID'), content);
    });
}
function stopQRReader() {
    if (scanner) {
        scanner.stop();
        document.getElementById("QRContainer").remove();
        getQuestion(getCookie('sessionID'));
    }
}
setInterval(getLocation, 31000);
var scanner;
var camNum=0;
