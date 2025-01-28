<?php
// Loads a grid of cards that are stored in database
require "avoid_errors.php";

// Get all cards
$stmt = $conn->prepare("SELECT * FROM cards ORDER BY bp");
$stmt->execute();
$result = $stmt->get_result();
if ((mysqli_num_rows($result) <= 0)) {
    echo "<p class='no-cards-found'>No cards found...</p>";
} else {
    while ($row = $result->fetch_assoc()) {
        // For each card
        $name = $row["card_name"];
        $id = $row["card_id"];
        $texture = $row["texture"];
        echo "<img onclick='viewCard($id)' class='card' title='See details' src='./img/cards/$texture' alt='$name'>";
    }
}
$stmt->close();
