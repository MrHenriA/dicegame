// /*
// GAME RULES:

// - The game has 2 players, playing in rounds
// - In each turn, a player rolls a dice as many times as he whishes. Each result get added to his ROUND score
// - BUT, if the player rolls a 1, all his ROUND score gets lost. After that, it's the next player's turn
// - The player can choose to 'Hold', which means that his ROUND score gets added to his GLBAL score. After that, it's the next player's turn
// - The first player to reach 100 points on GLOBAL score wins the game

// */

var scores, sroundScore, activePlayer, gamePlaying;
init();

// Main code

document.querySelector(".btn-roll").addEventListener("click", function() {
  if (gamePlaying) {
    // 1. random number
    var dice = Math.floor(Math.random() * 6) + 1;
    var diceDom = document.querySelector(".dice");
    // 2. Display the result
    diceDom.style.display = "inline-flex";
    diceDom.src = "img/dice-" + dice + ".png";

    //3. update the round score IF the rolled number is NOT a 1
    if (dice !== 1) {
      //add score
      roundScore += dice;
      document.getElementById(
        "current-" + activePlayer
      ).textContent = roundScore;
    } else {
      nextPlayer();
    }
  }
});

document.querySelector("#x-icon").addEventListener("click", function() {
  document.getElementById("rules").style.animation = "fadeOut .5s 1";

  setTimeout(function() {
    document.querySelector("#rules").style.display = "none";

    document.querySelector(".btn-roll").style.animation = " shake 1s 1";
  }, 400);

  setTimeout(function() {
    document.querySelector(".btn-roll").style.animation = " shake .8s 1";
  }, 500);
});

document.querySelector(".btn-hold").addEventListener("click", function() {
  if (gamePlaying) {
    scores[activePlayer] += roundScore;

    document.querySelector("#score-" + activePlayer).textContent =
      scores[activePlayer];

    if (scores[activePlayer] >= 50) {
      document.querySelector("#name-" + activePlayer).textContent = "Winner!";
      document.querySelector(".dice").style.display = "none";
      document
        .querySelector(".player-" + activePlayer + "-panel")
        .classList.add("winner");
      document.getElementById("name-" + activePlayer).style.animation =
        " jackInTheBox 1s 1";
      document
        .querySelector(".player-" + activePlayer + "-panel")
        .classList.remove("active");
      document.getElementById("score-" + activePlayer).style.animation =
        " flash 1s 1";
      setTimeout(function() {
        document.querySelector(".btn-new").style.animation = " shake .9s 1";
      }, 1200);

      gamePlaying = false;
    } else {
      nextPlayer();
    }
  }
});

function nextPlayer() {
  activePlayer === 0 ? (activePlayer = 1) : (activePlayer = 0);

  roundScore = 0;

  document.getElementById("current-0").textContent = "0";
  document.getElementById("current-1").textContent = "0";
  document.querySelector(".player-0-panel").classList.toggle("active");
  document.querySelector(".player-1-panel").classList.toggle("active");
  document.querySelector(".dice").style.display = "none";
}

document.querySelector(".btn-new").addEventListener("click", function() {
  init();

  document.getElementById("name-0").style.animation = " fadeInDown 1s 1";
  document.getElementById("name-1").style.animation = " fadeInDown 1s 1";
  document.getElementById("score-0").style.animation = " fadeInLeft 1s 1";
  document.getElementById("score-1").style.animation = " fadeInRight 1s 1";
  document.getElementById("current-0").style.animation = " fadeInUp 1s 1";
  document.getElementById("current-1").style.animation = " fadeInUp 1s 1";
});

function init() {
  gamePlaying = true;
  scores = [0, 0];
  roundScore = 0;
  activePlayer = 0;
  document.querySelector(".dice").style.display = "none";
  document.getElementById("score-0").textContent = "0";
  document.getElementById("score-1").textContent = "0";
  document.getElementById("current-0").textContent = "0";
  document.getElementById("current-1").textContent = "0";
  document.getElementById("name-0").textContent = "Player 1";
  document.getElementById("name-1").textContent = "Player 2";
  document.querySelector(".player-0-panel").classList.remove("winner");
  document.querySelector(".player-1-panel").classList.remove("winner");
  document.querySelector(".player-0-panel").classList.remove("active");
  document.querySelector(".player-1-panel").classList.remove("active");
  document.querySelector(".player-0-panel").classList.add("active");
  document.getElementById("name-0").style.animation = " fadeInDown 1s 1";
  document.getElementById("name-1").style.animation = " fadeInDown 1s 1";
  document.getElementById("score-0").style.animation = " fadeInLeft 1s 1";
  document.getElementById("score-1").style.animation = " fadeInRight 1s 1";
  document.getElementById("current-0").style.animation = " fadeInUp 1s 1";
  document.getElementById("current-1").style.animation = " fadeInUp 1s 1";
  document.getElementById("rules").style.animation = "bounceIn 1s 1";

  
}
