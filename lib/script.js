// @ts-check

//Card variables
let suits = ["Hearts", "Clubs", "Diamonds", "Spades"];
let values = ["Ace", "King", "Queen", "Jack", "Ten", "Nine", "Eight", "Seven", "Six", "Five", "Four", "Three", "Two"];

//DOM variables
let mainHeading = document.getElementById("start-text");
let dealerArea = document.getElementById("dealer-area");
let dealerHeading = document.getElementById("dealer-heading");
let dealerScoreHeading = document.getElementById("dealer-score-text");
let playerArea = document.getElementById("player-area");
let playerHeading = document.getElementById("player-heading");
let playerScoreHeading = document.getElementById("player-score-text");
let moneyHeading = document.getElementById("money-heading");
let newGameButton = document.getElementById("new-game-button");
let hitButton = document.getElementById("hit-button");
let stayButton = document.getElementById("stay-button");

//Game variables
let gameStarted = false;
let gameOver = false;
let playerWon;
let dealerCards = [];
let playerCards = [];
let dealerScore = 0;
let playerScore = 0;
let playerMoney = 20;
let deck = [];

dealerArea.style.display = "none";
dealerHeading.style.display = "none";
dealerScoreHeading.style.display = "none";
playerArea.style.display = "none";
playerHeading.style.display = "none";
playerScoreHeading.style.display = "none";
moneyHeading.style.display = "none";

hitButton.style.display = "none";
stayButton.style.display = "none";
showStatus();

//Button events
newGameButton.addEventListener("click", function () 
{
  gameStarted = true;
  gameOver = false;
  playerWon = false;

  deck = createDeck();
  shuffleDeck(deck);
  dealerCards = [getNextCard(), getNextCard()];
  playerCards = [getNextCard(), getNextCard()];

  mainHeading.style.display = "none";
  dealerArea.style.display = "block";
  dealerHeading.style.display = "block";
  dealerScoreHeading.style.display = "block";
  playerArea.style.display = "block";
  playerHeading.style.display = "block";
  playerScoreHeading.style.display = "block";
  moneyHeading.style.display = "block";

  newGameButton.style.display = "none";
  hitButton.style.display = "inline";
  stayButton.style.display = "inline";
  checkForEndGame();
  showStatus();
});

hitButton.addEventListener("click", function () 
{
  playerCards.push(getNextCard());
  checkForEndGame();
  showStatus();
});

stayButton.addEventListener("click", function () 
{
  gameOver = true;
  checkForEndGame();
  showStatus();
});


/**********  Functions *********/

function createDeck() 
{
  let deck = [];

  for (let suitIndex = 0; suitIndex < suits.length; suitIndex++) 
  {
    for (let valueIndex = 0; valueIndex < values.length; valueIndex++) 
    {
      //Card object
      let card =
      {
        suit: suits[suitIndex],
        value: values[valueIndex]
      };

      //Add card to deck
      deck.push(card);
    }
  }

  return deck;
}

function shuffleDeck(deck) 
{
  for (let i = 0; i < deck.length; i++) 
  {
    let swapIndex = Math.trunc(Math.random() * deck.length);
    let temp = deck[swapIndex];

    deck[swapIndex] = deck[i];
    deck[i] = temp;
  }
}

function getNextCard() 
{
  return deck.shift();
}

function getCardString(card) 
{
  return card.value + " of " + card.suit;
}

function getCardNumericValue(card) 
{
  switch (card.value) 
  {
    case "Ace":
      return 1;
    case "Two":
      return 2;
    case "Three":
      return 3;
    case "Four":
      return 4;
    case "Five":
      return 5;
    case "Six":
      return 6;
    case "Seven":
      return 7;
    case "Eight":
      return 8;
    case "Nine":
      return 9;
    default:
      return 10;
  }
}

function getScore(cardArray) 
{
  let score = 0;
  let hasAce = false;

  //Loop through the array
  for (let i = 0; i < cardArray.length; i++) 
  {
    let card = cardArray[i];
    score += getCardNumericValue(card);

    if (card.value === "Ace") 
    {
      hasAce = true;
    }
  }

  //Ace check
  if (hasAce && score + 10 <= 21) 
  {
    return score + 10;
  }

  return score;
}

function updateScores() 
{
  dealerScore = getScore(dealerCards);
  playerScore = getScore(playerCards);
}

function showStatus() 
{
  //Welcome
  if (!gameStarted) 
  {
    mainHeading.innerText = "Welcome to Blackjack";
    return;
  }

  //Update scores
  updateScores();

  //Update text scores
  dealerScoreHeading.innerText = "Score: " + dealerScore;
  playerScoreHeading.innerText = "Score: " + playerScore;

  //Game over
  if (gameOver) 
  {
    if (playerWon) 
    {
      mainHeading.innerText = "YOU WIN!";
      playerMoney += 1;
    }
    else 
    {
      if(playerScore === dealerScore)
      {
        mainHeading.innerText = "TIE";
      }
      else
      {
        mainHeading.innerText = "DEALER WINS";
        playerMoney -= 1;
      }
    }

    mainHeading.style.display = "block";
    newGameButton.style.display = "inline";
    hitButton.style.display = "none";
    stayButton.style.display = "none";
  }

  drawCards();
  updateCredits();
}

function checkForEndGame()
{
  updateScores();

  if(gameOver)
  {
    //Dealer take cards
    while(dealerScore < playerScore && playerScore <= 21 && dealerScore <= 21)
    {
      dealerCards.push(getNextCard());
      updateScores();
    }
  }

  if(playerScore > 21)
  {
    playerWon = false;
    gameOver = true;
  }
  else if(dealerScore > 21)
  {
    playerWon = true;
    gameOver = true;
  }
  else if(gameOver)
  {
    if(playerScore > dealerScore)
    {
      playerWon = true;
    }
    else
    {
      playerWon = false;
    }
  }

  //Dealer gets five cards
  if(dealerCards.length >= 5)
  {
    playerWon = false;
    gameOver = true;
  }

  //Blackjack
  if(playerCards.length === 2 && playerScore === 21)
  {
    playerWon = true;
    gameOver = true;
  }
}

function updateCredits()
{
  moneyHeading.innerText = "Credits: " + playerMoney + "$";
}

function drawCards()
{
  //Reset
  playerArea.innerHTML = "";
  dealerArea.innerHTML = "";

  playerCards.forEach(drawSingleCardPlayer);
  dealerCards.forEach(drawSingleCardDealer);
}

function drawSingleCardPlayer(item, index)
{
  playerArea.innerHTML += "<div class='card shadow mb-2'>" + item.value +" of " + item.suit + "</div>";
}

function drawSingleCardDealer(item, index)
{
  dealerArea.innerHTML += "<div class='card shadow mb-2'>" + item.value +" of " + item.suit + "</div>";
}