<?php
// Sends an emoji to opponent
require "../avoid_errors.php";
if (isset($_SESSION["match_name"]) && $_SERVER['REQUEST_METHOD'] == "POST") {
    // Get json
    $json = json_decode(file_get_contents('php://input'), true);
    $emoji = htmlspecialchars($json["emoji"]);
    $tablename = $_SESSION['match_name'];

    // See if emoji is valid
    $valid_path = "../../img/emojis/$emoji";
    if (!is_file($valid_path)) {
        echo json_encode(array("error" => "invalid"));
        exit;
    }

    // Set path
    $emoji_path = "./img/emojis/" . $emoji;

    // Update emoji column
    $oppos = $_SESSION['opponent_uid_pos'];
    $emoji_col = "emoji" . $oppos;
    $round = $_SESSION['current_round'];
    $conn -> select_db("nocskir_matches");
    $stmt = $conn->prepare("UPDATE $tablename SET $emoji_col = ? WHERE round = ?");
    $stmt->bind_param("si", $emoji_path, $round);
    $stmt->execute();
    $stmt->close();

    // Return ok
    echo json_encode(array(
        "ok" => 1,
        "emojipath" => $emoji_path
    ));
} else {
    header("Location: ../../index.php");
    exit;
}