import fs from 'fs';
import readline from 'readline';

async function _readInputs(): Promise<Array<number[]>> {
    const fileStream = fs.createReadStream("./input/day02/input.txt");
    const rl = readline.createInterface({
        input: fileStream,
    });

    const inputs = new Array<number[]>();
    for await (const line of rl) {
        inputs.push(line.split(" ").map((s: String) => Number(s)));
    }

    return inputs;
}

function _isSafe(level: number[]): boolean {
    const isLevelAsc = level[0] < level[1];
    for (let i = 0; i < level.length - 1; i++) {
        if (!_checkSafety(level[i], level[i + 1], isLevelAsc)) {
            return false;
        }
    }
    return true;
}

function _checkSafety(curr: number, next: number, isLevelAsc: boolean) {
    const diff = Math.abs(curr - next);
    const isAsc = curr < next;
    if (isLevelAsc != isAsc) {
        return false;
    } else if (diff <= 0 || diff >= 4) {
        return false;
    }
    return true;
}

async function safety(): Promise<number> {
    const inputs = await _readInputs();
    let safe = 0;
    for (const level of inputs) {
        const isSafe = _isSafe(level);
        if (isSafe) {
            safe++;
        }
    }
    return safe;
}

function _isSafeTolerant(level: number[]): boolean {
    if (_isSafe(level)) {
        return true;
    }

    for (const i of Array.from(Array(level.length).keys())) {
        if (_isSafe(level.filter((_, index) => i !== index))) {
            return true;
        }
    }
    return false;

}

async function safetyWithTolerance(): Promise<number> {
    const inputs = await _readInputs();
    let safe = 0;
    for (const level of inputs) {
        const isSafe = _isSafeTolerant(level);
        if (isSafe) {
            safe++;
        }
    }
    return safe;
}

safety().then(result => console.log(result));
safetyWithTolerance().then(result => console.log(result))