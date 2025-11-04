"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = createCommentCollection;
const node_appwrite_1 = require("node-appwrite");
const name_1 = require("../name");
const config_1 = require("./config");
async function createCommentCollection() {
    // Creating Collection
    await config_1.databases.createCollection(name_1.db, name_1.COMMENTS_COLLECTION, name_1.COMMENTS_COLLECTION, [
        node_appwrite_1.Permission.create("users"),
        node_appwrite_1.Permission.read("any"),
        node_appwrite_1.Permission.read("users"),
        node_appwrite_1.Permission.update("users"),
        node_appwrite_1.Permission.delete("users"),
    ]);
    console.log("Comment Collection Created");
    // Creating Attributes
    await Promise.all([
        config_1.databases.createStringAttribute(name_1.db, name_1.COMMENTS_COLLECTION, "content", 10000, true),
        config_1.databases.createEnumAttribute(name_1.db, name_1.COMMENTS_COLLECTION, "type", ["answer", "question"], true),
        config_1.databases.createStringAttribute(name_1.db, name_1.COMMENTS_COLLECTION, "typeId", 50, true),
        config_1.databases.createStringAttribute(name_1.db, name_1.COMMENTS_COLLECTION, "authorId", 50, true),
    ]);
    console.log("Comment Attributes Created");
}
