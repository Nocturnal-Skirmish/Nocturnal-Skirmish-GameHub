<?php
require "../../php_scripts/avoid_errors.php";
// Gets source code of file or opens image for file explorer
if (!isset($_SESSION['isadmin']) || $_SESSION['isadmin'] != 1) {
    header("Location: ../admin_login.php?error=unauth");
    exit;
} else {
    // Clear temp directory
        $files = scandir("../temp");
        foreach($files as $file) {
            if (is_file("../temp/" . $file)) {
                unlink("../temp/" . $file);
            }
        }
    $file = htmlspecialchars($_POST['file']);
    $absolutepath = $_SESSION['admin_currentpath'] . "/" . $file;
    if (file_exists($absolutepath)) {
        $mimetype = mime_content_type($absolutepath);
        if (str_contains($mimetype, "image")) {
            // If file is an image
            if (!copy($absolutepath, "../temp/$file")) {
                echo "error";
            } else {
                echo "<img style='max-width: 100%' src='./temp/$file'>";
            }
            echo "<a href='./temp/$file' download>Download</a><br>";
        } else if (str_contains($mimetype, "audio")) {
            // if file is audio
            if (!copy($absolutepath, "../temp/$file")) {
                echo "error";
            } else {
                echo "<audio controls><source src='./temp/$file' type='$mimetype'></audio>";
            }
            echo "<br><a href='./temp/$file' download>Download</a><br>";
        } else {
            // Show sourcecode if file is not an image or audio
            $sourcecode = file_get_contents($absolutepath);
            $sourcecode = htmlspecialchars($sourcecode);
            $sourcecode = nl2br($sourcecode);
            echo "<p>" . $sourcecode . "</p>";
        }
        echo "<br><br><button onclick='removeSourceCode()'>Close</button>";
    } else {
        echo "error";
    }
}