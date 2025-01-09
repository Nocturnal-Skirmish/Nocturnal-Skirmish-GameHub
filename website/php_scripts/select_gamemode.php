<?php
// starts a new matchmaking with user specified gamemode
if($_SERVER['REQUEST_METHOD'] == 'POST') {
    require "avoid_errors.php";
    $gamemode = htmlspecialchars($_POST["gamemode"]);
    if ($gamemode == "ranked") {
        // If gamemode is ranked, get users rank
        $rank = "bronze";
    } else {
        $rank = NULL;
    }

    // Get all rows in matchmaking table that has empty user id 2
    $conn -> select_db("nocskir");
    $stmt = $conn->prepare("SELECT * FROM matchmaking WHERE gamemode = ? AND user_id_2 = 0 LIMIT 1");
    $stmt->bind_param("s", $gamemode);
    $stmt->execute();
    $result = $stmt->get_result();
    if ((mysqli_num_rows($result) <= 0)) {
        // No rows found, create one

        // Create match name with timestamp, random strings, and user id 1
        $matchname = time() . "_" . bin2hex(random_bytes(10)) . "_uid" . $_SESSION['user_id'] . "uid_";

        $stmt = $conn->prepare("INSERT INTO matchmaking (user_id_1, gamemode, user_rank, match_name) VALUES (?, ?, ?, ?)");
        $stmt->bind_param("isss", $_SESSION['user_id'], $gamemode, $rank, $matchname);
        $stmt->execute();
        $_SESSION['matchmaking_id'] = $stmt->insert_id;
        $_SESSION['match_name'] = $matchname;
        $_SESSION['match_uid_pos'] = 1;
    } else {
        // Row found, insert user id into that row
        $row = $result->fetch_assoc();
        $row_id = $row['id'];
        // Update match name to include user id 2
        $matchname = $row['match_name'] . "_uid" . $_SESSION['user_id'] . "uid_";
        $stmt = $conn->prepare("UPDATE matchmaking SET user_id_2 = ?, match_name = ? WHERE id = ?");
        $stmt->bind_param("isi", $_SESSION['user_id'], $matchname, $row_id);
        $stmt->execute();
        $_SESSION['matchmaking_id'] = $row_id;
        $_SESSION['match_name'] = $matchname;
        $_SESSION['match_uid_pos'] = 2;
    }
    $stmt->close();
    $conn -> select_db("gamehub");
} else {
    header("Location: ../index.php");
}