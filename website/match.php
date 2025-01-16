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
        Turn user id = " . $row["turn"] . "<br>
        Rank: " . $row["user_rank"];

        // Set some session variables
        $_SESSION["match_user_id_1"] = $row["user_id_1"];
        $_SESSION["match_user_id_2"] = $row["user_id_2"];
    }
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
    <title>Document</title>
</head>
<body>
    <button onclick="leaveMatch()">Leave</button>
</body>
<script>
    // Interval to verify that youre online, check if the other user is online and if other user left
    setInterval(function() {
        $.get("./php_scripts/verify_online_match.php", function(response){
            switch(response) {
                case "left":
                    window.location = "nocturnal-skirmish.php?matchmaking=left"
            }
        })
    }, 5000)

    // Leaves the current match
    function leaveMatch() {
        $.get("./php_scripts/leave_match.php", function(response){
            switch(response) {
                case "ok":
                    window.location = "nocturnal-skirmish.php"
            }
        })
        .fail(function(xhr, status, error) {
            // Alert detailed error information
            alert("Error details:\n" +
                "Status: " + status + "\n" +
                "Error: " + error + "\n" +
                "Response Text: " + xhr.responseText);
            
            // Optionally, log the error for debugging
            console.error("Error Details:", xhr, status, error);
        /* If request went wrong
        $.get("./php_scripts/cancel_matchmaking.php")
        window.location = "nocturnal-skirmish.php?matchmaking=error"
        */
    })
    }
</script>
</html>