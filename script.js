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
        // Draw segment
        ctx.beginPath();
        ctx.moveTo(200, 200);
        ctx.arc(200, 200, 180, i * arcSize, (i + 1) * arcSize);
        ctx.fillStyle = getRandomColor();
        ctx.fill();
        ctx.stroke();

        // Calculate text angle & position
        const angle = i * arcSize + arcSize / 2;
        const radius = 130;
        const x = 200 + radius * Math.cos(angle);
        const y = 200 + radius * Math.sin(angle);

        // Draw text
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(0); // always horizontal
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "white";

        // Dynamic font size based on name length
        let fontSize = 18;
        ctx.font = `${fontSize}px Arial`;

        // Shrink font size if too wide
        let maxWidth = 80; // max width to fit in a slice
        while (ctx.measureText(players[i]).width > maxWidth && fontSize > 10) {
            fontSize -= 1;
            ctx.font = `${fontSize}px Arial`;
        }

        ctx.fillText(players[i], 0, 0);
        ctx.restore();
    }
}





// Random Color
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
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

    let randomSpin = 2000 + Math.floor(Math.random() * 360);
    let duration = 4000;
    let startTime = null;
    bottle = document.getElementById('bottle');

    // Play Spin Sound
    if (!spinSound) {
        spinSound = new Audio('./bottle sound.mp3');
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
const questions = {
    "Truth": [
        "What is the worst thing that ever happened ",
"Whom did you kiss the last  time ",
"If you were trapped in a room with fire what would you do", 
"What would be your last meal ",
"If it was your last day before dying what would you do",
"Who is your celebrity crush", 
"Whom would you thank for the state you are in today ",
"What names would you like to name your child ",
"What did you learn from your life ",
"What is your favourite thing from space",
"The one person you would erase from this world", 
"Whom do you hate the most", 
"What qualities would you like to have in your soulmate ",
"What would you like to be in your next life ",
"What are the three wishes that you think should become true", 
"How did you meet your bestfriend ",
"Do you have birthmarks and do you like them",
"The precious person in your life", 
"On the age of what do you want to marry ",
"Do you what to have love or arranged or forced marriage", 
"What life do you what to life ",
"Whom do you want to share one night", 
"Which is your dream place and why",

        "niku emani ante ekkuva kopam vastundi?",
        "likhitha is a serial villian  or not?",
        "niku knife icchi champamante evarni champutav?",

    ],
    "Dare": [
        "close your eyes walk 50meters",
        "keep water in ur mouth and talk",
        "touch ur nose with tongue",
        "cycle tokkinattu act chey",
        "act like ur favorate heroine",
        "sing a song without opening ur mouth",
        "do cat walk",
        "banana tintunnatu act chey ",
        "clap using legs",
        "Eat green chilli with red chilli powder",
"Run five rounds shouting help me ",
"Talk in pure english for 10 minutes",
"Go to random house and ring the bell ",
"Go to your mom and tell who am l ",
"Call a random number and make random sounds ",
"Act like a beggar ",
"Do thirty jumping jacks ",
"Ask shyam anna to draw moustache for likhitha and tell her to stay like that for the whole game ",
"Take water and pour on your head ",
"Act like a psychopath ",
"Slap someone ",
"Pour salt in water and drink", 
"Sit on some one's. Lap for 5 min", 
"Lay on the ground for 5 min ",
"Dance with aayansh ",
"Brush with salt ",
"Put mud in your slippers and mix water and do cat walk "



    ],
    "Bunnify": [
        "Rohan ,charan ,your dad ",
        "Likhitha , angel , rashmika mandanna ",
        "Richelle ,anvay, charan ",
        "Neha ,Nithya ,Deepu  ",
        "Aayansh , shyam anna,bindu akka ",
        "Your friend ,best friend ,and your play friends ",
        "Alia bhatt ,rashmika mandanna , tenali rama"
        

    ]
};
// Handle Action Selection (Truth, Dare, Bunnify)
function selectAction(actionType) {
    selectedAction = actionType;

    

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
    const dgifs=[
        "dgif1.gif",
        "dgif2.gif","dgif3.gif","dgif4.gif","dgif5.gif","dgif6.gif","dgif7.gif","dgif8.gif",
        
    ]

    bottle.style.display = "none";
document.getElementById('wheel').style.display = "none";
document.getElementById('wbutton').style.display='block';
const randomimg=Math.floor(Math.random()*dgifs.length);

document.getElementById('gifimg').src=dgifs[randomimg];

setTimeout(()=>{
    document.getElementById('wbutton').style.display='none';
    document.getElementById('questionArea').style.display = "none";

// Show bottle and wheel again
bottle.style.display = "block";
document.getElementById('wheel').style.display = "block";
},2500)
    
}

function forfeit(){
    let gifs=[
        "gif1.gif",
        "gif2.gif",
        "gif3.gif",
        "gif4.gif",
        "gif5.gif","gif6.gif","gif7.gif","gif8.gif","gif9.gif","gif10.gif","gif11.gif","gif12.gif",
    ]
        document.getElementById('questionArea').style.display = "none";
        bottle.style.display = "none";
    document.getElementById('wheel').style.display = "none";
    document.getElementById('wbutton').style.display='block';
    const randomimg=Math.floor(Math.random()*gifs.length);

    document.getElementById('gifimg').src=gifs[randomimg];

    setTimeout(()=>{
        document.getElementById('wbutton').style.display='none';
        document.getElementById('questionArea').style.display = "none";

    // Show bottle and wheel again
    bottle.style.display = "block";
    document.getElementById('wheel').style.display = "block";
 },2500)

}
function changeQuestion() {
    if (!selectedAction) return;

    let availableQuestions = questions[selectedAction];
    if (!availableQuestions || availableQuestions.length === 0) return;

    let newQuestion = availableQuestions[Math.floor(Math.random() * availableQuestions.length)];

    document.getElementById('randomQuestion').textContent = newQuestion;
}

// On Page Load
window.onload = () => {
    drawWheel();
    document.getElementById('bottle').addEventListener('click', spinBottle);
    document.getElementById('doneButton').addEventListener('click', done);
    document.getElementById('sButton').addEventListener('click', forfeit);
    document.getElementById('changequestion').addEventListener('click', changeQuestion);




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
