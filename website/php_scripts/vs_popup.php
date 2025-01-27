<?php
// Shows a popup of who youre competing against in match screen
if ($_SESSION["popup_shown"] == false) {
    require "avoid_errors.php";
    $_SESSION["popup_shown"] = true;

    // Get information about users to show

    // Get info about user id 1
    $conn -> select_db("gamehub");
    $stmt = $conn->prepare("SELECT * FROM users WHERE user_id = ? LIMIT 1");
    $stmt->bind_param("i", $_SESSION["match_user_id_1"]);
    $stmt->execute();
    $result = $stmt->get_result();
    $row = $result->fetch_assoc();
    $user_id_1_profilepic = $row["profile_picture"];
    $user_id_1_border = $row["profile_border"];
    $user_id_1_username = $row["username"];
    $user_id_1_nickname = $row["nickname"];
    $user_id_1_rank = $row["user_rank"];

    // Get info about user id 2
    $stmt = $conn->prepare("SELECT * FROM users WHERE user_id = ? LIMIT 1");
    $stmt->bind_param("i", $_SESSION["match_user_id_2"]);
    $stmt->execute();
    $result = $stmt->get_result();
    $row = $result->fetch_assoc();
    $user_id_2_profilepic = $row["profile_picture"];
    $user_id_2_border = $row["profile_border"];
    $user_id_2_username = $row["username"];
    $user_id_2_nickname = $row["nickname"];
    $user_id_2_rank = $row["user_rank"];

    // Check whos turn it is
    if ($_SESSION["match_turn_user_id"] == $_SESSION["user_id"]) {
        $turn = "You're going first.";
    } else {
        $turn = "Opponent going first.";
    }

    // Make first letter of rank uppercase (turn variable into array and then remove first index, then uppercase it and add back)
    $array = str_split($user_id_1_rank);
    $firstchar = $array[0];
    $firstchar = strtoupper($firstchar);
    unset($array[0]);
    $rank_without_first_char = implode($array);
    $user_id_1_rank = $firstchar . $rank_without_first_char;

    $array = str_split($user_id_2_rank);
    $firstchar = $array[0];
    $firstchar = strtoupper($firstchar);
    unset($array[0]);
    $rank_without_first_char = implode($array);
    $user_id_2_rank = $firstchar . $rank_without_first_char;
} else {
    goto end;
}
?>
<div class="popup-vs-background" id="popup-vs">
    <div class="popup-vs">
        <div class="profile-vs-preview">
            <div class="profile-container">
                <div class="profile-vs-preview-pfp" style="background-image: url(./img/profile_pictures/<?php echo $user_id_1_profilepic ?>);">
                    <img src="./img/borders/<?php echo $user_id_1_border ?>">
                </div>
                <div class="profile-vs-preview-name-container">
                    <h1><?php echo $user_id_1_nickname ?></h1>
                    <h3 class="vs-username"><?php echo $user_id_1_username ?> - Rank: <?php echo $user_id_1_rank ?><img class="vs-rank-icon" src="./img/ranks/<?php echo $user_id_1_rank ?>.png"></h3>
                </div>
            </div>
        </div>
        <div class="vs-container">
            <h1>VS</h1>
        </div>
        <div class="profile-vs-preview">
            <div class="profile-container" id="user_id_2">
                <div class="profile-vs-preview-pfp" style="background-image: url(./img/profile_pictures/<?php echo $user_id_2_profilepic ?>);">
                    <img src="./img/borders/<?php echo $user_id_2_border ?>">
                </div>
                <div class="profile-vs-preview-name-container">
                    <h1><?php echo $user_id_2_nickname ?></h1>
                    <h3 class="vs-username"><?php echo $user_id_2_username ?> - Rank: <?php echo $user_id_2_rank ?><img class="vs-rank-icon" src="./img/ranks/<?php echo $user_id_2_rank ?>.png"></h3>
                </div>
            </div>
        </div>
        <div class="turn-absolute">
            <div class="turn-container">
                <?php echo $turn ?>
            </div>
        </div>
    </div>
</div>

<?php
end:
?>