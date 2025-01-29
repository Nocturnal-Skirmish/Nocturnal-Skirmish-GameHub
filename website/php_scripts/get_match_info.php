<?php
require "avoid_errors.php";
// Retrives info about current match
if (isset($_SESSION["match_name"])) {
    $conn -> select_db("nocskir_matches");
    $tablename = $_SESSION['match_name'];

    // Get last row in match table
    $stmt = $conn->prepare("SELECT * FROM $tablename ORDER BY round DESC LIMIT 1;");
    $stmt->execute();
    $result = $stmt->get_result();
    $row = $result->fetch_assoc();

    $_SESSION["current_round"] = $row["round"];
    $_SESSION["match_turn_user_id"] = $row["turn"];

    // Figure out if youre user id 1 or 2
    if ($row["user_id_1"] == $_SESSION["user_id"]) {
        $pos = "1";
        $oppos = "2";
    } else {
        $pos = "2";
        $oppos = "1";
    }

    // Get data
    $yourhealth = $row["health" . $pos];
    $yourbp = $row["bp" . $pos];
    $opponenthealth = $row["health" . $oppos];

    // Return JSON
    $response = array(
        "yourhealth" => $yourhealth,
        "yourbp" => $yourbp,
        "opponenthealth" => $opponenthealth
    );

    echo json_encode($response);
} else {
    exit;
}