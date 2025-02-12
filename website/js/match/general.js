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

// Shows a popup of an emoji sent by opponent
function showEmoji(emoji) {
    emojiImg = document.getElementById("emoji_img");
    emojiImg.src = emoji;
    $('#matchShowEmoji').animate({
        height:'180px',
    }, 300);
    setTimeout(function() {
        $('#matchShowEmoji').animate({
            height:'0px',
        }, 300);
    }, 2000)
}

// Sends an emoji to the opponent
function sendEmoji(emoji) {
    var url = "./php_scripts/match/send_emoji.php";

    // Disable all emoji buttons
    var el = document.getElementById('emoji-dropdown'),
    all = el.getElementsByTagName('button'), i;
    for (i = 0; i < all.length; i++) {
        all[i].disabled = true;
    }

    fetch(url, {
        method : "POST",
        body : JSON.stringify({
            emoji : emoji
        }),
        credentials : "same-origin"
    })

    .then(response => response.json())

    .then(response => {
        switch(response.error) {
            case "invalid":
                matchShowConfirm("Invalid emoji.");
        }

        if (response.ok == 1) {
            showEmoji(response.emojipath)
        }
    })

    .catch(error => {
        console.error(error);
        matchShowConfirm("Something went wrong.")
    })

    .finally(() => {
        setTimeout(function() {
            // Enable all emoji buttons
            var el = document.getElementById('emoji-dropdown'),
            all = el.getElementsByTagName('button'), i;
            for (i = 0; i < all.length; i++) {
                all[i].disabled = false;
            }
        }, 3000)
    })
}

// function that retrieves information about match at a interval of 5 seconds
var yourHealth = 0
var yourBP = 0
var opponentHealth = 0
var turn = "";
var round = 0;

var firstTime = true;

var yourHealthContainer = document.getElementById("your-health");
var yourBpContainer = document.getElementById("your-bp");
var opponentHealthContainer = document.getElementById("opponent-health")

var yourHealthBar = document.getElementById("your-health-meter");
var opponentHealthBar = document.getElementById("opponent-health-meter");

var roundCounter = document.getElementById("round")
var turnCounter = document.getElementById("turn")

var handArray = [];

