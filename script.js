// localStorage.clear();
let circleAmounts = [1, 1, 1];
let points = 0;
let streekBonus = 0;
let board = [];
let colours = ['FF0080', 'F6DF0E', '35E2F2'];
let classes = ['small', 'medium', 'large'];
let hasUsedCircles = [false, false, false];
let thingsToPutDown = [];
let currentCircle;
let bestScore = localStorage.getItem("bestScore") || 0;
document.getElementsByClassName('highScore')[0].innerText = bestScore;
document.getElementsByClassName('highScore')[1].innerText = bestScore;
document.getElementsByClassName('highScore')[2].innerText = bestScore;
console.log(bestScore);
const dropdown = document.getElementById("dropdown");
for (let i = 0; i < 27; i++) {
    board.push('');
}

function createCircles() {
    for (let i = 1; i < 4; i++) {
        let isDragging = false;
        let startingX = 0;
        let startingY = 0;
        let X = 0;
        let Y = 0;
        let circle;
        let innerCircle1;
        let innerCircle2 = false;

        if (circleAmounts[i - 1] == 1) {
            circle = document.createElement('div');
            innerCircle1 = document.createElement('div');
            let circle1Colour = colours[Math.floor(Math.random() * colours.length)];
            innerCircle1.style.border = `12px solid #${circle1Colour}`;
            innerCircle1.classList.add(circle1Colour);
            innerCircle1.classList.add(classes[Math.floor(Math.random() * classes.length)]);
            circle.appendChild(innerCircle1);
            thingsToPutDown.push(innerCircle1);
        } else if (circleAmounts[i - 1] == 2) {
            circle = document.createElement('div');
            innerCircle1 = document.createElement('div');
            innerCircle2 = document.createElement('div');
            let circle1Colour = colours[Math.floor(Math.random() * colours.length)];
            let circle2Colour = colours[Math.floor(Math.random() * colours.length)];
            let circle1Size = classes[Math.floor(Math.random() * classes.length)];
            let circle2Size = classes[Math.floor(Math.random() * classes.length)];
            while (circle1Size == circle2Size) {
                circle2Size = classes[Math.floor(Math.random() * classes.length)];
            }
            innerCircle1.style.border = `12px solid #${circle1Colour}`;
            innerCircle2.style.border = `12px solid #${circle2Colour}`;
            innerCircle1.classList.add(circle1Colour);
            innerCircle2.classList.add(circle2Colour);
            innerCircle2.classList.add(circle2Size);
            innerCircle1.classList.add(circle1Size);
            circle.appendChild(innerCircle1);
            circle.appendChild(innerCircle2);
            thingsToPutDown.push([innerCircle1, innerCircle2]);
        }
        circle.classList.add(`circle${i}`);
        circle.classList.add('circle');
        circle.classList.add('outsideCircle');
        circle.style.position = 'absolute';
        document.getElementById(`part${i}`).appendChild(circle);

        circle.addEventListener("mousedown", startDrag);
        circle.addEventListener("touchstart", startDrag);
        document.addEventListener("mousemove", drag);
        document.addEventListener("touchmove", drag);
        document.addEventListener("mouseup", stopDrag);
        document.addEventListener("touchend", stopDrag);

        function startDrag(e) {
            if (!hasUsedCircles[i - 1] && !circle.classList.contains('taken')) {
                currentCircle = circle;
                X = circle.offsetWidth / 2; 
                Y = circle.offsetHeight / 2; 
                startingX = circle.style.left;
                startingY = circle.style.top;
                isDragging = true;
                circle.style.zIndex = "1000";
        
                let eventX = e.clientX || e.touches[0].clientX;
                let eventY = e.clientY || e.touches[0].clientY;
                circle.style.left = `${eventX - X}px`;
                circle.style.top = `${eventY - Y}px`;
                if (dropdown.style.display == 'flex') {
                    dropdown.style.display = 'none';
                }
            }
        }

        function drag(e) {
            if (isDragging && currentCircle === circle) {
                let eventX = e.clientX || e.touches[0].clientX;
                let eventY = e.clientY || e.touches[0].clientY;
                circle.style.left = `${eventX - X}px`;
                circle.style.top = `${eventY - Y}px`;
            }
        }

        function stopDrag(e) {
            if (currentCircle === circle) {
                let rowOrder = [[0, 1, 2, 0], [3, 4, 5, 0], [6, 7, 8, 0], [0, 3, 6, 90], [1, 4, 7, 90], [2, 5, 8, 90], [0, 4, 8, 45], [2, 4, 6, 135]];
                let placesToAddBeam = [false, false, false, false, false, false, false, false];
                let places = [];
                let placesToremove = [];
                let amountOnBoard = 0;
                isDragging = false;
                currentCircle = null;
                circle.style.zIndex = '10';
                let isTouchingTile = false;
                let circleX = parseInt((circle.style.left).replace("px", "")) + X;
                let circleY = parseInt((circle.style.top).replace("px", "")) + Y;
                for (let x = 1; x < 10; x++) {
                    if (circleX >= document.getElementById(`tile${x}`).getBoundingClientRect().left && circleX <= document.getElementById(`tile${x}`).getBoundingClientRect().right && circleY >= document.getElementById(`tile${x}`).getBoundingClientRect().top && circleY <= document.getElementById(`tile${x}`).getBoundingClientRect().bottom) {
                        if (board[x * 3 - classes.indexOf(innerCircle1.classList[1]) - 1] == '' && (!innerCircle2 || board[x * 3 - classes.indexOf(innerCircle2.classList[1]) - 1] == '')) {         
                            isTouchingTile = true;
                            hasUsedCircles[i - 1] = true;
                            circle.classList.add('taken');
                            innerCircle1.classList.add(x * 3 - classes.indexOf(innerCircle1.classList[1]) - 1);
                            if (innerCircle2) {
                                innerCircle2.classList.add(x * 3 - classes.indexOf(innerCircle2.classList[1]) - 1);
                            }
                            circle.style.left = `${document.getElementById(`tile${x}`).getBoundingClientRect().left + window.scrollX + document.getElementById(`tile${x}`).getBoundingClientRect().width / 2 - circle.offsetWidth / 2}px`;
                            circle.style.top = `${document.getElementById(`tile${x}`).getBoundingClientRect().top + window.scrollY + document.getElementById(`tile${x}`).getBoundingClientRect().height / 2 - circle.offsetHeight / 2}px`;

                            board[x * 3 - classes.indexOf(innerCircle1.classList[1]) - 1] = {colour: innerCircle1.classList[0], size: innerCircle1.classList[1]};
                            if (innerCircle2) {
                                board[x * 3 - classes.indexOf(innerCircle2.classList[1]) - 1] = {colour: innerCircle2.classList[0], size: innerCircle2.classList[1]};
                            }
                            
                            function checkFor3OnSameSpot(place1, place2, place3) {
                                if (board[place1].colour == board[place2].colour && board[place2].colour == board[place3].colour && board[place1].colour !== undefined) {
                                    points = points + 5 + streekBonus;
                                    showAddedPoints(`+${5 + streekBonus}`);
                                    createBubbles(board[place1].colour, document.getElementById(`tile${place1 / 3 + 1}`).children[0].getBoundingClientRect());

                                    document.getElementsByClassName(place1)[0].style.animation = 'shrink 0.3s forwards';
                                    document.getElementsByClassName(place2)[0].style.animation = 'shrink 0.3s forwards';
                                    document.getElementsByClassName(place3)[0].style.animation = 'shrink 0.3s forwards';

                                    document.body.classList.add('shake');
                                    setTimeout(() => {
                                        document.body.classList.remove('shake');
                                    }, 400);

                                    let places = [place1, place2, place3];
                                    for (let e = 0; e < 3; e++) {
                                        board[places[e]] = '';
                                        document.getElementsByClassName(places[e])[0].classList.remove(places[e]);
                                    }
                                }
                            }
                            
                            function checkFor3InARow(group1, group2, group3, angle) {
                                let group1Colours = [board[group1 * 3].colour, board[group1 * 3 + 1].colour, board[group1 * 3 + 2].colour];
                                let group2Colours = [board[group2 * 3].colour, board[group2 * 3 + 1].colour, board[group2 * 3 + 2].colour];
                                let group3Colours = [board[group3 * 3].colour, board[group3 * 3 + 1].colour, board[group3 * 3 + 2].colour];
                                let hasUsedGroups = [];
                                for (let y = 0; y < colours.length; y++) {
                                    if (group1Colours.includes(colours[y]) && group2Colours.includes(colours[y]) && group3Colours.includes(colours[y])) {
                                        let groups = [group1, group2, group3];
                                        for (let e = 0; e < 3; e++) {
                                            for (let s = 0; s < 3; s++) {
                                                if (board[groups[e] * 3 + s].colour == colours[y]) {
                                                    for (let o = 0; o < rowOrder.length; o++) {
                                                        if (group1 == rowOrder[o][0] && group2 == rowOrder[o][1] && group3 == rowOrder[o][2] && !hasUsedGroups.includes(rowOrder[o][e])) {
                                                            placesToAddBeam[o] = [group1, group2, group3];
                                                            hasUsedGroups.push(rowOrder[o][e]);
                                                            places.push(o);
                                                        }
                                                    }
                                                    
                                                    const beamContainer = document.createElement('div');
                                                    beamContainer.classList.add('beamContainer');
                                                    document.getElementById('allBeams').appendChild(beamContainer);
                                                    const beam = document.createElement('div');
                                                    beam.id = 'beam';
                                                    beamContainer.appendChild(beam);
                                                    beam.style.background = `#${colours[y]}`;
                                                    beam.style.boxShadow = `0 0 10px 10px #${colours[y]}`;
                                                    beamContainer.style.transform = `rotate(${angle}deg)`;
                                                    beamContainer.style.left = `${document.getElementById(`tile${group2 + 1}`).getBoundingClientRect().left + window.scrollX + document.getElementById(`tile${group2 + 1}`).getBoundingClientRect().width / 2 - beamContainer.offsetWidth / 2}px`;
                                                    beamContainer.style.top = `${document.getElementById(`tile${group2 + 1}`).getBoundingClientRect().top + window.scrollY + document.getElementById(`tile${group2 + 1}`).getBoundingClientRect().height / 2 - beamContainer.offsetHeight / 2}px`;

                                                    document.body.classList.add('shake');
                                                    beam.style.opacity = '1';
                                                    beam.style.transform = 'translate(-50%, -50%) scaleY(1)';
                                                    setTimeout(() => {
                                                        beam.style.transform = 'translate(-50%, -50%) scaleY(0)';
                                                        setTimeout(() => {
                                                            document.body.classList.remove('shake');
                                                            beam.style.opacity = '0';
                                                            beamContainer.remove();
                                                        }, 50);
                                                    }, 450);
                                                }
                                            }
                                        }
                                    }
                                }
                            }

                            function checkForRows(amount) {
                                if (places.length == amount * 3) {
                                    let boardAtGroup = [];
                                    for (let o = 0; o < amount; o++) {
                                        let groups = [placesToAddBeam[places[o * 3]][0], placesToAddBeam[places[o * 3]][1], placesToAddBeam[places[o * 3]][2]];
                                        let group1Colours = [board[groups[0] * 3].colour, board[groups[0] * 3 + 1].colour, board[groups[0] * 3 + 2].colour];
                                        let group2Colours = [board[groups[1] * 3].colour, board[groups[1] * 3 + 1].colour, board[groups[1] * 3 + 2].colour];
                                        let group3Colours = [board[groups[2] * 3].colour, board[groups[2] * 3 + 1].colour, board[groups[2] * 3 + 2].colour];
                                        for (let y = 0; y < colours.length; y++) {
                                            for (let e = 0; e < 3; e++) {
                                                for (let s = 0; s < 3; s++) {
                                                    if (group1Colours.includes(colours[y]) && group2Colours.includes(colours[y]) && group3Colours.includes(colours[y]) && board[groups[e] * 3 + s].colour == colours[y]) {
                                                        placesToremove.push(document.getElementsByClassName(groups[e] * 3 + s)[0]);
                                                        boardAtGroup.push(groups[e] * 3 + s);
                                                    }
                                                }
                                            }
                                        }
                                    }
                                    for (let o = 0; o < placesToremove.length; o++) {
                                        placesToremove[o].style.display = 'none';
                                        for (let i = 0; i <= 27; i++) {
                                            if (placesToremove[o].classList.contains(i.toString())) {
                                                placesToremove[o].classList.remove(i);
                                            }
                                        }
                                        board[boardAtGroup[o]] = '';
                                    }
                                    points = points + amount * amount * 3 + streekBonus;
                                    showAddedPoints(`+${amount * amount * 3 + streekBonus}`);
                                }
                            }

                            checkFor3InARow(0, 1, 2, 0);
                            checkFor3InARow(3, 4, 5, 0);
                            checkFor3InARow(6, 7, 8, 0);
                            checkFor3InARow(0, 3, 6, 90);
                            checkFor3InARow(1, 4, 7, 90);
                            checkFor3InARow(2, 5, 8, 90);
                            checkFor3InARow(0, 4, 8, 45);
                            checkFor3InARow(2, 4, 6, 135);

                            for (let y = 0; y < 9; y++) {
                                checkFor3OnSameSpot(y * 3, y * 3 + 1, y * 3 + 2);
                                checkForRows(y + 1);
                            }

                            if (hasUsedCircles[0] && hasUsedCircles[1] && hasUsedCircles[2]) {
                                hasUsedCircles = [false, false, false];
                                thingsToPutDown = [];
                                createCircles();
                            }

                            for (let x = 0; x < board.length; x++) {
                                if (board[x] !== '') {
                                    amountOnBoard++;
                                }
                            }
                            if (amountOnBoard == 0) {
                                points = points + 15;
                                showAddedPoints('Board Cleared\n+15');
                            }
                            break;
                        }
                    }
                }

                if (!isTouchingTile) {
                    circle.style.left = startingX;
                    circle.style.top = startingY;
                }
                if (placesToremove.length !== 0) {
                    streekBonus = streekBonus + 3;
                } else {
                    streekBonus = 0;
                }
                
                if (amountOnBoard >= 17) {
                    circleAmounts = [1, 2, 2];
                    if (points >= 50) {
                        circleAmounts = [2, 2, 2];
                    }
                } else if (amountOnBoard >= 12) {
                    circleAmounts = [1, 2, 2];
                }
                 else if (amountOnBoard >= 9) {
                    circleAmounts = [1, 1, 2];
                    if (points >= 50) {
                        circleAmounts = [1, 2, 2];
                    }
                } else if (amountOnBoard < 9) {
                    circleAmounts = [1, 1, 1];
                    if (points >= 50) {
                        circleAmounts = [1, 1, 2];
                    }
                }

                if (points >= 6) {
                    colours = ['FF0080', 'FF7902', 'F6DF0E', '25FB67', '35E2F2', 'B82EFF'];
                }

                for (let x = thingsToPutDown.length - 1; x >= 0; x--) {
                    let firstItem = Array.isArray(thingsToPutDown[x]) ? thingsToPutDown[x][0] : thingsToPutDown[x];
                    if (firstItem.parentElement && firstItem.parentElement.classList.contains('taken')) {
                        thingsToPutDown.splice(x, 1);
                    }
                }
                let sizesToPutDown = [];
                for (let x = 0; x < thingsToPutDown.length; x++) {
                    if (thingsToPutDown[x].length == 2) {
                        sizesToPutDown.push([thingsToPutDown[x][0].classList[1], thingsToPutDown[x][1].classList[1]]);
                    } else {
                        sizesToPutDown.push(thingsToPutDown[x].classList[1]);
                    }
                }
                function checkForFreeSpot(sizeToCheck1, sizeToCheck2) {
                    for (let x = 0; x < 27; x = x + 3) {
                        if (board[x + sizeToCheck1] == '' && board[x + sizeToCheck2] == '') {
                            return true;
                            break;
                        }
                    }
                    return false;
                }

                let sizeMap = {large: 0, medium: 1, small: 2};
                let numbers = sizesToPutDown.map(item => Array.isArray(item) ? [sizeMap[item[0]], sizeMap[item[1]]] : [sizeMap[item], sizeMap[item]]);

                let gameOver = true;
                for (let x = 0; x < numbers.length; x++) {
                    if (checkForFreeSpot(numbers[x][0], numbers[x][1])) {
                        gameOver = false;
                    }
                }
                if (gameOver) {
                    setTimeout(() => {
                        document.getElementById('game').style.display = 'none';
                        document.getElementById('gameOver').style.display = 'block';
                        document.getElementById('endScore').innerText = points;

                        if (points > bestScore) {
                            alert('New Best!');
                            localStorage.setItem("bestScore", points);
                        }

                        document.getElementsByClassName('highScore')[0].innerText = bestScore;
                        document.getElementsByClassName('highScore')[1].innerText = bestScore;
                        document.getElementsByClassName('highScore')[2].innerText = bestScore;
                    }, 500);
                }
            }
        }
    }
}

