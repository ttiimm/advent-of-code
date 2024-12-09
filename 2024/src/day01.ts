import fs from 'fs';
import readline from 'readline';

class Inputs {
    left: number[] = [];
    right: number[] = [];
}

async function _readInputs(): Promise<Inputs> {
    const inputs = new Inputs();
    const fileStream = fs.createReadStream("./input/day01/input.txt");
    const rl = readline.createInterface({
        input: fileStream,
    });

    for await (const line of rl) {
        const [first, second] = line.split("   ");
        inputs.left.push(parseInt(first));
        inputs.right.push(parseInt(second));
    }
    // inputs.left = [3, 4, 2, 1, 3, 3];
    // inputs.right = [4, 3, 5, 3, 9, 3];
    return inputs;
}

function _findDistances(inputs: Inputs): number[] {
    const leftSorted = inputs.left.sort();
    const rightSorted = inputs.right.sort();
    return leftSorted.map((n, i) => Math.abs(n - rightSorted[i]));
}

function _findSimilarities(inputs: Inputs): number[] {
    const similarities: number[] = [];
    for (const n of inputs.left) {
        const freq = inputs.right.filter(r => n == r);
        const count = freq.length;
        similarities.push(n * count);
    }
    return similarities;
}


async function distance(): Promise<number> {
    const inputs = await _readInputs();
    const distances = _findDistances(inputs);
    const summed = distances.reduce((sum, n) => sum + n, 0);
    return summed;
}

async function similaritiy(): Promise<number> {
    const inputs = await _readInputs();
    const similarities = _findSimilarities(inputs);
    const summed = similarities.reduce((sum, n) => sum + n, 0);
    return summed;
}

distance().then(result => {
    console.log(result);
})

similaritiy().then(result => {
    console.log(result);
})