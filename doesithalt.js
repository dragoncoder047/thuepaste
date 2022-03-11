function halts(thue, timeout = 5000) {
    const start = +new Date();
    function chanceOfHalting(text) {
        if (+new Date() - start > timeout) throw 'timeout';
        var matches = thue.matches(text);
        if (matches.length === 0) return 1.0; // will defintely halt.
        var chances = [];
        for (var [r, m] of matches) {
            var applied = thue.apply(r, m, text, true);
            // test to see if the rule will match itself
            var oldRules = thue.rules;
            thue.rules = [r];
            var mematch = thue.matches(applied).length;
            thue.rules = oldRules;
            if (mematch > 0)
                chances.push(1.0 - (mematch / matches.length)); // may match itself this many times, so it might not halt.
            else
                chances.push(chanceOfHalting(thue.apply(r, m, text, true)));
        }
        return chances.reduce((a, b) => a + b, 0.0) / chances.length;
    }
    return chanceOfHalting(thue.text);
}
