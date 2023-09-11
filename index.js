
let columns = 10;
let rows = 10;
let longerSide;
if (columns >= rows)
{
    longerSide = columns;
}
else if (rows > columns)
{
    longerSide = rows;
}

let scale = 10 / longerSide;
let boxSize = 500 / longerSide;

let gridItemList = [];

const mineCount = 10;

let gameBoard = document.getElementById("board");

let used = [];

let leftButtonDown = false;
let rightButtonDown = false;

function createMines(mineCount)
{
    for(let i = 0; i < mineCount; i++)
    {
        let box = (Math.floor(Math.random() * gridItemList.length));
        if(!gridItemList[box].classList.contains("mine"))
        {
            gridItemList[box].classList.add("mine");
        }
        else
        {
            i--;
        }
    }
}

function gridItemCreate(boxCount)
{
    for (let i = 0; i < boxCount; i++)
    {
        let gridItem = document.createElement("div");
        gridItem.className = "grid-item";
        gridItem.style.width = `${boxSize}`;
        gridItem.style.height = `${boxSize}`;
        gameBoard.appendChild(gridItem);
        gridItemList.push(gridItem);
        gridItem.addEventListener("mousedown", click);
        gridItem.dataset.cellLocation = i;
    }
}

function click(e)
{   
    setTimeout(()=>{
        if (leftButtonDown && rightButtonDown)
        {
            bothClick(e);
        }    
        else if (leftButtonDown)
        {
            leftClick(e);
        }
        else if (rightButtonDown)
        {
            rightClick(e);
        }
    },20);
}

function leftClick(e)
{
    if (e.target.classList.contains("flag")) { return; }
    if (gameBoard.classList.contains("you-won")) { return; }
    if (gameBoard.classList.contains("game-over")) { return; }
    let cellLocation = parseInt(e.target.dataset.cellLocation);

    let numOfMines = getAdjacentClass(cellLocation, "mine");

    if(e.target.classList.contains("mine"))
    {
        gameBoard.classList.add("game-over");
    }
    else
    {
        if(numOfMines !== 0)
        {
            e.target.classList.add("clicked");
            e.target.classList.remove("flag");
            e.target.dataset.mineCount = numOfMines;
        }
        else
        {
            getBlankCells(cellLocation);
        }
    }
    for (let i = 0; i < gridItemList.length; i++)
    {
        if (gridItemList[i].className === "grid-item" || gridItemList[i].className === "grid-item flag") { return; }
    }
    gameBoard.classList.add("you-won");
}

function rightClick(e)
{
    if (e.target.classList.contains("clicked")) { return; }
    if (e.target.classList.contains("empty-cell")) { return; }
    if (gameBoard.classList.contains("you-won")) { return; }
    if (gameBoard.classList.contains("game-over")) { return; }
    e.target.classList.toggle("flag");
}

function bothClick(e)
{
    let cellLocation = parseInt(e.target.dataset.cellLocation);
    let numOfAdjacentFlags = getAdjacentClass(cellLocation, "flag");
    let numOfMines = getAdjacentClass(cellLocation, "mine");

    if (e.target.classList.contains("clicked") && numOfAdjacentFlags === numOfMines)
    {
        let adjacentCells = getAdjacentCells(cellLocation);
        console.log(adjacentCells);
        adjacentCells.forEach(cell => leftClick({target:cell}));
    }
}

function getBlankCells(cellLocation)
{
    if (used.includes(cellLocation)){ return; }

    used.push(cellLocation);

    let numOfMines = getAdjacentClass(cellLocation, "mine");
    
    if (numOfMines !== 0)
    {
        gridItemList[cellLocation].dataset.mineCount = numOfMines;
        gridItemList[cellLocation].classList.add("clicked");
        gridItemList[cellLocation].classList.remove("flag");
        return;
    }

    gridItemList[cellLocation].classList.add("empty-cell");

    let adjacentCells = getAdjacentCells(cellLocation);

    adjacentCells.forEach(cell => {getBlankCells(parseInt(cell.dataset.cellLocation))});
}

function getAdjacentCells(cellLocation)
{
    let checkLocations = [];
    const columnIndex = cellLocation % columns;
    
    if (columnIndex !== 0) // left
    {
        checkLocations.push(gridItemList[cellLocation - 1]);
    }
    if (columnIndex !== columns - 1) // right
    {
        checkLocations.push(gridItemList[cellLocation + 1]);
    }
    if ((cellLocation - columns) >= 0) // up
    {
        checkLocations.push(gridItemList[cellLocation - columns]);
    }
    if ((cellLocation + columns) < gridItemList.length) // down
    {
        checkLocations.push(gridItemList[cellLocation + columns]);
    }
    if (columnIndex !== 0 && (cellLocation - columns - 1) >= 0) // up left
    {
        checkLocations.push(gridItemList[cellLocation - columns - 1]);
    }
    if (columnIndex !== (columns - 1) && (cellLocation + columns + 1) < gridItemList.length) // down right
    {
        checkLocations.push(gridItemList[cellLocation + columns + 1]);
    }
    if (columnIndex !== (columns - 1) && (cellLocation - columns) >= 0) // up right
    {
        checkLocations.push(gridItemList[cellLocation - columns + 1]);
    }
    if (columnIndex !== 0 && (cellLocation + columns) < gridItemList.length) // down left
    {
        checkLocations.push(gridItemList[cellLocation + columns - 1]);
    }

    return checkLocations;
}

function getAdjacentClass(cellLocation, className)
{
    let adjacentCells = getAdjacentCells(cellLocation);

    let numOfAdjacentCells = 0;

    adjacentCells.forEach(cell => 
        {
            if(cell.classList.contains(className))
            {
                numOfAdjacentCells++;
            }
        });

    return numOfAdjacentCells;
}

document.addEventListener("mousedown", (e) => {
    // left click
    if (e.button === 0) 
    {
        leftButtonDown = true;
    }
    // right button
    if (e.button === 2) 
    {
        rightButtonDown = true;
    }
});

document.addEventListener("mouseup", (e) => {
    // left click
    if (e.button === 0) 
    {
        leftButtonDown = false;
    }
    // right button
    if (e.button === 2) 
    {
        rightButtonDown = false;
    }
});

document.getElementById("play-area").addEventListener("contextmenu",(e)=>e.preventDefault());
gridItemCreate(columns * rows);
createMines(mineCount);
gameBoard.style.gridTemplateColumns=`repeat(${columns}, 1fr)`; 
gameBoard.style.gridTemplateRows=`repeat(${rows}, 1fr)`;
gameBoard.style.transform=`scale(${scale})`;