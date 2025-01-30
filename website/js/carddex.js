// JavaScript file for card dex

// Function that loads in modal of card and description
function viewCard(card_id) {
    var url = "./spa/nocturnal-skirmish/viewcard.php?card=" + card_id

    ajaxGet(url, "dark-container");
}

// event listener from search bar
document.getElementById("searchInput").addEventListener("keyup", function() {
    var search = this.value

    searchCard(search)
})

var search = "";

// Searches for card in database
function searchCard(searching) {
    var url = "./php_scripts/load_card_grid.php";
    search = searching;

    fetch(url, {
        method : "POST",
        body : JSON.stringify({
            search : search
        }),
        credentials : "same-origin"
    })

    .then(response => response.text())

    .then(html => {
        document.getElementById("card-grid").innerHTML = html;
    })

    .catch(error => {
        console.error(error)
        document.getElementById("card-grid").innerHTML = "<p class='not-found-p'>Something went wrong.</p>"
    })
}

// Sorts cards by a column
function sortBy(column) {
    var url = "./php_scripts/carddex_sort.php"

    fetch(url, {
        method : "POST",
        body : JSON.stringify({
            column : column
        }),
        credentials : "same-origin"
    })

    .then(() => {
        searchCard(search);
    })

    .catch(error => {
        console.error(error);
        showConfirm("Something went wrong.");
    })
}