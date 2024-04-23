const sanitizeHtml = require("sanitize-html")

class sanitizeHtmlService{
    getCleanHtml(dirtyHtml){
        return sanitizeHtml(dirtyHtml)
    }
}


module.exports = new sanitizeHtmlService()