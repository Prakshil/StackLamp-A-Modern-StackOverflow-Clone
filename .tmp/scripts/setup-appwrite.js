"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = require("dotenv");
dotenv.config();
const env_1 = require("../src/app/env");
const name_1 = require("../src/models/name");
async function run() {
    const endpoint = String(env_1.default.appwrite.endpoint || '');
    const projectId = String(env_1.default.appwrite.projectId || '');
    const apiKey = String(env_1.default.appwrite.apikey || '');
    if (!endpoint || endpoint === 'undefined' || !projectId || projectId === 'undefined' || !apiKey) {
        console.error('Missing Appwrite env variables. Ensure NEXT_PUBLIC_APPWRITE_HOST_URL, NEXT_PUBLIC_APPWRITE_PROJECT_ID and APPWRITE_API_KEY are set in .env.local');
        process.exit(1);
    }
    const { Client, Databases } = await Promise.resolve().then(() => require('node-appwrite'));
    const client = new Client().setEndpoint(endpoint).setProject(projectId).setKey(apiKey);
    const databases = new Databases(client);
    // Attempt to create the database if it doesn't exist. Different SDK versions expose different method names; try a few.
    let createdDb = false;
    try {
        if (typeof databases.createDatabase === 'function') {
            await databases.createDatabase(name_1.db, 'StackOverflow DB');
            createdDb = true;
            console.log('Database created using createDatabase');
        }
        else if (typeof databases.create === 'function') {
            await databases.create(name_1.db, 'StackOverflow DB');
            createdDb = true;
            console.log('Database created using create');
        }
        else {
            console.log('Databases API does not expose createDatabase/create; skipping automatic DB creation.');
        }
    }
    catch (err) {
        // If it already exists, ignore the error
        const msg = err?.response || err?.message || String(err);
        if (typeof msg === 'string' && msg.toLowerCase().includes('already')) {
            console.log('Database already exists.');
        }
        else if (err?.code === 409) {
            console.log('Database already exists (409).');
        }
        else {
            console.warn('Could not create database automatically:', msg);
            // Continue — collection creation will fail with database_not_found if DB truly missing
        }
    }
    // Create collections and attributes directly here to avoid path-alias import issues
    try {
        const { Permission } = await Promise.resolve().then(() => require('node-appwrite'));
        // Questions
        try {
            await databases.createCollection(name_1.db, name_1.QUESTION_COLLECTION, name_1.QUESTION_COLLECTION, [
                Permission.read('any'),
                Permission.read('users'),
                Permission.create('users'),
                Permission.update('users'),
                Permission.delete('users'),
            ]);
            console.log('Question collection created');
        }
        catch (err) {
            console.warn('Question collection create error (may already exist):', err?.message || err);
        }
        // Answer collection
        try {
            await databases.createCollection(name_1.db, name_1.ANSWERS_COLLECTION, name_1.ANSWERS_COLLECTION, [
                Permission.create('users'),
                Permission.read('any'),
                Permission.read('users'),
                Permission.update('users'),
                Permission.delete('users'),
            ]);
            console.log('Answer collection created');
        }
        catch (err) {
            console.warn('Answer collection create error (may already exist):', err?.message || err);
        }
        // Comment collection
        try {
            await databases.createCollection(name_1.db, name_1.COMMENTS_COLLECTION, name_1.COMMENTS_COLLECTION, [
                Permission.create('users'),
                Permission.read('any'),
                Permission.read('users'),
                Permission.update('users'),
                Permission.delete('users'),
            ]);
            console.log('Comment collection created');
        }
        catch (err) {
            console.warn('Comment collection create error (may already exist):', err?.message || err);
        }
        // Vote collection
        try {
            await databases.createCollection(name_1.db, name_1.VOTE_COLLECTION, name_1.VOTE_COLLECTION, [
                Permission.create('users'),
                Permission.read('any'),
                Permission.read('users'),
                Permission.update('users'),
                Permission.delete('users'),
            ]);
            console.log('Vote collection created');
        }
        catch (err) {
            console.warn('Vote collection create error (may already exist):', err?.message || err);
        }
        // Create attributes (example: title/content for questions)
        try {
            await Promise.all([
                databases.createStringAttribute(name_1.db, name_1.QUESTION_COLLECTION, 'title', 100, true),
                databases.createStringAttribute(name_1.db, name_1.QUESTION_COLLECTION, 'content', 10000, true),
                databases.createStringAttribute(name_1.db, name_1.QUESTION_COLLECTION, 'authorId', 50, true),
                databases.createStringAttribute(name_1.db, name_1.ANSWERS_COLLECTION, 'content', 10000, true),
                databases.createStringAttribute(name_1.db, name_1.ANSWERS_COLLECTION, 'questionId', 50, true),
                databases.createStringAttribute(name_1.db, name_1.ANSWERS_COLLECTION, 'authorId', 50, true),
                databases.createStringAttribute(name_1.db, name_1.COMMENTS_COLLECTION, 'content', 10000, true),
                databases.createEnumAttribute(name_1.db, name_1.COMMENTS_COLLECTION, 'type', ['answer', 'question'], true),
                databases.createStringAttribute(name_1.db, name_1.COMMENTS_COLLECTION, 'typeId', 50, true),
                databases.createStringAttribute(name_1.db, name_1.COMMENTS_COLLECTION, 'authorId', 50, true),
                databases.createEnumAttribute(name_1.db, name_1.VOTE_COLLECTION, 'type', ['question', 'answer'], true),
                databases.createStringAttribute(name_1.db, name_1.VOTE_COLLECTION, 'typeId', 50, true),
                databases.createEnumAttribute(name_1.db, name_1.VOTE_COLLECTION, 'voteStatus', ['upvoted', 'downvoted'], true),
                databases.createStringAttribute(name_1.db, name_1.VOTE_COLLECTION, 'votedById', 50, true),
            ]);
            console.log('Attributes creation attempted (some may already exist).');
        }
        catch (err) {
            console.warn('Attribute creation errors (some attributes may already exist):', err?.message || err);
        }
        // Storage bucket
        try {
            const { Storage } = await Promise.resolve().then(() => require('node-appwrite'));
            const storage = new Storage(client);
            if (typeof storage.createBucket === 'function') {
                await storage.createBucket(name_1.QUESTION_ATTACHMENT_COLLECTION, 'Question Attachments');
                console.log('Storage bucket created');
            }
            else {
                console.log('Storage API does not expose createBucket on this SDK version');
            }
        }
        catch (err) {
            console.warn('Storage bucket create error (may already exist):', err?.message || err);
        }
        console.log('Collection and bucket creation attempted. Check logs above for details.');
    }
    catch (err) {
        console.error('Error during collection creation:', err);
    }
}
run();
