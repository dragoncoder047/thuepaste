function chanceOfHalting(thue, timeout = 5000) {
    const start = +new Date();
    var seen = {}; ////////////////////////////////////
    function hc(text) {
        if (+new Date() - start > timeout) throw 'timeout';
        var matches = thue.matches(text);
        if (matches.length === 0) return 1.0; // will defintely halt.
        var chances = [];
        for (var i = 0; i < matches.length; i++) {
            var [r, m] = matches[i];
            // TODO - FINISH HERE
            var applied = thue.apply(r, m, text, true);
            // test to see if the rule will match itself or in a cycle
            var oldRules = thue.rules;
            var moreSeen = seenRules.indexOf(r) === -1 ? [r].concat(seenRules) : seenRules; // prevent duplicates
            thue.rules = moreSeen;
            chances.push(hc(thue.apply(r, m, text, true)));
            thue.rules = oldRules;
        }
        return chances.reduce((a, b) => a + b, 0.0) / chances.length;
    }
    return hc(thue.text);
}
