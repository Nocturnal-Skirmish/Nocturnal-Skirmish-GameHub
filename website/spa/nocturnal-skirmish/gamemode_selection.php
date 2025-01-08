<style><?php include "./css/gamemode-selection.css" ?></style>

<div class="gamemode-selection-menu-container">
    <div class="gamemode-selection-header-container">
        <div class="gamemode-selection-header">
            Select Gamemode
        </div>
    </div>
    <div class="flickity-container">
        <div class="main-carousel">
            <div class="carousel-cell">
                <div class="cell-header">
                    Casual
                </div>
                <div class="carousel-pixelart-container" style="background-image: url(./img/cards/CryoEruption_Card.webp);"></div>
                <div class="carousel-select-button-container-container">
                    <div class="carousel-select-button-container">
                        <button title="Select casual gamemode" onclick="selectGamemode('casual')">Select</button>
                    </div>
                </div>
            </div>
            <div class="carousel-cell">
                <div class="cell-header">
                    Intermediate
                </div>
                <div class="carousel-pixelart-container" style="background-image: url(./img/cards/Eruption_Card.webp);"></div>
                <div class="carousel-select-button-container-container">
                    <div class="carousel-select-button-container">
                        <button title="Select intermediate gamemode" onclick="selectGamemode('intermediate')">Select</button>
                    </div>
                </div>
            </div>
            <div class="carousel-cell">
                <div class="cell-header">
                    Ranked
                </div>
                <div class="carousel-pixelart-container" style="background-image: url(./img/cards/FireballVolley_Card.webp);"></div>
                <div class="carousel-select-button-container-container">
                    <div class="carousel-select-button-container">
                        <button title="Select ranked gamemode" onclick="selectGamemode('ranked')">Select</button>
                    </div>
                </div>
            </div>
            <div class="carousel-cell">
                <div class="cell-header">
                    Dual
                </div>
                <div class="carousel-pixelart-container" style="background-image: url(./img/cards/DivergentSpirit_Card.webp);"></div>
                <div class="carousel-select-button-container-container">
                    <div class="carousel-select-button-container">
                        <button title="Select dual gamemode" onclick="ajaxGet('./spa/nocturnal-skirmish/invite-friend.php', 'dark-container')">Select</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="gamemode-selection-close-container">
        <button title="Close" onclick="removeDarkContainer()">Close</button>
    </div>
</div>