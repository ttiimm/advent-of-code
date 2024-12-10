import fs from 'fs';

type Coord = { x: number, y: number }
type Node = { coord: Coord, altitude: number }

class Direction {
    delta: Coord

    constructor(delta: [number, number]) {
        this.delta = { x: delta[0], y: delta[1] };
    }
}

const DIRS = {
    North: new Direction([0, -1]),
    East: new Direction([1, 0]),
    South: new Direction([0, 1]),
    West: new Direction([-1, 0]),
}

function score() {
    const input = fs.readFileSync("./input/day10/input.txt", "utf-8");
    const grid = input.split('\n');
    let sum = 0
    let rating = 0;

    for (const y of range(grid.length)) {
        for (const x of range(grid[y].length)) {
            const coord = { x: x, y: y };
            const tile = look(coord, grid);
            if (tile === 0) {
                const seen = find(coord, grid);
                // console.log(`score = ${seen.size}`);
                sum += seen[0].size;
                rating += seen[1];
            }
        }
    }
    console.log(`rating: ${rating}`);
    return sum;
}

function find(coord: Coord, grid: string[]): [Set<string>, number] {
    const seen = new Set<string>();
    const stack = [{ coord: coord, altitude: 0 }];
    let node: Node | undefined = undefined;
    let rating = 0;
    while ((node = stack.pop()) !== undefined) {
        for (const d of Object.values(DIRS)) {
            const altitude = lookDir(node.coord, d, grid);
            if (altitude === node.altitude + 1) {
                if (altitude === 9) {
                    const neigh = neighbor(node.coord, d);
                    seen.add(key({ coord: neigh, altitude: 9 }));
                    rating++;
                } else {
                    const next = { coord: neighbor(node.coord, d), altitude: node.altitude + 1 };
                    stack.push(next);
                }
            }
        }
    }

    return [seen, rating];
}

function key(node: Node): string {
    return `${node.altitude} (${node.coord.x}, ${node.coord.y})`;
}

function range(end: number) {
    return [...Array(end).keys()];
}

function lookDir(current: Coord, direction: Direction, grid: string[]): null | number {
    return look(neighbor(current, direction), grid);
}

function neighbor(current: Coord, direction: Direction): Coord {
    return { x: current.x + direction.delta.x, y: current.y + direction.delta.y };
}

function look(coord: Coord, grid: string[]): null | number {
    if (coord.y < 0 || coord.y >= grid.length) {
        return null;
    }
    if (coord.x < 0 || coord.x >= grid[coord.y].length) {
        return null;
    }
    return parseInt(grid[coord.y][coord.x]);
}

console.log(score());