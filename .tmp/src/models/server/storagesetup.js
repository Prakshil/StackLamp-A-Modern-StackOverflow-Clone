"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = getOrCreateStorage;
const node_appwrite_1 = require("node-appwrite");
const name_1 = require("../name");
const config_1 = require("./config");
async function getOrCreateStorage() {
    try {
        await config_1.storage.getBucket(name_1.QUESTION_ATTACHMENT_COLLECTION);
        console.log("Storage Connected");
    }
    catch (error) {
        try {
            await config_1.storage.createBucket(name_1.QUESTION_ATTACHMENT_COLLECTION, name_1.QUESTION_ATTACHMENT_COLLECTION, [
                node_appwrite_1.Permission.create("users"),
                node_appwrite_1.Permission.read("any"),
                node_appwrite_1.Permission.read("users"),
                node_appwrite_1.Permission.update("users"),
                node_appwrite_1.Permission.delete("users"),
            ], false, undefined, undefined, ["jpg", "png", "gif", "jpeg", "webp", "heic"]);
            console.log("Storage Created");
            console.log("Storage Connected");
        }
        catch (error) {
            console.error("Error creating storage:", error);
        }
    }
}
