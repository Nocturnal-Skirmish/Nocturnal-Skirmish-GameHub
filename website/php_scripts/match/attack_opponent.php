<?php
require "../avoid_errors.php";
// Attack opponent with card
if (isset($_SESSION["match_name"])) {
    require "get_all_match_info.php";
    // Check if its the users turn
    if ($user_id == $turn_uid) {
        $tablename = $_SESSION['match_name'];
        $action_damage = 0;
        $action_bp = 0;

        // Get the posted cards
        $json = json_decode(file_get_contents('php://input'), true);

        // Foreach card in action
        foreach ($json as $key) {
            $card_id = htmlspecialchars($key);
            if ($card_id != 0) {
                // Check if card exists
                $conn -> select_db("gamehub");
                $stmt = $conn->prepare("SELECT * FROM cards WHERE card_id = ? LIMIT 1;");
                $stmt->bind_param("i", $card_id);
                $stmt->execute();
                $result = $stmt->get_result();
                if (mysqli_num_rows($result) === 0) {
                    echo json_encode(array("error" => "not_in_deck"));
                    exit;
                }

                // Get the card row and info
                $row = $result->fetch_assoc();
                $card_damage = $row["damage"];
                $card_bp = $row["bp"];

                // Check if card is in hand
                $hand_array = str_getcsv($yourhand_csv,separator: ',', enclosure: '"', escape: "");
                if (!in_array($card_id, $hand_array)) {
                    echo json_encode(array("error" => "not_in_deck"));
                    exit;
                }

                // Add bp and damage to variables
                $action_damage += $card_damage;
                $action_bp += $action_bp;
            }
        }

        // Check if user has enough bp to do attack
        if ($your_bp < $action_bp) {
            echo json_encode(array("error" => "not_enough_bp"));
            exit;
        }

        // Calculate opponents new hp
        $newhp = $opponent_health - $action_damage;
        if ($newhp < 0) {
            $newhp = 0;
        }

        $opponent_health_column = "health" . $opponent_uid_pos;

        $conn -> select_db("nocskir_matches");

        // Update table
        $stmt = $conn->prepare("UPDATE $tablename SET $opponent_health_column = ? WHERE round = ?");
        $stmt->bind_param("ii", $newhp, $current_round);
        $stmt->execute();
        $stmt->close();

        // Start new round
        $stmt = $conn->prepare("INSERT INTO $tablename (turn, user_action, upgrades1, upgrades2, health1, health2, armor1, armor2, hand1, hand2, connected1, connected2) SELECT turn, user_action, upgrades1, upgrades2, health1, health2, armor1, armor2, hand1, hand2, connected1, connected2 FROM $tablename WHERE round = ?;");
        $stmt->bind_param("i", $current_round);
        $stmt->execute();
        $stmt->close();

        $new_round = $current_round + 1;

        // Set new turn
        $stmt = $conn->prepare("UPDATE $tablename SET turn = ? WHERE round = ?;");
        $stmt->bind_param("ii", $opponent_uid, $new_round);
        $stmt->execute();
        $stmt->close();

        // Reshuffle deck
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
            $stmt->bind_param("si", $hand_csv, $new_round);
            $stmt->execute();
            $stmt->close();
        } else {
            echo "error";
            exit;
        }

        $_SESSION["current_round"] = $new_round;

        echo json_encode(array("ok" => 1));
        exit;
    } else {
        echo json_encode(array("error" => "not_your_turn"));
        exit;
    }
} else {
    exit;
}