"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Load environment variables from .env.local (useful when running scripts outside Next.js)
const dotenv = require("dotenv");
dotenv.config();
const env_1 = require("../src/app/env");
const name_1 = require("../src/models/name");
async function run() {
    const endpoint = String(env_1.default.appwrite.endpoint || '');
    const projectId = String(env_1.default.appwrite.projectId || '');
    const apiKeyPresent = Boolean(env_1.default.appwrite.apikey);
    console.log('Endpoint:', endpoint ? '[loaded]' : 'MISSING');
    console.log('Project ID:', projectId ? '[loaded]' : 'MISSING');
    console.log('Has API key?', apiKeyPresent);
    if (!endpoint || !projectId) {
        console.error('Missing endpoint or projectId in env. Check your .env.local and restart the dev server.');
        process.exit(1);
    }
    // Build health URL. If endpoint already ends with /v1 use /health, otherwise append /v1/health
    const base = endpoint.replace(/\/+$/g, '');
    const healthUrl = base.endsWith('/v1') ? `${base}/health` : `${base}/v1/health`;
    console.log('Checking Appwrite health at', healthUrl);
    try {
        // Use global fetch (Node 18+) — falls back to require('node:https') if unavailable
        let res;
        if (typeof fetch === 'function') {
            res = await fetch(healthUrl);
            const text = await res.text();
            console.log('Status:', res.status);
            console.log('Response body:', text);
        }
        else {
            // Fallback for older Node: use https.get
            const https = await Promise.resolve().then(() => require('node:https'));
            await new Promise((resolve, reject) => {
                const req = https.get(healthUrl, (r) => {
                    let data = '';
                    r.on('data', (chunk) => (data += chunk));
                    r.on('end', () => {
                        console.log('Status:', r.statusCode);
                        console.log('Response body:', data);
                        resolve(true);
                    });
                });
                req.on('error', (err) => reject(err));
            });
        }
    }
    catch (err) {
        console.error('Failed to reach Appwrite health endpoint:', err);
        console.error('Common causes: wrong NEXT_PUBLIC_APPWRITE_HOST_URL, Appwrite server not running, network/CORS or proxy issues.');
        process.exit(1);
    }
    // Optional: attempt an authenticated call using node-appwrite if API key is present
    if (apiKeyPresent) {
        try {
            const { Client, Databases } = await Promise.resolve().then(() => require('node-appwrite'));
            const client = new Client()
                .setEndpoint(endpoint)
                .setProject(projectId)
                .setKey(String(env_1.default.appwrite.apikey));
            const databases = new Databases(client);
            // Try listing collections in the configured database (may require proper permission)
            if (name_1.db) {
                // Some SDK versions expose listCollections, others list. We'll try listCollections first.
                if (typeof databases.listCollections === 'function') {
                    const res = await databases.listCollections(name_1.db);
                    console.log('listCollections result:', JSON.stringify(res).slice(0, 1000));
                }
                else if (typeof databases.list === 'function') {
                    const res = await databases.list(name_1.db);
                    console.log('databases.list result:', JSON.stringify(res).slice(0, 1000));
                }
                else {
                    console.log('node-appwrite Databases API shape unknown for this SDK version. Authenticated connection appears to work if health check passed.');
                }
            }
        }
        catch (err) {
            console.error('Authenticated SDK call failed:', err);
            // Do not exit with non-zero here because health check already passed
        }
    }
}
run();
