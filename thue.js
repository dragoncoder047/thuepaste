class Thue {
    constructor(rules, text) {
        this.rules = rules || [];
        this.text = text || '';
    }
    matches(text) {
        var matches = [];
        for (var r of this.rules) {
            for (var m of r.findMatches(text)) {
                matches.push([r, m]);
            }
        }
        return matches;
    }
    apply(rule, match, text, silent = false) {
        return rule.applyMatch(text, match, this, silent);
    }
    stepOnce() {
        var matches = this.matches(this.text);
        if (matches.length === 0) return true;
        this.text = this.apply(...randomChoice(matches), this.text);
        return false;
    }
}

class OutputThue extends Thue {
    constructor(rules, text, area) {
        super(rules, text);
        this.workspace = document.createElement('code');
        this.outputElement = document.createElement('pre');
        area.append(this.workspace, this.outputElement);
        this.hyperspeed = false;

        this.init(this.text);
    }
    init(text) {
        this.outputElement.textContent = '';
        this.workspace.setAttribute('class', '');
        this.workspace.textContent = text;
        this.text = text;
    }
    output(text) {
        this.outputElement.innerHTML += text;
    }
    input(p) {
        return prompt(p || 'input please');
    }
    tick() {
        var done;
        for (var i = 0; i < (this.hyperspeed ? 1024 : 1); i++) {
            var oldText = this.text;
            done = this.stepOnce();
            this.workspace.textContent = this.text;
            if (done) {
                this.workspace.classList.add('done');
                break;
            }
        }
        return done;
    }
}

class Rule {
    constructor(text) {
        if (text.indexOf('::=') === -1) throw `not a rule: ${text}`;
        var [left, right] = text.split('::=');
        this.left = left || '';
        this.right = right || '';
        if (right === left) throw `degenerate rule: ${left}::=${right}`;
        this.selfApplicable = right.indexOf(left) > -1;
        this.output = this.left;
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
        if (!this.right.startsWith(':::')) throw 'not input rule';
        this.selfApplicable = undefined;
        this.output = undefined;
    }
    applyMatch(text, matchIndex, thue, silent = false) {
        if (silent) throw 'cannot determine halting condition for a program that accepts user input';
        return text.substring(0, matchIndex) + thue.input(this.right.substring(3, this.right.length)) + text.substring(matchIndex + this.left.length, text.length);
    }
}

class OutputRule extends Rule {
    constructor(text) {
        super(text);
        if (!this.right.startsWith('~')) throw 'not output rule';
        this.selfApplicable = false;
        this.output = '';
    }
    applyMatch(text, matchIndex, thue, silent = false) {
        if (!silent) thue.output(this.right.substring(1, this.right.length));
        return text.substring(0, matchIndex) + text.substring(matchIndex + this.left.length, text.length);
    }
}

class RegExpRule {
    constructor(text) {
        if (text.indexOf('::/=') === -1) throw `bad regexp rule: ${text}`;
        var [left, right] = text.split('::/=');
        this.left = new RegExp('^' + (left || ''));
        this.right = right || '';
        this.selfApplicable = undefined;
        this.output = undefined;
    }
    findMatches(text) {
        var out = [];
        for (var i = 0; i < text.length; i++) {
            var m = this.left.test(text.substring(i, text.length));
            if (m) {
                out.push(i);
            }
        }
        return out;
    }
    applyMatch(text, matchIndex, thue) {
        var t = text.substring(matchIndex, text.length);
        return text.substring(0, matchIndex) + t.replace(this.left, this.right);
    }
}

function randomChoice(a) {
    return a[Math.floor(Math.random() * a.length)];
}


function parse(code, ruleClasses, endOfRules='::=') {
    var lines = code.split(/\r\n|\r|\n/);
    var rules = [], text = '';
    while (lines) {
        var line = lines.shift();
        if (line === endOfRules) {
            text = lines.join('\n');
            break;
        }
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
    if (!rules) throw 'no rules';
    return [rules, text];
}
