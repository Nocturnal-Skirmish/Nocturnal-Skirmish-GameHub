<?php
session_start();
if (!isset($_SESSION['matchmaking_id'])) {
    header("Location: ./nocturnal-skirmish.php");
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nocturnal Skirmish - Matchmaking</title>
    <link rel="icon" type=".image/x-icon" href="./img/favicon.png">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
    <link href="https://fonts.googleapis.com/css2?family=Silkscreen:wght@400;700&display=swap" rel="stylesheet">
    <style><?php require "./css/matchmaking.css" ?></style>
    <style><?php require "./css/universal.css" ?></style>
</head>
<body>
    
<div class="perspective-container">
    <div class="perspective">
        <div class="box">
            <div class="face back"></div>
            <div class="face front"></div>
        </div>
    </div>
</div>
<div class="matchmaking-text-container">
    <h1 id="finding-match">Finding match</h1>
    <p id="elapsed-time">Elapsed time: 1 second.</p>
</div>
<button class="cancel-matchmaking" title="Cancel matchmaking" onclick="cancelMatchmaking()">Cancel</button>
<audio src="./audio/music/IntermissionOST.mp3" autoplay style="display: none;" loop></audio>
</body>
<script>
    // Finding match...
    var matchmakingText = document.getElementById("finding-match")
    var original = matchmakingText.innerHTML;
    var dots = "";
    var dotscounter = 0;
    var matchmakingAnimation = setInterval(function(){
        dots = dots + ".";
        dotscounter++
        matchmakingText.innerHTML = original + dots
        if (dotscounter == 4) {
            dots = "";
            dotscounter = 0;
            matchmakingText.innerHTML = original;
        }
    }, 500)

    // Elapsed time: .... seconds
    var matchmakingElapsedText = document.getElementById("elapsed-time")
    var seconds = 1
    var minutes = 0
    var matchmakingTime = setInterval(function() {
        seconds++
        if (minutes > 0) {
            if (minutes == 1) {
                matchmakingElapsedText.innerHTML = "Elapsed time: " + minutes + " minute and " + seconds + " seconds."
            } else {
                matchmakingElapsedText.innerHTML = "Elapsed time: " + minutes + " minutes and " + seconds + " seconds."
            }
        } else {
            matchmakingElapsedText.innerHTML = "Elapsed time: " + seconds + " seconds."
        }
        if (seconds == 59) {
            minutes++
            seconds = 0
        }
    }, 1000)
</script>
<script>
    <?php include "./js/nocskir.js" ?>
</script>
</html>