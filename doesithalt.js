function halts(thue, timeout = 5000) {
    const start = +new Date();
    function chanceOfHalting(text) {
        if (+new Date() - start > timeout) throw 'timeout';
        var matches = thue.matches(text);
        if (matches.length === 0) return 1.0;
        var chances = [];
        for (var [r, m] of matches) {
            chances.push(chanceOfHalting(thue.apply(r, m, text, true)));
        }
        return chances.reduce((a, b) => a + b, 0.0) / chances.length;
    }
    return chanceOfHalting(thue.text);
}
