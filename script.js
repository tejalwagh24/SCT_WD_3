// CANVAS

const canvas =
document.getElementById("bg");

const ctx =
canvas.getContext("2d");

canvas.width =
window.innerWidth;

canvas.height =
window.innerHeight;


// PARTICLES

const particles = [];

for(let i=0;i<130;i++){

  particles.push({

    x:Math.random()*canvas.width,

    y:Math.random()*canvas.height,

    radius:Math.random()*2,

    dx:(Math.random()-0.5)*0.4,

    dy:(Math.random()-0.5)*0.4

  });

}


// ANIMATION

function animate(){

  ctx.clearRect(
  0,
  0,
  canvas.width,
  canvas.height
  );

  particles.forEach(p => {

    p.x += p.dx;
    p.y += p.dy;

    if(p.x < 0 ||
       p.x > canvas.width){

      p.dx *= -1;

    }

    if(p.y < 0 ||
       p.y > canvas.height){

      p.dy *= -1;

    }

    ctx.beginPath();

    ctx.arc(
      p.x,
      p.y,
      p.radius,
      0,
      Math.PI*2
    );

    ctx.fillStyle =
    "rgba(255,255,255,0.5)";

    ctx.fill();

  });


  // CONNECTIONS

  for(let a=0;a<particles.length;a++){

    for(let b=a;b<particles.length;b++){

      let dx =
      particles[a].x -
      particles[b].x;

      let dy =
      particles[a].y -
      particles[b].y;

      let distance =
      Math.sqrt(dx*dx + dy*dy);

      if(distance < 100){

        ctx.beginPath();

        ctx.strokeStyle =
        `rgba(139,255,207,
        ${1-distance/100})`;

        ctx.lineWidth = 0.5;

        ctx.moveTo(
        particles[a].x,
        particles[a].y
        );

        ctx.lineTo(
        particles[b].x,
        particles[b].y
        );

        ctx.stroke();

      }

    }

  }

  requestAnimationFrame(
  animate
  );

}

animate();


// QUIZ SYSTEM

const questionText =
document.getElementById("question");

const optionsContainer =
document.getElementById("options");

const analysis =
document.getElementById("analysis");

const phase =
document.getElementById("phase");

const scoreDisplay =
document.getElementById("score");

const timerDisplay =
document.getElementById("timer");

const nextBtn =
document.getElementById("next-btn");

const memoryLog =
document.getElementById("memory-log");


let currentQuestion = 0;

let score = 0;

let timer = 15;

let interval;

let answered = false;

let hesitationCount = 0;

let fastAnswers = 0;


// QUESTIONS

const questions = [

  {

    question:
    "Select the sequence that feels incomplete.",

    options:
    ["◼ ◻ ◼ ?", "▲ ▲ ▼ ▲", "● ● ● ●", "◆ ◇ ◆ ◇"],

    answer:
    "◼ ◻ ◼ ?"

  },

  {

    question:
    "Which language controls web interactivity?",

    options:
    ["Python","JavaScript","C++","Java"],

    answer:
    "JavaScript"

  },

  {

    question:
    "Choose the symbol pattern that breaks symmetry.",

    options:
    ["⬡ ⬡ ⬡","◉ ◉ ◎","▲ ▲ ▲","◆ ◆ ◆"],

    answer:
    "◉ ◉ ◎"

  },

  {

    question:
    "Which property styles webpage appearance?",

    options:
    ["CSS","Node.js","MongoDB","API"],

    answer:
    "CSS"

  }

];


// LOAD QUESTION

function loadQuestion(){

  answered = false;

  clearInterval(interval);

  timer = 15;

  timerDisplay.innerHTML =
  timer;

  startTimer();

  const q =
  questions[currentQuestion];

  phase.innerHTML =
  `0${currentQuestion+1}`;

  questionText.innerHTML =
  q.question;

  optionsContainer.innerHTML =
  "";

  q.options.forEach(option => {

    const button =
    document.createElement("button");

    button.classList.add("option");

    button.innerHTML =
    option;

    button.onclick = () =>
    selectAnswer(button,option);

    optionsContainer.appendChild(button);

  });

}


// TIMER

function startTimer(){

  interval =
  setInterval(() => {

    timer--;

    timerDisplay.innerHTML =
    timer;

    if(timer <= 5){

      document.body.style.background =
      "#120404";

    }

    if(timer <= 0){

      clearInterval(interval);

      hesitationCount++;

      analysis.innerHTML =
      "hesitation threshold elevated.";

      lockOptions();

    }

  },1000);

}


// SELECT ANSWER

function selectAnswer(button,option){

  if(answered) return;

  answered = true;

  clearInterval(interval);

  const correct =
  questions[currentQuestion].answer;

  const allOptions =
  document.querySelectorAll(".option");


  allOptions.forEach(btn => {

    if(btn.innerHTML === correct){

      btn.classList.add("correct");

    }

  });


  if(timer >= 10){

    fastAnswers++;

  }


  if(option === correct){

    score++;

    scoreDisplay.innerHTML =
    score;

    button.classList.add("correct");

    analysis.innerHTML =
    "pattern recognition confirmed.";

    document.body.style.background =
    "#04110d";

  }

  else{

    button.classList.add("wrong");

    analysis.innerHTML =
    "cognitive instability detected.";

    document.body.style.background =
    "#120404";

  }


  // MEMORY

  const memoryItem =
  document.createElement("div");

  memoryItem.classList.add(
  "memory-item"
  );

  memoryItem.innerHTML =
  `${questions[currentQuestion].question}`;

  memoryLog.prepend(memoryItem);

}


// LOCK OPTIONS

function lockOptions(){

  answered = true;

  const correct =
  questions[currentQuestion].answer;

  const allOptions =
  document.querySelectorAll(".option");

  allOptions.forEach(btn => {

    if(btn.innerHTML === correct){

      btn.classList.add("correct");

    }

  });

}


// NEXT

nextBtn.addEventListener("click", () => {

  currentQuestion++;

  document.body.style.background =
  "#020202";

  if(currentQuestion < questions.length){

    loadQuestion();

  }

  else{

    finishEvaluation();

  }

});


// FINAL ANALYSIS

function finishEvaluation(){

  clearInterval(interval);

  optionsContainer.innerHTML =
  "";

  nextBtn.style.display =
  "none";

  timerDisplay.innerHTML =
  "00";


  let profile =
  "";


  if(score >= 3){

    profile +=
    "high pattern recognition.<br>";

  }

  else{

    profile +=
    "logic consistency unstable.<br>";

  }


  if(hesitationCount >= 2){

    profile +=
    "hesitation under pressure detected.<br>";

  }


  if(fastAnswers >= 2){

    profile +=
    "rapid cognition observed.<br>";

  }


  questionText.innerHTML =
  "EVALUATION COMPLETE";


  analysis.innerHTML =

  `
  FINAL SCORE: ${score}/${questions.length}
  <br><br>
  COGNITIVE ANALYSIS:
  <br><br>
  ${profile}
  curiosity threshold elevated.
  <br><br>
  the machine remembers you.
  `;


  // FINAL FORM

  document.body.style.background =
  "#f5f5f5";

  document.body.style.color =
  "#020202";

}


// START

loadQuestion();


// RESIZE

window.addEventListener(
"resize",
() => {

  canvas.width =
  window.innerWidth;

  canvas.height =
  window.innerHeight;

});