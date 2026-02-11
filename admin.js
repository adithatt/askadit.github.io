// Admin interface functions
let currentSection = 'countries';
let editingTopicId = null;

async function initAdmin() {
    if (!requireAuth()) return;
    updateNavLinks();
    await loadSection('countries');
}

function updateNavLinks() {
    const navLinks = document.querySelectorAll('.section-nav a');
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.dataset.section === currentSection) {
            link.classList.add('active');
        }
    });
}

async function loadSection(section) {
    currentSection = section;
    updateNavLinks();
    hideTopicForm();

    const topicsList = document.getElementById('topicsList');
    topicsList.innerHTML = '<p style="text-align: center; color: var(--text-forest-light);">Loading…</p>';

    let topics;
    try {
        topics = await getTopics(section);
    } catch (err) {
        topicsList.innerHTML = '<p style="text-align: center; color: #d32f2f;">Failed to load. Check console.</p>';
        console.error(err);
        return;
    }

    topicsList.innerHTML = '';

    if (topics.length === 0) {
        topicsList.innerHTML = '<p style="text-align: center; color: var(--text-forest-light);">No topics yet. Click "Add Topic" to create one.</p>';
        return;
    }

    topics.forEach(topic => {
        const topicItem = document.createElement('div');
        topicItem.className = 'topic-item';
        
        if (section === 'quotes') {
            topicItem.innerHTML = `
                <div class="topic-info">
                    <h3>${topic.quote || topic.title}</h3>
                    <p class="topic-meta">— ${topic.attribution}</p>
                </div>
                <div class="topic-actions">
                    <button onclick="editTopic('${section}', '${topic.id}')" class="btn-small">Edit</button>
                    <button onclick="deleteTopicConfirm('${section}', '${topic.id}')" class="btn-small btn-danger">Delete</button>
                </div>
            `;
        } else {
            topicItem.innerHTML = `
                <div class="topic-info">
                    <h3>${topic.title}</h3>
                    <p class="topic-preview">${topic.preview || ''}</p>
                </div>
                <div class="topic-actions">
                    <button onclick="editTopic('${section}', '${topic.id}')" class="btn-small">Edit</button>
                    <button onclick="deleteTopicConfirm('${section}', '${topic.id}')" class="btn-small btn-danger">Delete</button>
                </div>
            `;
        }
        
        topicsList.appendChild(topicItem);
    });
}

function showTopicForm() {
    document.getElementById('topicForm').style.display = 'block';
    document.getElementById('topicsList').style.display = 'none';
    document.getElementById('addTopicBtn').style.display = 'none';
    editingTopicId = null;
    document.getElementById('topicFormTitle').textContent = 'Add Topic';
    
    // Reset form
    const form = document.getElementById('topicForm');
    form.reset();
    
    // Clear any previous values
    document.getElementById('title').value = '';
    document.getElementById('image').value = '';
    document.getElementById('preview').value = '';
    document.getElementById('content').value = '';
    document.getElementById('quote').value = '';
    document.getElementById('attribution').value = '';
    document.getElementById('reflection').value = '';
    
    // Show/hide fields based on section
    const isQuotes = currentSection === 'quotes';
    document.getElementById('titleGroup').style.display = isQuotes ? 'none' : 'block';
    document.getElementById('imageGroup').style.display = isQuotes ? 'none' : 'block';
    document.getElementById('previewGroup').style.display = isQuotes ? 'none' : 'block';
    document.getElementById('contentGroup').style.display = isQuotes ? 'none' : 'block';
    document.getElementById('quoteGroup').style.display = isQuotes ? 'block' : 'none';
    document.getElementById('attributionGroup').style.display = isQuotes ? 'block' : 'none';
    document.getElementById('reflectionGroup').style.display = isQuotes ? 'block' : 'none';
    
    // Update required attributes based on section
    document.getElementById('title').required = !isQuotes;
    document.getElementById('quote').required = isQuotes;
    document.getElementById('attribution').required = isQuotes;
}

function hideTopicForm() {
    document.getElementById('topicForm').style.display = 'none';
    document.getElementById('topicsList').style.display = 'block';
    document.getElementById('addTopicBtn').style.display = 'block';
    editingTopicId = null;
}

