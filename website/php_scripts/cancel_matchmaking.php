<?php
// Cancels current matchmaking
require "avoid_errors.php";

if (isset($_SESSION['matchmaking_id'])) {
    // Deleted current matchmaking row
    $conn -> select_db("nocskir");
    $stmt = $conn->prepare("DELETE FROM matchmaking WHERE id = ?");
    $stmt->bind_param("i", $_SESSION['matchmaking_id']);
    $stmt->execute();
    $stmt->close();
    $conn -> select_db("gamehub");

    // Unset session variables attached to matchmaking
    unset($_SESSION['matchmaking_id']);
    unset($_SESSION['match_name']);
} else {
    header("Location: ./nocturnal-skirmish.php");
}