<?php
require "../avoid_errors.php";
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
        $opponent = $row["user_id_2"];
        $pos = "1";
        $oppos = "2";
    } else {
        $pos = "2";
        $oppos = "1";
        $opponent = $row["user_id_1"];
    }

    // Figure out whos turn it is
    if ($row["turn"] == $opponent) {
        $turn = "Opponents";
    } else {
        $turn = "Your";
    }

    // Get round
    $round = $row["round"];

    // Get data
    $yourhealth = $row["health" . $pos];
    $yourbp = $row["bp" . $pos];
    $opponenthealth = $row["health" . $oppos];

    // Check if anyone has lost or won the game
    $winloss = 0;
    if ($yourhealth <= 0) {
        //Loss
        $winloss = "loss";
    } else if ($opponenthealth <= 0 ){
        //win
        $winloss = "win";
    }

    // Get emoji
    $emoji = $row["emoji" . $pos];
    $emojicol = "emoji" . $pos;
    if ($emoji != "0") {
        // Emoji has been received, reset to zero
        $conn -> select_db("nocskir_matches");
        $stmt = $conn->prepare("UPDATE $tablename SET $emojicol = 0 WHERE round = ?");
        $stmt->bind_param("i", $round);
        $stmt->execute();
        $stmt->close();
    }

    // Prepera response json
    $response = array(
        "yourhealth" => $yourhealth,
        "yourbp" => $yourbp,
        "opponenthealth" => $opponenthealth,
        "round" => $round,
        "turn" => $turn,
        "emoji" => $emoji,
        "winloss" => $winloss
    );

    // Get your hand
    $yourhand_csv = $row["hand" . $pos];
    $_SESSION["hand"] = $yourhand_csv;
    $yourhand = str_getcsv($yourhand_csv,separator: ',', enclosure: '"', escape: "");
    $count = 1;
    $yourhandrarity = "";
    foreach ($yourhand as $card_id) {
        // Get card texture for each card
        $conn -> select_db("gamehub");
        $stmt2 = $conn->prepare("SELECT * FROM cards WHERE card_id = ?");
        $stmt2->bind_param("i", $card_id);
        $stmt2->execute();
        $result2 = $stmt2->get_result();
        $row2 = $result2->fetch_assoc();
        $texture = "./img/cards/" . $row2["texture"];
        $rarity = $row2["rarity"];
        $bp = $row2["bp"];

        // Make variable name and value of texture
        $response["yourhand" . $count] = $texture;

        // Make variable name and value of id
        $response["yourhand" . $count . "id"] = $card_id;

        // Make variable name with bp of card
        $response["yourhand" . $count . "bp"] = $bp;

        // Make css for hand rarity
        $css = "#card-slideout-$count {background-image: var(--Common), var(--$rarity);} ";
        $yourhandrarity = $yourhandrarity . $css;

        $response["yourhandrarity"] = $yourhandrarity;

        $count = $count + 1;
    }

    // Get enemys hand
    $enemyhand_csv = $row["hand" . $oppos];
    $enemyhand = str_getcsv($enemyhand_csv,separator: ',', enclosure: '"', escape: "");
    $count = 1;
    $enemyhandrarity = "";
    foreach ($enemyhand as $card_id) {
        // Get card texture for each card
        $conn -> select_db("gamehub");
        $stmt2 = $conn->prepare("SELECT * FROM cards WHERE card_id = ?");
        $stmt2->bind_param("i", $card_id);
        $stmt2->execute();
        $result2 = $stmt2->get_result();
        $row2 = $result2->fetch_assoc();
        $texture = "./img/cards/" . $row2["texture"];
        $rarity = $row2["rarity"];
        $bp = $row2["bp"];

        // Make variable name and value of texture
        $response["enemyhand" . $count] = $texture;

        // Make variable name and value of id
        $response["enemyhand" . $count . "id"] = $card_id;

        // Make variable name with bp of card
        $response["enemyhand" . $count . "bp"] = $bp;

        // Make css for hand rarity
        $css = "#card-slideout-$count-enemy {background-image: var(--Common), var(--$rarity);} ";
        $enemyhandrarity = $enemyhandrarity . $css;

        $response["enemyhandrarity"] = $enemyhandrarity;

        $count = $count + 1;
    }

    // Return JSON
    echo json_encode($response);
} else {
    exit;
}