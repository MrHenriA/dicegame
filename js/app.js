/*
GAME RULES:
- Two players race to the target score.
- Roll to add dice points to the round pot.
- Every third safe roll in a turn activates a hot-streak bonus.
- Rolling 1 busts the round pot and passes the turn.
- Bank to add the round pot to the player score and pass the turn.
*/

var targetScore = 75;
var scores, roundScore, activePlayer, gamePlaying, safeRollStreak;

var diceDom = document.querySelector(".dice");
var eventFeed = document.getElementById("event-feed");
var comboBadge = document.getElementById("combo-badge");
var burstLayer = document.getElementById("burst-layer");

init();

document.querySelector(".btn-roll").addEventListener("click", function() {
  if (!gamePlaying) return;

  var dice = Math.floor(Math.random() * 6) + 1;
  diceDom.style.display = "inline-flex";
  diceDom.src = "img/dice-" + dice + ".png";
  diceDom.classList.remove("dice-roll");
  void diceDom.offsetWidth;
  diceDom.classList.add("dice-roll");

  if (dice !== 1) {
    safeRollStreak += 1;
    var bonus = safeRollStreak % 3 === 0 ? dice : 0;
    roundScore += dice + bonus;
    setText("current-" + activePlayer, roundScore);
    setText("hint-" + activePlayer, bonus ? "+" + bonus + " hot bonus!" : "Keep rolling or bank it");
    updateHud();
    pulsePanel("player-" + activePlayer + "-panel");

    if (bonus) {
      showEvent("🔥 Hot streak! Bonus +" + bonus + " added.");
      burst("hot");
    } else {
      showEvent("Player " + (activePlayer + 1) + " rolled " + dice + ". Pot is " + roundScore + ".");
    }
  } else {
    showEvent("💥 Bust! Round pot burned. Player " + (activePlayer + 1) + " loses the turn.");
    burst("bust");
    nextPlayer();
  }
});

document.querySelector("#x-icon").addEventListener("click", function() {
  document.getElementById("rules").style.animation = "fadeOut .5s 1";

  setTimeout(function() {
    document.querySelector("#rules").style.display = "none";
    document.querySelector(".btn-roll").style.animation = "shake 1s 1";
  }, 400);

  setTimeout(function() {
    document.querySelector(".btn-roll").style.animation = "shake .8s 1";
  }, 500);
});

document.querySelector(".btn-hold").addEventListener("click", function() {
  if (!gamePlaying || roundScore === 0) {
    showEvent("Build a pot first, then bank it.");
    return;
  }

  scores[activePlayer] += roundScore;
  setText("score-" + activePlayer, scores[activePlayer]);
  updateProgress();
  burst("bank");

  if (scores[activePlayer] >= targetScore) {
    setText("name-" + activePlayer, "Winner!");
    diceDom.style.display = "none";
    document.querySelector(".player-" + activePlayer + "-panel").classList.add("winner");
    document.querySelector(".player-" + activePlayer + "-panel").classList.remove("active");
    document.getElementById("name-" + activePlayer).style.animation = "jackInTheBox 1s 1";
    document.getElementById("score-" + activePlayer).style.animation = "flash 1s 1";
    showEvent("👑 Player " + (activePlayer + 1) + " wins the neon crown!");
    setTimeout(function() {
      document.querySelector(".btn-new").style.animation = "shake .9s 1";
    }, 900);
    gamePlaying = false;
  } else {
    showEvent("💰 Player " + (activePlayer + 1) + " banked " + roundScore + " points.");
    nextPlayer();
  }
});

document.querySelector(".btn-new").addEventListener("click", function() {
  init();
});

function nextPlayer() {
  activePlayer = activePlayer === 0 ? 1 : 0;
  roundScore = 0;
  safeRollStreak = 0;

  setText("current-0", "0");
  setText("current-1", "0");
  setText("hint-0", activePlayer === 0 ? "Your move" : "Bank before you bust");
  setText("hint-1", activePlayer === 1 ? "Your move" : "Bank before you bust");
  document.querySelector(".player-0-panel").classList.toggle("active");
  document.querySelector(".player-1-panel").classList.toggle("active");
  diceDom.style.display = "none";
  updateHud();
}

function init() {
  gamePlaying = true;
  scores = [0, 0];
  roundScore = 0;
  activePlayer = 0;
  safeRollStreak = 0;

  diceDom.style.display = "none";
  setText("target-score", targetScore);
  setText("score-0", "0");
  setText("score-1", "0");
  setText("current-0", "0");
  setText("current-1", "0");
  setText("name-0", "Player 1");
  setText("name-1", "Player 2");
  setText("hint-0", "Your move");
  setText("hint-1", "Bank before you bust");

  document.querySelector(".player-0-panel").classList.remove("winner");
  document.querySelector(".player-1-panel").classList.remove("winner");
  document.querySelector(".player-0-panel").classList.remove("active");
  document.querySelector(".player-1-panel").classList.remove("active");
  document.querySelector(".player-0-panel").classList.add("active");

  document.getElementById("rules").style.display = "block";
  document.getElementById("rules").style.animation = "bounceIn 1s 1";
  animateIntro();
  updateHud();
  updateProgress();
  showEvent("Roll to build heat. Bank before a 1 wipes the pot.");
}

function updateHud() {
  setText("streak-count", "x" + safeRollStreak);
  setText("combo-badge", "Combo x" + (Math.floor(safeRollStreak / 3) + 1));

  var risk = "Safe";
  if (roundScore >= 20) risk = "Spicy";
  if (roundScore >= 35) risk = "Danger";
  setText("risk-level", risk);
}

function updateProgress() {
  document.getElementById("progress-0").style.width = Math.min(100, scores[0] / targetScore * 100) + "%";
  document.getElementById("progress-1").style.width = Math.min(100, scores[1] / targetScore * 100) + "%";
}

function showEvent(message) {
  eventFeed.textContent = message;
  eventFeed.classList.remove("event-pop");
  void eventFeed.offsetWidth;
  eventFeed.classList.add("event-pop");
}

function burst(type) {
  var icons = type === "bust" ? ["💥", "⚡", "🧨"] : ["✨", "🔥", "💎", "⭐"];
  for (var i = 0; i < 14; i += 1) {
    var particle = document.createElement("span");
    particle.textContent = icons[Math.floor(Math.random() * icons.length)];
    particle.style.left = 45 + Math.random() * 10 + "%";
    particle.style.top = 34 + Math.random() * 16 + "%";
    particle.style.setProperty("--x", Math.random() * 260 - 130 + "px");
    particle.style.setProperty("--y", Math.random() * -220 - 40 + "px");
    burstLayer.appendChild(particle);
    removeParticle(particle);
  }
}

function removeParticle(particle) {
  setTimeout(function() {
    particle.remove();
  }, 900);
}

function pulsePanel(className) {
  var panel = document.querySelector("." + className);
  panel.classList.remove("score-pulse");
  void panel.offsetWidth;
  panel.classList.add("score-pulse");
}

function animateIntro() {
  document.getElementById("name-0").style.animation = "fadeInDown 1s 1";
  document.getElementById("name-1").style.animation = "fadeInDown 1s 1";
  document.getElementById("score-0").style.animation = "fadeInLeft 1s 1";
  document.getElementById("score-1").style.animation = "fadeInRight 1s 1";
  document.getElementById("current-0").style.animation = "fadeInUp 1s 1";
  document.getElementById("current-1").style.animation = "fadeInUp 1s 1";
}

function setText(id, value) {
  document.getElementById(id).textContent = value;
}
