<?php
    require "./php_scripts/avoid_errors.php";
    $tablename = $_SESSION['match_name'];
    $stmt = $conn->prepare("SELECT * FROM information_schema.tables WHERE table_schema = 'nocskir_matches' AND table_name = '$tablename' LIMIT 1;");
    $stmt->execute();
    $result = $stmt->get_result();
    if ((mysqli_num_rows($result) === 0)) {
        // Match doesnt exist
        header("Location: ./nocturnal-skirmish.php?matchmaking=cancelled");
        exit;
    } else {
        // Match exists, get info
        $conn -> select_db("nocskir_matches");
        $stmt = $conn->prepare("SELECT * FROM $tablename WHERE round = 1 LIMIT 1");
        $stmt->execute();
        $result = $stmt->get_result();
        $row = $result->fetch_assoc();
        $console_log = "Table name = $tablename | User id 1 = " . $row["user_id_1"] . " | You are user id " . $_SESSION['match_uid_pos'] . " | User id 2 = " . $row["user_id_2"] . " | Gamemode = " . $row["gamemode"] . " | Turn user id = " . $row["turn"] . " | Rank: " . $row["user_rank"];

        // Set some session variables
        $_SESSION["match_user_id_1"] = $row["user_id_1"];
        $_SESSION["match_user_id_2"] = $row["user_id_2"];
        $_SESSION["match_turn_user_id"] = $row["turn"];
        $_SESSION["current_round"] = $row["round"];

        // Get opponents nickname
        if ($row["user_id_1"] == $_SESSION["user_id"]) {
            $opponent_uid = $row["user_id_2"];
        } else {
            $opponent_uid = $row["user_id_1"];
        }

        $conn -> select_db("gamehub");
        $stmt = $conn->prepare("SELECT * FROM users WHERE user_id = ? LIMIT 1");
        $stmt -> bind_param("i", $opponent_uid);
        $stmt->execute();
        $result = $stmt->get_result();
        $row = $result->fetch_assoc();
        $opponent_nickname = $row["nickname"];

        echo "<script>
            document.addEventListener('DOMContentLoaded', function() {
            console.log('%c $console_log', 'color:green; font-size:30px;')
        })</script>";
    }

    // Randomly selects a song out of 4 to play as background music
    $music_chance = rand(1,4);
    switch($music_chance) {
        case 1:
            $musicsource = "MontebelloOST.wav";
            break;
        case 2:
            $musicsource = "MatchOST.mp3";
            break;
        case 3:
            $musicsource = "NocskirHouseOST.mp3";
            break;
        case 4:
            $musicsource = "ColumbusOST.mp3";
            break;
    }
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
    <script src="./lib/anime-master/lib/anime.min.js"></script>
    <link rel="icon" type=".image/x-icon" href="./img/favicon.png">
    <title>Match - Duelling <?php if (isset($opponent_nickname)) {echo $opponent_nickname;}?></title>
    <link href="https://fonts.googleapis.com/css2?family=Silkscreen:wght@400;700&display=swap" rel="stylesheet">
    <style>
        <?php include "./css/match.css" ?>
    </style>
    <style>
        <?php include "./css/universal.css" ?>
    </style>
    <style id="card-slideout-style"></style>
