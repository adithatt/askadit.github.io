// Admin interface functions
let currentSection = 'countries';
let editingTopicId = null;

function initAdmin() {
    if (!requireAuth()) return;
    
    loadSection('countries');
    updateNavLinks();
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

function loadSection(section) {
    currentSection = section;
    updateNavLinks();
    
    // Hide form and show list when switching sections
    hideTopicForm();
    
    const topics = getTopics(section);
    const topicsList = document.getElementById('topicsList');
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

function editTopic(section, topicId) {
    const topic = getTopic(section, topicId);
    if (!topic) return;

    editingTopicId = topicId;
    currentSection = section;
    document.getElementById('topicFormTitle').textContent = 'Edit Topic';
    
    // Fill form fields
    if (section === 'quotes') {
        document.getElementById('quote').value = topic.quote || '';
        document.getElementById('attribution').value = topic.attribution || '';
        document.getElementById('reflection').value = topic.reflection || '';
    } else {
        document.getElementById('title').value = topic.title || '';
        document.getElementById('image').value = topic.image || '';
        document.getElementById('preview').value = topic.preview || '';
        document.getElementById('content').value = topic.content || '';
    }
    
    showTopicForm();
}

function saveTopic(e) {
    e.preventDefault();
    e.stopPropagation();
    
    // Validate required fields based on section
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
        
        if (editingTopicId) {
            updateTopic(currentSection, editingTopicId, topic);
        } else {
            addTopic(currentSection, topic);
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
        
        if (editingTopicId) {
            updateTopic(currentSection, editingTopicId, topic);
        } else {
            addTopic(currentSection, topic);
        }
    }
    
    hideTopicForm();
    loadSection(currentSection);
    return false;
}

function deleteTopicConfirm(section, topicId) {
    if (confirm('Are you sure you want to delete this topic?')) {
        deleteTopic(section, topicId);
        loadSection(section);
    }
}

function adminLogout() {
    if (confirm('Are you sure you want to logout?')) {
        logout();
        window.location.href = 'login.html';
    }
}
