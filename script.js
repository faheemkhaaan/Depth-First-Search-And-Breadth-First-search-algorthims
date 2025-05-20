/** @type {HTMLCanvasElement} */

const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext('2d');
const { width, height } = canvas;

// buttons

const increaseSizeBtn = document.getElementById("increaseSize");
const decreaseSizeBtn = document.getElementById("decreaseSize")
const createWallBtn = document.getElementById("createWalls")
const removeWallsBtn = document.getElementById("removeWalls")
const targetCellBtn = document.getElementById("targetCell")
const startCellBtn = document.getElementById("startCell");
const hideOutlinesBtn = document.getElementById("hideOutlines");
const randomDirectionsBtn = document.getElementById("randomDirections");
const depthFirstSearchBtn = document.getElementById("dfs")
const breadthFirstSearchBtn = document.getElementById("bfs")
const resetBtn = document.getElementById("reset");
let randomDirections = false;

let startCell = null;
let targetCell = null;
let cellSize = 10
let selectingTargetCell = false;
let selectingStartCell = false;
let creatingWalls = false;
let removingWalls = false;
let outlines = true;

let foundPath = null
let visitedCells = null
let drawingVisitedCellIndex = 0;
let drawingPathCellIndex = 0;

let grid = generateGrid();
drawGrid(grid);
resetBtn.addEventListener("click", () => {
    startCell = null;
    targetCell = null;
    foundPath = null
    visitedCells = null
    grid.forEach(row => row.forEach(cell => { cell.isVisited = false; cell.parent = null; cell.isWall = false }));
    drawingPathCellIndex = 0;
    drawingVisitedCellIndex = 0;
    drawGrid(grid);
})
randomDirectionsBtn.addEventListener("click", () => {
    if (randomDirections) {
        randomDirections = false;
        randomDirectionsBtn.style.backgroundColor = 'transparent'
        randomDirectionsBtn.style.color = "black"
    } else {
        randomDirections = true;
        randomDirectionsBtn.style.backgroundColor = 'blue'
        randomDirectionsBtn.style.color = 'white'
    }
})

depthFirstSearchBtn.addEventListener("click", () => {
    reset()
    console.log("Finding the path")
    if (!targetCell && !startCell) {
        console.log("Targetcell and startcell are undifned", targetCell, startCell);
        return;
    }
    const { foundPath: path, visitedCells: visited } = depthFirstSearch(grid, startCell, targetCell, randomDirections);

    foundPath = reconstructPath(path);
    visitedCells = visited

    animate()

});
breadthFirstSearchBtn.addEventListener('click', () => {
    reset()
    if (!targetCell && !startCell) {
        console.log("Targetcell and startcell are undifned", targetCell, startCell);
        return;
    }
    const { foundPath: path, visitedCells: visited } = breadthFirstSearch(grid, startCell, targetCell);
    foundPath = reconstructPath(path)
    visitedCells = visited;
    animate()
})

hideOutlinesBtn.addEventListener("click", () => {
    if (outlines) {
        outlines = false;
        hideOutlinesBtn.textContent = "Show outlines"
    } else {
        outlines = true;
        hideOutlinesBtn.textContent = "Hide outlines"
    }
    drawGrid(grid)
})

increaseSizeBtn.addEventListener("click", () => {
    if (cellSize < 55) {
        cellSize += 2;
    }
    grid = generateGrid()
    drawGrid(grid)
    console.log(cellSize)
});
decreaseSizeBtn.addEventListener("click", () => {
    if (cellSize > 4) {
        cellSize -= 2;
    }
    grid = generateGrid()
    drawGrid(grid)
    console.log(cellSize)
});
targetCellBtn.addEventListener("click", () => {
    handleSelectingWallCell(false);
    handleSelectingStartCell(false);
    handleSelectingRemoveWallCell(false)
    if (!selectingTargetCell) {
        selectingTargetCell = true;
        targetCellBtn.setAttribute("data-selectingTarget", "true");
    } else {
        selectingTargetCell = false;
        targetCellBtn.setAttribute("data-selectingTarget", "false");
    }
});
startCellBtn.addEventListener("click", () => {
    handleSelectingWallCell(false);
    handleSelectingTargetCell(false);
    handleSelectingRemoveWallCell(false)
    if (!selectingStartCell) {
        selectingStartCell = true;
        startCellBtn.setAttribute("data-selectingStartCell", "true");
    } else {
        selectingStartCell = false;
        startCellBtn.setAttribute("data-selectingStartCell", "false");
    }
});


