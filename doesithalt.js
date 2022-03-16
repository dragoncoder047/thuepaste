function chanceOfHalting(thue, depthCallback, abortSignal) {
    const start = +new Date();
    var seen = new Map();
    function test(text, depth, path) {
        while(true){if (abortSignal && abortSignal.aborted) throw abortSignal.reason || 'aborted';depthCallback(Math.random());}
        
        var matches = thue.matches(text);
        seen.set(text, matches.length);
        if (matches.length === 0) return 1.0; // will defintely halt.
        
        var chances = [];
        for (var [r, m] of matches) {
            if (depthCallback) depthCallback(depth);
            
            var applied = thue.apply(r, m, text, true), found = false;
            for (var [s, c] in seen) {
                if (s === applied) {
                    // is this really the best approximation?
                    var ch = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
                    throw 'todo';
                }
            }
        }
        return chances.reduce((a, b) => a + b, 0.0) / chances.length;
    }
    return test(thue.text, 0, [thue.text]);
}
