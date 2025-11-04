import * as dotenv from 'dotenv';
dotenv.config();

import env from '../src/app/env';
import {
  db as DATABASE_ID,
  QUESTION_COLLECTION,
  ANSWERS_COLLECTION,
  COMMENTS_COLLECTION,
  VOTE_COLLECTION,
  QUESTION_ATTACHMENT_COLLECTION,
} from '../src/models/name';

async function run() {
  const endpoint = String(env.appwrite.endpoint || '');
  const projectId = String(env.appwrite.projectId || '');
  const apiKey = String(env.appwrite.apikey || '');

  if (!endpoint || endpoint === 'undefined' || !projectId || projectId === 'undefined' || !apiKey) {
    console.error('Missing Appwrite env variables. Ensure NEXT_PUBLIC_APPWRITE_HOST_URL, NEXT_PUBLIC_APPWRITE_PROJECT_ID and APPWRITE_API_KEY are set in .env.local');
    process.exit(1);
  }

  const { Client, Databases } = await import('node-appwrite');
  const client = new Client().setEndpoint(endpoint).setProject(projectId).setKey(apiKey);
  const databases = new Databases(client);

  // Attempt to create the database if it doesn't exist. Different SDK versions expose different method names; try a few.
  let createdDb = false;
  try {
    if (typeof (databases as any).createDatabase === 'function') {
      await (databases as any).createDatabase(DATABASE_ID, 'StackOverflow DB');
      createdDb = true;
      console.log('Database created using createDatabase');
    } else if (typeof (databases as any).create === 'function') {
      await (databases as any).create(DATABASE_ID, 'StackOverflow DB');
      createdDb = true;
      console.log('Database created using create');
    } else {
      console.log('Databases API does not expose createDatabase/create; skipping automatic DB creation.');
    }
  } catch (err: any) {
    // If it already exists, ignore the error
    const msg = err?.response || err?.message || String(err);
    if (typeof msg === 'string' && msg.toLowerCase().includes('already')) {
      console.log('Database already exists.');
    } else if (err?.code === 409) {
      console.log('Database already exists (409).');
    } else {
      console.warn('Could not create database automatically:', msg);
      // Continue — collection creation will fail with database_not_found if DB truly missing
    }
  }

  // Create collections and attributes directly here to avoid path-alias import issues
  try {
    const { Permission } = await import('node-appwrite');
    // Questions
    try {
      await (databases as any).createCollection(DATABASE_ID, QUESTION_COLLECTION, QUESTION_COLLECTION, [
        Permission.read('any'),
        Permission.read('users'),
        Permission.create('users'),
        Permission.update('users'),
        Permission.delete('users'),
      ]);
      console.log('Question collection created');
    } catch (err: any) {
      console.warn('Question collection create error (may already exist):', err?.message || err);
    }

    // Answer collection
    try {
      await (databases as any).createCollection(DATABASE_ID, ANSWERS_COLLECTION, ANSWERS_COLLECTION, [
        Permission.create('users'),
        Permission.read('any'),
        Permission.read('users'),
        Permission.update('users'),
        Permission.delete('users'),
      ]);
      console.log('Answer collection created');
    } catch (err: any) {
      console.warn('Answer collection create error (may already exist):', err?.message || err);
    }

    // Comment collection
    try {
      await (databases as any).createCollection(DATABASE_ID, COMMENTS_COLLECTION, COMMENTS_COLLECTION, [
        Permission.create('users'),
        Permission.read('any'),
        Permission.read('users'),
        Permission.update('users'),
        Permission.delete('users'),
      ]);
      console.log('Comment collection created');
    } catch (err: any) {
      console.warn('Comment collection create error (may already exist):', err?.message || err);
    }

    // Vote collection
    try {
      await (databases as any).createCollection(DATABASE_ID, VOTE_COLLECTION, VOTE_COLLECTION, [
        Permission.create('users'),
        Permission.read('any'),
        Permission.read('users'),
        Permission.update('users'),
        Permission.delete('users'),
      ]);
      console.log('Vote collection created');
    } catch (err: any) {
      console.warn('Vote collection create error (may already exist):', err?.message || err);
    }

    // Create attributes (example: title/content for questions)
    try {
      await Promise.all([
        (databases as any).createStringAttribute(DATABASE_ID, QUESTION_COLLECTION, 'title', 100, true),
        (databases as any).createStringAttribute(DATABASE_ID, QUESTION_COLLECTION, 'content', 10000, true),
        (databases as any).createStringAttribute(DATABASE_ID, QUESTION_COLLECTION, 'authorId', 50, true),
        (databases as any).createStringAttribute(DATABASE_ID, ANSWERS_COLLECTION, 'content', 10000, true),
        (databases as any).createStringAttribute(DATABASE_ID, ANSWERS_COLLECTION, 'questionId', 50, true),
        (databases as any).createStringAttribute(DATABASE_ID, ANSWERS_COLLECTION, 'authorId', 50, true),
        (databases as any).createStringAttribute(DATABASE_ID, COMMENTS_COLLECTION, 'content', 10000, true),
        (databases as any).createEnumAttribute(DATABASE_ID, COMMENTS_COLLECTION, 'type', ['answer', 'question'], true),
        (databases as any).createStringAttribute(DATABASE_ID, COMMENTS_COLLECTION, 'typeId', 50, true),
        (databases as any).createStringAttribute(DATABASE_ID, COMMENTS_COLLECTION, 'authorId', 50, true),
        (databases as any).createEnumAttribute(DATABASE_ID, VOTE_COLLECTION, 'type', ['question', 'answer'], true),
        (databases as any).createStringAttribute(DATABASE_ID, VOTE_COLLECTION, 'typeId', 50, true),
        (databases as any).createEnumAttribute(DATABASE_ID, VOTE_COLLECTION, 'voteStatus', ['upvoted', 'downvoted'], true),
        (databases as any).createStringAttribute(DATABASE_ID, VOTE_COLLECTION, 'votedById', 50, true),
      ]);
      console.log('Attributes creation attempted (some may already exist).');
    } catch (err: any) {
      console.warn('Attribute creation errors (some attributes may already exist):', err?.message || err);
    }

    // Storage bucket
    try {
      const { Storage } = await import('node-appwrite');
      const storage = new Storage(client);
      if (typeof (storage as any).createBucket === 'function') {
        await (storage as any).createBucket(QUESTION_ATTACHMENT_COLLECTION, 'Question Attachments');
        console.log('Storage bucket created');
      } else {
        console.log('Storage API does not expose createBucket on this SDK version');
      }
    } catch (err: any) {
      console.warn('Storage bucket create error (may already exist):', err?.message || err);
    }

    console.log('Collection and bucket creation attempted. Check logs above for details.');
  } catch (err) {
    console.error('Error during collection creation:', err);
  }
}

run();
