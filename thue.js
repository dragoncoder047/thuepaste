class Thue {
    constructor(rules, text) {
        this.rules = rules || [];
        this.workspace = text || '';
    }
    step_once() {
        var matches = [];
        for (var r in this.rules) {
            for (var m in r.findMatches(this.text)) {
                matches.push([r, m]);
            }
        }
        var [rule, match] = randomChoice(matches);
        var oldtext = this.text;
        this.text = rule.applyMatch(oldtext, match, this);
        return {
            rule,
            match,
            oldtext,
            newtext: this.text,
        };
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
        return text.substring(0, matchIndex) + prompt(':::') + text.substring(matchIndex + this.left.length, text.length);
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


function parse(text, ruleClasses) {
    var lines = text.split(/\r\n|\r|\n/);
    var rules = []
    while (lines) {
        var line = lines.shift();
        var worked = false;
        for (var klass in ruleClasses) {
            try {
                rules.push(new klass(line));
                worked = true;
                break;
            } catch (e) {
                continue;
            }
        }
        if (!worked)
            return [rules, [line].concat(lines).join('\n')];
    }
    return [rules, ''];
}
