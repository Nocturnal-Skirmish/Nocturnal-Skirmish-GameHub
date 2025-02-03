// JavaScript file for card dex

// Function that loads in modal of card and description
function viewCard(card_id) {
    var url = "./spa/nocturnal-skirmish/viewcard.php?card=" + card_id

    ajaxGet(url, "dark-container");

    setTimeout(function(){
        perspective();
    }, 500)
}

// CREDIT: https://armandocanals.com/posts/CSS-transform-rotating-a-3D-object-perspective-based-on-mouse-position.html
function perspective() {
    let constrain = 20;
    let mouseOverContainer = document.getElementById("main-card-container");
    let ex1Layer = document.getElementById("main-card");

    function transforms(x, y, el) {
        let box = el.getBoundingClientRect();
        let calcX = -(y - box.y - (box.height / 2)) / constrain;
        let calcY = (x - box.x - (box.width / 2)) / constrain;
    
    return "perspective(100px) "
        + "   rotateX("+ calcX +"deg) "
        + "   rotateY("+ calcY +"deg) ";
    };

    function transformElement(el, xyEl) {
    el.style.transform  = transforms.apply(null, xyEl);
    }

    mouseOverContainer.onmousemove = function(e) {
        let xy = [e.clientX, e.clientY];
        let position = xy.concat([ex1Layer]);
        console.log(xy)

        window.requestAnimationFrame(function(){
            transformElement(ex1Layer, position);
        });
    };

    mouseOverContainer.onmouseout = function(e) {
        ex1Layer.style = "";
    }
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

// Event listeners for mobile dropdown on sidebar
document.getElementById("carddex-sidebar-open").addEventListener("click", function() {
    document.getElementById("carddex-sidebar-container").style.display = "flex";
    document.getElementById("carddex-sidebar-background").style.display = "block";
    document.getElementById("carddex-sidebar-open").style.display = "none";
})

document.getElementById("carddex-sidebar-close").addEventListener("click", function() {
    document.getElementById("carddex-sidebar-container").style.display = "none";
    document.getElementById("carddex-sidebar-background").style.display = "none";
    document.getElementById("carddex-sidebar-open").style.display = "flex";
})