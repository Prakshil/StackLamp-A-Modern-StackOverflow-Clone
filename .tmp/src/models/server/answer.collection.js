"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = createAnswerCollection;
const node_appwrite_1 = require("node-appwrite");
const name_1 = require("../name");
const config_1 = require("./config");
async function createAnswerCollection() {
    // Creating Collection
    await config_1.databases.createCollection(name_1.db, name_1.ANSWERS_COLLECTION, name_1.ANSWERS_COLLECTION, [
        node_appwrite_1.Permission.create("users"),
        node_appwrite_1.Permission.read("any"),
        node_appwrite_1.Permission.read("users"),
        node_appwrite_1.Permission.update("users"),
        node_appwrite_1.Permission.delete("users"),
    ]);
    console.log("Answer Collection Created");
    // Creating Attributes
    await Promise.all([
        config_1.databases.createStringAttribute(name_1.db, name_1.ANSWERS_COLLECTION, "content", 10000, true),
        config_1.databases.createStringAttribute(name_1.db, name_1.ANSWERS_COLLECTION, "questionId", 50, true),
        config_1.databases.createStringAttribute(name_1.db, name_1.ANSWERS_COLLECTION, "authorId", 50, true),
    ]);
    console.log("Answer Attributes Created");
}
