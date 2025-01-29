// JavaScript file for match page

// Interval to verify that youre online, check if the other user is online and if other user left
setInterval(function() {
    $.get("./php_scripts/verify_online_match.php", function(response){
        switch(response) {
            case "left":
                window.location = "nocturnal-skirmish.php?matchmaking=left"
        }
    })
    retrieveMatchInfo();
}, 5000)

// Leaves the current match
function leaveMatch() {
    $.get("./php_scripts/leave_match.php", function(response){
        switch(response) {
            case "ok":
                window.location = "nocturnal-skirmish.php"
        }
    })
    .fail(function(xhr, status, error) {
    $.get("./php_scripts/cancel_matchmaking.php")
    window.location = "nocturnal-skirmish.php?matchmaking=error"
    })
}

if (document.getElementById("popup-vs")) {
    setTimeout(function() {
        $("#popup-vs").fadeOut(500);
    }, 5000)
}

// function that retrieves information about match at a interval of 5 seconds
var yourHealth = 0
var yourBP = 0
var opponentHealth = 0

var yourHealthContainer = document.getElementById("your-health");
var yourBpContainer = document.getElementById("your-bp");
var opponentHealthContainer = document.getElementById("opponent-health")

var yourHealthBar = document.getElementById("your-health-meter");
var opponentHealthBar = document.getElementById("opponent-health-meter");

function retrieveMatchInfo() {
    var url = "./php_scripts/get_match_info.php";

    fetch(url, {
        method : "GET",
        credentials : "same-origin"
    })

    .then(response => response.json())

    .then(response => {
        yourHealth = response.yourhealth;
        yourBP = response.yourbp;
        opponentHealth = response.opponenthealth;

        opponentHealthContainer.innerHTML = opponentHealth + "/1000";
        yourHealthContainer.innerHTML = yourHealth + "/1000";
        yourBpContainer.innerHTML = "BP: " + yourBP

        var healthbar = (yourHealth / 10)
        healthbar = Math.round(healthbar)
        yourHealthBar.style.width = healthbar + "%";

        healthbar = (opponentHealth / 10)
        healthbar = Math.round(healthbar)
        opponentHealthBar.style.width = healthbar + "%";
    })

    .catch(error => {
        console.error(error)
    })
}

// when effect icon is hovered over
var effecticon = document.querySelector(".effect-icon");
var effectdetailcontainer = document.querySelector(".effect-details-container");

function showEffectDetails(effectname){
   switch(effectname){
        case "shield":
            effectdetailcontainer.innerHTML = "<p>Shield: Protects you from damage, but also reduces your BP by 10% for 3 seconds.</p>";
            break;
        case "regen":
            effectdetailcontainer.innerHTML = "<p>Shield: Protects you from damage, but also reduces your BP by 10% for 3 seconds.</p>";
            break;
        case "damageboost":
            effectdetailcontainer.innerHTML = "<p>Damage Boost: Increases your damage by 20% for 5 seconds.</p>";
            break;
        case "overhealth":
            effectdetailcontainer.innerHTML = "<p>Sigma: Increases your</p>";
            break;
   }
   effectdetailcontainer.style.display = "block";
}

function hideEffectDetails(event){
    effectdetailcontainer.style.display = "none";
}

// Emoji dropdown
var dropdownState = 0;
document.getElementById("emoji-dropdown-button").addEventListener("click", function() {
    var arrow = document.getElementById("emoji-arrow");
    if (dropdownState == 0) {
        dropdownState = 1
        // If dropdown is closed
        document.getElementById("emoji-dropdown").style.display = "inline";
        $('#emoji-dropdown').animate({
            height:'300px',
        }, 300);
        arrow.style.transform = "rotate(180deg)";
    } else {
        dropdownState = 0
        // If dropdown is open
        setTimeout(function() {
            document.getElementById("emoji-dropdown").style.display = "none";
        }, 300)
        $('#emoji-dropdown').animate({
            height:'0px',
        }, 300);
        arrow.style.transform = "rotate(0deg)";
    }
})

// All buttons go through this function
function matchEventHandler(json) {
    var url = "./php_scripts/match_event_handler.php"

    fetch(url, {
        method : "POST",
        body : JSON.stringify(json),
        credentials : "same-origin",
        headers : {
            "Content-Type" : "application/json"
        }
    })

    .then(response => response.json())

    .then(response => {
        // Handle response here
        switch (response.error) {
            case "not_your_turn":
                alert("It is not your turn yet.");
                break;
            case "error":
                alert("something went wrong.");
                break;
        }

        if (response.ok == 1) {
            retrieveMatchInfo();
        }
    })

    .catch(error => {
        alert(error)
    })
}