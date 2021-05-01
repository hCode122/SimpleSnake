var canvas; 
var canvas_context; 
var first_part = {x:45, y:45}; 
var second_part = {x:45, y:30}
// snake's main body
var snake = [first_part, second_part];
// points to the snake's first element
var head = snake[0];
// current direction
var direction;
// the direction we called the previous time
var pre_direction;
// stores the setInterval() variable so we can clear it later
var running;
var score = 0;
var highscore;
// the interval of calling render()
var speed = 300;
// stores the position of food
var food_pos = {x:null, y:null};

function prepare() {

    // get the canvas element
    /*--------------------------------------------------------*/
    // this event listener lisetens to input from the arrow
    // keys and sets $direction to the right value
    document.addEventListener('keydown', function(event) {
        switch (event.key) {
            case 'ArrowUp':
                if (pre_direction != 'd') {
                    event.preventDefault();
                    direction = 'u';
                }
                break;
            case 'ArrowDown':
                if (pre_direction != 'u') {
                    event.preventDefault();
                    direction = 'd';
                }
                break;
            case 'ArrowLeft':
                if (pre_direction != 'r') {
                    direction = 'l';
                }
                break;
            case 'ArrowRight':
                if (pre_direction != 'l') {
                    direction = 'r';
                }
                break;
        }
    });
    /*-------------------------------------------------------*/
    // android swipe listener
    var startx,starty = null;
    window.addEventListener("touchstart",function(event){
    if(event.touches.length === 1){
        event.preventDefault();
        //just one finger touched
    startx = event.touches.item(0).clientX;
    starty = event.touches.item(0).clientY;
    }else{
    //a second finger hit the screen, abort the touch
    startx,starty = null;
        }
    });

window.addEventListener("touchend",function(event){
    var offset = 100;//at least 100px are a swipe
    if(startx) {
      //the only finger that hit the screen left it
      var endx = event.changedTouches.item(0).clientX;
      if(endx > startx + offset){
        if (pre_direction != 'l') {
        event.preventDefault();
        direction = 'r';
        }
      }
      if(endx < startx - offset ){
        if (pre_direction != 'r') {
        event.preventDefault();
        direction = 'l';
        }
      }
    }
    if(starty){
      //the only finger that hit the screen left it
      var endy = event.changedTouches.item(0).clientY;

      if(endy > starty + offset){
        if (pre_direction != 'u') {
        event.preventDefault();
        direction = 'd';
        }
      }
      if(endy < starty - offset ){
        if (pre_direction != 'd') {
        event.preventDefault();
        direction = 'u';
        }
      }
    }
    });
    /*-------------------------------------------------------*/
    // resize event so the canvas size keep responsive
    window.addEventListener('resize', resizeCanvas, false);
        // Draw canvas border for the first time.
        resizeCanvas();
    

    main();
}

    // Display custom canvas. In this case it's a black, 5 pixel 
    // border that resizes along with the browser window.
    function redraw() {
        canvas_context.strokeStyle = 'black';
        canvas_context.lineWidth = '5';
        canvas_context.strokeRect(0, 0, canvas.width, canvas.height);
    }

    // Runs each time the DOM window resize event fires.
    // Resets the canvas dimensions to match window,
    // then draws the new borders accordingly.
    function resizeCanvas() {
        canvas = document.getElementById('canvas');
        canvas_context = canvas.getContext("2d");
        canvas.width = window.innerWidth*0.4  - 5;
        canvas.height = window.innerHeight*0.5 - 5;
        redraw();
    }
    /*---------------------------------------------------------*/

// pops the snake's last body piece and adds a new piece in
// the new position based on input while the snake is inside
// the game's board
// if the snake hits the board's edge this function calls quit()
function move() {
    switch (direction) {
        case 'u':
            if ((head.y)-15 >= 0) {
                var new_head = {x:head.x, y:head.y-15};
                snake.pop();
                snake.unshift(new_head);
                pre_direction = 'u';
            } else {
                quit();
            }
            break;
        case 'd':
            if ((head.y)+15 <= canvas.height) {
                var new_head = {x:head.x, y:head.y+15};
                snake.pop();
                snake.unshift(new_head);
                pre_direction = 'd';
            } else {
                quit();
            }
            break;
        case 'r':
            if ((head.x)+15 <= canvas.width) {
                var new_head = {x:head.x+15, y:head.y};
                snake.pop();
                snake.unshift(new_head);          
                pre_direction = 'r';
            } else {
                quit();
            }  
            break;
        case 'l':
            if ((head.x)-15 >= 0) {
                var new_head = {x:head.x-15, y:head.y};
                snake.pop();
                snake.unshift(new_head);          
                pre_direction = 'l';
            } else {
                quit();
            }
            break;
    }
   
    if (check_eaten()) {
        quit();
    }
    head = snake[0];
    get_food();
    render();
}

