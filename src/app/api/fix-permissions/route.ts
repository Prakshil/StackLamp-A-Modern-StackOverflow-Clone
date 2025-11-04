import { NextResponse } from "next/server";
import { databases } from "@/models/server/config";
import { db, QUESTION_COLLECTION } from "@/models/name";
import { Permission, Role, Query } from "node-appwrite";

export async function GET() {
  try {
    // Get all questions
    const response = await databases.listDocuments(db, QUESTION_COLLECTION, [
      Query.limit(100),
    ]);

    console.log(`Found ${response.documents.length} questions`);

    const updates = [];

    // Update permissions for each question
    for (const doc of response.documents) {
      try {
        await databases.updateDocument(
          db,
          QUESTION_COLLECTION,
          doc.$id,
          {},
          [
            Permission.read(Role.any()),
            Permission.update(Role.user(doc.authorId as string)),
            Permission.delete(Role.user(doc.authorId as string)),
          ]
        );
        updates.push({ id: doc.$id, status: "success" });
        console.log(`Updated permissions for question ${doc.$id}`);
      } catch (err: any) {
        updates.push({ id: doc.$id, status: "error", message: err.message });
        console.error(`Failed to update question ${doc.$id}:`, err);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Processed ${response.documents.length} questions`,
      updates,
    });
  } catch (err: any) {
    console.error("Error fixing permissions:", err);
    return NextResponse.json(
      {
        success: false,
        error: err.message,
      },
      { status: 500 }
    );
  }
}
