var snake_current = ["5-5", "5-4"]; 

var direction;
var pre_direction;
var running;
var score = 0;
var highscore;
var speed = 700;

function prepare() {
    // iteratively create the cells and rows of the game field

    // get the table element
    var tbl = document.getElementById('field');
    for (var row = 0; row < 12; ++row) {
        // create a table row
        var tr = document.createElement('tr');
        for (var col = 0; col < 12; ++col) {
            // create a table cell
            var td = document.createElement('td');

            // create a p element
            // which is necessary so the td
            // field would appear since it table cells
            // doesn't render when empty&& direction != 'r'
            var p = document.createElement('p');

            // add the p element to the cell
            td.appendChild(p);

            // set the cell id to the number of the
            // current row + "-" + the number of the
            // current cell
            // I added the dash to prevent two cells
            // from having the same id since without the
            // dash the eleventh cell in the first row and
            // the first cell in the eleventh row would have
            // the same id: 111 while if we added the dash their
            // ids would be 1-11 and 11-1 which would be easier
            // to destinguish
            // the id would be useful later when interacting
            // with specific cells to add items to them
            // or change their color...etc
            td.id = row+"-"+col;

            // add the cell to the row
            tr.appendChild(td);
        }
        // add the row to the table
        tbl.appendChild(tr);
    }
    for (var i = 0; i < snake_current.length; ++i) {
        var cell = document.getElementById(snake_current[i]);
        cell.style.backgroundColor = 'black';
    }
    /*--------------------------------------------------------*/
    // this event listener lisetens to input from the arrow
    // keys and calls move() with the right values
        document.addEventListener('keydown', function(event) {
        switch (event.key) {
            case 'ArrowUp':
                if (pre_direction != 'd') {
                direction = 'u';
                }
                break;
            case 'ArrowDown':
                if (pre_direction != 'u') {
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
    // android swipe listener
    var startx,starty = null;
    window.addEventListener("touchstart",function(event){
    if(event.touches.length === 1){
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
    if(startx){
      //the only finger that hit the screen left it
      var endx = event.changedTouches.item(0).clientX;
      if(endx > startx + offset){
        if (pre_direction != 'l') {
        direction = 'r';
        }
      }
      if(endx < startx - offset ){
        if (pre_direction != 'r') {
        direction = 'l';
        }
      }
    }
    if(starty){
      //the only finger that hit the screen left it
      var endy = event.changedTouches.item(0).clientY;

      if(endy > starty + offset){
        if (pre_direction != 'u') {
        direction = 'd';
        }
      }
      if(endy < starty - offset ){
        if (pre_direction != 'd') {
        direction = 'u';
        }
      }
    }

    });
    main();
}

// pops the snake's last body piece and adds a new piece in
// the new position based on input while the snake is inside
// the game board
// if the snake hits the board edge this function calls quit()
function move() {
    var piece_location = snake_current[0].split('-');
    switch (direction) {
        case 'u':
            if (parseInt(piece_location[0])-1 >= 0) {
            pre_direction = direction;
            snake_current.pop();
            snake_current.unshift(piece_location[0]--);
            } else {
                quit();
                return;
            }
            break;
        case 'd':
            if (parseInt(piece_location[0])+1< 12 ) {  
            pre_direction = direction;
            snake_current.pop();
            snake_current.unshift(piece_location[0]++);
            } else {
                quit();
                return;
            }
            break;
        case 'r':
            if (parseInt(piece_location[1])+1 < 12 ) {
            pre_direction = direction;
            snake_current.pop();
            snake_current.unshift(piece_location[1]++);
            } else {
                quit();
                return;
            }
            break;
        case 'l':
            if (parseInt(piece_location[1])-1 >= 0 ) {
            pre_direction = direction;
            snake_current.pop();
            snake_current.unshift(piece_location[1]--);
            } else {
                quit();
                return;
            }
            break;
    }
    snake_current[0] = piece_location[0] + '-' + piece_location[1];
    for (var x = 4; x < snake_current.length; ++x) {
        for (var y = 0; y < snake_current.length; ++y) {
            if (x != y & snake_current[x] == snake_current[y]) {
            quit();
            }
        }
    }
    get_food();
    render();
}

function render() {
    // loop through each cell and changes its background to white to clear
    // the screen
    for (var x = 0; x < 12; ++x) {
        for (var y = 0; y < 12; ++y) {
            if (document.getElementById(x+'-'+y).style.backgroundColor != 'green') {
                document.getElementById(x+'-'+y).style.backgroundColor = 'white';}
        }
    }
    // display each segment of the snake's body as a black background
    for (var i = 0; i < snake_current.length; ++i) {
        document.getElementById(snake_current[i]).style.backgroundColor = 'black';
    }
}

// the main game function, calls move every 0.7 sec
function main() {
    if (sessionStorage.getItem('hscore') == null) {
        sessionStorage.setItem('hscore', 0);
        highscore = sessionStorage.getItem('hscore');
    }
    else {
        highscore = sessionStorage.getItem('hscore');
    }

    document.getElementById('score_tb').value = score;
    document.getElementById('hscore_tb').value = highscore;

    create_food();
    running = setInterval(function() {move()},speed);
}


// stops the script from calling move every 0.7 sec and changes the snake's
// color to red to signify that the snake have hit a wall and displays
// you loose to the player
function quit() {
    clearInterval(running);

    // change the snake's color to red to signify damage
    for (var i = 0; i < snake_current.length; ++i) {
        document.getElementById(snake_current[i]).style.backgroundColor = 'red';
    }

    var prev_highscore = highscore;

    // if the current score is higher than the highscore, update the highscore
    if (score > prev_highscore) {
        sessionStorage.setItem('hscore', score);
        highscore = score;
    }

    

    if (confirm('You loose!\nScore = ' +score+ '    HighScore = ' +highscore+ '\n\n\n Restart?')) {
        // clear screen
        for (var x = 0; x < 12; ++x) {
            for (var y = 0; y < 12; ++y) {
                document.getElementById(x+'-'+y).style.backgroundColor = 'white';}
        }

        // reset snake_current to default location and length
        while (snake_current.length > 0) {
            snake_current.pop();
        }
        score = 0;
        direction = '';
        pre_direction = '';
        speed = 700;

        snake_current = ["5-5", "5-4"]; 
        main();
    }
}

// responsible for deleting eaten food, increasing the snake's length and speed and adding score
function get_food() {
    if (document.getElementById(snake_current[0]).style.backgroundColor == 'green'){
        score += 10;

        // we have to clear the interval and reset it so it would take to the new speed val
        if (speed > 150) {
        speed -= 50;
        clearInterval(running);
        running = setInterval(function() {move()},speed);}

        // add a new piece
        var piece_location = snake_current[snake_current.length-1].split('-');
        if (direction == 'u') {
            snake_current.push(piece_location[0]++ + '-' + piece_location[1]);
        } else if (direction == 'd') {
            snake_current.push(piece_location[0]-- + '-' + piece_location[1]);
        } else if (direction == 'l') {
            snake_current.push(piece_location[0] + '-' + piece_location[1]--);
        } else if (direction == 'r') {
            snake_current.push(piece_location[0]-- + '-' + piece_location[1]++);
        }
        document.getElementById('score_tb').value = score;
        create_food();}
}

// creates food in a random empty cell
function create_food() {
    // keep creating new positions for the food as long as the position is taken by previous food
    // or by the snake's body
    do {
    var new_food_pos_x = parseInt(Math.random() * 11);
    var new_food_pos_y = parseInt(Math.random() * 11);}
    while (document.getElementById(new_food_pos_x + '-' + new_food_pos_y).style.backgroundColor == 'black' |
    document.getElementById(new_food_pos_x + '-' + new_food_pos_y).style.backgroundColor == 'green');
    console.log((new_food_pos_x + " " + new_food_pos_y));

    document.getElementById(new_food_pos_x + '-' + new_food_pos_y).style.backgroundColor = 'green';

}
