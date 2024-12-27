const express = require('express')
const httpProxy = require('http-proxy')

const app = express()
const PORT = 8000
const BASE_PATH = 'https://vercel-clone.mos.ap-southeast-3.sufybkt.com/__outputs'

const proxy = httpProxy.createProxy()

proxy.on('error', (err, req, res) => {
    console.error('Proxy Error:', err);
    res.status(500).send('Proxy Error');
});

app.use((req, res) => {
    const hostname = req.hostname;
    const subdomain = hostname.split('.')[0];
    const pid = subdomain;
    const url = req.url;

    // Check if request is for a static file
    const isStaticFile = /\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot|json)$/i.test(url);

    if (!isStaticFile) {
        // For non-static routes, always serve index.html
        const indexPath = `${BASE_PATH}/${pid}/index.html`;
        return proxy.web(req, res, {
            target: indexPath,
            changeOrigin: true,
            ignorePath: true
        });
    }

    // For static files, preserve the path
    const resolvesTo = `${BASE_PATH}/${pid}${url}`;
    return proxy.web(req, res, {
        target: resolvesTo,
        changeOrigin: true,
        ignorePath: true
    });
});

app.listen(PORT, () => console.log(`Reverse Proxy Running on port ${PORT}`));