async function editTopic(section, topicId) {
    let topic;
    try {
        topic = await getTopic(section, topicId);
    } catch (err) {
        console.error(err);
        alert('Failed to load topic.');
        return;
    }
    if (!topic) return;

    editingTopicId = topicId;
    currentSection = section;
    document.getElementById('topicFormTitle').textContent = 'Edit Topic';
    
    if (section === 'quotes') {
        document.getElementById('quote').value = topic.quote || topic.quote_text || '';
        document.getElementById('attribution').value = topic.attribution || topic.author || '';
        document.getElementById('reflection').value = topic.reflection || '';
    } else {
        document.getElementById('title').value = topic.title || '';
        document.getElementById('image').value = topic.image || topic.photo || '';
        document.getElementById('preview').value = topic.preview || '';
        document.getElementById('content').value = topic.content || '';
    }
    
    showTopicForm();
}

async function saveTopic(e) {
    e.preventDefault();
    e.stopPropagation();
    
    if (currentSection === 'quotes') {
        const quote = document.getElementById('quote').value.trim();
        const attribution = document.getElementById('attribution').value.trim();
        
        if (!quote || !attribution) {
            alert('Please fill in both Quote and Attribution fields.');
            return false;
        }
        
        const topic = {
            id: editingTopicId || generateId(),
            title: attribution,
            quote: quote,
            attribution: attribution,
            reflection: document.getElementById('reflection').value.trim() || ''
        };
        
        try {
            if (editingTopicId) {
                await updateTopic(currentSection, editingTopicId, topic);
            } else {
                await addTopic(currentSection, topic);
            }
        } catch (err) {
            console.error(err);
            alert('Failed to save.');
            return false;
        }
    } else {
        const title = document.getElementById('title').value.trim();
        
        if (!title) {
            alert('Please fill in the Title field.');
            return false;
        }
        
        const topic = {
            id: editingTopicId || generateId(),
            title: title,
            image: document.getElementById('image').value.trim() || '',
            preview: document.getElementById('preview').value.trim() || '',
            content: document.getElementById('content').value.trim() || ''
        };
        
        try {
            if (editingTopicId) {
                await updateTopic(currentSection, editingTopicId, topic);
            } else {
                await addTopic(currentSection, topic);
            }
        } catch (err) {
            console.error(err);
            alert('Failed to save.');
            return false;
        }
    }
    
    hideTopicForm();
    await loadSection(currentSection);
    return false;
}

async function deleteTopicConfirm(section, topicId) {
    if (!confirm('Are you sure you want to delete this topic?')) return;
    try {
        await deleteTopic(section, topicId);
        await loadSection(section);
    } catch (err) {
        console.error(err);
        alert('Failed to delete.');
    }
}

function adminLogout() {
    if (confirm('Are you sure you want to logout?')) {
        logout();
        window.location.href = 'login.html';
    }
}

function updateSyncStatus() {
    var statusEl = document.getElementById('syncStatus');
    if (!statusEl) return;
    
    if (typeof hasGistConfig === 'function' && hasGistConfig()) {
        statusEl.innerHTML = '<span style="color: var(--text-forest-light);">✓ Sync enabled (Gist ID: ' + getGistId().substring(0, 8) + '...)</span>';
    } else {
        statusEl.innerHTML = '<span style="color: var(--text-forest-light);">Sync not configured. Click "Setup GitHub Sync" to enable.</span>';
    }
}

function setupGistSync() {
    var token = prompt('Enter your GitHub Personal Access Token:\n\nCreate one at: https://github.com/settings/tokens\n\nRequired scopes: gist');
    if (!token) return;
    
    token = token.trim();
    if (!token) {
        alert('Token cannot be empty.');
        return;
    }
    
    if (confirm('This will create a new Gist and sync your current database. Continue?')) {
        createGist(token).then(function (gistId) {
            alert('Sync enabled! Gist created: ' + gistId + '\n\nYour database will now sync automatically when you make changes.');
            updateSyncStatus();
        }).catch(function (err) {
            alert('Failed to setup sync: ' + err.message);
            console.error(err);
        });
    }
}

function manualSync() {
    if (typeof hasGistConfig === 'function' && hasGistConfig()) {
        syncFromGist().then(function () {
            alert('Synced from GitHub! Refreshing...');
            window.location.reload();
        }).catch(function (err) {
            alert('Sync failed: ' + err.message);
            console.error(err);
        });
    } else {
        alert('Sync not configured. Please set it up first.');
    }
}

function handleFileImport(event) {
    var file = event.target.files[0];
    if (!file) return;
    uploadDb(file);
    event.target.value = '';
}