let lastCell = null;
canvas.addEventListener("mousedown", (e) => {
    const x = Math.floor(e.offsetX / cellSize);
    const y = Math.floor(e.offsetY / cellSize);
    lastCell = { x, y };

    if (creatingWalls) {
        grid[y][x].isWall = true;
    } else if (removingWalls) {
        grid[y][x].isWall = false;
    }
    drawGrid(grid);
});
canvas.addEventListener("mousemove", (e) => {
    if (!lastCell) return;

    const x = Math.floor(e.offsetX / cellSize);
    const y = Math.floor(e.offsetY / cellSize);

    // If mouse moved to a new cell
    if (x !== lastCell.x || y !== lastCell.y) {
        // Draw line between last cell and current cell
        drawLine(lastCell.x, lastCell.y, x, y);
        lastCell = { x, y };
        drawGrid(grid);
    }
});
canvas.addEventListener("mouseup", (e) => {
    lastCell = null
});
canvas.addEventListener("mouseleave", () => {
    lastCell = null
})
createWallBtn.addEventListener("click", () => {
    handleSelectingStartCell(false)
    handleSelectingTargetCell(false)
    handleSelectingRemoveWallCell(false)
    if (!creatingWalls) {
        creatingWalls = true;
        createWallBtn.setAttribute("data-creatingWalls", "true");
    } else if (creatingWalls) {
        creatingWalls = false;
        createWallBtn.setAttribute("data-creatingWalls", "false")
    }
})
removeWallsBtn.addEventListener("click", () => {
    handleSelectingStartCell(false)
    handleSelectingTargetCell(false);
    handleSelectingWallCell(false)
    if (!removingWalls) {
        removingWalls = true;
        removeWallsBtn.setAttribute("data-removingWalls", "true");
    } else if (removingWalls) {
        removingWalls = false;
        removeWallsBtn.setAttribute("data-removingWalls", "false")
    }
})

canvas.addEventListener("click", (e) => {
    const x = Math.floor(e.offsetX / cellSize);
    const y = Math.floor(e.offsetY / cellSize);

    if (selectingTargetCell && !selectingStartCell) {
        targetCell = grid[y][x];
        drawGrid(grid);

    }
    if (selectingStartCell && !selectingTargetCell) {
        startCell = grid[y][x];
        drawGrid(grid);

    }
});


function reset() {
    grid.forEach(row => row.forEach(cell => { cell.isVisited = false; cell.parent = null }));
    foundPath = null;
    drawingPathCellIndex = 0;
    drawingVisitedCellIndex = 0;
    drawGrid(grid);
}
function handleSelectingTargetCell(bool) {
    selectingTargetCell = bool;
    targetCellBtn.setAttribute("data-selectingTarget", `${bool}`);
}
function handleSelectingStartCell(bool) {
    selectingStartCell = bool;
    startCellBtn.setAttribute("data-selectingStartCell", `${bool}`);
}
function handleSelectingWallCell(bool) {
    creatingWalls = bool;
    createWallBtn.setAttribute("data-creatingWalls", `${bool}`);
}
function handleSelectingRemoveWallCell(bool) {
    removingWalls = bool;
    removeWallsBtn.setAttribute("data-removingWalls", `${bool}`);
}
function generateGrid() {
    const grid = []
    const rows = Math.floor(width / cellSize);
    const cols = Math.floor(height / cellSize);

    for (let y = 0; y < cols; y++) {
        let row = []
        for (let x = 0; x < rows; x++) {
            row.push({
                x,
                y,
                isWall: false,
                isVisited: false,
                parent: null,
            })
        }
        grid.push(row)
    }
    return grid;
}

