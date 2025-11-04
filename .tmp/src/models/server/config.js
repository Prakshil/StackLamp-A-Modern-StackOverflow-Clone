"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.storage = exports.avatars = exports.users = exports.databases = exports.client = void 0;
const env_1 = require("@/app/env");
const node_appwrite_1 = require("node-appwrite");
let client = new node_appwrite_1.Client();
exports.client = client;
client
    .setEndpoint(env_1.default.appwrite.endpoint) // Your API Endpoint
    .setProject(env_1.default.appwrite.projectId) // Your project ID
    .setKey(env_1.default.appwrite.apikey) // Your secret API key
;
const databases = new node_appwrite_1.Databases(client);
exports.databases = databases;
const avatars = new node_appwrite_1.Avatars(client);
exports.avatars = avatars;
const storage = new node_appwrite_1.Storage(client);
exports.storage = storage;
const users = new node_appwrite_1.Users(client);
exports.users = users;
