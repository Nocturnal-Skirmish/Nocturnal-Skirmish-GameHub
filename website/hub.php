<?php
session_start();
$_SESSION['user_profile_picture'] = "";
$_SESSION['user_profile_border'] = "";
$user_id = "";

// Redirects user to login page if theyre not logged in
if (!isset($_SESSION['user_id'])) {
    header("Location: ./index.php");
} else {
    $user_id = $_SESSION['user_id'];
    require "./config/conn.php";
    require "./php_scripts/get_loggedin_info.php";
    require "./php_scripts/register_visit.php";
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>GameHub & Nocturnal Skirmish - Main Hub</title>
    <link rel="icon" type=".image/x-icon" href="./img/favicon.png">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
    <style> <?php include "./css/universal.css" ?> </style>
    <style> <?php include "./css/hub-page.css" ?> </style>
</head>
<body id="hub-body" onload="prepareSFX(); ajaxGet('./php_scripts/update_login_time.php', 'players-live-count', 'no_sfx'); isKicked(); ajaxGet('./php_scripts/update_messages_hub.php', 'dropdown-button-chats', 'no_sfx'); ajaxGet('./php_scripts/update_pending_hub.php', 'dropdown-button-friends', 'no_sfx');">

    <div id="dark-container" class="dark-container"></div>
    <div class="confirmation-popup" id="confirmContainer"></div>
    <div class="hub-spa-container" id="hub-spa-container">
    </div>
    <!--Mobile dropdown start-->
    <button id="hub-dropdown-button" class="hub-dropdown-button"></button>
    <div class="hub-dropdown-container" id="hub-dropdown-container">
        <h1>Navigate</h1>
        <button class="hub-dropdown-close" id="hub-dropdown-close"></button>
        <button class="hub-corner-profile-dropdown-button" id="dropdown-button-settings" title="Settings" onclick="window.location.href = 'user_settings.php';"></button>
            <div class="hub-corner-profile-dropdown-divider"></div>
            <button class="hub-corner-profile-dropdown-button" id="dropdown-button-friends" title="Friends" onclick="ajaxGet('./spa/hub/friends_list.php', 'hub-spa-container', 'friends_list'); displaySpaContainerHub('block');"></button>
            <div class="hub-corner-profile-dropdown-divider"></div>
            <button class="hub-corner-profile-dropdown-button" id="dropdown-button-chats" title="Chats" onclick="window.location.href = 'messages.php'"></button>
            <div class="hub-corner-profile-dropdown-divider"></div>
            <button class="hub-corner-profile-dropdown-button" id="dropdown-button-leaderboard" title="Leaderboard"></button>
            <div class="hub-corner-profile-dropdown-divider"></div>
            <button class="hub-corner-profile-dropdown-button" id="dropdown-button-q_and_a" title="QandA"></button>
    </div>
    <!--Mobile dropdown end-->
    <div class="slide-text">
        <h1 class="slide-text-h1">
            <span>
                Untitled-Game-Terminal-Project also known as Nocturnal Skirmish is not only jut a game but a game hub too. In this multipul A game you will face your worst fears and experiance action like you've never seen before. take your cards to battle in this emersive open world, 3D, mmo rpg, billion dollar game with not one A, not two A's, not three but four A's.
            </span>
        </h1>
    </div>
    <div class="hub-corner-profile-container">
        <div class="hub-corner-profilepic-container" id="hub-corner-profilepic-container">
            <a href="#" onclick="displayUserProfile(<?php echo $user_id ?>)">
                <div class="hub-corner-profilepic" style="background-image: url(<?php echo $_SESSION['user_profile_picture']; ?>);">
                    <img src="<?php echo $_SESSION['user_profile_border']; ?>" alt="Profile Border" class="hub-corner-profilepic-border">
                </div>
            </a>
        </div>
        <div class="hub-corner-profile-dropdown">
            <button class="hub-corner-profile-dropdown-button" id="dropdown-button-settings" title="Settings" onclick="window.location.href = 'user_settings.php';"></button>
            <div class="hub-corner-profile-dropdown-divider"></div>
            <button class="hub-corner-profile-dropdown-button" id="dropdown-button-friends" title="Friends" onclick="ajaxGet('./spa/hub/friends_list.php', 'hub-spa-container', 'friends_list'); displaySpaContainerHub('block');"></button>
            <div class="hub-corner-profile-dropdown-divider"></div>
            <button class="hub-corner-profile-dropdown-button" id="dropdown-button-chats" title="Chats" onclick="window.location.href = 'messages.php'"></button>
            <div class="hub-corner-profile-dropdown-divider"></div>
            <button class="hub-corner-profile-dropdown-button" id="dropdown-button-leaderboard" title="Leaderboard"></button>
            <div class="hub-corner-profile-dropdown-divider"></div>
            <button class="hub-corner-profile-dropdown-button" id="dropdown-button-q_and_a" title="QandA"></button>
        </div>
    </div>


<!-- HUB2-IMPORT -->
    <!-- Middle Menu -->
    <div class="main-menu-middle-ui-container">
        <div class="main-menu-middle-ui"
            style="display: flex; justify-content: center; flex-direction: column; align-items: center; gap: 20px;">
            <h1 class="title-text">GameHub</h1>
            <div class="menu-selection-buttons">
                <button onclick="window.location.href = 'nocturnal-skirmish.php'" class="play-button">Play <img style="width: 30%;" src="img/Noc_Skir_Logo.svg" alt="Logo"></button>
                <br>
                <button class="menu-button">Inventory</button>
                <button class="menu-button">Shop</button>
                <br>
                <button class="menu-button" onclick="ajaxGet('./spa/hub/tutorial_selection.php', 'dark-container')">Tutorial</button>
                <button class="menu-button" onclick="ajaxGet('./spa/hub/friends_list.php', 'hub-spa-container', 'friends_list'); displaySpaContainerHub('block');" id='menu-selection-friends'>Friends List</button>
            </div>
        </div>

        <!-- Patch Notes UI container -->
        <div class="patch-notes-box">
            <h2 class="patch-notes-title">Patch Notes</h2>
            <div class="patch-notes-content-grey">
                <div class="patch-note-list">
                    <div class="patch-note">
                        <h3 class="patch-note-title">Version 1.1.0</h3>
                        <ul class="patch-note-list-items">
                            <li>Added new cards</li>
                            <li>Updated shop items</li>
                        </ul>
                    </div>
                    <div class="patch-note">
                        <h3 class="patch-note-title">Version 1.0.0</h3>
                        <ul class="patch-note-list-items">
                            <li>Added new stuff</li>
                            <li>Updated shop items</li>
                            <li>Added leaderboard feature</li>
                        </ul>
                    </div>
                    <div class="patch-note">
                        <h3 class="patch-note-title">Version 0.9.8</h3>
                        <ul class="patch-note-list-items">
                            <li>Added new stuff</li>
                            <li>Updated shop items</li>
                            <li>Added new stuff</li>
                        </ul>
                    </div>
                    <div class="patch-note">
                        <h3 class="patch-note-title">Version 0.9.7</h3>
                        <ul class="patch-note-list-items">
                            <li>Added new stuff</li>
                            <li>Updated shop items</li>
                            <li>Added new stuff</li>
                        </ul>
                    </div>
                    <div class="patch-note">
                        <h3 class="patch-note-title">Version 0.9.6</h3>
                        <ul class="patch-note-list-items">
                            <li>Added new stuff</li>
                            <li>Updated shop items</li>
                            <li>Added new stuff</li>
                            <li>Added more set_file_buffer</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>   

    <!-- Footer container with trademark text and live player count -->
    <footer>
        <a class="report-errors-link" href="error_report.php">Report errors</a>
        <p class="footer-tm-text">GameHub 2024</p>
        <p class="player-live-count-text" id="players-live-count"></p>
    </footer>
    <!-- /HUB2-IMPORT -->

    <!-- Autolooping audio background music (works only if user allows it) -->
    <audio autoplay loop style="display: none;" id="musicAudio">
        <source src="./audio/music/BrowsingShopOST.mp3" type="audio/mpeg">
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
<script><?php include "./js/script.js" ?></script>
<script>
    //Tells the user to enable autoplay once
    audioprompt = localStorage.getItem("audio-prompt");
    if (audioprompt != 1) {
        alert("To enable music and sound effects the website needs autoplay permission.")
        localStorage.setItem("audio-prompt", 1)
    }

    // Sets default volumes if it is first time youre making a user.
    if(localStorage.getItem("volumeUi") === null) {
        localStorage.setItem("volumeUi", 1);
    }

    if(localStorage.getItem("volumeMusic") === null) {
        localStorage.setItem("volumeMusic", 1);
    }

    // Checks if user should be kicked
    function isKicked() {
        var placeholder = "placeholder";
        $.ajax({
            type: "POST",
            url: './php_scripts/kick.php',
            data:{ placeholder : placeholder }, 
            success: function(response){
                if (response == "kick") {
                    window.location.href = "index.php";
                }
            }
        })
    }

    // Starts 5 second interval to update players online counter, and to check if user should be kicked, and to update notifications
    setInterval(function(){
        ajaxGet('./php_scripts/update_login_time.php', 'players-live-count', 'no_sfx');
        isKicked()
        ajaxGet('./php_scripts/update_messages_hub.php', 'dropdown-button-chats', 'no_sfx');
        ajaxGet('./php_scripts/update_pending_hub.php', 'dropdown-button-friends', 'no_sfx');
    }, 5000);

    // If friend list should be open, open it.
    var friendListVar = localStorage.getItem("openFriendList");
    if (friendListVar == 1) {
        ajaxGet('./spa/hub/friends_list.php', 'hub-spa-container', 'friends_list');
        displaySpaContainerHub('block');
        localStorage.setItem("openFriendList", 0);
    }

    document.getElementById("hub-dropdown-button").addEventListener("click", function() {
        document.getElementById("hub-dropdown-container").style.display = "block";
    })

    document.getElementById("hub-dropdown-close").addEventListener("click", function() {
        document.getElementById("hub-dropdown-container").style.display = "none";
    })
</script>
</html>