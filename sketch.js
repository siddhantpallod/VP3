//Create variables here

var dogImg, happyDog, database, foodS, foodStock;
var garden, washroom, bedroom;
var dog;
var fedTime, lastFed;
var feed, addFood;
var foodObj;
var gameState, readState;

function preload()
{
  //load images here
  dogImg = loadImage("images/dogImg.png");
  dogHappy = loadImage("images/dogImg1.png");
  garden = loadImage("images/Garden.png");
  washroom = loadImage("images/Wash Room.png");
  bedroom = loadImage("images/Bed Room.png");
}

function setup() {
  database = firebase.database();
  createCanvas(600, 600);
  
  foodObj = new Food();

  readState = database.ref('gameState');
  readState.on("value",function(data){
    gameState = data.val();
  })

  dog = createSprite(500,300,50,50);
  dog.addImage(dogImg);
  dog.scale = 0.15;

  foodStock = database.ref('Food');
  foodStock.on("value",readStock);

  feed = createButton("Feed The Dog");
  feed.position(600,95);
  feed.mousePressed(feedDog);

  addFood = createButton("Add Food");
  addFood.position(700,95);
  addFood.mousePressed(addFoods);
  
}


function draw() {  

  currentTime = hour();
  if(currentTime === (lastFed + 1)){
    update("Playing");
    foodObj.garden();
  }
  else if(currentTime === (lastFed + 2)){
    update("Sleeping");
    foodObj.bedroom();
  }
  else if(currentTime > (lastFed + 2) && currentTime <= (lastFed + 4)){
    update("Bathing");
    foodObj.washroom();
  }
  else{
    update("Hungry");
    foodObj.display();
  }

  if(gameState !== "Hungry"){
    feed.hide();
    addFood.hide();
    dog.remove();
  }
  else{
    feed.show();
    addFood.show();
    dog.addImage(dogImg);
  }

  background(46,139,87);

  fedTime = database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed = data.val();
  });

 
  //add styles here

  fill(255,255,254);
  textSize(15);
  if(lastFed > 12){
    text("Last Fed : " + lastFed % 12 + " PM",105,65);
  }
  else if(lastFed === 0){
    text("Last Fed : 12 AM",105,65);
  }
  else{
    text("Last Fed : " + lastFed + " AM",105,65);
  }
  drawSprites();
}

function readStock(data){
  foodS = data.val();
  foodObj.updateFoodStock(foodS);
}

function feedDog(){
  dog.addImage(dogImg);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food : foodObj.getFoodStock(),
    FeedTime : hour()
  })
}

function addFoods(){
  foodS++;
  database.ref('/').update({
    Food : foodS
  })
}

function update(state){
  database.ref('/').update({
    gameState : state
  })
}