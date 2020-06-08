const moment = require('moment');
const args = process.argv.slice(2);
const inFile = args[0];

if (!inFile) {
    console.log('No input file specified')
    return;
}

const lineReader = require('readline').createInterface({
    input: require('fs').createReadStream(inFile)
});

lineReader.on('line', line => {
    try {
        const parsedLine = JSON.parse(line);
        if (parsedLine.log && parsedLine.time) {
            let logLine = parsedLine.log;
            if (!process.stdout.isTTY) {
                // Remove ANSI codes if stdout is redirected
                logLine = logLine.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '');
            }
            // Trim
            logLine = logLine.replace(/^\s+|\s+$/g, '')
            line = moment(parsedLine.time).utc().format('YYYY-MM-DD HH:mm:ss.SSS') + (typeof parsedLine.stream === 'string' && parsedLine.stream !== 'stdout' ? '\t' + parsedLine.stream + ':' : '') + '\t' + logLine
        } else {
            throw 'invalid line';
        }
    } catch (e) {
        if (typeof line === 'string' && line.indexOf('//') !== 0) {
            // Add unparsable lines as comments
            line = '// '+line;
        }
    }
    if (line) {
        line = line.replace(/^\s+|\s+$/g, '');
    }
    console.log(line);
});
