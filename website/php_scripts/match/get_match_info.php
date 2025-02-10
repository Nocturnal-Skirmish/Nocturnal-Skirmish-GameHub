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
        $var_name = "yourhand" . $count;
        ${$var_name} = $texture;

        // Make variable name and value of id
        $var_name = "yourhand" . $count . "id";
        ${$var_name} = $card_id;

        // Make variable name with bp of card
        $var_name = "yourhand" . $count . "bp";
        ${$var_name} = $bp;

        // Make css for hand rarity
        $css = "#card-slideout-$count {background-image: var(--Common), var(--$rarity);} ";
        $yourhandrarity = $yourhandrarity . $css;

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
        $var_name = "enemyhand" . $count;
        ${$var_name} = $texture;

        // Make variable name and value of id
        $var_name = "enemyhand" . $count . "id";
        ${$var_name} = $card_id;

        // Make variable name with bp of card
        $var_name = "enemyhand" . $count . "bp";
        ${$var_name} = $bp;

        // Make css for hand rarity
        $css = "#card-slideout-$count-enemy {background-image: var(--Common), var(--$rarity);} ";
        $enemyhandrarity = $enemyhandrarity . $css;

        $count = $count + 1;
    }

    // Get round
    $round = $row["round"];

    // Get data
    $yourhealth = $row["health" . $pos];
    $yourbp = $row["bp" . $pos];
    $opponenthealth = $row["health" . $oppos];

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

    // Return JSON
    $response = array(
        "yourhealth" => $yourhealth,
        "yourbp" => $yourbp,
        "opponenthealth" => $opponenthealth,
        "round" => $round,
        "turn" => $turn,
        "yourhand1" => $yourhand1,
        "yourhand2" => $yourhand2,
        "yourhand3" => $yourhand3,
        "yourhand4" => $yourhand4,
        "yourhand5" => $yourhand5,
        "yourhand1id" => $yourhand1id,
        "yourhand2id" => $yourhand2id,
        "yourhand3id" => $yourhand3id,
        "yourhand4id" => $yourhand4id,
        "yourhand5id" => $yourhand5id,
        "yourhand1bp" => $yourhand1bp,
        "yourhand2bp" => $yourhand2bp,
        "yourhand3bp" => $yourhand3bp,
        "yourhand4bp" => $yourhand4bp,
        "yourhand5bp" => $yourhand5bp,
        "yourhandrarity" => $yourhandrarity,

        "enemyhand1" => $enemyhand1,
        "enemyhand2" => $enemyhand2,
        "enemyhand3" => $enemyhand3,
        "enemyhand4" => $enemyhand4,
        "enemyhand5" => $enemyhand5,
        "enemyhand1id" => $enemyhand1id,
        "enemyhand2id" => $enemyhand2id,
        "enemyhand3id" => $enemyhand3id,
        "enemyhand4id" => $enemyhand4id,
        "enemyhand5id" => $enemyhand5id,
        "enemyhand1bp" => $enemyhand1bp,
        "enemyhand2bp" => $enemyhand2bp,
        "enemyhand3bp" => $enemyhand3bp,
        "enemyhand4bp" => $enemyhand4bp,
        "enemyhand5bp" => $enemyhand5bp,
        "enemyhandrarity" => $enemyhandrarity,
        "emoji" => $emoji
    );

    echo json_encode($response);
} else {
    exit;
}