<?php
// shows a modal of a card with a description and stats
require "../../php_scripts/avoid_errors.php";

$error = false;

// Get card id from url
if(isset($_GET["card"])) {
    $card_id = $_GET["card"];
} else {
    $error = true;
}

// Get info about card
$stmt = $conn->prepare("SELECT * FROM cards WHERE card_id = ? LIMIT 1");
$stmt->bind_param("i", $card_id);
$stmt->execute();
$result = $stmt->get_result();
if ((mysqli_num_rows($result) <= 0)) {
    $error = true;
} else {
    $row = $result->fetch_assoc();
    // Get info
    $rarity = $row["rarity"];
    $name = $row["card_name"];
    $texture = $row["texture"];
    $description = $row["description"];
    $bp = $row["bp"];
    $damage = $row["damage"];
    if ($damage == null) {
        $damage = "This card deals no damage.";
    }
    $healing = $row["healing"];
    if ($healing == null) {
        $healing = "This card does no healing.";
    }
    $special = $row["special"];
    if ($special == 0) {
        $special = "This card does not have a specialty.";
    }
    $effects = $row["effects"];
    if ($effects == null) {
        $effects = "This card has no effects.";
    }
    $combo_list = $row["combo_list"];
    if ($combo_list == NULL) {
        $combo_list == "This card has no comboes.";
    }
    $evolution = $row["evolution"];
    if ($evolution == NULL) {
        $evolution == "This card has no evolution.";
    }
}
$stmt->close();
?>
<style>
    <?php require "./css/viewcard.css" ?>
</style>
<?php
    if ($error == true) {
        echo "<div class='viewcard-container'>This card could not be found...<button onclick='removeDarkContainer()'>Close</button></div>";
        exit;
    }
    ?>
<div class="viewcard-container" style="background: var(--<?php echo $rarity ?>);">
    <button class="close" title="Close" onclick="removeDarkContainer()"></button>
    <img class="main-card" src="./img/cards/<?php echo $texture ?>" alt="<?php echo $name ?>">
    <div class="vertical-divider"></div>
    <div class="stats-container">
        <div class="name-container">
            <h1 class="name"><?php echo $name ?></h1>
        </div>
        <div class="description-container">
        <div class="name-underline"></div>
        <div class="description">
            <?php echo $description ?>
        </div>
        </div>
        <p class="stats-headline">STATS</p>
        <div class="stats-text-container">
            <p>Battle points: <?php echo $bp ?></p>
            <p>Damage: <?php echo $damage ?></p>
            <p>Healing: <?php echo $healing ?></p>
            <p>Special: <?php echo $special ?></p>
            <p>Effects: <?php echo $effects ?></p>
            <p>Combo list: <?php echo $combo_list ?></p>
            <p>Evolution: <?php echo $evolution ?></p>
        </div>
    </div>
</div>