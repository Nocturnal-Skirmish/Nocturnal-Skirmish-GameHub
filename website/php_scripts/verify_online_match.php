<?php
// Verifies that youre online, if the other user left or is offline in a match
require "avoid_errors.php";
if (!isset($_SESSION['match_name'])) {
    header("Location: ./nocturnal-skirmish.php");
} else {
    // Function that runs if player left
    function playerLeft() {
        require "avoid_errors.php";
        // Delete matchmaking row and match table
        $conn -> select_db("nocskir");
        $stmt = $conn->prepare("DELETE FROM matchmaking WHERE id = ?");
        $stmt->bind_param("i", $_SESSION['matchmaking_id']);
        $stmt->execute();
        $stmt->close();

        $conn -> select_db("nocskir_matches");
        $tablename = $_SESSION['match_name'];
        $stmt = $conn->prepare("DROP TABLE $tablename");
        $stmt->execute();
        $stmt->close();

        // redirect
        echo "left";
        exit;
    }

    // Update login_time row
    $conn -> select_db("gamehub");
    $updateLastLogin = time() + 10;
    $stmt = $conn->prepare("UPDATE users SET last_login = ? WHERE user_id = ?");
    $stmt->bind_param("ii", $updateLastLogin, $_SESSION["user_id"]);
    $stmt->execute();
    $stmt->close();

    // Check if anyone left the match
    $conn -> select_db("nocskir_matches");
    $tablename = $_SESSION['match_name'];
    $stmt = $conn->prepare("SELECT * FROM $tablename WHERE connected1 = 0 OR connected2 = 0 ORDER BY round DESC LIMIT 1");
    $stmt->execute();
    $result = $stmt->get_result();
    if ((mysqli_num_rows($result) > 0)) {
        // Someone left
        $stmt->close();
        playerLeft();
    }
    $stmt->close();

    // Check if other user is offline
    if ($_SESSION["match_user_id_1"] == $_SESSION["user_id"]) {
        $user_id_query = $_SESSION["match_user_id_2"];
    } else {
        $user_id_query = $_SESSION["match_user_id_1"];
    }
    $conn -> select_db("gamehub");
    $unix_timestamp = time();
    $stmt = $conn->prepare("SELECT * FROM users WHERE user_id = ? AND last_login > $unix_timestamp");
    $stmt->bind_param("i", $user_id_query);
    $stmt->execute();
    $result = $stmt->get_result();
    if ((mysqli_num_rows($result) === 0)) {
        // User is offline
        $stmt->close();
        playerLeft();
    }
    $stmt->close();
}