function retrieveMatchInfo() {
    var url = "./php_scripts/match/get_match_info.php";

    fetch(url, {
        method : "GET",
        credentials : "same-origin"
    })

    .then(response => response.json())

    .then(response => {
        yourHealth = response.yourhealth;
        opponentHealth = response.opponenthealth;

        opponentHealthContainer.innerHTML = opponentHealth + "/12000";
        yourHealthContainer.innerHTML = yourHealth + "/12000";

        if (firstTime == true) {
            yourBP = response.yourbp;
            UpdateBP();
            firstTime = false;
        }

        // Set health bars
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

        // Get textures for your hand
        document.getElementById("card-slideout-1").src = response.yourhand1
        document.getElementById("card-slideout-2").src = response.yourhand2
        document.getElementById("card-slideout-3").src = response.yourhand3
        document.getElementById("card-slideout-4").src = response.yourhand4
        document.getElementById("card-slideout-5").src = response.yourhand5

        // Get ids for your hand
        document.getElementById("card-1").name = response.yourhand1id
        handArray[0] = Number(response.yourhand1id);
        document.getElementById("card-2").name = response.yourhand2id
        handArray[1] = Number(response.yourhand2id);
        document.getElementById("card-3").name = response.yourhand3id
        handArray[2] = Number(response.yourhand3id);
        document.getElementById("card-4").name = response.yourhand4id
        handArray[3] = Number(response.yourhand4id);
        document.getElementById("card-5").name = response.yourhand5id
        handArray[4] = Number(response.yourhand5id);

        // Get bp for each card
        document.getElementById("card-slideout-1-bp").innerHTML = response.yourhand1bp
        document.getElementById("card-1").setAttribute("bp", response.yourhand1bp);
        document.getElementById("card-slideout-2-bp").innerHTML = response.yourhand2bp
        document.getElementById("card-2").setAttribute("bp", response.yourhand2bp);
        document.getElementById("card-slideout-3-bp").innerHTML = response.yourhand3bp
        document.getElementById("card-3").setAttribute("bp", response.yourhand3bp);
        document.getElementById("card-slideout-4-bp").innerHTML = response.yourhand4bp
        document.getElementById("card-4").setAttribute("bp", response.yourhand4bp);
        document.getElementById("card-slideout-5-bp").innerHTML = response.yourhand5bp
        document.getElementById("card-5").setAttribute("bp", response.yourhand5bp);

        // Get rarity for your hand
        var style = document.getElementById("card-slideout-style")
        style.innerHTML = "";
        style.innerHTML = style.innerHTML + response.yourhandrarity

        // Get textures for enemy hand
        document.getElementById("card-slideout-1-enemy").src = response.enemyhand1
        document.getElementById("card-slideout-2-enemy").src = response.enemyhand2
        document.getElementById("card-slideout-3-enemy").src = response.enemyhand3
        document.getElementById("card-slideout-4-enemy").src = response.enemyhand4
        document.getElementById("card-slideout-5-enemy").src = response.enemyhand5

        // Get ids for enemy hand
        document.getElementById("card-1-enemy").name = response.enemyhand1id
        document.getElementById("card-2-enemy").name = response.enemyhand2id
        document.getElementById("card-3-enemy").name = response.enemyhand3id
        document.getElementById("card-4-enemy").name = response.enemyhand4id
        document.getElementById("card-5-enemy").name = response.enemyhand5id

        // Get bp for each enemy card
        document.getElementById("card-slideout-1-bp-enemy").innerHTML = response.enemyhand1bp
        document.getElementById("card-slideout-2-bp-enemy").innerHTML = response.enemyhand2bp
        document.getElementById("card-slideout-3-bp-enemy").innerHTML = response.enemyhand3bp
        document.getElementById("card-slideout-4-bp-enemy").innerHTML = response.enemyhand4bp
        document.getElementById("card-slideout-5-bp-enemy").innerHTML = response.enemyhand5bp

        // Get rarity for enemy hand
        var style = document.getElementById("card-slideout-style")
        style.innerHTML = style.innerHTML + response.enemyhandrarity

        // Get emoji
        if (response.emoji != 0) {
            showEmoji(response.emoji);
        }

        // Check if someone has won or lost
        var winloss = response.winloss;
        if (winloss == "win") {
            // You won
        } else if (winloss == "loss") {
            // You lost
        }
    })

    .catch(error => {
        console.error(error)
    })
}

