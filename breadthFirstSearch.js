



function breadthFirstSearch(grid, startCell, targetCell) {
    const queue = [];
    const visitedCells = []
    startCell.isVisited = true;
    queue.push(startCell);
    visitedCells.push(startCell)

    while (queue.length > 0) {
        const currentCell = queue.shift();

        if (currentCell.x === targetCell.x && currentCell.y === targetCell.y) {
            return { foundPath: currentCell, visitedCells };
        }
        const neighbours = getNeighbours(grid, currentCell);

        for (let neibhour of neighbours) {
            if (!neibhour.isWall && !neibhour.isVisited) {
                neibhour.parent = currentCell
                if (neibhour.x === targetCell.x && neibhour.y == targetCell.y) {
                    return { visitedCells, foundPath: neibhour }
                }
                neibhour.isVisited = true;
                queue.push(neibhour);
                visitedCells.push(neibhour);
            }
        }
    }
    return null
}

function getNeighbours(grid, currentCell) {
    const { x, y } = currentCell;
    const neighbors = []
    const directions = [
        { x: 1, y: 0 },
        { x: -1, y: 0 },
        { x: 0, y: 1 },
        { x: 0, y: -1 }
    ];
    directions.forEach(dir => {
        const nx = dir.x + x;
        const ny = dir.y + y

        if (nx >= 0 && nx < grid[0].length && ny >= 0 && ny < grid.length) {
            neighbors.push(grid[ny][nx]);
        }
    });
    return neighbors
}