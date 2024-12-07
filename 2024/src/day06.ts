function _readInputs(): string {
    const fs = require('fs');
    return fs.readFileSync("./2024/input/day06/input.txt", "utf-8");
}

enum Bearing {
    North, NorthEast, East, SouthEast, South, SouthWest, West, NorthWest
}

type Coord = { x: number, y: number }

class Direction {
    bearing: Bearing
    opposite: Bearing
    delta: Coord

    constructor(bearing: Bearing, opposite: Bearing, delta: Coord) {
        this.bearing = bearing;
        this.opposite = opposite;
        this.delta = { x: delta.x, y: delta.y };
    }
}

const DIRS = {
    North: new Direction(Bearing.North, Bearing.South, { x: 0, y: -1 }),
    East: new Direction(Bearing.East, Bearing.West, { x: 1, y: 0 }),
    South: new Direction(Bearing.South, Bearing.North, { x: 0, y: 1 }),
    West: new Direction(Bearing.West, Bearing.East, { x: -1, y: 0 }),
}

const GUARD_TILES = ['^', '>', '<', 'v'];
const NO_COORD = { x: -1, y: -1 };
const NO_DIR = new Direction(Bearing.North, Bearing.South, NO_COORD);

class Guard {
    grid: string[];
    location: Coord;
    facing: Direction;
    // stores locations like "x,y"
    visited: Set<string>;
    turns: Map<Bearing, Coord[]>;
    obstacles: number = 0;

    constructor(grid: string[]) {
        this.grid = grid;
        this.location = NO_COORD;
        this.facing = NO_DIR;
        this.visited = new Set();
        this.turns = new Map<Bearing, Coord[]>();
        this.turns.set(Bearing.North, []);
        this.turns.set(Bearing.East, []);
        this.turns.set(Bearing.South, []);
        this.turns.set(Bearing.West, []);

        for (let y = 0; y < grid.length; y++) {
            for (let x = 0; x < grid[y].length; x++) {
                if (GUARD_TILES.includes(grid[y][x])) {
                    this.location = { x: x, y: y };
                    switch (grid[y][x]) {
                        case '^':
                            this.facing = DIRS.North;
                            break;
                        case '>':
                            this.facing = DIRS.East;
                            break;
                        case 'v':
                            this.facing = DIRS.South;
                            break;
                        case '<':
                            this.facing = DIRS.West;
                            break;
                    }
                }
            }
        }

        if (this.location === NO_COORD) {
            throw Error('No guard located');
        } else if (this.facing === NO_DIR) {
            throw Error('No guard direction');
        }

        this.visit();
    }

    go() {
        const tile = this.look();
        if (tile === '#') {
            this.checkCycle();
            this.rotate();
        } else if (tile === null) {
            return;
        } else {
            this.move();
        }
    }

    look() {
        return this.lookWay(this.location.y, this.facing.delta.y, this.location.x, this.facing.delta.x);
    }

    lookWay(y: number, delta_y: number, x: number, delta_x: number) {
        const new_y = y + delta_y;
        if (new_y < 0 || new_y >= this.grid.length) {
            return null;
        }
        const new_x = x + delta_x;
        if (new_x < 0 || new_x >= this.grid.length) {
            return null;
        }
        return this.grid[new_y][new_x];
    }

    rotate() {
        this.turns.get(this.facing.bearing)?.push(Object.assign({}, this.location));
        switch (this.facing) {
            case DIRS.North:
                this.facing = DIRS.East;
                break;
            case DIRS.East:
                this.facing = DIRS.South;
                break;
            case DIRS.South:
                this.facing = DIRS.West;
                break;
            case DIRS.West:
                this.facing = DIRS.North;
                break;
        }
    }

    checkCycle() {
        const previous = this.turns.get(this.facing.opposite);
        if (previous === undefined) {
            return;
        } else {
            for (const p of previous) {
                let target = NO_COORD;
                let delta_x = 0;
                let delta_y = 0;
                switch (this.facing.bearing) {
                    case Bearing.North:
                        target = { x: p.x, y: this.location.y };
                        delta_x = 1;
                        delta_y = 0;
                        break;
                    case Bearing.South:
                        target = { x: p.x, y: this.location.y };
                        delta_x = -1;
                        delta_y = 0;
                        break;
                    case Bearing.East:
                        delta_x = 0;
                        delta_y = -1;
                        target = { x: this.location.x, y: p.y };
                    case Bearing.West:
                        delta_x = 0;
                        delta_y = 1;
                        target = { x: this.location.x, y: p.y };
                        break;
                }

                if (target === NO_COORD || (delta_x === 0 && delta_y === 0)) {
                    throw new Error("Check cycle invalid");
                }

                if (this.isReachable(delta_x, delta_y, target)) {
                    this.obstacles++;
                }
            }
        }
    }

    isReachable(delta_x: number, delta_y: number, target: Coord): boolean {
        let location = Object.assign({}, this.location);
        while (location.x !== target.x || location.y !== target.y) {
            const tile = this.lookWay(location.y, delta_y, location.x, delta_x);
            if (tile === null || tile === '#') {
                return false;
            }
            location.x += delta_x;
            location.y += delta_y;
        }
        return true;
    }

    move() {
        this.location.x = this.location.x + this.facing.delta.x;
        this.location.y = this.location.y + this.facing.delta.y;
        this.visit();
    }

    visit() {
        this.visited.add(`${this.location.x},${this.location.y}`);
    }
}

function bruteforce(input: string) {
    const grid = input.split('\n');
    const og = new Guard(grid);
    while (og.look() !== null) {
        og.go();
    }

    let count = 0;
    for (const xy of og.visited) {
        const grid = input.split('\n');
        const guard = new Guard(grid);
        const coord = { x: parseInt(xy.split(',')[0]), y: parseInt(xy.split(',')[1]) }
        if (guard.location.x === coord.x && guard.location.y === coord.y) {
            continue;
        }
        grid[coord.y] = grid[coord.y].substring(0, coord.x) + '#' + grid[coord.y].substring(coord.x + 1);
        const locations = new Set();
        while (guard.look() !== null) {
            locations.add(`${guard.location.x},${guard.location.y}:${guard.facing.bearing}`);
            guard.go();
            if (locations.has(`${guard.location.x},${guard.location.y}:${guard.facing.bearing}`)) {
                count++;
                break;
            }
        }
    }
    console.log(`bruteforce = ${count}`);
}

function findPositions() {
    const input = _readInputs();
    const grid = input.split('\n');
    const guard = new Guard(grid);
    while (guard.look() !== null) {
        guard.go();
    }

    console.log(`visits = ${guard.visited.size}`)
    console.log(`obstacles = ${guard.obstacles}`)

    bruteforce(input);
}

findPositions();
