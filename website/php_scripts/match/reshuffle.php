<?php
// Reshuffles your hand

require "../avoid_errors.php";
// Create a hand with 5 random cards from your deck
$conn -> select_db("gamehub");
$stmt = $conn->prepare("SELECT deck FROM users WHERE user_id = ? LIMIT 1");
$stmt->bind_param("i", $_SESSION['user_id']);
$stmt->execute();
$result = $stmt->get_result();
if ((mysqli_num_rows($result) > 0)) {
    // Convert deck to array
    $row = mysqli_fetch_assoc($result);
    $deck_array = str_getcsv($row["deck"],separator: ',', enclosure: '"', escape: "");

    // Choose five random values from array
    $hand_array = array_rand($deck_array, 5);
    shuffle($hand_array);
    $hand_csv = "";
    foreach ($hand_array as $index) {
        // Get the id
        $card_id = $deck_array[$index];
        // Convert back to csv
        $hand_csv = $hand_csv . "," . $card_id;
    }
    // Remove first ,
    $hand_csv = substr($hand_csv, 1);

    // Update column
    $conn -> select_db("nocskir_matches");
    $tablename = $_SESSION["match_name"];
    if ($_SESSION["match_uid_pos"] == 1) {
        $hand = "hand1";
    } else {
        $hand = "hand2";
    }

    $stmt = $conn->prepare("UPDATE $tablename SET $hand = ? WHERE round = ?");
    $stmt->bind_param("si", $hand_csv, $_SESSION["current_round"]);
    $stmt->execute();
    $stmt->close();
} else {
    echo "error";
    exit;
}