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
var turn = "";
var round = 0;

var yourHealthContainer = document.getElementById("your-health");
var yourBpContainer = document.getElementById("your-bp");
var opponentHealthContainer = document.getElementById("opponent-health")

var yourHealthBar = document.getElementById("your-health-meter");
var opponentHealthBar = document.getElementById("opponent-health-meter");

var roundCounter = document.getElementById("round")
var turnCounter = document.getElementById("turn")

function retrieveMatchInfo() {
    var url = "./php_scripts/match/get_match_info.php";

    fetch(url, {
        method : "GET",
        credentials : "same-origin"
    })

    .then(response => response.json())

    .then(response => {
        yourHealth = response.yourhealth;
        yourBP = response.yourbp;
        opponentHealth = response.opponenthealth;

        opponentHealthContainer.innerHTML = opponentHealth + "/12000";
        yourHealthContainer.innerHTML = yourHealth + "/12000";
        yourBpContainer.innerHTML = "BP: " + yourBP

        var healthbar = (yourHealth / 120)
        healthbar = Math.round(healthbar)
        var width = healthbar + "%";
        $(yourHealthBar).animate({
            width:width,
        }, 500);

        healthbar = (opponentHealth / 120)
        healthbar = Math.round(healthbar)
        width = healthbar + "%";
        $(opponentHealthBar).animate({
            width:width,
        }, 500);

        turn = response.turn;
        round = response.round;

        turnCounter.innerHTML = turn + " turn."
        roundCounter.innerHTML = "Round " + round
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

// TEMP: function that attacks opponent with damage in card
function attackOpponent(card_id) {
    var url = "./php_scripts/match/attack_opponent.php";

    fetch(url, {
        method : "POST",
        body : JSON.stringify({
            card_id : card_id
        }),
        credentials : "same-origin"
    })

    .then(response => response.json())

    .then(response => {
        switch (response.error) {
            case "not_in_deck":
                matchShowConfirm("This card is not in your deck.");
                break;
            case "not_your_turn":
                matchShowConfirm("It is not your turn yet.");
                break;
            case "not_enough_bp":
                matchShowConfirm("You dont have enough battle points for this attack.");
                break;
        }

        if (response.ok == 1) {
            retrieveMatchInfo();
        }
    })

    .catch(error => {
        matchShowConfirm("Something went wrong.");
        console.error(error);
    })

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

// Shows a popup with red text
function matchShowConfirm(message, duration = 2000) {
    document.getElementById("matchShowConfirm").innerHTML = message;
    $('#matchShowConfirmContainer').animate({
        height:'180px',
    }, 300);
    setTimeout(function() {
        $('#matchShowConfirmContainer').animate({
            height:'0px',
        }, 300);
    }, duration)
}