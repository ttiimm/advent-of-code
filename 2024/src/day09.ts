import fs from 'fs';

type DiskMap = Array<'.' | number>;

function checksum(): number {
    const input = fs.readFileSync("./input/day09/input.txt", "utf-8");
    const blocks = readBlocks(input);
    // console.log(blocks.join('|'));
    const compacted = compact(blocks);
    // console.log(compacted.join('|') + '|.'.repeat(blocks.length - compacted.length));
    return compacted.filter(n => n !== '.').map((id, i) => i * id).reduce((accum, n) => accum + n);
}

function readBlocks(input: string): DiskMap {
    let id = 0;
    let isFile = true;
    let blocks: DiskMap = [];
    for (const n of [...input]) {
        const times = parseInt(n);
        if (isFile) {
            for (let i = 0; i < times; i++) {
                blocks.push(id);
            }
            id++;
        } else {
            for (let i = 0; i < times; i++) {
                blocks.push('.');
            }
        }
        isFile = !isFile;
    }
    return blocks;
}

function compact(blocks: DiskMap): DiskMap {
    const fill = Array.from(blocks).filter(c => c !== '.');
    let compacted: DiskMap = [];
    for (let i = 0; i < blocks.length; i++) {
        let next = undefined;
        if (blocks[i] === '.') {
            next = fill.pop();
        } else {
            next = fill.shift();
        }
        if (next !== undefined) {
            compacted.push(next);
        }
    }
    return compacted;
}

type DiskMapByFile = Array<Block>;

class Block {
    id: number | string
    length: number
    index: number

    constructor(id: number | string, length: number, index: number) {
        this.id = id;
        this.length = length;
        this.index = index;
    }

    toString() {
        return `[${this.index}] ${(this.id.toString() + ",").repeat(this.length)}`
    }
}

function checksumByFile() {
    const input = fs.readFileSync("./input/day09/input.txt", "utf-8");
    const blocks = readBlocksByFile(input);
    const compacted = compactByFile(blocks);
    // process.stdout.write(`${compacted.join(', ')}\n`);
    return compacted.map((id, i) => id >= 0 ? i * id : 0).reduce((accum, n) => accum + n);
}

function readBlocksByFile(input: string): DiskMapByFile {
    let id = 0;
    let isFile = true;
    const blocks: DiskMapByFile = [];
    let index = 0;
    for (const n of [...input]) {
        const times = parseInt(n);
        if (isFile) {
            blocks.push(new Block(id, times, index));
            id++;
        } else if (times > 0) {
            blocks.push(new Block('.', times, index));
        }
        index += times;
        isFile = !isFile;
    }
    return blocks;
}

function compactByFile(blocks: DiskMapByFile): number[] {
    const compacted = blocks.flatMap(b => new Array(b.length).fill(b.id === '.' ? -1 : b.id));
    for (const b of Array.from(blocks).filter(b => b.id !== ".").reverse()) {
        for (const f of Array.from(blocks).filter(b => b.id === ".")) {
            if (f.index > b.index) {
                break;
            }
            if (f.length >= b.length) {
                for (let i = 0; i < b.length; i++) {
                    compacted.splice(f.index + i, 1, b.id);
                }
                for (let i = 0; i < b.length; i++) {
                    compacted.splice(b.index + i, 1, -1);
                }
                f.length = f.length - b.length;
                f.index += b.length;
                break;
            }
        }
    }
    return compacted;
}

console.log(checksum());
console.log(checksumByFile());
