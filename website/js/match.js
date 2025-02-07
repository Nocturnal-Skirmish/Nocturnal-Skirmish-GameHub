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
        document.getElementById("card-2").name = response.yourhand2id
        document.getElementById("card-3").name = response.yourhand3id
        document.getElementById("card-4").name = response.yourhand4id
        document.getElementById("card-5").name = response.yourhand5id

        // Get bp for each card
        document.getElementById("card-slideout-1-bp").innerHTML = response.yourhand1bp
        document.getElementById("card-slideout-2-bp").innerHTML = response.yourhand2bp
        document.getElementById("card-slideout-3-bp").innerHTML = response.yourhand3bp
        document.getElementById("card-slideout-4-bp").innerHTML = response.yourhand4bp
        document.getElementById("card-slideout-5-bp").innerHTML = response.yourhand5bp

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



// animations playground...........................................................................................................................................

/* Experimental fix (not working) */
function toggleDisabled(togglestatus = false) {
    if (togglestatus === true) {
        document.getElementById('card-slideout-container').setAttribute("disabled");
        document.getElementById('card-slideout-container').style.pointerEvents = "none";
    } else {
        document.getElementById('card-slideout-container').removeAttribute("disabled");
        document.getElementById('card-slideout-container').style = "";
    }
} 

/* husk å gjøre lukking animasjon raskere ----------------------------------------------------------------------------------------- */
var animationDuration = 50;
/* Cards sliding out from hand animation timeline */
var cardSlideOut = anime.timeline({
    easing: 'easeInOutSine',
    duration: (animationDuration * 2),
    autoplay: false,
    loop: false,
});
/* The Timeline itself */
cardSlideOut
.add({
    function() {
        toggleDisabled(true);
    },
    targets: '#card-5',
    translateX: 720,
    duration: (animationDuration * 3),
})
.add({
    targets: '#card-4',
    translateX: 540,
    duration: (animationDuration * 3),
}, "-=50")
.add({
    targets: '#card-3',
    translateX: 360,
    duration: (animationDuration * 3),
}, "-=50")
.add({
    targets: '#card-2',
    translateX: 180,
    duration: (animationDuration * 3),
    complete: function() {
        toggleDisabled(false);
    },
}, "-=50");



/* Button slideout animation which comes at the same time as the cards slide out */
var buttonSlideOut = anime.timeline({
    easing: 'easeInOutSine',
    duration: (animationDuration * 4),
    autoplay: false
})

buttonSlideOut.add({
    targets: '#card-slideout-button',
    translateX: 800,
    duration: (animationDuration * 3),
    rotate: "180deg"
})

// slide selected cards up
var cardSelectedUp = anime.timeline({
    easing: 'easeOutExpo',
    duration: 100,
    autoplay: false,
});

cardSelectedUp
.add({
    targets: '.card-slideout-card',
    translateY: -20,
    duration: 100,
});

/* Define a bunch of important state variables for the animations and selections */
var animationState = 0;
var animationStateEnemy = 0;
var previousCard = "";
var previousCardEnemy = "";

