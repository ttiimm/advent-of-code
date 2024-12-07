function _readInputs(): string {
    const fs = require('fs');
    return fs.readFileSync("./input/day07/input.txt", "utf-8");
}

class Equation {
    target: number
    nums: number[]
    results: number[] = []

    constructor(target: number, nums: number[]) {
        this.target = target;
        this.nums = nums;
    }

    isValid() {
        return this.results.includes(this.target);
    }
}

function calibrate(): number {
    const input = _readInputs();
    const equations = _parse(input);
    let sum = 0;
    for (const eq of equations) {
        sum += _check(eq)
    }
    return sum;
}

function concatenate(): number {
    const input = _readInputs();
    const equations = _parse(input);
    let sum = 0;
    for (const eq of equations) {
        sum += _checkConcat(eq)
    }
    return sum;
}

function _parse(input: string): Equation[] {
    const eqs = [];
    for (const line of input.split('\n')) {
        const split = line.split(':');
        const target = parseInt(split[0]);
        const nums = split[1].split(' ')
            .map(n => parseInt(n))
            .filter(n => !isNaN(n));
        eqs.push(new Equation(target, nums));
    }
    return eqs;
}

function _check(eq: Equation): number {
    const nums = Array.from(eq.nums);
    const head = nums.shift()

    if (head === undefined) {
        throw new Error("invalid");
    }

    _doit(nums, head, eq);
    return eq.isValid() ? eq.target : 0;
}

function _doit(nums: number[], result: number, eq: Equation) {
    if (nums.length === 0) {
        eq.results.push(result);
    } else {
        const head = nums.shift()
        _doit(Array.from(nums), result + head, eq);
        _doit(Array.from(nums), result * head, eq);
    }

}

function _checkConcat(eq: Equation): number {
    const nums = Array.from(eq.nums);
    const head = nums.shift()

    if (head === undefined) {
        throw new Error("invalid");
    }

    _doitConcat(nums, head, eq);
    return eq.isValid() ? eq.target : 0;
}

function _doitConcat(nums: number[], result: number, eq: Equation) {
    if (nums.length === 0) {
        eq.results.push(result);
    } else {
        const head = nums.shift()
        _doitConcat(Array.from(nums), result + head, eq);
        _doitConcat(Array.from(nums), result * head, eq);
        _doitConcat(Array.from(nums), parseInt(result.toString() + head?.toString()), eq);
    }

}

console.log(calibrate());
console.log(concatenate());