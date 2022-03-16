async function chanceOfHalting(thue, statusCallback, abortSignal) {
    throw 'todo :)';
    
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    function interrupt() {
        if (abortSignal && abortSignal.aborted) throw abortSignal.reason || 'aborted';
    }
    
    var tree = new Map();
    tree.set(thue.text, thue.matches(thue.text));
    var longLimit = 10000;
    
    async function findCycleFrom(text, path = []) {
        // Brent's cycle finding algorithm
        function foo(text, iii) {
            var match = tree.get(text)[path[iii]];
            if (match === undefined) return undefined;
            return thue.apply(match[0], match[1], text, true);
        }
        var tortoise = text, hare = foo(text, path[0]);
        var power = 1, lambda = 1;
        while (tortoise !== hare) {
            interrupt();
            if (power === lambda) {
                tortoise = hare;
                power *= 2;
                lambda = 0;
            }
            hare = foo(hare, lambda);
            if (hare === undefined) return [undefined, undefined];
            lambda++;
            await statusCallback('cyclefind' + lambda);
        }
        tortoise = hare = text;
        var i;
        for (i = 0; i < lambda; i++)
            hare = foo(hare, i);
        var mu = 0;
        while (tortoise !== hare) {
            tortoise = foo(tortoise, mu);
            hare = foo(hare, i++);
            mu++;
            await statusCallback('mufind' + mu);
        }
        return [lambda, mu];        
    }
    
    //////////////////////////////////////return findCycleFrom(thue.text, [0, 0, 0, 0, 0])[0];
    
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    var seen = new Map();
    async function test(text, depth, path) {
        interrupt();
        
        var matches = thue.matches(text);
        seen.set(text, matches.length);
        if (matches.length === 0) return 1.0; // will defintely halt.
        
        var chances = [];
        for (var [r, m] of matches) {
            if (statusCallback) await statusCallback(depth);
            
            var applied = thue.apply(r, m, text, true), found = false;
            for (var [s, c] in seen) {
                if (s.indexOf(applied) > -1) {
                    // is this really the best approximation? substring?
                    var ch = 1.0;
                    var n = path.indexOf(s);
                    for (var i = n; i < path.length; i++)
                        ch /= seen.get(path[i]);
                    seen.set(s, ch); // update chance
                    chances.push(ch);
                    found = true;
                }
                //await statusCallback(depth);
            }
            // brute force recursive search
            if (!found) chances.push(await test(applied, depth + 1, path.concat([applied])));
        }
        return chances.reduce((a, b) => a + b, 0.0) / chances.length;
    }
    return await test(thue.text, 0, [thue.text]);
}
