function _readInputs(): string {
    const fs = require('fs');
    return fs.readFileSync("./input/day03/input.txt", "utf-8");
}

function mul(): number {
    const input = _readInputs();
    const mulRegex = /mul\((\d{1,3}),(\d{1,3})\)/g;
    const matches = [...input.matchAll(mulRegex)];
    if (!matches) {
        return -1;
    }

    const tuples = [];
    for (const m of matches) {
        tuples.push([parseInt(m[1]), parseInt(m[2])]);
    }

    return tuples.map(([first, second]) => first * second)
        .reduce((sum, n) => sum + n, 0);
}

function mulDoDont(): number {
    const input = _readInputs();
    const r = /mul\((\d{1,3}),(\d{1,3})\)|(do|don't)\(\)/g;
    const matches = [...input.matchAll(r)];
    if (!matches) {
        return -1;
    }
    const tuples = [];
    let enabled = true;
    for (const m of matches) {
        let match = m[0];
        switch (match) {
            case "do()":
                enabled = true;
                break;
            case "don't()":
                enabled = false;
                break;
            default:
                if (enabled) {
                    tuples.push([parseInt(m[1]), parseInt(m[2])]);
                }
                break;
        }
    }

    return tuples.map(([first, second]) => first * second)
        .reduce((sum, n) => sum + n, 0);
}

console.log(mul());
console.log(mulDoDont());
