<?php
require "../avoid_errors.php";
// Attack opponent with card
if (isset($_SESSION["match_name"])) {
    require "get_all_match_info.php";
    // Check if its the users turn
    if ($user_id == $turn_uid) {
        $tablename = $_SESSION['match_name'];
        $json = json_decode(file_get_contents('php://input'), true);

        // Get posted card id
        $card_id = htmlspecialchars($json["card_id"]);

        // Check if card exists
        $conn -> select_db("gamehub");
        $stmt = $conn->prepare("SELECT * FROM cards WHERE card_id = ? LIMIT 1;");
        $stmt->bind_param("i", $card_id);
        $stmt->execute();
        $result = $stmt->get_result();
        if (mysqli_num_rows($result) > 0) {
            $row = $result->fetch_assoc();
            $card_damage = $row["damage"];
            $card_bp = $row["bp"];

            // Check if user has enough bp
            if ($your_bp < $card_bp) {
                echo json_encode(array("error" => "not_enough_bp"));
                exit;
            }

            // Calculate opponents new hp
            $newhp = $opponent_health - $card_damage;
            if ($newhp < 0) {
                $newhp = 0;
            }

            // Calculate your new bp
            $newbp = $your_bp - $card_bp;
            if ($newbp < 0) {
                $newbp = 0;
            }

            $opponent_health_column = "health" . $opponent_uid_pos;
            $your_bp_column = "bp" . $match_uid_pos;

            $conn -> select_db("nocskir_matches");

            // Update table
            $stmt = $conn->prepare("UPDATE $tablename SET $opponent_health_column = ?, $your_bp_column = ?  WHERE round = ?");
            $stmt->bind_param("iii", $newhp, $newbp, $current_round);
            $stmt->execute();
            $stmt->close();

            // Start new round
            $stmt = $conn->prepare("INSERT INTO $tablename (turn, user_action, upgrades1, upgrades2, health1, health2, armor1, armor2, bp1, bp2, connected1, connected2) SELECT turn, user_action, upgrades1, upgrades2, health1, health2, armor1, armor2, bp1, bp2, connected1, connected2 FROM $tablename WHERE round = ?;");
            $stmt->bind_param("i", $current_round);
            $stmt->execute();
            $stmt->close();

            $new_round = $current_round + 1;

            // Set new turn
            $stmt = $conn->prepare("UPDATE $tablename SET turn = ? WHERE round = ?;");
            $stmt->bind_param("ii", $opponent_uid, $new_round);
            $stmt->execute();
            $stmt->close();

            $_SESSION["current_round"] = $new_round;
            
            echo json_encode(array("ok" => 1));
            exit;
        } else {
            echo json_encode(array("error" => "not_in_deck"));
            exit;
        }
    } else {
        echo json_encode(array("error" => "not_your_turn"));
        exit;
    }
} else {
    exit;
}