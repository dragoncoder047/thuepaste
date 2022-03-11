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

samplesSelector.addEventListener('change', wrapWithTryCatch(e => init(samplesSelector.value)));
loadButton.addEventListener('click', wrapWithTryCatch(e => init()));
runButton.addEventListener('click', wrapWithTryCatch(e => toggleStartStop()));
stepButton.addEventListener('click', wrapWithTryCatch(e => stepButtonClicked()));
haltsButton.addEventListener('click', wrapWithTryCatch(e => determineHalts()));

init('samples/hello.t').then(() => status('Ready.'));

function status(text, cls='') { statusBar.setAttribute('class', cls); statusBar.textContent = text; }

async function init(filename=false) {
    if (running) stop();
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
    var [rules, init] = parse(text, [OutputRule, InputRule, Rule]);
    thue.init(init);
    thue.rules = rules;
    status('Press RUN.');
    done = false;
}

function step() {
    if (done) return;
    done = thue.tick();
    if (done) {
        stop();
        status('Program halted.', 'done');
        return;
    }
    if (running) requestAnimationFrame(step);
}

function stop() {
    running = false;
    runButton.textContent = 'Run';
    status(done ? 'Program halted. ' : 'Paused.');
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

function determineHalts() {
    requestAnimationFrame(() => status('Computing...', 'computing'));
    var chance = chanceOfHalting(thue);
    if (chance === 1.0)
        setTimeout(() => status('Program will definitely halt.', 'done'), 10);
    else if (chance === 0.0)
        setTimeout(() => status('Program will never halt.', 'done'), 10);
    else
        setTimeout(() => status(`Program has a ${Math.floor(100 * chance)}% chance of halting.`, 'done'), 10);
}

function erro(e) {
    stop();
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
