/**
 * Content API: uses SQLite (db.js) for topics and quotes.
 * Load db.js before this script. All functions are async and return Promises.
 */
(function () {
    var initDb = window.initDb;
    var dbGetTopics = window.getTopics;
    var dbGetTopic = window.getTopic;
    var dbAddTopic = window.addTopic;
    var dbUpdateTopic = window.updateTopic;
    var dbDeleteTopic = window.deleteTopic;
    var dbGetQuotes = window.getQuotes;
    var dbGetQuote = window.getQuote;
    var dbAddQuote = window.addQuote;
    var dbUpdateQuote = window.updateQuote;
    var dbDeleteQuote = window.deleteQuote;
    var dbGenerateId = window.generateId;

    window.getTopics = function (section) {
        if (section === 'quotes') return dbGetQuotes();
        return dbGetTopics(section);
    };

    window.getTopic = function (section, topicId) {
        if (section === 'quotes') return dbGetQuote(topicId);
        return dbGetTopic(section, topicId);
    };

    window.addTopic = function (section, topic) {
        if (section === 'quotes') return dbAddQuote(topic);
        return dbAddTopic(section, topic);
    };

    window.updateTopic = function (section, topicId, updatedTopic) {
        if (section === 'quotes') return dbUpdateQuote(topicId, updatedTopic);
        return dbUpdateTopic(section, topicId, updatedTopic);
    };

    window.deleteTopic = function (section, topicId) {
        if (section === 'quotes') return dbDeleteQuote(topicId);
        return dbDeleteTopic(section, topicId);
    };

    window.getQuotes = dbGetQuotes;
    window.getQuote = dbGetQuote;
    window.addQuote = dbAddQuote;
    window.updateQuote = dbUpdateQuote;
    window.deleteQuote = dbDeleteQuote;
    window.generateId = dbGenerateId;
    window.initDb = initDb;
})();
