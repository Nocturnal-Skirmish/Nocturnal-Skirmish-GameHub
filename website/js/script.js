//Prevents form resubmission on refresh of page
if ( window.history.replaceState ) {
    window.history.replaceState( null, null, window.location.href );
};

//Function to switch visibility of dark container
function showDarkContainer() {
    container = document.getElementById("loginDarkContainer");
    if (window.getComputedStyle(container).display === 'none'){
        container.style.display = 'block';
    } else {
        container.style.display = "none";
    }
}

// Check the amount of pending friend invites the user has
function checkPendingAmount() {
    $.ajax({
        type: "POST",
        url: './php_scripts/get_pending_invites_amount.php',
        data:{ placeholder : "placeholder" }, 
        success: function(response){
            pendingAmountContainer = document.getElementById("pending_amount");
            if (response != "none") {
                pendingAmountContainer.innerHTML = response;
                pendingAmountContainer.style.display = 'block';
            } else {
                pendingAmountContainer.innerHTML = "";
                pendingAmountContainer.style.display = 'none';
            }
        }
    })
}

// Configures flickty
function configureFlickity() {
    var elem = document.querySelector('.main-carousel');
    var flkty = new Flickity( elem, {
        // options
        cellAlign: 'center',
        contain: true,
        wrapAround: true
    });
        // element argument can be a selector string
        //   for an individual element
        var flkty = new Flickity( '.main-carousel', {
        // options
    });
}

// GET request with ajax
function ajaxGet(phpFile, changeID, onLoad = null){
    $.get(phpFile, function(data){
        document.getElementById(changeID).innerHTML = data;
    })
    .done(function() {
        switch(onLoad) {
            case "cropper_js":
                configureCropperJS();
                break;
            case "audio_music_settings":
                configureAudioSettings();
                break;
            case "friends_list":
                ajaxGet('./spa/hub/online_offline_friends.php', 'hub-friends-content');
                checkPendingAmount();
                startFriendsListInterval();
                break;
            case "cropper_js_banner":
                configureCropperJSBanner();
                break;
            case "still_at_bottom":
                stillAtBottom();
                break;
            case "scroll":
                container = document.getElementById("messages-container");
                container.scrollTop = container.scrollHeight;
                break;
            case "scrollToDiv":
                scrollToDiv();
                break;
            case "cropper_js_groupchat":
                configureCropperJSGroupchat();
                break;
            case "resize_groupchat_input":
                resizeGroupchatInput();
                break;
            case "flickity":
                setTimeout(configureFlickity, 100);
                break;
        }

        if (onLoad != "no_sfx") {
            prepareSFX();
        };

        if (changeID == "dark-container") {
            $("#dark-container").fadeIn(100);
        };
    })
    .fail(function() {
        try {
            showConfirm("Something went wrong")
        } catch (error) {
            alert("Something went wrong.")
        }
    });
}

// Save description in database
function saveDescription() {
    var text = $('#descriptionTextArea').val();
    $.ajax({
        type: "POST",
        url: './php_scripts/save_description.php',
        data:{ description: text }, 
        success: function(){
            showConfirm("Description saved!")
        }
    })
}

function submitDevCode() {
    var text = $('#devcodeInput').val();
    $.ajax({
        type: "POST",
        url: './php_scripts/submit_devcode.php',
        data:{ devcode: text }, 
        success: function(response){
            if (response == "codenotfound") {
                showConfirm("Code doesn't exist or is expired.")
            } else if (response == "alreadyredeemed") {
                showConfirm("Code already redeemed!")
            } else {
                showConfirm("Code redeemed!")
            }
        }
    })
}

// Save new nickname in database
function saveNickname () {
    var text = $('#change-nickname-input').val();
    $.ajax({
        type: "POST",
        url: './php_scripts/save_nickname.php',
        data:{ nickname: text }, 
        success: function(nickname){
            if (nickname == "error") {
                showConfirm("Something went wrong.");
                removeDarkContainer();
            } else {
                document.getElementById("settings-myaccount-nickname").innerHTML = nickname;
                document.getElementById("settings-myaccount-details-nickname").innerHTML = nickname;
                removeDarkContainer();
                showConfirm("Nickname saved!");
            }
        }
    })
}

