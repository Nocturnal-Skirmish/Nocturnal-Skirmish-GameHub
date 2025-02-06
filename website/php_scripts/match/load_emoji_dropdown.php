<?php
// Loads a dropdown of emojis
if (isset($_SESSION["match_name"])) {
    // Get all emojis
    $files = scandir('./img/emojis');
    foreach($files as $file) {
        if (is_file("./img/emojis/$file")) {
            printf("<button class='emoji-send-button' style='background-image: url(./img/emojis/$file)' onclick='sendEmoji(%s)'></button>", '"' . $file . '"');
        }
    }
} else {
    header("Location: ../../index.php");
    exit;
}