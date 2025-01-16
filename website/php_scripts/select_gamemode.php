<?php
// starts a new matchmaking with user specified gamemode
if($_SERVER['REQUEST_METHOD'] == 'POST') {
    require "avoid_errors.php";
    start:
    $gamemode = htmlspecialchars($_POST["gamemode"]);
    if ($gamemode == "ranked") {
        // If gamemode is ranked, get users rank
        $stmt = $conn->prepare("SELECT user_rank FROM users WHERE user_id = ?");
        $stmt->bind_param("i", $_SESSION["user_id"]);
        $stmt->execute();
        $result = $stmt->get_result();
        $row = $result->fetch_assoc();
        $rank = $row["user_rank"];
    } else {
        $rank = "none";
    }

    // Get all rows in matchmaking table that has empty user id 2
    $conn -> select_db("nocskir");
    $stmt = $conn->prepare("SELECT * FROM matchmaking WHERE gamemode = ? AND user_rank = ? AND user_id_2 = 0 LIMIT 1");
    $stmt->bind_param("ss", $gamemode, $rank);
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

        // Check if user_id_1 in row is online
        $row = $result->fetch_assoc();

        // Get last login unix timestamp
        $conn -> select_db("gamehub");
        $stmt1 = $conn->prepare("SELECT * FROM users WHERE user_id = ? LIMIT 1");
        $stmt1->bind_param("i", $row["user_id_1"]);
        $stmt1->execute();
        $result1 = $stmt1->get_result();
        $row1 = $result1->fetch_assoc();

        $unix_timestamp = time();
        if ($row1["last_login"] < $unix_timestamp || $row["user_id_1"] == $_SESSION["user_id"]) {
            // User isnt online or user is yourself. Delete the row and try again
            $conn -> select_db("nocskir");
            $stmt1 = $conn->prepare("DELETE FROM matchmaking WHERE id = ?");
            $stmt1->bind_param("i", $row["id"]);
            $stmt1->execute();
            $stmt1->close();
            $stmt->close();
            goto start;
        } else {
            // User is online
            $conn -> select_db("nocskir");
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
    }
    $stmt->close();
    $conn -> select_db("gamehub");
} else {
    header("Location: ../index.php");
}