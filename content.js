// Content management functions
const CONTENT_KEY = 'askadit_content';

// Initialize default content structure
function initContent() {
    if (!localStorage.getItem(CONTENT_KEY)) {
        const defaultContent = {
            countries: [
                {
                    id: 'japan',
                    title: 'Japan',
                    image: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=800&h=600&fit=crop',
                    preview: 'Where ancient temples meet neon-lit streets, and every meal feels like a ceremony. The attention to detail in everything—from train schedules to tea ceremonies—taught me that excellence is in the small things.',
                    content: 'Where ancient temples meet neon-lit streets, and every meal feels like a ceremony. The attention to detail in everything—from train schedules to tea ceremonies—taught me that excellence is in the small things.'
                },
                {
                    id: 'iceland',
                    title: 'Iceland',
                    image: 'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?w=800&h=600&fit=crop',
                    preview: 'A land of fire and ice where nature reminds you how small you are. The midnight sun in summer and the northern lights in winter—both experiences that reset your sense of time and place.',
                    content: 'A land of fire and ice where nature reminds you how small you are. The midnight sun in summer and the northern lights in winter—both experiences that reset your sense of time and place.'
                }
            ],
            outdoors: [
                {
                    id: 'getting-lost',
                    title: 'The Art of Getting Lost',
                    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
                    preview: 'Sometimes the best trails are the ones you never planned to take. Getting lost isn\'t a failure—it\'s an opportunity to discover something you didn\'t know you were looking for.',
                    content: 'Sometimes the best trails are the ones you never planned to take. Getting lost isn\'t a failure—it\'s an opportunity to discover something you didn\'t know you were looking for.'
                },
                {
                    id: 'rain-hiking',
                    title: 'Why Rain Makes Everything Better',
                    image: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&h=600&fit=crop',
                    preview: 'There\'s something about hiking in the rain that clears your head. The sound, the smell, the way everything looks more alive. Plus, you get the trails all to yourself.',
                    content: 'There\'s something about hiking in the rain that clears your head. The sound, the smell, the way everything looks more alive. Plus, you get the trails all to yourself.'
                }
            ],
            quotes: [
                {
                    id: 'lao-tzu',
                    title: 'Lao Tzu',
                    quote: 'The journey of a thousand miles begins with a single step.',
                    attribution: 'Lao Tzu',
                    reflection: 'A reminder that every big adventure starts with a single step. I think about this whenever I\'m procrastinating on something that feels too big to tackle. Just start.'
                },
                {
                    id: 'tolkien',
                    title: 'J.R.R. Tolkien',
                    quote: 'Not all those who wander are lost.',
                    attribution: 'J.R.R. Tolkien',
                    reflection: 'This one hits different when you\'re actually lost on a trail. But more seriously, it\'s a beautiful reminder that exploration and curiosity are valid life paths, not just detours.'
                },
                {
                    id: 'proust',
                    title: 'Marcel Proust',
                    quote: 'The real voyage of discovery consists not in seeking new landscapes, but in having new eyes.',
                    attribution: 'Marcel Proust',
                    reflection: 'Travel isn\'t just about going places—it\'s about learning to see differently. The same principle applies to revisiting familiar places or ideas with fresh perspective.'
                }
            ],
            guides: [
                {
                    id: 'packing',
                    title: 'How to Pack Like You Actually Know What You\'re Doing',
                    image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=600&fit=crop',
                    preview: 'Lessons learned from one too many overstuffed suitcases. The golden rule: if you think you might need it, you probably don\'t. But always pack an extra pair of socks.',
                    content: 'Lessons learned from one too many overstuffed suitcases. The golden rule: if you think you might need it, you probably don\'t. But always pack an extra pair of socks.'
                },
                {
                    id: 'multi-day-hike',
                    title: 'Your First Multi-Day Hike: A Friendly Reality Check',
                    image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&h=600&fit=crop',
                    preview: 'Everything I wish someone had told me before my first backpacking trip. Spoiler: it\'s going to hurt, but it\'s also going to be amazing. Here\'s how to prepare.',
                    content: 'Everything I wish someone had told me before my first backpacking trip. Spoiler: it\'s going to hurt, but it\'s also going to be amazing. Here\'s how to prepare.'
                }
            ]
        };
        saveContent(defaultContent);
    }
}

function getContent() {
    initContent();
    return JSON.parse(localStorage.getItem(CONTENT_KEY));
}

function saveContent(content) {
    localStorage.setItem(CONTENT_KEY, JSON.stringify(content));
}

function getTopics(section) {
    const content = getContent();
    return content[section] || [];
}

function getTopic(section, topicId) {
    const topics = getTopics(section);
    return topics.find(t => t.id === topicId);
}

function addTopic(section, topic) {
    const content = getContent();
    if (!content[section]) {
        content[section] = [];
    }
    content[section].push(topic);
    saveContent(content);
}

function updateTopic(section, topicId, updatedTopic) {
    const content = getContent();
    const index = content[section].findIndex(t => t.id === topicId);
    if (index !== -1) {
        content[section][index] = { ...content[section][index], ...updatedTopic };
        saveContent(content);
        return true;
    }
    return false;
}

function deleteTopic(section, topicId) {
    const content = getContent();
    content[section] = content[section].filter(t => t.id !== topicId);
    saveContent(content);
}

function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}
