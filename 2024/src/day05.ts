import fs from 'fs';

class Input {
    rules: Map<string, string[]> = new Map();
    reversed: Map<string, string[]> = new Map();
    toCheck: string[][] = [];
}

function toPrint(): number {
    const input = fs.readFileSync("./input/day05/input.txt", "utf-8");
    const built = _build(input);
    let sum = 0;
    for (const check of built.toCheck) {
        sum += _check(built.rules, check);
    }
    return sum;
}

function toFix(): number {
    const input = fs.readFileSync("./input/day05/input.txt", "utf-8");
    const built = _build(input);
    let sum = 0;
    for (const check of built.toCheck) {
        // _check returns 0 if wasn't in the right order
        if (_check(built.rules, check) === 0) {
            sum += _fix(built.reversed, check);
        }
    }
    return sum;
}

function _build(input: string): Input {
    const lines = input.split('\n');
    const built = new Input();
    const lineBreak = lines.indexOf('');
    for (const line of lines.slice(0, lineBreak)) {
        const [predecessor, then] = line.split('|');
        const ruleSet = built.rules.get(predecessor) || [];
        ruleSet.push(then);
        built.rules.set(predecessor, ruleSet);
        const reversed = built.reversed.get(then) || [];
        reversed.push(predecessor);
        built.reversed.set(then, reversed);
    }

    built.toCheck = lines.slice(lineBreak + 1)
        .map(s => s.split(','));
    return built;
}

function _check(rules: Map<string, string[]>, check: string[]): number {
    const predecessor: string[] = [];
    for (const c of check) {
        const ruleSet = rules.get(c);
        for (const p of predecessor) {
            if (ruleSet?.includes(p)) {
                return 0;
            }
        }
        predecessor.push(c);
    }
    return _middle(check);
}

function _middle(arr: string[]): number {
    const middleIndex = Math.floor(arr.length / 2.0);
    return parseInt(arr[middleIndex]);
}

function _fix(reversed: Map<string, string[]>, check: string[]): number {
    const mutableReversed: Map<string, string[]> = new Map();
    for (const e of reversed.entries()) {
        const key = e[0];
        if (check.includes(key)) {
            const values = e[1]
            const inChecked: string[] = [];
            for (const v of values) {
                if (check.includes(v)) {
                    inChecked.push(v);
                }
            }
            mutableReversed.set(key, inChecked);
        }
    }

    // start from any page that has no rules about it
    const keys = Array.from(mutableReversed.keys());
    const next = check.filter(c => !keys.includes(c));
    Array.from(mutableReversed.entries()).forEach(([k, v]) => { if (v.length === 0) { next.push(k) } });
    if (next.length === 0) {
        throw new Error("should have one rule");
    }
    const ordered = [];
    let n;
    while ((n = next.pop()) !== undefined) {
        mutableReversed.delete(n);
        ordered.push(n);
        for (const v of mutableReversed.values()) {
            const nIndex = v.indexOf(n);
            if (nIndex > -1) {
                v.splice(nIndex, 1);
            }
        }

        Array.from(mutableReversed.entries()).forEach(([k, v]) => { if (v.length === 0) { next.push(k) } });
    }
    return _middle(ordered);
}

console.log(toPrint());
console.log(toFix());