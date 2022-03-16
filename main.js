function $(sel) { return document.querySelector(sel); }

var samplesSelector = $('#samples');
var statusBar = $('#status');
var codeBox = $('#code');
var loadButton = $('#load');
var runButton = $('#run');
var stepButton = $('#step');
var haltsButton = $('#halts');
var thueArea = $('#thue');

var thue = new OutputThue([], '', thueArea);

var running = false;
var done = false;
var haltsAborter = null;

samplesSelector.addEventListener('change', wrapWithTryCatch(e => init(samplesSelector.value)));
loadButton.addEventListener('click', wrapWithTryCatch(e => init()));
runButton.addEventListener('click', wrapWithTryCatch(e => toggleStartStop()));
stepButton.addEventListener('click', wrapWithTryCatch(e => stepButtonClicked()));
haltsButton.addEventListener('click', wrapWithTryCatch(e => determineHalts()));

init('samples/hello.t').then(() => status('Ready.'));

function status(text, cls='') { statusBar.setAttribute('class', cls); statusBar.textContent = text; }

function buttonsEnable(load = true, run = true, step = true, halts = true) {
    load  ?  loadButton.removeAttribute('disabled') :  loadButton.setAttribute('disabled', true);
    run   ?   runButton.removeAttribute('disabled') :   runButton.setAttribute('disabled', true);
    step  ?  stepButton.removeAttribute('disabled') :  stepButton.setAttribute('disabled', true);
    halts ? haltsButton.removeAttribute('disabled') : haltsButton.setAttribute('disabled', true);
}

async function init(filename=false) {
    if (running) stop();
    buttonsEnable(false, false, false, false)
    var text;
    if (filename) {
        status('Downloading example...');
        var resp = await fetch(filename);
        if (resp.status >= 300){
            status(`Fetch error: ${resp.status} ${resp.statusText}`, 'error');
            return;
        }
        text = await resp.text();
        codeBox.value = text;
    } else
        text = codeBox.value;
    status('Parsing...');
    var [rules, state] = parse(text, [OutputRule, InputRule, RegExpRule, Rule]);
    thue.init(state);
    thue.rules = rules;
    status('Press RUN.');
    done = false;
    runButton.textContent = 'Run';
    buttonsEnable();
}

function step() {
    done = thue.tick();
    if (done) {
        stop();
        status('Program halted.', 'done');
        buttonsEnable(true, true, false, true);
        runButton.textContent = 'Restart';
        return;
    }
    if (running) requestAnimationFrame(step);
}

function stop() {
    running = false;
    runButton.textContent = 'Resume';
    if (done)
        status('Program halted.', 'done')
    else
        status('Paused.');
}

function start() {
    if (done) init();
    running = true;
    runButton.textContent = 'Pause';
    status('Running...');
    step();
}

function stepButtonClicked() { stop(); step(); }

function toggleStartStop() {
    if (running) 
        stop();
    else 
        start();
}

var depthCounter = 0;

function determineHalts() {
    if (haltsAborter) haltsAborter.abort();
    else {
        haltsAborter = new AbortController();
        setTimeout(wrapWithTryCatch(async () => { // setTimeout to prevent prowser from baulking with a long-running event handler.
            buttonsEnable(false, false, false, true);
            haltsButton.textContent = 'Abort';
            var chance;
            try {
                chance = await chanceOfHalting(thue, d => {
                    if (++depthCounter === 1000) {
                        depthCounter = 0;
                        return new Promise(r => {
                            requestAnimationFrame(() => {
                                status(`Computing... ${d}`, 'computing');
                                r();
                            });
                        });
                    }
                }, haltsAborter.signal);
            } catch (e) {
                status('Error: ' + e, 'error');
                haltsAborter = null;
                haltsButton.textContent = 'Does it halt?';
                buttonsEnable();
                return;
            }
            if (chance === 1.0)
                status('Program will definitely halt.', 'done');
            else if (chance === 0.0)
                status('Program will never halt.', 'done');
            else
                status(`Program has a ${Math.floor(100 * chance)}% chance of halting.`, 'done');
            buttonsEnable();
            haltsButton.textContent = 'Does it halt?';
            haltsAborter = null;
        }), 0);
    }
}

function erro(e) {
    stop();
    buttonsEnable(true, false, false, false);
    status('Error: ' + e, 'error');
}

function wrapWithTryCatch(fun) {
    return function(...args) {
        try {
            var ret = fun(...args);
            if (ret instanceof Promise) {
                ret.catch(erro);
            }
        } catch(e) {
            erro(e);
        }
    }
}