/* The event listener itself and the logic behind animations for player hand */
const cards = document.querySelectorAll('.card-slideout-card-wrapper');
cards.forEach(card => {
    card.addEventListener("click", function() {
        if (animationStateEnemy == 1) {
            playCardAnimationEnemy()
            animationStateEnemy = 0;
            hideCardDetailsEnemy();
        }
        if (animationState == 0) {
            playCardAnimation();
            animationState = 1;
        }
        else {
            if (previousCard == this.id) {
                cardDownAnimation(previousCard);
                hideCardDetails()
                previousCard = 0;
            } else {
                cardDownAnimation(previousCard);
                cardUpAnimation(this.id);
                previousCard = this.id;
                showCardDetails(this.name, this.id);
            }
        }
    })
});
/* Cards sliding up when selected animations */
var slideuptime = 50;
var cardSelectedUp = anime.timeline({})
function cardUpAnimation(id) {
    cardSelectedUp = anime.timeline({
        easing: 'easeOutExpo',
        duration: slideuptime,
        autoplay: false,
        loop: false,
    });
    
    cardSelectedUp
    .add({
        targets: '#' + id,
        translateY: -40,
        duration: slideuptime,
    });

    cardSelectedUp.play();
}
/* Cards sliding down when selected again, or when selecting other cards animation */
var slidedowntime = 20;
var cardSelectedDown = anime.timeline({})
function cardDownAnimation(id) {

    cardSelectedDown = anime.timeline({
        easing: 'easeOutExpo',
        duration: slideuptime,
        autoplay: false,
    });
    
    cardSelectedDown
    .add({
        targets: '#' + id,
        translateY: 0,
        duration: slidedowntime,
    });
    cardSelectedDown.play();
}
/* Card slideout button onclick function which triggers multiple logic states */
document.querySelector('#card-slideout-button').onclick = function() {
    hideCardDetails();
    playCardAnimation();
    if (animationStateEnemy == 1) {
        playCardAnimationEnemy()
        animationStateEnemy = 0;
        hideCardDetailsEnemy();
    }
    if (animationState == 0) {
        animationState = 1;
    } else {
        animationState = 0;
    }
}
/* Gets triggered in the code above */
function playCardAnimation() {
    document.getElementById("card-slideout-button").disabled = true;
    if (cardSlideOut.began) {
        if (cardSlideOut.finished) {
            cardDownAnimation(previousCard);
            cardSlideOut.reverse();
            buttonSlideOut.reverse();
        }
    }
    cardSlideOut.play();
    buttonSlideOut.play();

    setTimeout(function() {
        document.getElementById("card-slideout-button").disabled = false;
    }, (animationDuration * 3))
   console.log(cardSlideOut); // began: true
}

// Gets details about a card and shows them
function showCardDetails(card_id, card_pressed) {
    var detailsContainer = document.getElementById("details-container");

    var url = "./php_scripts/match/get_card_details.php?id=" + card_id;

    fetch(url, {
        method : "GET",
        credentials : "same-origin"
    })

    .then(response => response.text())

    .then(response => {
        if (response == "error") {
            hideCardDetails();
            matchShowConfirm("Something went wrong.")
        } else {
            detailsContainer.style.display = "flex";
            detailsContainer.innerHTML = response;
        }
    })

    .then(() => {
        document.getElementById("card-details-button").name = card_pressed;
    })

    .catch(error => {
        console.error(error)
        hideCardDetails();
        matchShowConfirm("Something went wrong.")
    })
}

// Gets details about a card and shows them for the enemys side
function showCardDetailsEnemy(card_id) {
    var detailsContainer = document.getElementById("details-container-enemy");

    var url = "./php_scripts/match/get_card_details.php?id=" + card_id + "&enemy=1";

    fetch(url, {
        method : "GET",
        credentials : "same-origin"
    })

    .then(response => response.text())

    .then(response => {
        if (response == "error") {
            hideCardDetails();
            matchShowConfirm("Something went wrong.")
        } else {
            detailsContainer.style.display = "flex";
            detailsContainer.innerHTML = response;
        }
    })

    .catch(error => {
        console.error(error)
        hideCardDetails();
        matchShowConfirm("Something went wrong.")
    })
}

// Hides card details
function hideCardDetails() {
    var detailsContainer = document.getElementById("details-container");
    detailsContainer.style.display = "none";
    detailsContainer.innerHTML = "";
}

// Hides card details for enemy
function hideCardDetailsEnemy() {
    var detailsContainer = document.getElementById("details-container-enemy");
    detailsContainer.style.display = "none";
    detailsContainer.innerHTML = "";
}



// Opponent/Enemy card slideout animations

var cardSlideOutEnemy = anime.timeline({
    easing: 'easeInOutSine',
    duration: (animationDuration * 2),
    autoplay: false,
});
cardSlideOutEnemy
.add({
    targets: '#card-5-enemy',
    translateX: -720,
    duration: (animationDuration * 3),
})
.add({
    targets: '#card-4-enemy',
    translateX: -540,
    duration: (animationDuration * 3),
}, "-=50")
.add({
    targets: '#card-3-enemy',
    translateX: -360,
    duration: (animationDuration * 3),
}, "-=50")
.add({
    targets: '#card-2-enemy',
    translateX: -180,
    duration: (animationDuration * 3),
}, "-=50")