// Save new email in database
function saveEmail() {
    var text = $('#change-email-input').val();
    $.ajax({
        type: "POST",
        url: './php_scripts/save_email.php',
        data:{ email: text }, 
        success: function(email){
            if (email == "error") {
                showConfirm("Something went wrong.");
                removeDarkContainer();
            } else {
                document.getElementById("settings-myaccount-details-email").innerHTML = email;
                removeDarkContainer();
                stopWaitClick();
                showConfirm("Email saved!");
            }
        },
        error: function() {
            stopWaitClick();
            showConfirm("Something went wrong.");
        }
    })
}

// Save new password in database
function savePassword() {
    var text = $('#change-password-input').val();
    var text2 = $('#change-password-confirm-input').val();
    $.ajax({
        type: "POST",
        url: './php_scripts/save_password.php',
        data:{ password: text, confirmpassword: text2}, 
        success: function(response){
            if (response == "error") {
                showConfirm("Something went wrong.");
                removeDarkContainer();
            } else if (response == "dontmatch"){
                removeDarkContainer();
                showConfirm("Passwords dont match!");
            } else if (response == "empty"){ 
                removeDarkContainer();
                showConfirm("Input is empty!");
            } else {
                removeDarkContainer();
                showConfirm("Password saved!");
            }
        }
    })
}

// Uploads temp banner to server
function uploadBanner() {
    var file_data = $('#banner-input').prop('files')[0];   
    var form_data = new FormData();                  
    form_data.append('file', file_data);                           
    $.ajax({
        url: './php_scripts/banner_upload.php',
        dataType: 'text',
        cache: false,
        contentType: false,
        processData: false,
        data: form_data,                         
        type: 'post',
        success: function(response){
            if (response == "unsupported") {
                removeDarkContainer();
                showConfirm("File type not supported! Only JPG allowed.");
            } else if (response == "empty") {
                removeDarkContainer();
                showConfirm("File input empty!");
            } else if (response == "error") {
                removeDarkContainer();
                showConfirm("Something went wrong.");
            } else {
                container = document.getElementById("dark-container");
                container.innerHTML = "";
                ajaxGet('./spa/user_settings/banner_crop.php', 'dark-container', 'cropper_js_banner');
            }
        }
    });
};

// Uploads temp profile pic to server
function uploadProfilePic() {
    var file_data = $('#profilepic-input').prop('files')[0];   
    var form_data = new FormData();                  
    form_data.append('file', file_data);                           
    $.ajax({
        url: './php_scripts/profilepic_upload.php',
        dataType: 'text',
        cache: false,
        contentType: false,
        processData: false,
        data: form_data,                         
        type: 'post',
        success: function(response){
            if (response == "unsupported") {
                removeDarkContainer();
                showConfirm("File type not supported! Only JPG and PNG allowed.");
            } else if (response == "empty") {
                removeDarkContainer();
                showConfirm("File input empty!");
            } else if (response == "error") {
                removeDarkContainer();
                showConfirm("Something went wrong.");
            } else {
                container = document.getElementById("dark-container");
                container.innerHTML = "";
                ajaxGet('./spa/user_settings/profilepic_crop.php', 'dark-container', 'cropper_js');
            }
        }
    });
};

// Configures settings from cropper js for profile picture
function configureCropperJS() {
    image = document.getElementById('cropper_js_element');
    let cropper = new Cropper(image, {
        aspectRatio: 1/1,
        dragMode: 'none',
        preview: '.settings-profilepic-preview-profilepic'
    });
    $('#settings-profilepic-crop-save-button').click(function(){
		canvas = cropper.getCroppedCanvas({
			width:400,
			height:400
		});
		canvas.toBlob(function(blob){
			url = URL.createObjectURL(blob);
			var reader = new FileReader();
			reader.readAsDataURL(blob);
			reader.onloadend = function(){
				var base64data = reader.result;
				$.ajax({
					url:'./php_scripts/profilepic_cropped_upload.php',
					method:'POST',
					data:{image:base64data},
					success:function(response){
                        if (response == "error") {
                            showConfirm("Something went wrong.");
                            removeDarkContainer();
                        } else {
                            document.getElementById("settings-myaccount-profile-pic-parent").style.backgroundImage = response;
                            showConfirm("Profile picture saved!");
                            removeDarkContainer();
                        }
					}
				});
			};
		});
    });
};

