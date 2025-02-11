// JavaScript file for card animations

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
