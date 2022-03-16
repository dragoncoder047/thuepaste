async function chanceOfHalting(thue, depthCallback, abortSignal) {
    var seen = new Map();
    async function test(text, depth, path) {
        if (abortSignal && abortSignal.aborted) throw abortSignal.reason || 'aborted';
        
        var matches = thue.matches(text);
        seen.set(text, matches.length);
        if (matches.length === 0) return 1.0; // will defintely halt.
        
        var chances = [];
        for (var [r, m] of matches) {
            if (depthCallback) await depthCallback(depth);
            
            var applied = thue.apply(r, m, text, true), found = false;
            for (var [s, c] in seen) {
                if (s.indexOf(applied) > -1) {
                    // is this really the best approximation? substring?
                    var ch = 1.0;
                    var n = path.indexOf(s);
                    for (var i = n + 1; i < path.length; i++)
                        ch /= seen.get(path[i]);
                    chances.push(ch);
                    found = true;
                }
            }
            // brute force recursive search
            if (!found) chances.push(await test(applied, depth + 1, path.concat([applied])));
        }
        return chances.reduce((a, b) => a + b, 0.0) / chances.length;
    }
    return await test(thue.text, 0, [thue.text]);
}
