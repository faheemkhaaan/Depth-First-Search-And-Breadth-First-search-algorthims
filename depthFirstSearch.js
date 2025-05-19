



function depthFirstSearch(grid, startCell, targetCell, randomDirections) {
    const stack = [];
    const visitedCells = [];
    startCell.isVisited = true;
    stack.push(startCell);
    visitedCells.length = 0;
    visitedCells.push(startCell)

    while (stack.length > 0) {
        const currentCell = stack.pop();
        if (currentCell.x === targetCell.x && currentCell.y === targetCell.y) {
            return { foundPath: currentCell, visitedCells };
        }
        const neibhours = getNeighbor(grid, currentCell, randomDirections);

        for (let neighbor of neibhours) {
            if (!neighbor.isWall && !neighbor.isVisited) {
                neighbor.parent = currentCell;
                if (neighbor.x === targetCell.x && neighbor.y === targetCell.y) {
                    return { foundPath: neighbor, visitedCells };
                }
                neighbor.isVisited = true;
                visitedCells.push(neighbor);
                stack.push(neighbor);
            }
        }
    }
    return null;
}

function getNeighbor(grid, currentCell, randomDirections) {
    const { x, y } = currentCell;
    const neibhours = []
    let directions = [
        { x: 0, y: 1 },
        { x: 0, y: -1 },
        { x: 1, y: 0 },
        { x: -1, y: 0 },
    ];

    if (randomDirections) {
        directions = directions.sort(() => Math.random() - 0.5)
    }

    directions.forEach(dir => {
        const nx = dir.x + x;
        const ny = dir.y + y;

        if (nx >= 0 && nx < grid[0].length && ny >= 0 && ny < grid.length) {
            const neibhour = grid[ny][nx];
            neibhours.push(neibhour);
        }
    });
    return neibhours;
};

function reconstructPath(targetCell) {

    const p = [];
    let currentCell = targetCell;

    while (currentCell) {
        p.push(currentCell);
        currentCell = currentCell.parent;
    }
    return p.reverse();
}