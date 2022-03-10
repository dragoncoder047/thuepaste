class Thue {
    constructor(rules, text) {
        this.rules = rules || [];
        this.text = text || '';
    }
    stepOnce() {
        var matches = [];
        for (var r of this.rules) {
            for (var m of r.findMatches(this.text)) {
                matches.push([r, m]);
            }
        }
        var [rule, match] = randomChoice(matches);
        var oldText = this.text;
        this.text = rule.applyMatch(oldText, match, this);
        return this.text;
    }
}

class OutputThue {
    constructor(rules, text, area) {
        super(rules, text);
        this.workspace = document.createElement('code');
        this.output = document.createElement('pre');
        area.append(this.workspace, this.output);

        this.init(this.text);
    }
    init(text) {
        this.output.textContent = '';
        this.workspace.setAttribute('class', '');
        this.workspace.textContent = text;
        this.text = text;
    }
    output(text) {
        this.output.textContent += text;
    }
    input() {
        return prompt(':::');
    }
    tick() {
        var oldText = this.text;
        this.lastStep = this.stepOnce();
        this.workspace.textContent = this.text;
        if (this.text === oldText) {
            this.workspace.classList.add('done');
            return true;
        }
        return false;
    }
}

class Rule {
    constructor(text) {
        if (text.indexOf('::=') === -1) throw 'no ::= in rule';
        var [left, right] = text.split('::=');
        this.left = left || '';
        this.right = right || '';
    }
    findMatches(text) {
        var i, lastindex = 0;
        var out = [];
        do {
            i = text.indexOf(this.left, lastindex);
            if (i != -1) {
                out.push(i);
            }
            lastindex = i + 1;
        } while (i != -1);
        return out;
    }
    applyMatch(text, matchIndex, thue) {
        return text.substring(0, matchIndex) + this.right + text.substring(matchIndex + this.left.length, text.length);
    }
}

class InputRule extends Rule {
    constructor(text) {
        super(text);
        if (this.right !== ':::') throw 'not input';
    }
    applyMatch(text, matchIndex, thue) {
        return text.substring(0, matchIndex) + thue.input() + text.substring(matchIndex + this.left.length, text.length);
    }
}

class OutputRule extends Rule {
    constructor(text) {
        super(text);
        if (!this.right.startsWith('~')) throw 'not output';
    }
    applyMatch(text, matchIndex, thue) {
        thue.output(this.right.substring(1, this.right.length));
        return text.substring(0, matchIndex) + text.substring(matchIndex + this.left.length, text.length);
    }
}

function randomChoice(a) {
    return a[Math.floor(Math.random() * a.length)];
}


function parse(code, ruleClasses) {
    var [rawRules, initText] = code.split('\n::=\n', 1);
    if (!initText) throw 'No rules';
    var lines = rawRules.split(/\r\n|\r|\n/);
    var rules = [];
    while (lines) {
        var line = lines.shift();
        for (var i = 0; i < ruleClasses.length; i++) {
            var klass = ruleClasses[i];
            try {
                rules.push(new klass(line));
                break;
            } catch (e) {
                if (i + 1 === ruleClasses.length) throw e;
                continue;
            }
        }
    }
    return [rules, initText];
}
