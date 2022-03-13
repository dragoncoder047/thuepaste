function chanceOfHalting(thue, depthCallback, timeout = 5000) {
    const start = +new Date();
    var seen = {};
    function test(text, depth, path) {
        if (+new Date() - start > timeout) throw 'timeout';
        var matches = thue.matches(text);
        if (matches.length === 0) return 1.0; // will defintely halt.
        var chances = [];
        for (var [r, m] of matches) {
            if (depthCallback) depthCallback(depth);
            var applied = thue.apply(r, m, text, true);
            for (var s in seen) {
                if (s.indexOf(applied) > -1) {
                    var c = seen[s];
                    throw 'todo'; ////////////////////////////////////////
                }
            }
        }
        return chances.reduce((a, b) => a + b, 0.0) / chances.length;
    }
    return test(thue.text, 0, [thue.text]);
}
