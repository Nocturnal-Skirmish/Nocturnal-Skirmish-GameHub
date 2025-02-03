<?php
// Checks if another user is in your matchmaking row and creates a match table if they are.
require "avoid_errors.php";

if (isset($_SESSION['matchmaking_id'])) {
    // Check if user_id_2 column has a user
    $conn -> select_db("nocskir");
    $stmt = $conn->prepare("SELECT * FROM matchmaking WHERE id = ? AND user_id_2 > 0");
    $stmt->bind_param("i", $_SESSION['matchmaking_id']);
    $stmt->execute();
    $result = $stmt->get_result();
    if ((mysqli_num_rows($result) > 0)) {
        // user id 2 has joined
        $row = mysqli_fetch_assoc($result);

        // Get match name
        $stmt = $conn->prepare("SELECT * FROM matchmaking WHERE id = ? LIMIT 1");
        $stmt->bind_param("i", $_SESSION['matchmaking_id']);
        $stmt->execute();
        $result = $stmt->get_result();
        if ((mysqli_num_rows($result) > 0)) {
            $row = mysqli_fetch_assoc($result);
            $tablename = $row['match_name'];
            $user_id_2 = $row['user_id_2'];
            $user_id_1 = $row['user_id_1'];
            $gamemode = $row['gamemode'];
            $rank = $row['user_rank'];
        } else {
            echo "error";
            exit;
        }
        $stmt->close();

        // Check if a match table has already been created
        $stmt = $conn->prepare("SELECT * FROM information_schema.tables WHERE table_schema = 'nocskir_matches' AND table_name = '$tablename' LIMIT 1;");
        $stmt->execute();
        $result = $stmt->get_result();
        if ((mysqli_num_rows($result) > 0)) {
            // Match table found, update session vars and connect to it
            $conn -> select_db("nocskir_matches");
            $_SESSION['match_name'] = $tablename;
            $stmt = $conn->prepare("UPDATE $tablename SET connected2 = 1 WHERE round = 1");
            $stmt->execute();
            $stmt->close();
        } else {
            // If it hasnt, create one.
            $conn -> select_db("nocskir_matches");
            $stmt = $conn->prepare("CREATE TABLE $tablename (
                    round int NOT NULL AUTO_INCREMENT,
                    user_id_1 int DEFAULT $user_id_1,
                    user_id_2 int DEFAULT $user_id_2,
                    gamemode varchar(32) DEFAULT '$gamemode',
                    user_rank varchar(64) DEFAULT '$rank',
                    turn int,
                    user_action varchar(255) DEFAULT NULL,
                    special varchar(255) DEFAULT NULL,
                    timer int DEFAULT 0,
                    effects1 varchar(300) DEFAULT '0',
                    effects2 varchar(300) DEFAULT '0',
                    upgrades1 varchar(300) DEFAULT '0',
                    upgrades2 varchar(300) DEFAULT '0',
                    health1 int DEFAULT 12000,
                    health2 int DEFAULT 12000,
                    armor1 int DEFAULT 0,
                    armor2 int DEFAULT 0,
                    bp1 int DEFAULT 15,
                    bp2 int DEFAULT 15,
                    hand1 varchar(300) DEFAULT '0',
                    hand2 varchar(300) DEFAULT '0',
                    connected1 boolean DEFAULT 0,
                    connected2 boolean DEFAULT 0,
                    PRIMARY KEY (round)
                );
            ");
            $stmt->execute();
            $stmt->close();

            // Create random turn
            $turn = random_int(1, 2);
            if ($turn == 1) {
                $turn = $user_id_1;
            } else {
                $turn = $user_id_2;
            }

            $connected1 = 1;

            // Insert first row
            $stmt = $conn->prepare("INSERT INTO $tablename (gamemode, user_rank, turn, connected1) VALUES (?, ?, ?, ?)");
            $stmt->bind_param("ssii", $gamemode, $rank, $turn, $connected1);
            $stmt->execute();
            $stmt->close();
        }
        $_SESSION["popup_shown"] = false;
        echo "found";
    }
} else {
    header("Location: ../nocturnal-skirmish.php");
}