// Configures settings from cropper js for banner
function configureCropperJSBanner() {
    image = document.getElementById('cropper_js_element_banner');
    let cropper = new Cropper(image, {
        aspectRatio: 93/14,
        dragMode: 'none',
        preview: '.settings-banner-preview-banner'
    });
    $('#settings-banner-crop-save-button').click(function(){
		canvas = cropper.getCroppedCanvas({
			width:930,
			height:140
		});
		canvas.toBlob(function(blob){
			url = URL.createObjectURL(blob);
			var reader = new FileReader();
			reader.readAsDataURL(blob);
			reader.onloadend = function(){
				var base64data = reader.result;
				$.ajax({
					url:'./php_scripts/banner_cropped_upload.php',
					method:'POST',
					data:{image:base64data},
					success:function(response){
                        if (response == "error") {
                            showConfirm("Something went wrong.");
                            removeDarkContainer();
                        } else {
                            document.getElementById("settings-myaccount-banner").style.backgroundImage = response;
                            showConfirm("Banner saved!");
                            removeDarkContainer();
                        }
					}
				});
			};
		});
    });
};

//Shows a popup when saving information in user settings
function showConfirm(text) {
    $("#confirmContainer").stop( true, true ).fadeOut();
    confirmContainer = document.getElementById("confirmContainer");
    confirmContainer.innerHTML = text;
    confirmContainer.style.display = "block";
    $("#confirmContainer").fadeOut(3000);
}

// Shows preview of banner that user is uploading
function filePreview(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            $('#bannerPreview').css('background-image','url('+e.target.result+')');
        };
        reader.readAsDataURL(input.files[0]);
    }
}

//Removes dark container and its contents
function removeDarkContainer() {
    container = document.getElementById("dark-container");
    if (window.getComputedStyle(container).display != 'none') {
        container.innerHTML = "";
        container.style.display = 'none';
    }
}

//Prepares sound effects for a page
function prepareSFX() {
    //Sets volume of music
    var musicAudio = document.getElementById('musicAudio');
    musicAudio.volume = localStorage.getItem("volumeMusic");

    var hoverAudio = document.getElementById('hoverSFX');
    hoverAudio.volume = localStorage.getItem("volumeUi");
    // Function to play hover soundeffect on button hover
    function playHoverSfx() {
        hoverAudio.play();
    }

    // Function to stop sfx hover
    function stopHoverSfx() {
        hoverAudio.pause();
        hoverAudio.currentTime = 0;
    }

    // Get all button and a tags
    const hoverSfxButton = document.getElementsByTagName('button');
    const hoverSfxLink = document.getElementsByTagName('a');

    //Loops through all button tags and adds a mouse over event listener
    for (var i = 0 ; i < hoverSfxButton.length; i++) {
        hoverSfxButton[i].addEventListener('mouseover', () => {playHoverSfx();});
        hoverSfxButton[i].addEventListener('mouseout', () => {stopHoverSfx();});
    }

    //Loops through all link (a) tags and adds a mouse over event listener
    for (var i = 0 ; i < hoverSfxLink.length; i++) {
        hoverSfxLink[i].addEventListener('mouseover', () => {playHoverSfx();});
        hoverSfxLink[i].addEventListener('mouseout', () => {stopHoverSfx();});
    }

    // play click sfx
    function playClickSfx() {
        var clickAudio = document.getElementById('clickSFX');
        clickAudio.volume = localStorage.getItem("volumeUi");
        clickAudio.play();
    }

    // Stop click sfx
    function stopClickSfx() {
        var clickAudio = document.getElementById('clickSFX');
        clickAudio.volume = localStorage.getItem("volumeUi");
        clickAudio.pause();
        clickAudio.currentTime = 0;
    }

    // Click sfx on whole document
    const clickSfxBody = document.querySelector('body');
    clickSfxBody.addEventListener('click', () => {
        stopClickSfx();
        playClickSfx();
    });

}

// Saves border you clicked to database user
function saveBorder(border) {
    $.ajax({
        type: "POST",
        url: './php_scripts/save_border.php',
        data:{ bordername: border}, 
        success: function(response){
            if (response == "error") {
                showConfirm("Something went wrong.");
                removeDarkContainer();
            } else {
                removeDarkContainer();
                showConfirm("Border saved!");
            }
        }
    })
}

