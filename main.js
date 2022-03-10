function $(sel) { return document.querySelector(sel); }

var samplesSelector = $('#samples');
var statusBar = $('#status');
var codeBox = $('#code');
var loadButton = $('#load');
var runButton = $('#run');
var stepButton = $('#step');
var thueArea = $('#thue');

var thue = new OutputThue([], '', thueArea);

var running = false;

samplesSelector.addEventListener('change', wrapWithTryCatch(e => init(samplesSelector.value)));
loadButton.addEventListener('click', wrapWithTryCatch(e => init()));
runButton.addEventListener('click', wrapWithTryCatch(e => toggleStartStop()));
stepButton.addEventListener('click', wrapWithTryCatch(e => stepButtonClicked()));

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
}

function step() {
    if (!running) return;
    running = !thue.tick();
    requestAnimationFrame(step);
}

function stop() { running = false; runButton.textContent = 'Run'; }
function start() { running = true; runButton.textContent = 'Pause'; step(); }

function stepButtonClicked() { stop(); step(); }

function toggleStartStop() {
    if (running) 
        stop();
    else 
        start();
}

function wrapWithTryCatch(fun) {
    return function(...args) {
        try {
            fun(...args);
        } catch(e) {
            status('Error: ' + e, 'error');
        }
    }
}
