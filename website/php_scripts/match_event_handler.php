<?php
// Handles events during match
require "avoid_errors.php";
if($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_SESSION['match_name'])) {
    // Define json return
    $json_return = array(
        "error" => 0,
        "echo" => 0,
        "ok" => 0
    );

    $json = json_decode(file_get_contents('php://input'), true);
    if (!$json) {
        $json_return['error'] = "error";
        goto end;
    }

    // Get relevant match data
    $user_id_1 = $_SESSION["match_user_id_1"];
    $user_id_2 = $_SESSION["match_user_id_2"];
    $turn_uid = $_SESSION["match_turn_user_id"];
    $user_id = $_SESSION["user_id"];
    $tablename = $_SESSION['match_name'];
    $match_uid_pos = $_SESSION['match_uid_pos'];
    $opponent_uid_pos = $_SESSION['opponent_uid_pos'];
    $current_round = $_SESSION['current_round'];

    // Figure out which uid is opponent
    if ($user_id_1 == $user_id) {
        $opponent_user_id = $user_id_2;
    } else {
        $opponent_user_id = $user_id_1;
    }

    // Get match data from database
    $conn -> select_db("nocskir_matches");
    $stmt = $conn->prepare("SELECT * FROM $tablename ORDER BY round DESC LIMIT 1");
    $stmt->execute();
    $result = $stmt->get_result();
    $row = $result->fetch_assoc();

    // HP
    $your_hp = $row["health" . $match_uid_pos];
    $opponent_hp = $row["health" . $opponent_uid_pos];

    // BP
    $your_bp = $row["bp" . $match_uid_pos];
    $opponent_bp = $row["bp" . $opponent_uid_pos];

    // Upgrades
    $your_upgrades = $row["upgrades" . $match_uid_pos];
    $opponent_upgrades = $row["upgrades" . $match_uid_pos];

    // Armor
    $your_armor = $row["armor" . $match_uid_pos];
    $opponent_armor = $row["armor" . $opponent_uid_pos];

    if (isset($json['turn'])) {
        // If turn is set, end turn
        $stmt = $conn->prepare("UPDATE $tablename SET turn = ? WHERE round = ?");
        $stmt->bind_param("ii", $opponent_user_id, $current_round);
        $stmt->execute();
        $stmt->close();
        $json_return['ok'] = 1;
        goto end;
    }

    // Check if its the users turn
    if ($turn_uid == $user_id) {
        // If attack is set, do it
        if (isset($json['attack'])) {
            $damage =  htmlspecialchars($json['attack']);
            $new_hp = $opponent_hp - $damage;
            if ($new_hp < 0) {
                $new_hp = 0;
            }
            $hp = "health" . $opponent_uid_pos;
            $stmt = $conn->prepare("UPDATE $tablename SET $hp = ? WHERE round = ?");
            $stmt->bind_param("ii", $new_hp, $current_round);
            $stmt->execute();
            $stmt->close();
        }
        $json_return['ok'] = 1;
    } else {
        $json_return['error'] = "not_your_turn";
    }

    end:

    echo json_encode($json_return);
} else {
    header("Location: ../index.php");
    exit;
}