// Changes volume in audio settings
function configureAudioSettings() {
    // Gets audio to change
    var hoverAudio = document.getElementById('hoverSFX');
    var clickAudio = document.getElementById('clickSFX');
    var musicAudio = document.getElementById('musicAudio');

    //Gets all range inputs
    let volumeSFX = document.querySelector("#volume-control-sfx");
    let volumeMusic = document.querySelector("#volume-control-music");
    let volumeUi = document.querySelector("#volume-control-ui");

    //Sets default value to localstorage value
    volumeUi.value = localStorage.getItem("volumeUi") * 100;
    volumeMusic.value = localStorage.getItem("volumeMusic") * 100;

    // Changes volume of ui sfx (hover, click)
    volumeUi.addEventListener("change", function(e) {
        hoverAudio.volume = e.currentTarget.value / 100;
        clickAudio.volume = e.currentTarget.value / 100;
    })

    // Changes volume of music
    volumeMusic.addEventListener("change", function(e) {
        musicAudio.volume = e.currentTarget.value / 100;
    })

    // Adds event listener to save button
    var audioSaveButton = document.getElementById('audioSaveButton');
    audioSaveButton.addEventListener("click", function() {
        localStorage.setItem("volumeUi", volumeUi.value / 100);
        localStorage.setItem("volumeMusic", volumeMusic.value / 100);
        showConfirm("Audio settings saved!");
    })
}

// Loads in popup box with user details
function displayUserProfile(user_id) {
    $.ajax({
        type: "POST",
        url: './php_scripts/display_user_profile.php',
        data:{ user_id : user_id}, 
        success: function(response){
            if (response == "error") {
                showConfirm("Something went wrong.");
            } else {
                ajaxGet('./spa/hub/user_profile_popup.php', 'dark-container');
            }
        }
    })
}

// Hides or shows spa container in hub
function displaySpaContainerHub(display) {
    container = document.getElementById('hub-spa-container');
    if (display == "none") {
        if (window.getComputedStyle(container).display != 'none') {
            container.innerHTML = "";
            container.style.display = 'none';
        }
    } else {
        if (window.getComputedStyle(container).display == 'none') {
            container.style.display = 'block';
        }
    }
}

// Open a modal with more options for each friend in friends list
function openMoreOptionsFriendsList(user_id) {
    $.ajax({
        type: "POST",
        url: './php_scripts/friends_list_more_button.php',
        data:{ user_id : user_id}, 
        success: function(response){
            if (response == "error") {
                showConfirm("Something went wrong.");
            } else {
                ajaxGet('./spa/hub/friends_list_more_button_modal.php', 'dark-container');
            }
        }
    })
}

// Shows or hides container for confirming removal of friend in friends list
function confirmFriendRemove(){
    var removeContainer = document.getElementById("friends-list-more-modal-remove-confirm-container");
    var mainContainer = document.getElementById("friends-list-more-modal-container");

    if (window.getComputedStyle(removeContainer).display === 'none') {
        removeContainer.style.display = 'block';
        mainContainer.style.display = 'none';
    } else {
        removeContainer.style.display = 'none';
        mainContainer.style.display = 'block';
    }
}

// Removes friend from friends list
function removeFriend(user_id) {
    $.ajax({
        type: "POST",
        url: './php_scripts/remove_friend.php',
        data:{ user_id : user_id}, 
        success: function(response){
            if (response == "error") {
                removeDarkContainer();
                showConfirm("Something went wrong.");
            } else {
                var removedFriendContainer = document.getElementById(response);
                removedFriendContainer.remove();
                removeDarkContainer();
                showConfirm("Friend removed.")
            }
        }
    })
}

// Accepts or ignores friend request
function acceptIgnoreFriendInvite(user_id, type) {
    $.ajax({
        type: "POST",
        url: './php_scripts/accept_ignore_friend_invite.php',
        data:{ user_id : user_id, type : type}, 
        success: function(response){
            if (response == "accepted") {
                showConfirm("User added to friends list!");
            } else if (response == "ignored") {
                showConfirm("Ignored friend invite.");
            } else if (response == "error") {
                showConfirm("Something went wrong.");
            }
            ajaxGet('./php_scripts/load_pending_invites.php', 'hub-add-friends-pending-container');
            checkPendingAmount();
        }
    })
}

