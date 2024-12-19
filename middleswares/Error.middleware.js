function ErrorMiddleware(error, req, res, next) {
    const message = error?.message || "Something Went wrong!"
    const status = error?.status || 500
    res.status(status).json({ error: message, })
}

module.exports = ErrorMiddleware