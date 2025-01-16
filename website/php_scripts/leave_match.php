<?php
// Leaves the current match
require "avoid_errors.php";
if (!isset($_SESSION['match_name'])) {
    header("Location: ./nocturnal-skirmish.php");
} else {
    // Update connection column
    if ($_SESSION['match_uid_pos'] == 1) {
        $connection = "connected1";
    } else {
        $connection = "connected2";
    }
    $conn -> select_db("nocskir_matches");
    $tablename = $_SESSION["match_name"];
    $stmt = $conn->prepare("UPDATE $tablename SET $connection = 0");
    $stmt->execute();
    $stmt->close();

    echo "ok";
}