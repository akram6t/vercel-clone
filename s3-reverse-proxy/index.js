import express from 'express';
import httpProxy from 'http-proxy'
import { collectAnalytics } from './analytics.js';
import { collectUsage } from './usage.js';

const app = express()
const PORT = 8000

app.set('trust proxy', true);


// const BASE_PATH = 'http://localhost:4566/vercel-clone/__outputs';
const BASE_PATH = 'https://vercel-clone.mos.ap-southeast-3.sufybkt.com/__outputs'

const proxy = httpProxy.createProxy()

proxy.on('error', (err, req, res) => {
    console.error('Proxy Error:', err);
    res.status(500).send('Proxy Error');
});

// collect analytics
app.use((req, res, next) => {
    collectAnalytics(req, res, 'project_id');
    next();
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


proxy.on('proxyRes', (proxyRes, req, res) => {
    let responseSize = 0;
    proxyRes.on('data', (chunk) => {
        // console.log('chunk.length: ', chunk.length);

        responseSize += chunk.length;
    });
    // Log the response size when the response ends
    proxyRes.on('end', () => {
        console.log(`Response size for ${req.url}: ${responseSize} bytes`);

        // Optionally, you can store this data for analytics
        collectUsage(req, res, responseSize, "project_id");
    });
});

app.listen(PORT, () => console.log(`Reverse Proxy Running on port ${PORT}`));