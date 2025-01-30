<?php
// A PHP file that can be used with require that gets all match info
require "../avoid_errors.php";
if (isset($_SESSION["match_name"])) {
    // Get all values for current round
    $conn -> select_db("nocskir_matches");
    $tablename = $_SESSION['match_name'];

    // Get last row in match table
    $stmt = $conn->prepare("SELECT * FROM $tablename ORDER BY round DESC LIMIT 1;");
    $stmt->execute();
    $result = $stmt->get_result();
    $row = $result->fetch_assoc();

    // Get relevant match data
    $user_id_1 = $_SESSION["match_user_id_1"];
    $user_id_2 = $_SESSION["match_user_id_2"];
    $turn_uid = $_SESSION["match_turn_user_id"];
    $user_id = $_SESSION["user_id"];
    $match_uid_pos = $_SESSION['match_uid_pos'];
    $opponent_uid_pos = $_SESSION['opponent_uid_pos'];
    $current_round = $_SESSION['current_round'];

    // Get opponent user id
    if ($user_id == $user_id_1) {
        $opponent_uid = $user_id_2;
        $_SESSION["opponent_uid"] = $user_id_2;
    } else {
        $opponent_uid = $user_id_1;
        $_SESSION["opponent_uid"] = $user_id_1;
    }

    // Get users data
    $your_health = $row["health" . $match_uid_pos];
    $your_bp = $row["bp" . $match_uid_pos];

    // Get opponents data
    $opponent_health = $row["health" . $opponent_uid_pos];
} else {
    exit;
}
