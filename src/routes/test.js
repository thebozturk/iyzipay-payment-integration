export default (router) => {
/* A route that returns the IP address and user agent of the client. */
    router.get('/check', async (req, res) => {
        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        const userAgent = req.headers['user-agent'];
        res.json({
            ip: ip,
            userAgent: userAgent
        });
    })
}