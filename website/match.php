<?php
    require "./php_scripts/avoid_errors.php";
    $conn -> select_db("nocskir");
    $stmt = $conn->prepare("SELECT * FROM matchmaking WHERE id = ?");
    $stmt->bind_param("i", $_SESSION['matchmaking_id']);
    $stmt->execute();
    $result = $stmt->get_result();
    if ((mysqli_num_rows($result) > 0)) {
        $row = mysqli_fetch_assoc($result);
        echo "user id 2: " . $row['user_id_2'] . "<br>user id 1: " . $row['user_id_1'] . "<br>matchmaking id: " . $_SESSION['matchmaking_id'] . "<br>table name: " . $row['match_name'] . "<br>gamemode: " . $row['gamemode'];
    } else {
        header("Location: ./nocturnal-skirmish.php?matchmaking=cancelled");
    }
?>