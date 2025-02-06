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
        document.getElementById("card-slideout-1").name = response.yourhand1id
        document.getElementById("card-slideout-2").name = response.yourhand2id
        document.getElementById("card-slideout-3").name = response.yourhand3id
        document.getElementById("card-slideout-4").name = response.yourhand4id
        document.getElementById("card-slideout-5").name = response.yourhand5id

        // Get rarity for your hand
        var style = document.getElementById("card-slideout-style")
        style.innerHTML = "";
        style.innerHTML = style.innerHTML + response.yourhandrarity

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



// animations playground

var animationDuration = 50;

var cardSlideOut = anime.timeline({
    easing: 'easeInOutElastic',
    duration: (animationDuration * 2),
    autoplay: false,
});
cardSlideOut
.add({
    targets: '#card-slideout-5',
    translateX: 720,
    duration: (animationDuration * 4),
})
.add({
    targets: '#card-slideout-4',
    translateX: 540,
    duration: (animationDuration * 4),
})
.add({
    targets: '#card-slideout-3',
    translateX: 360,
    duration: (animationDuration * 4),
})
.add({
    targets: '#card-slideout-2',
    translateX: 180,
    duration: (animationDuration * 4),
})




var buttonSlideOut = anime.timeline({
    easing: 'easeInOutElastic',
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

var animationState = 0;
var previousCard = "";

const cards = document.querySelectorAll('.card-slideout-card');
cards.forEach(card => {
    card.addEventListener("click", function() {
        if (animationState == 0) {
            playCardAnimation();
            animationState = 1;
        }
        else {
            if (previousCard == this.id) {
                cardUpAnimation(previousCard, 1)
                hideCardDetails()
            } else {
                cardUpAnimation(previousCard, 1)
                cardUpAnimation(this.id);
                previousCard = this.id;
                showCardDetails(this.name);
            }
        }
    })
});

var slideuptime = 50;
var cardSelectedUp = anime.timeline({})
function cardUpAnimation(id, reverse) {
    cardSelectedUp.restart();
    cardSelectedUp = anime.timeline({
        easing: 'easeOutExpo',
        duration: slideuptime,
        autoplay: false,
    });
    
    cardSelectedUp
    .add({
        targets: '#' + id,
        translateY: -40,
        duration: slideuptime,
    });

    if (reverse == 1) {
        cardSelectedUp.reverse();
    }

    cardSelectedUp.play();
}

document.querySelector('#card-slideout-button').onclick = function() {
    hideCardDetails();
    playCardAnimation()
    if (animationState == 0) {
        animationState = 1;
    } else {
        animationState = 0;
    }
}

function playCardAnimation() {
    document.getElementById("card-slideout-button").disabled = true;
    if (cardSlideOut.began) {
        if (cardSlideOut.finished) {
            cardUpAnimation(previousCard, 1)
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
function showCardDetails(card_id) {
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





