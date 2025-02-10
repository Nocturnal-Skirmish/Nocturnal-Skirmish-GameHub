<?php
session_start();

// Deletes user specified
if($_SERVER['REQUEST_METHOD'] == 'POST') {
    if (!isset($_SESSION['isadmin']) || $_SESSION['isadmin'] != 1) {
        header("Location: ../admin_login.php?error=unauth");
        exit;
    } else {
        require "../../config/conn.php";
        $user_id = htmlspecialchars($_POST['user_id']);
        // First, delete user from users table
        $stmt = $conn->prepare("DELETE FROM users WHERE user_id = ?");
        $stmt->bind_param("i", $user_id);
        $stmt->execute();

        //Second, delete user from all other tables, like for example border_inventory, friend list excetera

        //border_inventory
        $stmt = $conn->prepare("DELETE FROM border_inventory WHERE user_id = ?");
        $stmt->bind_param("i", $user_id);
        $stmt->execute();

        //friend list - user_id_1
        $stmt = $conn->prepare("DELETE FROM friend_list WHERE user_id_1 = ?");
        $stmt->bind_param("i", $user_id);
        $stmt->execute();

        //friend list - user_id_2
        $stmt = $conn->prepare("DELETE FROM friend_list WHERE user_id_2 = ?");
        $stmt->bind_param("i", $user_id);
        $stmt->execute();

        //ip_adresses
        $stmt = $conn->prepare("DELETE FROM ip_adresses WHERE user_id = ?");
        $stmt->bind_param("i", $user_id);
        $stmt->execute();

        //pending_friend_list - user_id_1
        $stmt = $conn->prepare("DELETE FROM pending_friend_list WHERE user_id_1 = ?");
        $stmt->bind_param("i", $user_id);
        $stmt->execute();

        //pending_friend_list - user_id_1
        $stmt = $conn->prepare("DELETE FROM pending_friend_list WHERE user_id_2 = ?");
        $stmt->bind_param("i", $user_id);
        $stmt->execute();

        //recovery_codes
        $stmt = $conn->prepare("DELETE FROM recovery_codes WHERE user_id = ?");
        $stmt->bind_param("i", $user_id);
        $stmt->execute();

        //redeemed_codes
        $stmt = $conn->prepare("DELETE FROM redeemed_codes WHERE user_id = ?");
        $stmt->bind_param("i", $user_id);
        $stmt->execute();

        // banned
        $stmt = $conn->prepare("DELETE FROM banned WHERE user_id = ?");
        $stmt->bind_param("i", $user_id);
        $stmt->execute();

        // kick
        $stmt = $conn->prepare("DELETE FROM kick WHERE user_id = ?");
        $stmt->bind_param("i", $user_id);
        $stmt->execute();

        // Archive every two user chat they were in
        $stmt = $conn->prepare("SELECT * FROM chats WHERE user_id = ? AND type = 'two_user'");
        $stmt->bind_param("i", $user_id);
        $stmt->execute();
        $result = $stmt->get_result();
        if ((mysqli_num_rows($result) > 0)) {
            while ($row = $result->fetch_assoc()) {
                $tablename = $row["tablename"];

                // Create table to move the chat into
                $conn -> select_db("gamehub_messages_archive");
                $new_tablename = $tablename . "_archive";
                $stmt1 = $conn->prepare("CREATE TABLE $new_tablename (message_id int NOT NULL AUTO_INCREMENT, user_id int, message varchar(500), file varchar(50), timestamp varchar(64), edited int DEFAULT 0, reply int DEFAULT 0, PRIMARY KEY (message_id));");
                $stmt1->execute();
                $stmt1->close();

                // Move chat into table
                $conn -> select_db("gamehub_messages");
                $stmt1 = $conn->prepare("SELECT * FROM $tablename");
                $stmt1->execute();
                $result1 = $stmt1->get_result();
                if ((mysqli_num_rows($result1) > 0)) {
                    while ($row1 = mysqli_fetch_assoc($result1)) {
                        $conn -> select_db("gamehub_messages_archive");
                        $stmt1 = $conn->prepare("INSERT INTO $new_tablename (user_id, message, file, timestamp, edited, reply) VALUES (?, ?, ?, ?, ?, ?)");
                        $stmt1->bind_param("ssssss", $row1['user_id'], $row1['message'], $row1['file'], $row1['timestamp'], $row1['edited'], $row1['reply']);
                        $stmt1->execute();
                    }
                }
                $stmt1->close();

                // Delete old table
                $conn -> select_db("gamehub_messages");
                $stmt1 = $conn->prepare("DROP TABLE $tablename");
                $stmt1->execute();
                $stmt1->close();

                $conn -> select_db("gamehub");

                // Delete chats row
                $stmt1 = $conn->prepare("DELETE FROM chats WHERE id = ?");
                $stmt1->bind_param("i", $row["id"]);
                $stmt1->execute();
                $stmt1->close();
            }
        }

        //Redirect to dashboard
        header("Location: ../dashboard.php?userdeleted=$user_id");
        exit;
    }
} else {
    header("Location: ../admin_login.php?error=unauth");
    exit;
}