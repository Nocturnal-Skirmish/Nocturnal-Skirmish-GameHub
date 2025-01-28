<?php
    require "./php_scripts/avoid_errors.php";
    $tablename = $_SESSION['match_name'];
    $stmt = $conn->prepare("SELECT * FROM information_schema.tables WHERE table_schema = 'nocskir_matches' AND table_name = '$tablename' LIMIT 1;");
    $stmt->execute();
    $result = $stmt->get_result();
    if ((mysqli_num_rows($result) === 0)) {
        // Match doesnt exist
        header("Location: ./nocturnal-skirmish.php?matchmaking=cancelled");
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
    <title>Document</title>
    <style>
        <?php include "./css/match.css" ?>
    </style>
    <style> <?php include "./css/universal.css" ?> </style>
</head>
<body onload="prepareSFX();">
    <?php include "./php_scripts/vs_popup.php" ?>
    <button onclick="leaveMatch()">Leave</button>

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
    // Interval to verify that youre online, check if the other user is online and if other user left
    setInterval(function() {
        $.get("./php_scripts/verify_online_match.php", function(response){
            switch(response) {
                case "left":
                    window.location = "nocturnal-skirmish.php?matchmaking=left"
            }
        })
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

    document.addEventListener("DOMContentLoaded", function() {
        console.log("%c <?php echo $console_log ?>", "color:green; font-size:30px;")
    })
</script>
</html>