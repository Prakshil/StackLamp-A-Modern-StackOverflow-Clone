"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = createQuestionCollection;
const node_appwrite_1 = require("node-appwrite");
const name_1 = require("../name");
const config_1 = require("./config");
async function createQuestionCollection() {
    // create collection
    await config_1.databases.createCollection(name_1.db, name_1.QUESTION_COLLECTION, name_1.QUESTION_COLLECTION, [
        node_appwrite_1.Permission.read("any"),
        node_appwrite_1.Permission.read("users"),
        node_appwrite_1.Permission.create("users"),
        node_appwrite_1.Permission.update("users"),
        node_appwrite_1.Permission.delete("users"),
    ]);
    console.log("Question collection is created");
    //creating attributes and Indexes
    await Promise.all([
        config_1.databases.createStringAttribute(name_1.db, name_1.QUESTION_COLLECTION, "title", 100, true),
        config_1.databases.createStringAttribute(name_1.db, name_1.QUESTION_COLLECTION, "content", 10000, true),
        config_1.databases.createStringAttribute(name_1.db, name_1.QUESTION_COLLECTION, "authorId", 50, true),
        config_1.databases.createStringAttribute(name_1.db, name_1.QUESTION_COLLECTION, "tags", 50, true, undefined, true),
        config_1.databases.createStringAttribute(name_1.db, name_1.QUESTION_COLLECTION, "attachmentId", 50, false),
    ]);
    console.log("Question Attributes created");
    // create Indexes
    /*
    await Promise.all([
      databases.createIndex(
        db,
        questionCollection,
        "title",
        IndexType.Fulltext,
        ["title"],
        ['asc']
      ),
      databases.createIndex(
        db,
        questionCollection,
        "content",
        IndexType.Fulltext,
        ["content"],
        ['asc']
      )
    ])
      */
}
