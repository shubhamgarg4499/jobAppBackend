class ErrorHandler extends Error {
    constructor(status = 500, message) {
        super(message)
        this.message = message
        this.status = status
    }
}

module.exports = ErrorHandler