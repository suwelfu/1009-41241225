$(document).ready(function () {
    const gameBoard = $('.game-board');
    let flippedCards = [];
    let matchedCards = [];
    const successSound = new Audio('music/select05.mp3');
    const failSound = new Audio('music/select08.mp3');
    let countdownTime = parseInt($('#countdown').val());
    let hideMatched = $('#hide-matched').val() === 'yes';

    // 監聽倒數計時選擇
    $('#countdown').on('change', function () {
        countdownTime = parseInt($(this).val());
    });

    // 監聽隱藏匹配卡片選擇
    $('#hide-matched').on('change', function () {
        hideMatched = $(this).val() === 'yes';
    });

    // 監聽網格大小選擇
    $('#grid-size').on('change', function () {
        const gridSize = parseInt($(this).val());
        generateBoard(gridSize);
    });

    // 初始化遊戲板
    generateBoard(4);

    // 根據網格大小生成遊戲板
    function generateBoard(size) {
        gameBoard.empty();
        gameBoard.attr('data-grid', size);
        flippedCards = [];
        matchedCards = [];

        let totalCards = size * size;
        let cardImages = [];
        for (let i = 0; i < totalCards / 2; i++) {
            cardImages.push(`img/img${i + 1}.png`, `img/img${i + 1}.png`);
        }

        cardImages.sort(() => 0.5 - Math.random());

        cardImages.forEach((imgSrc, index) => {
            const cardHTML = `
                <div class="card-container">
                    <div class="card" data-card-id="${index}">
                        <div class="front">
                            <img src="img/im0.jfif" alt="Cover Image">
                        </div>
                        <div class="back">
                            <img src="${imgSrc}" alt="Card Image">
                        </div>
                    </div>
                </div>`;
            gameBoard.append(cardHTML);
        });

        $('.card').on('click', handleCardClick);
    }

    // 處理卡片點擊事件
    function handleCardClick() {
        if ($(this).hasClass('flipped') || $(this).hasClass('matched') || flippedCards.length === 2) return;

        $(this).toggleClass('flipped');
        flippedCards.push($(this));

        if (flippedCards.length === 2) {
            const card1 = flippedCards[0].find('.back img').attr('src');
            const card2 = flippedCards[1].find('.back img').attr('src');

            if (card1 === card2) {
                successSound.play();
                matchedCards.push(...flippedCards);
                flippedCards.forEach(card => card.addClass('matched'));

                if (hideMatched) {
                    setTimeout(() => {
                        flippedCards.forEach(card => card.fadeOut(300));
                        flippedCards = [];
                    }, 500);
                } else {
                    flippedCards = [];
                }

                if (matchedCards.length === size * size) {
                    setTimeout(() => alert('You win!'), 500);
                }
            } else {
                failSound.play();
                setTimeout(() => {
                    flippedCards.forEach(card => card.removeClass('flipped'));
                    flippedCards = [];
                }, countdownTime);
            }
        }
    }
});