// Enemy/Opponent card button slideout animations
var buttonSlideOutEnemy = anime.timeline({
    easing: 'easeInOutElastic',
    duration: (animationDuration * 4),
    autoplay: false
})

buttonSlideOutEnemy.add({
    targets: '#card-slideout-button-enemy',
    translateX: 800,
    duration: (animationDuration * 3),
    rotate: "180deg"
})

// slide selected cards up on enemy/Opponent
var cardSelectedUpEnemy = anime.timeline({
    easing: 'easeOutExpo',
    duration: 100,
    autoplay: false,
});

cardSelectedUpEnemy
.add({
    targets: '.card-slideout-card-enemy',
    translateY: -20,
    duration: 100,
});


/* On click function for enemy button slideout animation */
document.querySelector('#card-slideout-button-enemy').onclick = function() {
    hideCardDetailsEnemy();
    playCardAnimationEnemy();
    /* Checks if player card hand is open, if so, close it */
    if (animationState == 1) {
        playCardAnimation();
        animationState = 0;
        hideCardDetails();
    }
    if (animationStateEnemy == 0) {
        animationStateEnemy = 1;
    } else {
        animationStateEnemy = 0;
    }
}
/* This gets triggered in the code above */
function playCardAnimationEnemy() {
    document.getElementById("card-slideout-button-enemy").disabled = true;
    if (cardSlideOutEnemy.began) {
        if (cardSlideOutEnemy.finished) {
            cardDownAnimation(previousCardEnemy)
            cardSlideOutEnemy.reverse();
            buttonSlideOutEnemy.reverse();
        }
    }
    cardSlideOutEnemy.play();
    buttonSlideOutEnemy.play();

    setTimeout(function() {
        document.getElementById("card-slideout-button-enemy").disabled = false;
    }, (animationDuration * 3))
   console.log(cardSlideOutEnemy); // began: true
}
/* Eventlistener for cards in hand enemy */
const enemycards = document.querySelectorAll('.card-slideout-card-wrapper-enemy');
enemycards.forEach(card => {
    card.addEventListener("click", function() {
        if (animationState == 1) {
            playCardAnimation()
            animationState = 0;
            hideCardDetails();
        }
        if (animationStateEnemy == 0) {
            playCardAnimationEnemy();
            animationStateEnemy = 1;
        }
        else {
            if (previousCardEnemy == this.id) {
                cardDownAnimation(previousCardEnemy)
                hideCardDetailsEnemy()
                previousCardEnemy = 0;
            } else {
                cardDownAnimation(previousCardEnemy)
                cardUpAnimation(this.id);
                previousCardEnemy = this.id;
                showCardDetailsEnemy(this.name);
            }
        }
    })
});

var actionJSON = {
    1:0,
    2:0,
    3:0,
    4:0,
    5:0
};
var cardBox = "";
var noOpenSpots = true;
// Function that adds card to action
function addToAction(card_id, card_pressed) {
    cardDownAnimation(card_pressed);
    noOpenSpots = true;

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
                        // Update background image
                        actionJSON[key] = card_id;
                        var cardBox = document.getElementById("action-card-" + key);
                        cardBox.style.backgroundImage = `url(./img/cards/${response.texture})`
                        cardBox.setAttribute("json_pos", key)
                        cardBox.setAttribute("card_id", card_id)
                        cardBox.addEventListener("click", function() {
                            removeFromAction(key);
                            cardBox.removeEventListener("click", null);
                        })
                        hideCardDetails();
                        break;
                    }
                }
            }
            if (noOpenSpots == true) {
                matchShowConfirm("You can only use 5 cards in an action.")
                hideCardDetails();
            }

            console.log(actionJSON)
        }
    })

    .catch(error => {
        console.error(error)
        matchShowConfirm("Something went wrong")
    })
}

// Function that removes card from action
function removeFromAction(id) {
    var cardBox = document.getElementById("action-card-" + id);
    cardBox.style.backgroundImage = "";
    actionJSON[id] = 0;
}
