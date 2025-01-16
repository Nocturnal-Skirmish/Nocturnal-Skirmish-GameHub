<?php
    require "./php_scripts/avoid_errors.php";
    $tablename = $_SESSION['match_name'];
    $stmt = $conn->prepare("SELECT * FROM information_schema.tables WHERE table_schema = 'nocskir_matches' AND table_name = '$tablename' LIMIT 1;");
    $stmt->execute();
    $result = $stmt->get_result();
    if ((mysqli_num_rows($result) === 0)) {
        // Match doesnt exist
        header("Location: ./nocturnal-skirmish.php?matchmaking=cancelled");
    } else {
        // Match exists, get info
        $conn -> select_db("nocskir_matches");
        $stmt = $conn->prepare("SELECT * FROM $tablename WHERE round = 1 LIMIT 1");
        $stmt->execute();
        $result = $stmt->get_result();
        $row = $result->fetch_assoc();
        echo "
        Table name = $tablename <br>
        User id 1 = " . $row["user_id_1"] . "<br>
        You are user id " . $_SESSION['match_uid_pos'] . " <br>
        User id 2 = " . $row["user_id_2"] . "<br>
        Gamemode = " . $row["gamemode"] . "<br>
        Turn user id = " . $row["turn"] . "<br>";
    }