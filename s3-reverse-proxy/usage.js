// import { ClickHouse } from '@clickhouse/client';
// import { Reader } from '@maxmind/geoip2-node';
// import * as geolite2Redist from 'geolite2-redist';
// import { UAParser } from 'ua-parser-js';
// import crypto from 'crypto';

// Initialize Clickhouse client
// const clickhouse = new ClickHouse({
//     host: 'http://localhost:8123',
//     username: 'default',
//     password: '',
//     database: 'analytics'
// });

// Initialize GeoIP lookup
// let geolite = null;

// async function initializeGeoIP() {
//     try {
//         const dbPath = await geolite2Redist.downloadDbs();
//         geolite = await Reader.open(dbPath.city);
//         console.log('GeoIP database initialized successfully');
//     } catch (error) {
//         console.error('Error initializing GeoIP:', error);
//         geolite = null;
//     }
// }


// Initialize database tables
// async function initializeTables() {
//   try {
//     await clickhouse.query(`
//       CREATE TABLE IF NOT EXISTS visits (
//         timestamp DateTime,
//         request_id String,
//         session_id String,
//         user_id String,
//         url String,
//         path String,
//         hostname String,
//         project_id String,
//         ip String,
//         country String,
//         city String,
//         device_type String,
//         browser String,
//         browser_version String,
//         os String,
//         referer String,
//         bandwidth UInt64,
//         status_code UInt16
//       ) ENGINE = MergeTree()
//       ORDER BY (timestamp, request_id)
//     `);

//     await clickhouse.query(`
//       CREATE TABLE IF NOT EXISTS bandwidth_usage (
//         timestamp DateTime,
//         project_id String,
//         bytes_transferred UInt64
//       ) ENGINE = SummingMergeTree()
//       ORDER BY (timestamp, project_id)
//     `);

//     console.log('Database tables initialized successfully');
//   } catch (error) {
//     console.error('Error initializing tables:', error);
//     throw error;
//   }
// }
// Generate a unique session ID
// function generateSessionId(req) {
//     const data = getIpAddress(req) + req.headers['user-agent'];
//     return crypto.createHash('md5').update(data).digest('hex');
// }

// Helper function to get IP address
// function getIpAddress(req) {
//     let ip = req.socket.remoteAddress || req.connection.remoteAddress;

//     // Localhost IPv6 loopback address ko IPv4 me convert karo
//     if (ip === '::1' || ip === '::ffff:127.0.0.1') {
//         ip = '127.0.0.1';
//     }


//     return ip;
// // Check for proxy forwarded IP
// const forwarded = req.headers['x-forwarded-for'];
// if (forwarded) {
//     // Get the first IP if multiple are present
//     return forwarded.split(',')[0].trim();
// }

// // Check various properties where IP might be stored
// const ip = req.headers['x-real-ip'] ||
//     req.connection?.remoteAddress ||
//     req.socket?.remoteAddress ||
//     req.connection?.socket?.remoteAddress;

// // Remove IPv6 prefix if present
// return ip ? ip.replace(/^::ffff:/, '') : 'unknown';
// }

// Main analytics collection function
async function collectUsage(req, res, responseSize, projectId) {
    try {
        // await initializeGeoIP();
        const timestamp = new Date();
        // const requestId = crypto.randomBytes(16).toString('hex');
        // const sessionId = generateSessionId(req);
        // const userAgent = new UAParser(req.headers['user-agent']);

        // Parse user agent information
        // const browserInfo = userAgent.getBrowser();
        // const osInfo = userAgent.getOS();
        // const deviceInfo = userAgent.getDevice();

        // Get IP address
        // const ip = getIpAddress(req);
        // let geoData = null;

        // try {
        // if (geolite && ip && ip !== 'unknown') {
        // geoData = await geolite.city(ip);
        // }
        // } catch (error) {
        // console.error('GeoIP lookup failed:', error);
        // }

        // Calculate bandwidth (response size)
        // const bandwidth = parseInt(res.getHeader('content-length')) || 0;

        // Prepare analytics data
        const usageData = {
            timestamp,
            // request_id: requestId,
            // session_id: sessionId,
            // user_id: req.headers['x-user-id'] || sessionId,
            // url: req.url,
            path: req.path || req.url,
            // hostname: req.hostname,
            project_id: projectId,
            // project_id: req.hostname.split('.')[0],
            // ip: ip,
            // country: geoData ? geoData.country?.names?.en : 'Unknown',
            // city: geoData ? geoData.city?.names?.en : 'Unknown',
            // device_type: deviceInfo.type || 'desktop',
            // browser: browserInfo.name || 'Unknown',
            // browser_version: browserInfo.version || 'Unknown',
            // os: `${osInfo.name || 'Unknown'} ${osInfo.version || ''}`.trim(),
            referer: req.headers.referer || '',
            bandwidth: responseSize,
            status_code: res.statusCode
        };

        console.log('usageData: ', usageData);

        // Insert visit data
        // await clickhouse.insert({
        //   table: 'visits',
        //   values: [analyticsData]
        // });

        // Update bandwidth usage
        // await clickhouse.insert({
        //   table: 'bandwidth_usage',
        //   values: [{
        //     timestamp,
        //     project_id: analyticsData.project_id,
        //     bytes_transferred: bandwidth
        //   }]
        // });

    } catch (error) {
        console.error('Analytics Error:', error);
    }
}

// Initialize everything
// async function initialize() {
//   await initializeGeoIP();
//   await initializeTables();
// }

// // Helper function to get analytics data
// async function getAnalytics(options = {}) {
//   const {
//     startDate = new Date(Date.now() - 24 * 60 * 60 * 1000),
//     endDate = new Date(),
//     projectId = null
//   } = options;

//   const queries = {
//     visitors: `
//       SELECT COUNT(*) as total_visits,
//              COUNT(DISTINCT user_id) as unique_visitors
//       FROM visits
//       WHERE timestamp BETWEEN {start: DateTime} AND {end: DateTime}
//       ${projectId ? 'AND project_id = {project: String}' : ''}
//     `,

//     countryStats: `
//       SELECT country,
//              COUNT(*) as visits,
//              COUNT(DISTINCT user_id) as unique_visitors
//       FROM visits
//       WHERE timestamp BETWEEN {start: DateTime} AND {end: DateTime}
//       ${projectId ? 'AND project_id = {project: String}' : ''}
//       GROUP BY country
//       ORDER BY visits DESC
//     `,

//     browserStats: `
//       SELECT browser,
//              browser_version,
//              COUNT(*) as visits
//       FROM visits
//       WHERE timestamp BETWEEN {start: DateTime} AND {end: DateTime}
//       ${projectId ? 'AND project_id = {project: String}' : ''}
//       GROUP BY browser, browser_version
//       ORDER BY visits DESC
//     `,

//     bandwidthStats: `
//       SELECT project_id,
//              SUM(bytes_transferred) as total_bandwidth
//       FROM bandwidth_usage
//       WHERE timestamp BETWEEN {start: DateTime} AND {end: DateTime}
//       ${projectId ? 'AND project_id = {project: String}' : ''}
//       GROUP BY project_id
//     `
//   };

//   const params = {
//     start: startDate,
//     end: endDate,
//     project: projectId
//   };

//   const results = {};
//   for (const [key, query] of Object.entries(queries)) {
//     results[key] = await clickhouse.query({
//       query,
//       params
//     });
//   }

//   return results;
// }

export { collectUsage };
//   initialize,
//   getAnalytics
// };