function showAddedPoints(amountAdded) {
    document.getElementById('score').innerText = points;
    document.getElementById('addedPoints').style.opacity = '1';
    document.getElementById('addedPoints').style.display = 'block';
    document.getElementById('addedPoints').innerText = amountAdded;
    setTimeout(() => {
        let opacity = 1;
        let timer = setInterval(() => {
            if (opacity <= 0) {
                clearInterval(timer);
                document.getElementById('addedPoints').style.display = "none"; 
            } else {
                document.getElementById('addedPoints').style.opacity = opacity;
                opacity -= 0.05;
            }
        }, 10);
    }, 1400);
}

function showIcons() {
    document.getElementById('dropdown').style.zIndex = '3000';
    if (dropdown.style.display == 'flex') {
        dropdown.style.display = 'none';
    } else {
        dropdown.style.display = 'flex';
    }
}

function createBubbles(colour, tile) {
    for (let i = 0; i < 10; i++) {
        let bubble = document.createElement("div");
        bubble.classList.add("bubble");
        document.body.appendChild(bubble);
        let x = Math.random() * 120 - 60;
        let y = Math.random() * 120 - 60;
        bubble.style.setProperty('--x', x);
        bubble.style.setProperty('--y', y);
        bubble.style.left = `${tile.left}px`;
        bubble.style.top = `${tile.top}px`;
        bubble.style.backgroundColor = `#${colour}`;
        setTimeout(() => bubble.remove(), 700);
    }
}

function changeColour(text, order) {
    let coloredText = '';
    for (let i = 0; i < text.textContent.length; i++) {
        coloredText += `<span style="color: ${order[i % order.length]};">${text.textContent[i]}</span>`;
    }
    text.innerHTML = coloredText;
}

function play() {
    document.getElementById('home').style.display = 'none';
    document.getElementById('game').style.display = 'block';
    document.getElementById('gameOver').style.display = 'none';
    createCircles();
}

function home() {
    location.reload();
}

document.getElementById('game').style.display = 'none';
document.getElementById('gameOver').style.display = 'none';
changeColour(document.getElementsByClassName('text')[0], ['#35E2F2', '#F6DF0E', '#25FB67', '#FF0080', '#B82EFF', '#FF7902']);
changeColour(document.getElementsByClassName('text')[1], ['#FF0080', '#25FB67', '#35E2F2', '#FF7902', '#B82EFF', '#FF0080', '#F6DF0E']);