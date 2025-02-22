<?php
// Dashboard for admins
session_start();

// If user is unauthorized, redirect them
if (!isset($_SESSION['isadmin']) || $_SESSION['isadmin'] != 1) {
    header("Location: admin_login.php?error=unauth");
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>GameHub & Nocturnal Skirmish - Admin Center</title>
    <link rel="icon" type=".image/x-icon" href="../img/favicon.png">
    <style> <?php include "../css/universal.css" ?> </style>
    <style> <?php include "./css/dashboard.css" ?> </style>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
</head>
<body onload="ajaxGet('./scripts/load_online_count.php', 'dashboard-player-online'); errorReportsSearch('')">
    <?php
    if (isset($_GET['userdeleted'])) {
        echo "<div id='message-container'>User deleted. uID: " . $_GET['userdeleted'] . ". Cleanup recommended.</div>";
    } else if (isset($_GET['userbanned'])) {
        echo "<div id='message-container'>User banned. uID: " . $_GET['userbanned'] . ". Go into user profile to see changes.</div>";
    }
    ?>
    <div id="dark-container" class="dark-container"></div>
    <header>
        <h1>GameHub Admin Center</h1>
        <div class="header-button-container">
            <form action="./scripts/header-button-handler.php" method="POST">
                <button name="phpmyadmin">phpMyAdmin</button>
                <button name="cleanup">Perform cleanup</button>
                <button name="logout">Log out.</button>
                <button name="testing">Testing page</button>
                <button name="server_settings">Server settings</button>
            </form>
            <?php include "./goofy/scripts/link.php" ?>
        </div>
    </header>
    <div class="content">
        <form action="display_profile.php" method="POST" id="display-profile-form"></form>
        <div class="scroll-container">
            <div class="error-reports-container">
                <h1 class="error-reports-container-h1">Error reports</h1>
                <input type="text" placeholder="Search by category, ip, user id or date" id="user-search-input" onkeyup="errorReportsSearch(this.value)">
                <div class="error-reports-table-container">
                    <table>
                        <tbody id="error-reports-tbody">
                        </tbody>
                    </table>
                </div>
            </div>
            <div class="dashboard-chat-list">
                <h1 class="dashboard-chat-list-h1">Chat List</h1>
                <input type="text" placeholder="Search by username, nickname, groupchat name, user id or tablename" id="user-search-input" onkeyup="adminChatSearch(this.value)">
                <div class="dashboard-chat-table-container">
                    <table>
                        <tbody id="dashboard-chat-table">
                            <?php include "./scripts/load_chat_list.php" ?>
                        </tbody>
                    </table>
                </div>
            </div>
            <div class="visits-container">
                <h1>Visits since 5.12.2024 (hub.php)</h1>
                <input type="text" placeholder="Date" id="user-search-input" onkeyup="adminVisitSearch(this.value)">
                <div class="visits-table-container">
                    <table id="visits-table">
                        <?php include "./scripts/load_visits.php" ?>
                    </table>
                </div>
                <p id="dashboard-player-online"></p>
            </div>
            <div class="user-search-container">
                <h1 class="user-search-headline">User search:</h1>
                <input type="text" placeholder="User ID, Username or Nickname" id="user-search-input" onkeyup="adminUserSearch(this.value)">
                <div class="user-search-results" id="user-search-results">
                    Start searching...
                </div>
            </div>
        </div>
    </div>
</body>
<script><?php include "./js/display_profile.js" ?></script>
<script><?php include "./js/dashboard.js" ?></script>
</body>
</html>