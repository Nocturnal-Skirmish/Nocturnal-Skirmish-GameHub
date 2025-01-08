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