function drawGrid(grid = []) {
    ctx.clearRect(0, 0, width, height);
    grid.forEach(row => {
        row.forEach(cell => {
            if (cell.x === targetCell?.x && cell.y == targetCell?.y) {
                ctx.beginPath();
                ctx.fillStyle = 'purple'
                ctx.fillRect(cell.x * cellSize, cell.y * cellSize, cellSize, cellSize);
            }
            if (cell.x == startCell?.x && cell.y === startCell?.y) {
                ctx.beginPath();
                ctx.fillStyle = 'blue'
                ctx.fillRect(cell.x * cellSize, cell.y * cellSize, cellSize, cellSize);
            }
            if (cell.isWall) {
                ctx.beginPath();
                ctx.fillStyle = 'rgb(6, 82, 78)'
                ctx.fillRect(cell.x * cellSize, cell.y * cellSize, cellSize, cellSize);
            } else {
                if (outlines) {
                    ctx.beginPath();
                    ctx.strokeStyle = 'gray'
                    ctx.strokeRect(cell.x * cellSize, cell.y * cellSize, cellSize, cellSize);

                }
            }

        });
    });
}

function rect(cell, color = 'rgb(49, 175, 206)') {
    ctx.beginPath();
    ctx.fillStyle = color

    ctx.fillRect(cell.x * cellSize, cell.y * cellSize, cellSize, cellSize);
    if (outlines) {
        ctx.strokeStyle = 'black';
        ctx.strokeRect(cell.x * cellSize, cell.y * cellSize, cellSize, cellSize)

    }


}
animate()
function animate() {
    if (!visitedCells && !foundPath) {
        console.log("visitedCells are undefined", visitedCells, foundPath);
        return;
    };
    if (drawingVisitedCellIndex < visitedCells.length) {
        rect(visitedCells[drawingVisitedCellIndex]);
        drawingVisitedCellIndex++
    } else if (foundPath) {
        if (drawingPathCellIndex < foundPath.length) {

            if (drawingPathCellIndex === 0) {
                rect(foundPath[drawingPathCellIndex], 'orange')
            }
            rect(foundPath[drawingPathCellIndex], 'rgb(219, 189, 68)')
            drawingPathCellIndex++

        }
    }
    if (targetCell && startCell) {
        rect(targetCell, "purple");
        rect(startCell, "blue")

    }
    requestAnimationFrame(animate);
}

function drawWalls(e) {
    const x = Math.floor(e.offsetX / cellSize);
    const y = Math.floor(e.offsetY / cellSize);
    if (creatingWalls) {
        grid[y][x].isWall = true;
    }

    drawGrid(grid)
};

function removeWalls(x, y) {
    console.log('Removing walls')

    // const x = Math.floor(e.offsetX / cellSize);
    // const y = Math.floor(e.offsetY / cellSize);
    if (removingWalls) {
        const directions = [
            { x: 0, y: 1 },
            { x: 0, y: -1 },
            { x: 1, y: 0 },
            { x: -1, y: 0 },
            { x: 1, y: 1 },
            { x: -1, y: 1 },
            { x: -1, y: -1 },
            { x: 1, y: -1 },
        ];
        directions.forEach(dir => {
            const nx = dir.x + x;
            const ny = dir.y + y;

            if (nx >= 0 && nx < grid[0].length && ny >= 0 && ny < grid.length) {
                grid[ny][nx].isWall = false;
            }
        })
    };
    console.log(grid[y][x])

}

function drawLine(x0, y0, x1, y1) {
    // Bresenham's line algorithm
    const dx = Math.abs(x1 - x0);
    const dy = Math.abs(y1 - y0);
    const sx = (x0 < x1) ? 1 : -1;
    const sy = (y0 < y1) ? 1 : -1;
    let err = dx - dy;

    while (true) {
        // Set wall state for current cell
        if (creatingWalls) {
            grid[y0][x0].isWall = true;
        } else if (removingWalls) {
            // grid[y0][x0].isWall = false;
            removeWalls(x0, y0)
        }

        if (x0 === x1 && y0 === y1) break;

        const e2 = 2 * err;
        if (e2 > -dy) {
            err -= dy;
            x0 += sx;
        }
        if (e2 < dx) {
            err += dx;
            y0 += sy;
        }
    }
}