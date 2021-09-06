const chokidar = require('chokidar');
const fs = require('fs');
require('isomorphic-fetch');
require('isomorphic-form-data');

let hostname = process.argv[3];
const path = process.argv[2];

let endpoint = '';
if (hostname.startsWith('http://')) {
    if (hostname.endsWith('/commit')) {
        endpoint = hostname;
    } else if (hostname.endsWith('/')) {
        endpoint = `${hostname}commit`
    } else if (hostname.endsWith(':8000')) {
        endpoint = `${hostname}/commit`
    } else {
        endpoint = `${hostname}:8000/commit`
    }
} else {
    endpoint = `http://${hostname}:8000/commit`
}

chokidar.watch(path, {ignored: 'node_modules/*'}).on('all', (event, relPath) => {
    if (!event.includes('Dir') && relPath === 'index.js') {
        const data = fs.readFileSync(`${path}${relPath}`, {encoding: 'utf-8'});
        const form = new FormData();
        form.append('op_type', event);
        form.append('data', data);
        
        fetch(endpoint, {method: 'POST', body: form});
    }
});
