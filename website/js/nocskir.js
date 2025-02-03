// JavaScript file for nocturnal skirmish game

// Function for selecting gamemode
function selectGamemode(gamemode) {
    $.ajax({
        type: "POST",
        url: './php_scripts/select_gamemode.php',
        data:{
            gamemode : gamemode
        }, 
        success: function(response){
            if (response == "error") {
                showConfirm("Something went wrong")
            } else {
                window.location = "matchmaking.php";
            }
        },
        error: function() {
            showConfirm("Something went wrong.")
        }
    })
}

// Cancels current matchmaking
function cancelMatchmaking() {
    $.get("./php_scripts/cancel_matchmaking.php", function(){
        window.location = "nocturnal-skirmish.php"
    });
}

// Checks if theres a user has joined your matchmaking row
function checkMatchmaking() {
    $.get("./php_scripts/check_create_match.php", function(response){
        if (response == "found") {
            // If a match was found
            clearInterval(matchmakingTime)
            clearInterval(matchmakingAnimation)
            document.getElementById("cancel-matchmaking").style.display = "none"
            document.getElementById("elapsed-time").style.display = "none"
            var matchmakingText = document.getElementById("finding-match")
            matchmakingText.innerHTML = "Match found! Redirecting..."
            setTimeout(function(){
                window.location = "match.php"
            }, 2000)
        } else if (response == "error") {
            // If something went wrong
            /*
            $.get("./php_scripts/cancel_matchmaking.php")
            window.location = "nocturnal-skirmish.php?matchmaking=error"
            */
        }
    })
    .fail(function() {
        /*
        $.get("./php_scripts/cancel_matchmaking.php")
        window.location = "nocturnal-skirmish.php?matchmaking=error"
        */
    })
}