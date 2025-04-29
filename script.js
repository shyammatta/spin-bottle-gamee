let players = JSON.parse(localStorage.getItem("players")) || [];
let bottle = null;
let spinning = false;
let spinSound = null;
let timerInterval;
let selectedPlayer = ""; // ADDED
let selectedAction = ""; // ADDED

// Draw the Wheel
function drawWheel() {
    const canvas = document.getElementById('wheel');
    const ctx = canvas.getContext('2d');
    const totalPlayers = players.length;
    const arcSize = (2 * Math.PI) / totalPlayers;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < totalPlayers; i++) {
        ctx.beginPath();
        ctx.moveTo(200, 200);
        ctx.arc(200, 200, 180, i * arcSize, (i + 1) * arcSize);
        ctx.fillStyle = getRandomColor();
        ctx.fill();
        ctx.stroke();

        ctx.save();
        ctx.translate(200, 200);
        ctx.rotate(i * arcSize + arcSize / 2);
        ctx.textAlign = "center";
        ctx.fillStyle = "black";
        ctx.font = "20px Arial";
        ctx.letterSpacing="20px";

        const name = players[i];
        for (let j = 0; j < name.length; j++) {
            ctx.fillText(name[j], 150, (j - name.length/2) * 16);
        }
        ctx.restore();
    }
}

// Random Color
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++ ) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// Easing Function
function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
}

// Spin Bottle
function spinBottle() {
    if (spinning) return;
    spinning = true;

    let randomSpin = 1000 + Math.floor(Math.random() * 360);
    let duration = 4000;
    let startTime = null;
    bottle = document.getElementById('bottle');

    // Play Spin Sound
    if (!spinSound) {
        spinSound = new Audio('https://cdn.pixabay.com/download/audio/2022/03/15/audio_f357b0fc8b.mp3');
    }
    spinSound.play();

    function rotate(timestamp) {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);

        const easedProgress = easeOutCubic(progress);
        const currentAngle = randomSpin * easedProgress;

        bottle.style.transform = `translate(-50%, -50%) rotate(${currentAngle}deg)`;

        if (progress < 1) {
            requestAnimationFrame(rotate);
        } else {
            spinSound.pause();
            spinSound.currentTime = 0;
            spinning = false;
            pickWinner(randomSpin);
        }
    }

    requestAnimationFrame(rotate);
}

// Pick Winner after stop
function pickWinner(finalAngle) {
    const totalPlayers = players.length;
    const degreesPerPlayer = 360 / totalPlayers;

    let adjustedAngle = (finalAngle % 360);

    const bottle = document.getElementById('bottle');
    const lidCorrectionAngle = calculateLidAngle(bottle);

    let lidAngle = (adjustedAngle + lidCorrectionAngle) % 360;

    let index = Math.floor((lidAngle) / degreesPerPlayer) % totalPlayers;
    if (index < 0) index += totalPlayers;

    selectedPlayer = players[index]; // ADDED

    // Hide bottle and wheel
    bottle.style.display = "none";
    document.getElementById('wheel').style.display = "none";


    // Show action buttons
    document.getElementById('actionButtons').style.display = "block"; // ADDED
    document.getElementById('selectedName').textContent = `Selected: ${selectedPlayer}`;


}

// Handle Action Selection (Truth, Dare, Bunnify)
function selectAction(actionType) {
    selectedAction = actionType;

    const questions = {
        "Truth": [
            "What's your biggest fear?",
            "Tell a secret nobody knows.",
            "Have you ever cheated on a test?"
        ],
        "Dare": [
            "Do 10 jumping jacks!",
            "Dance without music for 30 seconds!",
            "Sing your favorite song loudly!"
        ],
        "Bunnify": [
            "Act like a bunny for 30 seconds!",
            "Hop around the room!",
            "Eat a carrot like a bunny!"
        ]
    };

    let randomQuestion = questions[actionType][Math.floor(Math.random() * questions[actionType].length)];

    // Hide action buttons
    document.getElementById('actionButtons').style.display = "none";

    // Show question area
    document.getElementById('questionArea').style.display = "block";
    document.getElementById('selectedName').textContent = `Selected: ${selectedPlayer}`;
    document.getElementById('randomQuestion').textContent = randomQuestion;

    startTimer();
}

// Start 30 second timer
function startTimer() {
    let timeLeft = 30;
    const timer = document.getElementById('timer');
    timer.textContent = timeLeft;

    clearInterval(timerInterval);

    timerInterval = setInterval(() => {
        timeLeft--;
        timer.textContent = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
        }
    }, 1000);
}

// Done button click
function done() {
    clearInterval(timerInterval);

    // Hide question area
    document.getElementById('questionArea').style.display = "none";

    // Show bottle and wheel again
    bottle.style.display = "block";
    document.getElementById('wheel').style.display = "block";
}

// On Page Load
window.onload = () => {
    drawWheel();
    document.getElementById('bottle').addEventListener('click', spinBottle);
    document.getElementById('doneButton').addEventListener('click', done);

    // Setup action button clicks
    document.getElementById('truthButton').addEventListener('click', () => selectAction("Truth")); // ADDED
    document.getElementById('dareButton').addEventListener('click', () => selectAction("Dare")); // ADDED
    document.getElementById('bunnifyButton').addEventListener('click', () => selectAction("Bunnify")); // ADDED
}

function calculateLidAngle(bottle) {
    const rect = bottle.getBoundingClientRect();
    const bottleCenterX = rect.left + rect.width / 2;
    const bottleCenterY = rect.top + rect.height / 2;

    const lidX = rect.left + rect.width / 2;
    const lidY = rect.top;

    const wheel = document.getElementById('wheel');
    const wheelRect = wheel.getBoundingClientRect();
    const wheelCenterX = wheelRect.left + wheelRect.width / 2;
    const wheelCenterY = wheelRect.top + wheelRect.height / 2;

    const deltaX = lidX - wheelCenterX;
    const deltaY = lidY - wheelCenterY;

    let angleInDegrees = Math.atan2(deltaY, deltaX) * (180 / Math.PI);

    angleInDegrees = (angleInDegrees + 360) % 360;

    return angleInDegrees;
}