// Takes user input in search bar and sends looks up the input in the database.
function searchForFriend(search) {
    $.ajax({
        type: "POST",
        url: './php_scripts/friend_add_search.php',
        data:{ search : search }, 
        success: function(response){
            resultContainer = document.getElementById("hub-add-friends-search-results-container");
            if (response == "none") {
                resultContainer.innerHTML = "No username or nickname found containing '" + search + "'.";
            } else {
                resultContainer.innerHTML = response;
            }
        }
    })
}

// Sends friend request from logged in user to a diffrent user
function sendFriendRequest(user_id, nickname) {
    $.ajax({
        type: "POST",
        url: './php_scripts/send_friend_request.php',
        data:{ user_id : user_id }, 
        success: function(response){
            if (response == "error") {
                showConfirm("Something went wrong.");
            } else {
                showConfirm("Sent friend request to " + nickname + "!");
                var search = document.getElementById("hub-add-friends-search-input").value;
                searchForFriend(search);
            }
        }
    })
}


// Functions and variables to stop and start intervals in friends list
var FriendsListIntervalState = 1;

function startFriendsListInterval() {
    FriendsListIntervalState = 1;
    var FriendsListInterval = setInterval(function(){
        if (FriendsListIntervalState == 1) {
            checkPendingAmount();
            var pendingRequestsContainer = document.getElementById("hub-add-friends-pending-container");
            if (pendingRequestsContainer !== null) {
                ajaxGet('./php_scripts/load_pending_invites.php', 'hub-add-friends-pending-container');
            }

            // If offline container exists then online container must exist
            var offlineContainer = document.getElementById("hub-friends-offline-container");
            if (offlineContainer !== null) {
                ajaxGet('./php_scripts/load_online_friends.php', 'hub-friends-online-container');
                ajaxGet('./php_scripts/load_offline_friends.php', 'hub-friends-offline-container');
            }
        } else {
            clearInterval(FriendsListInterval);
        }
    }, 3000);
}

// Stops friend list interval
function stopFriendsListInterval() {
    FriendsListIntervalState = 0;
}

// Logs in user
function loginForm() {
    var username = document.getElementById("username-input").value;
    var password = document.getElementById("password-input").value;
    $.ajax({
        type: "POST",
        url: './php_scripts/login_form_handler.php',
        data:{ username : username, password : password }, 
        success: function(response){
            if (response == "wrong") {
                showConfirm("Password or username incorrect!");
            } else if (response == "empty") {
                showConfirm("Inputs empty!");
            } else if (response == "exist") {
                showConfirm("User doesnt exist!");
            } else if (response == "correct") {
                window.location.href = "hub.php";
            } else {
                alert(response);
                showConfirm("You have been banned!");
            }
        }
    })
}

// Function thats called when user types in their email and presses next in forgot_link.php
function recoveryTypeIn() {
    var email = document.getElementById("forgot-email-input").value;

    $.ajax({
        type: "POST",
        url: './php_scripts/recovery_type_in_email.php',
        data:{ email : email }, 
        success: function(response){
            if (response == "notregistered") {
                showConfirm("This email is not registered to a GameHub account!");
            } else if (response == "empty") {
                showConfirm("Input empty!");
            } else if (response == "invalid") {
                showConfirm("Not a valid email adress!");
            } else {
                stopWaitClick();
                document.getElementById("dark-container").innerHTML = "";
                ajaxGet("./spa/login/recovery_type_in_code.php", "dark-container", "no_sfx");
            }
            stopWaitClick();
        }
    })
}

// Function that posts user inputted recovery code
function recoveryCode() {
    var code = document.getElementById("recovery_code_input").value;
    $.ajax({
        type: "POST",
        url: './php_scripts/recovery_type_in_code.php',
        data:{ code : code }, 
        success: function(response){
            if (response == "invalid") {
                showConfirm("Not a valid code!")
            } else if (response == "empty") {
                showConfirm("Input empty!");
            } else if (response == "existexpired") {
                showConfirm("Code is wrong or is expired.")
            } else {
                document.getElementById("dark-container").innerHTML = "";
                ajaxGet("./spa/login/recovery_final.php", "dark-container", "no_sfx");
            }
        }
    })
}

