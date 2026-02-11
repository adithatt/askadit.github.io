/**
 * AskAdit Admin API
 * Single interface for all CRUD operations. All mutations are persisted to the DB
 * (IndexedDB + optional Gist sync). Load db.js and content.js before this script.
 */
(function () {
    'use strict';

    async function ensureDb() {
        if (typeof window.initDb === 'function') {
            await window.initDb();
        }
    }

    /**
     * List topics for a section (countries, outdoors, guides) or quotes (section === 'quotes').
     * @param {string} section - 'countries' | 'outdoors' | 'guides' | 'quotes'
     * @returns {Promise<Array>} List of topics or quotes
     */
    async function getTopics(section) {
        await ensureDb();
        if (typeof window.getTopics !== 'function') {
            throw new Error('API: getTopics not available. Load content.js and db.js first.');
        }
        return window.getTopics(section);
    }

    /**
     * Get a single topic or quote by section and id.
     * @param {string} section
     * @param {string} topicId
     * @returns {Promise<Object|null>}
     */
    async function getTopic(section, topicId) {
        await ensureDb();
        if (typeof window.getTopic !== 'function') {
            throw new Error('API: getTopic not available. Load content.js and db.js first.');
        }
        return window.getTopic(section, topicId);
    }

    /**
     * Create a topic or quote. Persists to DB (and triggers sync if configured).
     * @param {string} section
     * @param {Object} data - Topic: { id?, title, image?, photo?, preview?, content? }. Quote: { id?, quote|quote_text, attribution|author, reflection? }
     * @returns {Promise<void>}
     */
    async function createTopic(section, data) {
        await ensureDb();
        if (typeof window.addTopic !== 'function') {
            throw new Error('API: addTopic not available. Load content.js and db.js first.');
        }
        const id = data.id || (typeof window.generateId === 'function' ? window.generateId() : Date.now().toString(36));
        const payload = { ...data, id };
        await window.addTopic(section, payload);
    }

    /**
     * Update a topic or quote. Persists to DB (and triggers sync if configured).
     * @param {string} section
     * @param {string} topicId
     * @param {Object} data - Same shape as create (id is ignored)
     * @returns {Promise<void>}
     */
    async function updateTopic(section, topicId, data) {
        await ensureDb();
        if (typeof window.updateTopic !== 'function') {
            throw new Error('API: updateTopic not available. Load content.js and db.js first.');
        }
        await window.updateTopic(section, topicId, data);
    }

    /**
     * Delete a topic or quote. Persists to DB (and triggers sync if configured).
     * @param {string} section
     * @param {string} topicId
     * @returns {Promise<void>}
     */
    async function deleteTopic(section, topicId) {
        await ensureDb();
        if (typeof window.deleteTopic !== 'function') {
            throw new Error('API: deleteTopic not available. Load content.js and db.js first.');
        }
        await window.deleteTopic(section, topicId);
    }

    function generateId() {
        return typeof window.generateId === 'function' ? window.generateId() : Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
    }

    window.AskAditAPI = {
        getTopics,
        getTopic,
        createTopic,
        updateTopic,
        deleteTopic,
        generateId
    };
})();