// checks if the snake bit itself by seeing if 2 of the snake's pats
// are in the same x,y position
function check_eaten() {
    for (var x = 4; x < snake.length; ++x) {
        for (var y = 0; y < snake.length; ++y) {
            if (x != y & snake[x].x == snake[y].x & snake[x].y == snake[y].y) {
                return true;
            }
        }
    }
}

function drawSnake(part) {
    // color of the block's filling
    canvas_context.fillStyle = this.valueOf('color');  
    // color of the block's edge
    canvas_context.strokeStyle = 'black';  
    // draw the block at the snake's part's x and y position
    // with 15 width and 15 height
    canvas_context.strokeRect(part.x, part.y, 15, 15);   
    canvas_context.fillRect(part.x, part.y, 15, 15);   
}

function clearCanvas() {
    // set the canvas width to the window's inner width multiplied
    // by 0.3 to make it a little smaller since we still need some
    // screen space to draw the score board
    canvas.width = window.innerWidth*0.4 +4;
    // set the canvas height same as above
    canvas.height = window.innerHeight*0.5 -7;

    canvas_context.fillStyle = 'white';  
    canvas_context.strokestyle = 'white';
    canvas_context.fillRect(0, 0, canvas.width, canvas.height);   
}

function render() {
    // call clearCanvas to clear the screen in order to draw the updates
    clearCanvas();
    // the snake's color
    var color = 'cyan';
    // call drawSnake() to draw each one of the snake's parts
    snake.forEach(drawSnake, color);

    // if there is food on the screen, draw it
    if (food_pos.x != null & food_pos.y != null) {
        canvas_context.fillStyle = 'yellow';
        canvas_context.strokestyle = 'black';
        canvas_context.fillRect(food_pos.x, food_pos.y, 15,15);
        canvas_context.strokeRect(food_pos.x, food_pos.y, 15,15);
    }
}

// the main game function, calls move every $speed second
function main() {
    // if there is no saved highscore set the highscore to 0
    // else load it
    if (localStorage.getItem('hscore') == null) {
        localStorage.setItem('hscore', 0);
        highscore = localStorage.getItem('hscore');
    } else {
        highscore = localStorage.getItem('hscore');
    }

    document.getElementById('score_tb').value = score;
    document.getElementById('hscore_tb').value = highscore;

    create_food();
    running = setInterval(function() {move()},speed);
}


// stops the script from calling move every $speed second and changes the snake's
// color to red to signify that the snake have hit a wall and displays
// you loose to the player with the option of restarting 
function quit() {
    clearInterval(running);

    clearCanvas();
    // change the snake's color to red to signify damage
    var color = 'red';
    snake.forEach(drawSnake,color)

    var prev_highscore = highscore;

    // if the current score is higher than the highscore, update the highscore
    if (score > prev_highscore) {
        localStorage.setItem('hscore', score);
        highscore = score;
    }
    
    if (confirm('You loose!\nScore = ' +score+ '    HighScore = ' +highscore+ '\n\n\n Restart?')) {
        // clear screen
        clearCanvas();
        // reset snake_current to default location and length
        while (snake.length > 0) {
            snake.pop();
        }
        score = 0;
        direction = '';
        pre_direction = '';
        speed = 300;

        first_part = {x:45, y:45}; 
        second_part = {x:45, y:30}
        snake = [first_part, second_part];
        head = snake[0];
        main();
    }
}

// responsible for deleting eaten food, increasing the snake's length and speed and adding score
function get_food() {
    if (head.x == food_pos.x & head.y == food_pos.y) {
        food_pos.x = null;
        food_pos.y = null;
        snake.push(snake[snake.length-1].x+5);
        score += 10;
        document.getElementById('score_tb').value = score;
        if (speed > 100) {
            speed -= 20;
            clearInterval(running);
            running = setInterval(function() {move()},speed);
        }
        create_food();
    } 
}

// creates food in a random empty cell
function create_food() {
    do {
        // we use the equation here to get a random multiple of 15 between 0 and
        // the max width/height
        food_pos.x = Math.round((Math.random() * (canvas.width-15) / 15)) * 15;
        food_pos.y = Math.round((Math.random() * (canvas.height-15) / 15)) * 15;
    } while (not_snake() == false);
}

// used to check that the specific x and y position does not contain a snake body piece
function not_snake() {
    for (var i = 0; i < snake.length; ++i) {
        if (snake[i].x == food_pos.x & snake[i].y == food_pos.y) {
            return false;
        }
    }
}
