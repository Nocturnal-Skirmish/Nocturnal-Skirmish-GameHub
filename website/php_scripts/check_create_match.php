<?php
// Checks if another user is in your matchmaking row and creates a match table if they are.
require "avoid_errors.php";

if (isset($_SESSION['matchmaking_id'])) {
    // Check if user_id_2 column has a user
    $conn -> select_db("nocskir");
    $stmt = $conn->prepare("SELECT * FROM matchmaking WHERE id = ? AND user_id_2 > 0");
    $stmt->bind_param("i", $_SESSION['matchmaking_id']);
    $stmt->execute();
    $result = $stmt->get_result();
    if ((mysqli_num_rows($result) > 0)) {
        $row = mysqli_fetch_assoc($result);
        // user_id_2 column has a user, create match table

        // Check if the user is a real user
        $conn -> select_db("gamehub");
        $stmt = $conn->prepare("SELECT * FROM users WHERE user_id = ?");
        $stmt->bind_param("i", $row['user_id_2']);
        $stmt->execute();
        $result = $stmt->get_result();
        if ($result->num_rows === 0){
            // User doesnt exist
            echo "error";
            exit;
        }
        $stmt->close();
        $conn -> select_db("nocskir");

        // Check if a match table has already been created

        // If it hasnt, create one.
        echo "found";
    }
} else {
    header("Location: ../nocturnal-skirmish.php");
}