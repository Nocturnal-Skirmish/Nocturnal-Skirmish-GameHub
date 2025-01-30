<?php
// Sets what to order by when searching in carddex
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get the post data
    $json = json_decode(file_get_contents('php://input'), true);
    $column = htmlspecialchars($json["column"]);

    // Set the column to sort
    session_start();
    $_SESSION["carddex_sort"] = $column;
} else {
    header("Location: ../index.php");
}