//Function to switch visibility of new password container
function showNewPassword() {
    button = document.getElementById("password-recovery-button");
    container = document.getElementById("new-password-input-container");

    if (window.getComputedStyle(container).display === 'none'){
        container.style.display = "block";
        button.innerHTML = "Save";
    } else {
        var password = document.getElementById("new-password-input").value;
        var password_confirm = document.getElementById("new-password-input-confirm").value;
        $.ajax({
            type: "POST",
            url: './php_scripts/recovery_save_password.php',
            data:{ password : password, password_confirm : password_confirm }, 
            success: function(response){
                if (response == "empty") {
                    showConfirm("Input empty!");
                } else if (response == "dontmatch") {
                    showConfirm("Passwords dont match!");
                } else {
                    removeDarkContainer();
                    showConfirm("Password saved.");
                }
            }
        })
    }
}

// Makes it so user has to wait before pressing button
function waitClick() {
    var waitContainer = document.getElementById("wait-container");
    waitContainer.style.display = "flex";
}

// Stops wait click
function stopWaitClick() {
    var waitContainer = document.getElementById("wait-container");
    waitContainer.style.display = "none";
}

// Creates account
function createAccount() {
    // Gets all neccessary inputs
    var username = document.getElementById("username-input").value;
    var nickname = document.getElementById("nickname-input").value;
    var description = document.getElementById("description-input").value;
    var email = document.getElementById("email-input").value;
    var email_confirm = document.getElementById("email-input-confirm").value;
    var password = document.getElementById("password-input").value;
    var password_confirm = document.getElementById("password-input-confirm").value;
    var checkbox = document.getElementById("terms-checkbox");
    if (checkbox.checked) {
        checkbox = "checked";
    } else {
        checkbox = "unchecked";
    }

    // Posts values
    $.ajax({
        type: "POST",
        url: './php_scripts/create_account.php',
        data:{
            username : username,
            nickname : nickname,
            description : description,
            email : email,
            email_confirm : email_confirm,
            password : password,
            password_confirm : password_confirm,
            checkbox : checkbox
        }, 
        success: function(response){
            if (response == "empty") {
                showConfirm("One or more inputs empty!");
            } else if (response == "password_dontmatch") {
                showConfirm("Passwords dont match!");
            } else if (response == "email_dontmatch") {
                showConfirm("Emails dont match!");
            } else if (response == "unchecked") {
                showConfirm("Checkbox unchecked!");
            } else if (response == "username_taken") {
                showConfirm("Username already taken!");
            } else if (response == "email_registered") {
                showConfirm("Email already registered!");
            } else if (response == "banned") {
                showConfirm("You have been banned! Log in to see reason.");
            } else if (response == "email_invalid") {
                showConfirm("Not a valid email adress!");
            } else if (response == "toolong") {
                showConfirm("Username is either too long or too short! Username need to be between 5-25 letters.");
            } else if (response == "whitelist") {
                showConfirm("Charachters in username not allowed!")
            } else {
                stopWaitClick();
                window.location.href = "hub.php";
            }
            stopWaitClick();
        },
        error: function() {
            stopWaitClick();
            showConfirm("Something went wrong.");
        }
    })
}

//password visibility button
function changeVisibility(inputID, buttonID){
    var passwordInput = document.getElementById(inputID)
    var visibilityButton = document.getElementById(buttonID)

    if (passwordInput.type === "password") {
        passwordInput.type = "text"
        visibilityButton.style.backgroundImage = "url(./img/icons/eye-password-show.svg)"
    }
    else {
        passwordInput.type = "password"
        visibilityButton.style.backgroundImage = "url(./img/icons/eye-password-hide.svg)"
    }
}

// Creates a new chat
function createChat(user_id, location) {
    $.ajax({
        type: "POST",
        url: './php_scripts/create_chat.php',
        data:{ user_id : user_id }, 
        success: function(response){
            if (response == "error") {
                showConfirm("Something went wrong.");
            } else {
                if (location == 1) {
                    removeDarkContainer();
                    ajaxGet("./php_scripts/load_messages.php", "messages-container", "scroll");
                    ajaxGet("./php_scripts/load_current_messenger.php", "current-messenger-container");
                    ajaxGet('./php_scripts/load_chat_list.php', 'messages-menu-chats-container');
                } else {
                    window.location.href = "messages.php";
                }
            }
        }
    })
}

// Error handles username
function validateUsername(username) {
    $.ajax({
        type: "POST",
        url: './php_scripts/validate_username.php',
        data:{ username : username }, 
        success: function(response){
            document.getElementById("username-validate-container").innerHTML = response;
        }
    })
}