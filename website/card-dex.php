<?php
require "./php_scripts/avoid_errors.php";
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nocturnal Skirmish - Card Dex</title>
    <link rel="icon" type=".image/x-icon" href="./img/favicon.png">
    <style> <?php include "./css/universal.css" ?> </style>
    <style> <?php include "./css/carddex.css" ?> </style>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
    <link href="https://fonts.googleapis.com/css2?family=Silkscreen:wght@400;700&display=swap" rel="stylesheet">
</head>
<body id="carddex-body" onload="prepareSFX(); ajaxGet('./php_scripts/update_login_time.php', 'hidden', 'no_sfx');">
    <div class="confirmation-popup" id="confirmContainer"></div>
    <div id="dark-container" class="dark-container"></div>
    <div id="hidden" style="display: none;"></div>
    <button class="back-button" onclick="window.location='nocturnal-skirmish.php'">
        Back
    </button>
    <div class="content">
        <h1 class="carddex-headline">Card dex</h1>
        <div class="card-grid">
            <?php include "./php_scripts/load_card_grid.php" ?>
        </div>
    </div>
</body>
<script><?php include "./js/script.js" ?></script>
<!-- Autolooping audio background music (works only if user allows it) -->
<audio autoplay loop style="display: none;" id="musicAudio">
    <source src="./audio/music/IntermissionOST.mp3" type="audio/mpeg">
</audio>
<!-- hover audio temp -->
<audio id='hoverSFX'>
        <source src="audio/sfx/hover.mp3" type="audio/mpeg">
    </audio>
    <!-- click sfx temp -->
    <audio id='clickSFX'>
        <source src="audio/sfx/click1.mp3" type="audio/mpeg">
    </audio>
</html>
<script>
    // Function that loads in modal of card and description
    function viewCard(card_id) {
        var url = "./spa/nocturnal-skirmish/viewcard.php?card=" + card_id

        ajaxGet(url, "dark-container");
    }
</script>