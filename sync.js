/**
 * GitHub Gists sync for cross-device database synchronization.
 * Stores the database as a JSON file in a GitHub Gist.
 */
(function () {
const GIST_ID_KEY = 'askadit_gist_id';
const GIST_TOKEN_KEY = 'askadit_gist_token';
const GIST_FILENAME = 'askadit-db.json';

function getGistId() {
    return localStorage.getItem(GIST_ID_KEY);
}

function setGistId(id) {
    if (id) {
        localStorage.setItem(GIST_ID_KEY, id);
    } else {
        localStorage.removeItem(GIST_ID_KEY);
    }
}

function getGistToken() {
    return localStorage.getItem(GIST_TOKEN_KEY);
}

function setGistToken(token) {
    if (token) {
        localStorage.setItem(GIST_TOKEN_KEY, token);
    } else {
        localStorage.removeItem(GIST_TOKEN_KEY);
    }
}

function hasGistConfig() {
    return !!(getGistId() && getGistToken());
}

async function exportDbToJson() {
    if (!db) await initDb();
    var topics = [];
    var quotes = [];
    
    var stmt = db.prepare('SELECT id, section, title, photo, preview, content FROM topics');
    while (stmt.step()) {
        var row = stmt.getAsObject();
        topics.push({
            id: row.id,
            section: row.section,
            title: row.title,
            photo: row.photo || '',
            preview: row.preview || '',
            content: row.content || ''
        });
    }
    stmt.free();
    
    var qstmt = db.prepare('SELECT id, quote_text, author, reflection FROM quotes');
    while (qstmt.step()) {
        var row = qstmt.getAsObject();
        quotes.push({
            id: row.id,
            quote_text: row.quote_text,
            author: row.author,
            reflection: row.reflection || ''
        });
    }
    qstmt.free();
    
    return JSON.stringify({ topics: topics, quotes: quotes, version: Date.now() }, null, 2);
}

async function importDbFromJson(jsonStr) {
    if (!db) await initDb();
    var data = JSON.parse(jsonStr);
    
    db.run('DELETE FROM topics');
    db.run('DELETE FROM quotes');
    
    if (data.topics && data.topics.length) {
        var stmt = db.prepare('INSERT INTO topics (id, section, title, photo, preview, content) VALUES (?, ?, ?, ?, ?, ?)');
        data.topics.forEach(function (t) {
            stmt.run([t.id, t.section, t.title || '', t.photo || '', t.preview || '', t.content || '']);
        });
        stmt.free();
    }
    
    if (data.quotes && data.quotes.length) {
        var qstmt = db.prepare('INSERT INTO quotes (id, quote_text, author, reflection) VALUES (?, ?, ?, ?)');
        data.quotes.forEach(function (q) {
            qstmt.run([q.id, q.quote_text || '', q.author || '', q.reflection || '']);
        });
        qstmt.free();
    }
    
    await persistDb();
}

async function syncToGist() {
    if (!hasGistConfig()) {
        throw new Error('Gist not configured. Please set up sync in admin settings.');
    }
    
    var gistId = getGistId();
    var token = getGistToken();
    var content = await exportDbToJson();
    
    var response = await fetch('https://api.github.com/gists/' + gistId, {
        method: 'PATCH',
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json',
            'Accept': 'application/vnd.github.v3+json'
        },
        body: JSON.stringify({
            files: {
                [GIST_FILENAME]: {
                    content: content
                }
            }
        })
    });
    
    if (!response.ok) {
        var error = await response.text();
        throw new Error('Failed to sync: ' + (error || response.statusText));
    }
    
    return await response.json();
}

async function syncFromGist() {
    if (!hasGistConfig()) {
        throw new Error('Gist not configured.');
    }
    
    var gistId = getGistId();
    var token = getGistToken();
    
    var response = await fetch('https://api.github.com/gists/' + gistId, {
        headers: {
            'Authorization': 'Bearer ' + token,
            'Accept': 'application/vnd.github.v3+json'
        }
    });
    
    if (!response.ok) {
        throw new Error('Failed to fetch from Gist: ' + response.statusText);
    }
    
    var gist = await response.json();
    var file = gist.files[GIST_FILENAME];
    
    if (!file) {
        throw new Error('Database file not found in Gist.');
    }
    
    await importDbFromJson(file.content);
    return true;
}

async function createGist(token) {
    var content = await exportDbToJson();
    
    var response = await fetch('https://api.github.com/gists', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json',
            'Accept': 'application/vnd.github.v3+json'
        },
        body: JSON.stringify({
            description: 'AskAdit Database',
            public: false,
            files: {
                [GIST_FILENAME]: {
                    content: content
                }
            }
        })
    });
    
    if (!response.ok) {
        var error = await response.text();
        throw new Error('Failed to create Gist: ' + (error || response.statusText));
    }
    
    var gist = await response.json();
    setGistId(gist.id);
    setGistToken(token);
    return gist.id;
}

function downloadDb() {
    exportDbToJson().then(function (json) {
        var blob = new Blob([json], { type: 'application/json' });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = 'askadit-db-' + new Date().toISOString().split('T')[0] + '.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }).catch(function (err) {
        alert('Failed to export: ' + err.message);
        console.error(err);
    });
}

function uploadDb(file) {
    var reader = new FileReader();
    reader.onload = function (e) {
        importDbFromJson(e.target.result).then(function () {
            alert('Database imported successfully! Refresh the page to see changes.');
            window.location.reload();
        }).catch(function (err) {
            alert('Failed to import: ' + err.message);
            console.error(err);
        });
    };
    reader.readAsText(file);
}

window.getGistId = getGistId;
window.setGistId = setGistId;
window.getGistToken = getGistToken;
window.setGistToken = setGistToken;
window.hasGistConfig = hasGistConfig;
window.exportDbToJson = exportDbToJson;
window.importDbFromJson = importDbFromJson;
window.syncToGist = syncToGist;
window.syncFromGist = syncFromGist;
window.createGist = createGist;
window.downloadDb = downloadDb;
window.uploadDb = uploadDb;
})();
