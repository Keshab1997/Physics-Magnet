// script.js for Flash Card Game (সম্পূর্ণ আপডেট - টাচ এবং কি-বোর্ড কন্ট্রোল সহ)

document.addEventListener('DOMContentLoaded', () => {
    // URL থেকে সেট নম্বর নেওয়া হচ্ছে
    const urlParams = new URLSearchParams(window.location.search);
    const setNumber = urlParams.get('set') || '1'; 

    // সঠিক ফ্ল্যাশ কার্ড সেট নির্বাচন করা
    let flashcards = [];
    if (typeof allFlashcardSets !== 'undefined' && allFlashcardSets[setNumber]) {
        flashcards = allFlashcardSets[setNumber];
    }

    // DOM এলিমেন্টগুলো ধরা
    const cardInner = document.querySelector('.card-inner');
    const cardFrontText = document.getElementById('card-front-text');
    const cardBackText = document.getElementById('card-back-text');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const shuffleBtn = document.getElementById('shuffle-btn');
    const cardCounter = document.getElementById('card-counter');
    const gameTitle = document.querySelector('.flashcard-game-container header h1');

    let currentCardIndex = 0;

    // যদি প্রশ্ন না পাওয়া যায়, তাহলে এরর মেসেজ দেখানো
    if (flashcards.length === 0) {
        document.querySelector('.flashcard-game-container').innerHTML = `
            <h1 style="color: red; font-size: 1.5rem;">দুঃখিত!</h1>
            <p>সেট নম্বর '${setNumber}' খুঁজে পাওয়া যায়নি অথবা এই সেটে কোনো প্রশ্ন যোগ করা হয়নি।</p>
            <a href="../../index.html" class="back-to-home" style="margin-top: 20px;">মূল মেনুতে ফিরে যান</a>`;
        return;
    }

    // গেমের টাইটেল আপডেট করা
    gameTitle.textContent = `ফ্ল্যাশ কার্ড: সেট ${setNumber}`;
    
    // কার্ড দেখানোর ফাংশন
    function showCard(index) {
        if (cardInner.classList.contains('is-flipped')) {
            cardInner.classList.remove('is-flipped');
        }
        
        const card = flashcards[index];
        cardFrontText.textContent = card.question;
        cardBackText.textContent = card.answer;
        
        cardCounter.textContent = `${index + 1} / ${flashcards.length}`;
        
        prevBtn.disabled = index === 0;
        nextBtn.disabled = index === flashcards.length - 1;
    }

    // কার্ড ফ্লিপ করার ফাংশন
    function flipCard() { cardInner.classList.toggle('is-flipped'); }
    // পরবর্তী কার্ড
    function nextCard() { if (!nextBtn.disabled) { currentCardIndex++; showCard(currentCardIndex); } }
    // আগের কার্ড
    function prevCard() { if (!prevBtn.disabled) { currentCardIndex--; showCard(currentCardIndex); } }
    // কার্ড এলোমেলো করা
    function shuffleCards() {
        for (let i = flashcards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [flashcards[i], flashcards[j]] = [flashcards[j], flashcards[i]];
        }
        currentCardIndex = 0;
        showCard(currentCardIndex);
    }

    // কি-বোর্ড কন্ট্রোলের জন্য ফাংশন
    function setupKeyboardControls() {
        document.addEventListener('keydown', (event) => {
            if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') return;

            switch (event.key) {
                case 'ArrowRight': nextCard(); break;
                case 'ArrowLeft': prevCard(); break;
                case 'Enter':
                case ' ': // Enter এবং Spacebar উভয় দিয়েই ফ্লিপ হবে
                    flipCard();
                    event.preventDefault(); 
                    break;
                case 's': case 'S': shuffleCards(); break;
            }
        });
    }

    // টাচ (সোয়াইপ) কন্ট্রোলের জন্য ফাংশন
    function setupTouchControls() {
        const cardElement = document.getElementById('flashcard');
        let touchStartX = 0;
        let touchEndX = 0;

        cardElement.addEventListener('touchstart', (event) => {
            touchStartX = event.changedTouches[0].screenX;
        }, { passive: true });

        cardElement.addEventListener('touchend', (event) => {
            touchEndX = event.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });

        function handleSwipe() {
            const swipeThreshold = 50; // ন্যূনতম সোয়াইপ দূরত্ব
            if (touchEndX > touchStartX + swipeThreshold) {
                prevCard();
            } else if (touchEndX < touchStartX - swipeThreshold) {
                nextCard();
            }
        }
    }

    // ইভেন্ট লিসেনারগুলো যোগ করা
    document.getElementById('flashcard').addEventListener('click', flipCard);
    nextBtn.addEventListener('click', nextCard);
    prevBtn.addEventListener('click', prevCard);
    shuffleBtn.addEventListener('click', shuffleCards);

    // প্রথম কার্ড দেখানো এবং কন্ট্রোলগুলো চালু করা
    showCard(currentCardIndex);
    setupKeyboardControls();
    setupTouchControls();
});