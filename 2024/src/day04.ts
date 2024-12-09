import fs from 'fs';

enum Bearing {
    North, NorthEast, East, SouthEast, South, SouthWest, West, NorthWest
}

type Coord = { x: number, y: number }

class Direction {
    delta: Coord

    constructor(delta: [number, number]) {
        this.delta = { x: delta[0], y: delta[1] };
    }
}

const DIRS = {
    NorthWest: new Direction([-1, -1]),
    North: new Direction([0, -1]),
    NorthEast: new Direction([1, -1]),
    East: new Direction([1, 0]),
    SouthEast: new Direction([1, 1]),
    South: new Direction([0, 1]),
    SouthWest: new Direction([-1, 1]),
    West: new Direction([-1, 0]),
}

class Done { }

const NEXT: { [key: string]: string | typeof Done } = {
    X: "M",
    M: "A",
    A: "S",
    S: Done
}

function find(): number {
    const input = fs.readFileSync("./input/day04/input.txt", "utf-8");
    const grid = input.split('\n');
    let count = 0;
    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[y].length; x++) {
            if (grid[y][x] === 'X') {
                const matches = Object.values(DIRS)
                    .filter(dir => _match(NEXT["X"], x, y, dir, grid));
                count += matches.length;
            }
        }
    }
    return count;
}

function findMas(): number {
    const input = fs.readFileSync("./input/day04/input.txt", "utf-8");
    const grid = input.split('\n');
    let count = 0;
    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[y].length; x++) {
            if (grid[y][x] === 'A') {
                const nw_seNeighbors = [
                    _next(x - 1, y - 1, grid),
                    _next(x + 1, y + 1, grid),
                ];
                const ne_swNeighbors = [
                    _next(x + 1, y - 1, grid),
                    _next(x - 1, y + 1, grid),
                ];
                if (nw_seNeighbors.includes("M")
                    && nw_seNeighbors.includes("S")
                    && ne_swNeighbors.includes("M")
                    && ne_swNeighbors.includes("S")) {
                    count++;
                }
            }
        }
    }
    return count;
}

function _match(target: string | typeof Done, x: number, y: number, dir: Direction, grid: string[]): boolean {
    if (target === Done) {
        return true;
    }

    const new_x = x + dir.delta.x;
    const new_y = y + dir.delta.y;
    const next = _next(new_x, new_y, grid);
    if (next === target) {
        const new_next = NEXT[next];
        return _match(new_next, new_x, new_y, dir, grid);
    }
    return false;
}

function _next(new_x: number, new_y: number, grid: string[]): null | string {
    if (new_y < 0 || new_y >= grid.length) {
        return null;
    }
    if (new_x < 0 || new_x >= grid[new_y].length) {
        return null;
    }
    return grid[new_y][new_x];
}


console.log(find());
console.log(findMas());
