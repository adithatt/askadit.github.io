/**
 * SQLite (SQL.js) database for AskAdit.
 * Topics: section, title, photo, preview, content
 * Quotes: quote text, author, reflection
 */
const DB_NAME = 'askadit_db';
const DB_STORE = 'sqlite';
let db = null;
let SQL = null;

var SQL_JS_CDN = 'https://cdn.jsdelivr.net/npm/sql.js@1.10.2/dist/';
var SQL_JS_TIMEOUT_MS = 15000;

function loadSqlJs() {
    var config = { locateFile: function (file) { return SQL_JS_CDN + file; } };
    var p;
    if (typeof window.initSqlJs === 'function') {
        p = window.initSqlJs(config);
    } else {
        p = new Promise(function (resolve, reject) {
            var script = document.createElement('script');
            script.src = SQL_JS_CDN + 'sql-wasm.js';
            script.onload = function () {
                if (typeof window.initSqlJs !== 'function') {
                    reject(new Error('SQL.js did not load'));
                    return;
                }
                window.initSqlJs(config).then(resolve).catch(reject);
            };
            script.onerror = function () { reject(new Error('SQL.js script failed to load')); };
            document.head.appendChild(script);
        });
    }
    return Promise.race([
        p,
        new Promise(function (_, reject) {
            setTimeout(function () { reject(new Error('SQL.js load timeout')); }, SQL_JS_TIMEOUT_MS);
        })
    ]);
}

function openIndexedDB() {
    return new Promise((resolve, reject) => {
        const req = indexedDB.open(DB_NAME, 1);
        req.onerror = () => reject(req.error);
        req.onsuccess = () => resolve(req.result);
        req.onupgradeneeded = (e) => {
            const idb = e.target.result;
            if (!idb.objectStoreNames.contains(DB_STORE)) {
                idb.createObjectStore(DB_STORE);
            }
        };
    });
}

function loadDbFromIndexedDB() {
    return new Promise((resolve, reject) => {
        openIndexedDB().then(idb => {
            const tx = idb.transaction(DB_STORE, 'readonly');
            const store = tx.objectStore(DB_STORE);
            const req = store.get('db');
            req.onsuccess = () => resolve(req.result);
            req.onerror = () => reject(req.error);
        }).catch(reject);
    });
}

function saveDbToIndexedDB(data) {
    return openIndexedDB().then(idb => {
        return new Promise((resolve, reject) => {
            const tx = idb.transaction(DB_STORE, 'readwrite');
            const store = tx.objectStore(DB_STORE);
            store.put(data, 'db');
            tx.oncomplete = () => resolve();
            tx.onerror = () => reject(tx.error);
        });
    });
}

function createSchema(database) {
    database.run(`
        CREATE TABLE IF NOT EXISTS topics (
            id TEXT PRIMARY KEY,
            section TEXT NOT NULL,
            title TEXT NOT NULL,
            photo TEXT,
            preview TEXT,
            content TEXT
        )
    `);
    database.run(`
        CREATE TABLE IF NOT EXISTS quotes (
            id TEXT PRIMARY KEY,
            quote_text TEXT NOT NULL,
            author TEXT NOT NULL,
            reflection TEXT
        )
    `);
}

