<?php
// Takes a card id from url and returns json of the card
if (isset($_GET["id"])) {
    $card_id = htmlspecialchars($_GET["id"]);

    // Check if card exists
    require "../avoid_errors.php";
    $stmt = $conn->prepare("SELECT * FROM cards WHERE card_id = ? LIMIT 1;");
    $stmt->bind_param("i", $card_id);
    $stmt->execute();
    $result = $stmt->get_result();
    if (mysqli_num_rows($result) > 0) {
        // Card exists, get info
        $row = $result->fetch_assoc();
        $response = json_encode(array(
            "name" => $row["card_name"],
            "description" => $row["description"],
            "bp" => $row["bp"],
            "damage" => $row["damage"],
            "healing" => $row["healing"],
            "special" => $row["special"],
            "effects" => $row["effects"],
            "combo_list" => $row["combo_list"],
            "evolution" => $row["evolution"],
            "rarity" => $row["rarity"],
            "rarity_int" => $row["rarity_int"],
            "element" => $row["element"],
            "tag" => $row["tag"],
            "css" => $row["css"],
            "texture" => $row["texture"],
            "credit" => $row["credit"],
            "status" => 200
        ));

        // Return the response
        echo $response;
    } else {
        echo json_encode(array("error" => "card_not_exist", "status" => 404));
        exit;
    }
} else {
    echo json_encode(array("error" => "error", "status" => 400));
    exit;
}