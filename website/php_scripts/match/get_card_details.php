<?php
// Gets details about a card for showing in match
if (isset($_GET["id"])) {
    $card_id = htmlspecialchars($_GET["id"]);
    require "../avoid_errors.php";
    // Get the card from database
    $conn -> select_db("gamehub");
    $stmt = $conn->prepare("SELECT * FROM cards WHERE card_id = ?");
    $stmt->bind_param("i", $card_id);
    $stmt->execute();
    $result = $stmt->get_result();
    if ((mysqli_num_rows($result) > 0)) {
        // Get info about card
        $row = mysqli_fetch_assoc($result);
        $name = $row["card_name"];
        $description = $row["description"];
        $texture = $row["texture"];
    } else {
        echo "error";
        exit;
    }
} else {
    header("Location: ../../index.php");
    exit;
}

?>

<img class="card-details-image" src="./img/cards/<?php echo $texture ?>" alt="<?php echo $name ?>">
<div class="card-details-right">
    <h1 class="card-details-name"><?php echo $name ?></h1>
    <div class="card-details-name-underline"></div>
    <div class="card-details-description">
        <?php echo $description ?>
    </div>
</div>
<?php
    if(isset($_GET["enemy"])) {
        goto end;
    }
?>
<button class="card-details-button" onclick="addToAction(<?php echo $card_id ?>)">Choose this card</button>
<?php
end:
?>