// Resets action to zero
function resetAction() {
    actionBp = 0;
    actionJSON = {
        1:0,
        2:0,
        3:0,
        4:0
    };

    document.querySelectorAll(".action-box-card").forEach(element => {
        element.style.backgroundImage = "";
        element.removeAttribute("json_pos");
        element.removeAttribute("card-pressed");
        element.removeAttribute("card_id");
    })

    document.querySelectorAll(".card-slideout-card-wrapper").forEach(element => {
        element.style.pointerEvents = "auto";
        element.style.opacity = "1";
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

// Attack opponent with action and ends the round
function attackOpponent() {
    var url = "./php_scripts/match/attack_opponent.php?debug=win";

    fetch(url, {
        method : "POST",
        body : JSON.stringify(actionJSON),
        credentials : "same-origin"
    })

    .then(response => response.json())

    .then(response => {
        switch (response.error) {
            case "not_in_deck":
                matchShowConfirm("Some of these cards are not in your deck.");
                break;
            case "not_your_turn":
                matchShowConfirm("It is not your turn yet.");
                break;
            case "not_enough_bp":
                matchShowConfirm("You dont have enough battle points for this attack.");
                break;
            case "error":
                matchShowConfirm("Something went wrong.");
                break;
        }

        if (response.ok == 1) {
            firstTime = true;
            resetAction();
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

function reshuffle() {
    var url = "./php_scripts/match/reshuffle.php";

    fetch(url, {
        method : "GET",
        credentials : "same-origin"
    })

    .then(() => {
        retrieveMatchInfo()
    })
}


var actionJSON = {
    1:0,
    2:0,
    3:0,
    4:0
};

var cardBox = "";
var noOpenSpots = true;
var card_count = 0;
var card_count_hand = 0;
var actionBp = 0;

// Function that adds card to action
function addToAction(card_id, card_pressed) {
    cardDownAnimation(card_pressed);
    var card_pressed_element = document.getElementById(card_pressed);
    var bp = card_pressed_element.getAttribute("bp");

    noOpenSpots = true;
    card_count = 0;
    card_count_hand = 0;

    var url = "./php_scripts/match/get_card_info.php?id=" + card_id;

    fetch(url, {
        method : "GET",
        credentials : "same-origin"
    })

    .then(response => response.json())

    .then(response => {
        switch(response.error) {
            case "card_not_exist":
                matchShowConfirm("This card doesnt exist.");
                break;
            case "error":
                matchShowConfirm("Something went wrong.")
                break;
        }

        if (response.status == 200) {
            // If everything went well
            for (var key in actionJSON) {
                if (actionJSON.hasOwnProperty(key)) {
                    var value = actionJSON[key];
                    if (value == 0) {
                        noOpenSpots = false;
                        // Check if this card is in your hand
                        if (handArray.includes(card_id) == false) {
                            hideCardDetails();
                            matchShowConfirm("This card is not in your hand.");
                            break;
                        } else {
                            // Check if you have enough of this card to use it

                            // Check how many of this card is already in the action
                            for (var key2 in actionJSON) {
                                if (actionJSON[key2] == card_id) {
                                    card_count++;
                                }
                            }

                            // Get the amount of that card in your hand
                            card_count_hand = handArray.filter(x => x === card_id).length;  // vet ikke hvorfor funker

                            // Check if those slots are already filled up
                            if (card_count == card_count_hand) {
                                matchShowConfirm("Card is already used up.")
                                hideCardDetails();
                                break;
                            } else {
                                // Check if you have enough BP left
                                if (bp > yourBP) {
                                    matchShowConfirm("You dont have enough bp for this card.")
                                    hideCardDetails();
                                    break;
                                } else {
                                    // Update background image
                                    actionJSON[key] = card_id;
                                    var cardBox = document.getElementById("action-card-" + key);
                                    cardBox.style.backgroundImage = `url(./img/cards/${response.texture})`

                                    // Update attributes of element
                                    cardBox.setAttribute("json_pos", key)
                                    cardBox.setAttribute("card_id", card_id)
                                    cardBox.setAttribute("card-pressed", card_pressed)

                                    // Make it clickable
                                    cardBox.addEventListener("click", function() {
                                        removeFromAction(key);
                                        cardBox.removeEventListener("click", null);
                                    })

                                    // Update bp
                                    actionBp += Number(bp);
                                    yourBP -= Number(bp);

                                    // Change counter color based on bp amount
                                    UpdateBP()

                                    // Disable pressed card
                                    card_pressed_element.style.pointerEvents = "none";
                                    card_pressed_element.style.opacity = "0.3";

                                    hideCardDetails();
                                    break;
                                }
                            }
                        }
                    }
                }
            }
        }
        if (noOpenSpots == true) {
            matchShowConfirm("You can only use 4 cards in an action.")
            hideCardDetails();
        }
    })

    .catch(error => {
        console.error(error)
        matchShowConfirm("Something went wrong")
    })
}

// Chnanges bp counter color based on bp amount
function UpdateBP() {
    const hue = Math.round( (15 - actionBp) / 14 * 120);
    const color = `hsl(${hue}, 100%, 50%)`;
    yourBpContainer.style.color = color;
    yourBpContainer.innerHTML = "BP: " + yourBP;
}

// Function that removes card from action
function removeFromAction(id) {
    // Get the card box and remove the background image
    var cardBox = document.getElementById("action-card-" + id);
    cardBox.style.backgroundImage = "";

    // Get the card that was pressed and enable it
    var card_pressed = cardBox.getAttribute("card-pressed");
    var card = document.getElementById(card_pressed);
    card.style.pointerEvents = "auto";
    card.style.opacity = "1";
    var bp = card.getAttribute("bp");

    // Remove attributes from card box
    cardBox.removeAttribute("card-pressed");
    cardBox.removeAttribute("json_pos");
    cardBox.removeAttribute("card_id");

    // Get bp and add it to amount
    yourBP += Number(bp);
    actionBp -= Number(bp)
    UpdateBP();
    actionJSON[id] = 0;
}
