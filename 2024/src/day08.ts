import fs from 'fs';

type Coord = { x: number, y: number }

function antinodes(repeat: boolean = false): number {
    const input = fs.readFileSync("./input/day08/input.txt", "utf-8");
    const antennas = findAntennas(input);
    const nodes = findAntinodes(input, antennas, repeat);
    return nodes.size;
}

function findAntennas(input: string): Map<string, Coord[]> {
    const antennas = new Map<string, Coord[]>();
    const lines = input.split('\n');
    for (let y = 0; y < lines.length; y++) {
        for (let x = 0; x < lines[y].length; x++) {
            const symbol = lines[y][x];
            if (symbol !== '.') {
                const coords: Coord[] = antennas.get(symbol) || [];
                coords.push({ x: x, y: y });
                antennas.set(symbol, coords);
            }
        }
    }
    return antennas;
}

function findAntinodes(input: string, antennas: Map<string, Coord[]>, repeat: boolean): Set<string> {
    const split = input.split('\n');
    const nodes = new Set<string>();
    for (const [symbol, coords] of antennas.entries()) {
        let mutCoords = coords;
        while (mutCoords.length >= 2) {
            const [head, ...tail] = mutCoords;
            if (repeat) {
                nodes.add(`${head.x},${head.y}`);
            }
            for (const other of tail) {
                if (repeat) {
                    nodes.add(`${other.x},${other.y}`);
                }
                const dx = head.x - other.x;
                const dy = head.y - other.y;
                addAntinodeWhenExists(head, dx, dy, split, symbol, nodes, repeat);
                addAntinodeWhenExists(other, -dx, -dy, split, symbol, nodes, repeat);
            }
            mutCoords = tail;
        }
    }
    return nodes;
}

function addAntinodeWhenExists(toCheck: Coord, dx: number, dy: number, split: string[], symbol: string, nodes: Set<string>, repeat: boolean) {
    let next = { x: toCheck.x + dx, y: toCheck.y + dy }
    let tile = getTileAt(split, next);
    // part 1
    if (tile !== null && tile !== symbol) {
        nodes.add(`${next.x},${next.y}`);
    }

    // part 2
    let multiplier = 2;
    while (repeat && tile !== null) {
        let next = { x: toCheck.x + (dx * multiplier), y: toCheck.y + (dy * multiplier) };
        tile = getTileAt(split, next);
        if (tile !== null && tile !== symbol) {
            nodes.add(`${next.x},${next.y}`);
        }
        multiplier++;
    }
}

function getTileAt(input: string[], coord: Coord): string | null {
    if (coord.y < 0 || coord.y >= input.length) {
        return null;
    }
    if (coord.x < 0 || coord.x >= input[coord.y].length) {
        return null;
    }
    return input[coord.y][coord.x];
}

console.log(antinodes());
console.log(antinodes(true));