</head>
<body id="match-body" onload="prepareSFX(); retrieveMatchInfo();">
    <div class="gradient-overlay"></div>
    <?php include "./php_scripts/vs_popup.php" ?>
    <div id="matchShowConfirmContainer">
        <div id="matchShowConfirm">
            It is not your turn yet.
        </div>
    </div>
    <div id="matchShowEmoji">
        <img id="emoji_img">
    </div>
    <div class="match-container">
        <div class="healthbar-container">
            <div class="healthbar" id="your-healthbar">
                <div class="healthbar-width-meter" id="your-health-meter">
                    <p id="your-health"></p>
                </div>
            </div>
            <div class="clock">
                <p id="clock-timer">00:35</p>
            </div>
            <div class="healthbar" id="opponent-healthbar">
                <div class="healthbar-width-meter" id="opponent-health-meter">
                    <p id="opponent-health"></p>
                </div>
            </div>
        </div>
        <div class="bp-container">
            <p id="your-bp">BP: 10</p>
            <div class="effect-icon" onmouseover="showEffectDetails('armour')" onmouseout="hideEffectDetails()"></div>
            <div class="effect-icon" onmouseover="showEffectDetails('regen')" onmouseout="hideEffectDetails()"></div>
            <div class="effect-icon" onmouseover="showEffectDetails('damageboost')" onmouseout="hideEffectDetails()"></div>
            <div class="effect-icon" onmouseover="showEffectDetails('overhealth')" onmouseout="hideEffectDetails()"></div>

            <!-- Hidden by default -->
            <div class="effect-details-container"></div>
        </div>
        <div class="emoji-dropdown-container">
            <div class="emoji-icon">
                <img src="./img/emojis/confused.png">
            </div>
            <div class="emoji-dropdown-menu" id="emoji-dropdown">
                <button class="emoji-send-button" id="temp" onclick="sendEmoji('temp.webp')"></button>
                <button class="emoji-send-button" id="confused" onclick="sendEmoji('confused.png')"></button>
                <button class="emoji-send-button" id="happythumbs" onclick="sendEmoji('happythumbs.jpg')"></button>
                <button class="emoji-send-button" id="confused" onclick="sendEmoji('happythumbs2.jpg')"></button>
                <button class="emoji-send-button" id="confused" onclick="sendEmoji('deviousblue.png')"></button>

                <button class="emoji-send-button" id="confused" onclick="sendEmoji('girl1scary.png')"></button>
                <button class="emoji-send-button" id="confused" onclick="sendEmoji('adultjoke.png')"></button>
                <button class="emoji-send-button" id="confused" onclick="sendEmoji('girl2scary.jpg')"></button>
                <button class="emoji-send-button" id="confused" onclick="sendEmoji('agony.webp')"></button>
                <button class="emoji-send-button" id="confused" onclick="sendEmoji('familynormal.jpg')"></button>

                <button class="emoji-send-button" id="confused" onclick="sendEmoji('familyreverse.png')"></button>
                <button class="emoji-send-button" id="confused" onclick="sendEmoji('superpinkysmile.webp')"></button>
                <button class="emoji-send-button" id="confused" onclick="sendEmoji('partyy.png')"></button>
                <button class="emoji-send-button" id="confused" onclick="sendEmoji('salutedrunk.jpg')"></button>
            </div>
            <button class="emoji-dropdown-button" title="Show emojis" id="emoji-dropdown-button">
                <img id="emoji-arrow" src="./img/icons/arrow.svg">
            </button>
        </div>
        <div class="round-turn-container">
            <div id="round">Round 1</div>
            <div id="turn">Turn</div>
        </div>
        <div class="card-slideout-container" id="card-slideout-container">
            <img class="card-slideout-card" id="card-slideout-1" src="./img/cards/FrostBlade_Card.webp" alt="">
            <img class="card-slideout-card" id="card-slideout-2" src="./img/cards/BlackCat_Card_tailwag.webp" alt="">
            <img class="card-slideout-card" id="card-slideout-3" src="./img/cards/Poison_Frog_card.webp" alt="">
            <img class="card-slideout-card" id="card-slideout-4" src="./img/cards/Buddha_Card.webp" alt="">
            <img class="card-slideout-card" id="card-slideout-5" src="./img/cards/PoisonArrow_Card.webp" alt="">
            <button class="card-slideout-button" id="card-slideout-button" title="Show hand"></button>
        </div>
    </div>

    <!-- Autolooping audio background music (works only if user allows it) -->
    <audio autoplay loop style="display: none;" id="musicAudio">
        <source src="./audio/music/<?php echo $musicsource ?>" type="audio/mpeg">
    </audio>

    <!-- hover audio temp -->
    <audio id='hoverSFX'>
        <source src="audio/sfx/hover.mp3" type="audio/mpeg">
    </audio>
    <!-- click sfx temp -->
    <audio id='clickSFX'>
        <source src="audio/sfx/click1.mp3" type="audio/mpeg">
    </audio>
</body>
<script>
    <?php include "./js/script.js" ?>
</script>
<script>
    <?php include "./js/match.js" ?>
</script>
</html>