function seedDefaultData(database) {
    const topicCount = database.exec("SELECT COUNT(*) as c FROM topics");
    if (topicCount.length && topicCount[0].values[0][0] > 0) return;

    const defaultTopics = [
        ['usa', 'countries', 'Japan', 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=800&h=600&fit=crop', 'Where ancient temples meet neon-lit streets, and every meal feels like a ceremony.', 'Where ancient temples meet neon-lit streets, and every meal feels like a ceremony. The attention to detail in everything—from train schedules to tea ceremonies—taught me that excellence is in the small things.'],
        ['iceland', 'countries', 'Iceland', 'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?w=800&h=600&fit=crop', 'A land of fire and ice where nature reminds you how small you are.', 'A land of fire and ice where nature reminds you how small you are. The midnight sun in summer and the northern lights in winter—both experiences that reset your sense of time and place.'],
        ['getting-lost', 'outdoors', 'The Art of Getting Lost', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop', 'Sometimes the best trails are the ones you never planned to take.', 'Sometimes the best trails are the ones you never planned to take. Getting lost isn\'t a failure—it\'s an opportunity to discover something you didn\'t know you were looking for.'],
        ['rain-hiking', 'outdoors', 'Why Rain Makes Everything Better', 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&h=600&fit=crop', 'There\'s something about hiking in the rain that clears your head.', 'There\'s something about hiking in the rain that clears your head. The sound, the smell, the way everything looks more alive. Plus, you get the trails all to yourself.'],
        ['packing', 'guides', 'How to Pack Like You Actually Know What You\'re Doing', 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=600&fit=crop', 'Lessons learned from one too many overstuffed suitcases.', 'Lessons learned from one too many overstuffed suitcases. The golden rule: if you think you might need it, you probably don\'t. But always pack an extra pair of socks.'],
        ['multi-day-hike', 'guides', 'Your First Multi-Day Hike: A Friendly Reality Check', 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&h=600&fit=crop', 'Everything I wish someone had told me before my first backpacking trip.', 'Everything I wish someone had told me before my first backpacking trip. Spoiler: it\'s going to hurt, but it\'s also going to be amazing. Here\'s how to prepare.']
    ];
    const stmt = database.prepare('INSERT INTO topics (id, section, title, photo, preview, content) VALUES (?, ?, ?, ?, ?, ?)');
    for (const row of defaultTopics) {
        stmt.run(row);
    }
    stmt.free();

    const defaultQuotes = [
        ['lao-tzu', 'The journey of a thousand miles begins with a single step.', 'Lao Tzu', 'A reminder that every big adventure starts with a single step. I think about this whenever I\'m procrastinating on something that feels too big to tackle. Just start.'],
        ['tolkien', 'Not all those who wander are lost.', 'J.R.R. Tolkien', 'This one hits different when you\'re actually lost on a trail. But more seriously, it\'s a beautiful reminder that exploration and curiosity are valid life paths, not just detours.'],
        ['proust', 'The real voyage of discovery consists not in seeking new landscapes, but in having new eyes.', 'Marcel Proust', 'Travel isn\'t just about going places—it\'s about learning to see differently. The same principle applies to revisiting familiar places or ideas with fresh perspective.']
    ];
    const qstmt = database.prepare('INSERT INTO quotes (id, quote_text, author, reflection) VALUES (?, ?, ?, ?)');
    for (const row of defaultQuotes) {
        qstmt.run(row);
    }
    qstmt.free();
}

async function initDb() {
    if (db) return db;
    SQL = await loadSqlJs();
    
    var tryGistFirst = typeof window.hasGistConfig === 'function' && window.hasGistConfig() && typeof window.syncFromGist === 'function';
    if (tryGistFirst) {
        try {
            await window.syncFromGist();
            var saved = await loadDbFromIndexedDB();
            if (saved && saved.length) {
                db = new SQL.Database(saved);
                return db;
            }
        } catch (err) {
            console.warn('Failed to sync from Gist, using local DB:', err);
        }
    }
    
    const saved = await loadDbFromIndexedDB();
    if (saved && saved.length) {
        db = new SQL.Database(saved);
    } else {
        db = new SQL.Database();
        createSchema(db);
        migrateFromLocalStorage(db);
        seedDefaultData(db);
        await persistDb();
    }
    return db;
}

function migrateFromLocalStorage(database) {
    try {
        var raw = localStorage.getItem('askadit_content');
        if (!raw) return;
        var data = JSON.parse(raw);
        var sections = ['countries', 'outdoors', 'guides'];
        sections.forEach(function (section) {
            var list = data[section];
            if (!list || !list.length) return;
            var stmt = database.prepare('INSERT OR IGNORE INTO topics (id, section, title, photo, preview, content) VALUES (?, ?, ?, ?, ?, ?)');
            list.forEach(function (t) {
                stmt.run([t.id, section, t.title || '', t.image || t.photo || '', t.preview || '', t.content || '']);
            });
            stmt.free();
        });
        if (data.quotes && data.quotes.length) {
            var qstmt = database.prepare('INSERT OR IGNORE INTO quotes (id, quote_text, author, reflection) VALUES (?, ?, ?, ?)');
            data.quotes.forEach(function (q) {
                qstmt.run([q.id, q.quote || '', q.attribution || q.author || '', q.reflection || '']);
            });
            qstmt.free();
        }
        localStorage.removeItem('askadit_content');
    } catch (e) {
        console.warn('Migration from localStorage skipped', e);
    }
}

function persistDb() {
    if (!db) return Promise.resolve();
    const data = db.export();
    var p = saveDbToIndexedDB(data);
    if (typeof window.syncToGist === 'function' && typeof window.hasGistConfig === 'function' && window.hasGistConfig()) {
        p = p.then(function () {
            return window.syncToGist().catch(function (err) {
                console.warn('Sync to Gist failed:', err);
            });
        });
    }
    return p;
}

// --- Topics (countries, outdoors, guides) ---
async function getTopics(section) {
    await initDb();
    const stmt = db.prepare('SELECT id, section, title, photo, preview, content FROM topics WHERE section = ?');
    stmt.bind([section]);
    const rows = [];
    while (stmt.step()) {
        const row = stmt.getAsObject();
        rows.push({
            id: row.id,
            title: row.title,
            image: row.photo || '',
            photo: row.photo || '',
            preview: row.preview || '',
            content: row.content || ''
        });
    }
    stmt.free();
    return rows;
}

async function getTopic(section, topicId) {
    await initDb();
    const stmt = db.prepare('SELECT id, section, title, photo, preview, content FROM topics WHERE section = ? AND id = ?');
    stmt.bind([section, topicId]);
    if (!stmt.step()) {
        stmt.free();
        return null;
    }
    const row = stmt.getAsObject();
    stmt.free();
    return {
        id: row.id,
        title: row.title,
        image: row.photo || '',
        photo: row.photo || '',
        preview: row.preview || '',
        content: row.content || ''
    };
}

async function addTopic(section, topic) {
    await initDb();
    db.run(
        'INSERT INTO topics (id, section, title, photo, preview, content) VALUES (?, ?, ?, ?, ?, ?)',
        [
            topic.id,
            section,
            topic.title,
            topic.image || topic.photo || '',
            topic.preview || '',
            topic.content || ''
        ]
    );
    await persistDb();
}

async function updateTopic(section, topicId, updatedTopic) {
    await initDb();
    db.run(
        'UPDATE topics SET title = ?, photo = ?, preview = ?, content = ? WHERE section = ? AND id = ?',
        [
            updatedTopic.title,
            updatedTopic.image || updatedTopic.photo || '',
            updatedTopic.preview || '',
            updatedTopic.content || '',
            section,
            topicId
        ]
    );
    await persistDb();
}

async function deleteTopic(section, topicId) {
    await initDb();
    db.run('DELETE FROM topics WHERE section = ? AND id = ?', [section, topicId]);
    await persistDb();
}

// --- Quotes ---
async function getQuotes() {
    await initDb();
    const stmt = db.prepare('SELECT id, quote_text, author, reflection FROM quotes');
    const rows = [];
    while (stmt.step()) {
        const row = stmt.getAsObject();
        rows.push({
            id: row.id,
            quote: row.quote_text,
            quote_text: row.quote_text,
            attribution: row.author,
            author: row.author,
            reflection: row.reflection || ''
        });
    }
    stmt.free();
    return rows;
}

async function getQuote(quoteId) {
    await initDb();
    const stmt = db.prepare('SELECT id, quote_text, author, reflection FROM quotes WHERE id = ?');
    stmt.bind([quoteId]);
    if (!stmt.step()) {
        stmt.free();
        return null;
    }
    const row = stmt.getAsObject();
    stmt.free();
    return {
        id: row.id,
        quote: row.quote_text,
        quote_text: row.quote_text,
        attribution: row.author,
        author: row.author,
        reflection: row.reflection || ''
    };
}

async function addQuote(quote) {
    await initDb();
    db.run(
        'INSERT INTO quotes (id, quote_text, author, reflection) VALUES (?, ?, ?, ?)',
        [
            quote.id,
            quote.quote || quote.quote_text,
            quote.attribution || quote.author,
            quote.reflection || ''
        ]
    );
    await persistDb();
}

async function updateQuote(quoteId, updatedQuote) {
    await initDb();
    db.run(
        'UPDATE quotes SET quote_text = ?, author = ?, reflection = ? WHERE id = ?',
        [
            updatedQuote.quote || updatedQuote.quote_text,
            updatedQuote.attribution || updatedQuote.author,
            updatedQuote.reflection || '',
            quoteId
        ]
    );
    await persistDb();
}

async function deleteQuote(quoteId) {
    await initDb();
    db.run('DELETE FROM quotes WHERE id = ?', [quoteId]);
    await persistDb();
}

function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}
