import { ANSWERS_COLLECTION, db } from "@/models/name";
import { databases, users } from "@/models/server/config";
import { UserPrefs } from "@/store/auth";
import { NextRequest, NextResponse } from "next/server";
import { ID } from "node-appwrite";

export async function POST(req: NextRequest) {
  try {
    const { questionId, answer, authorId } = await req.json();

    if (!questionId || !answer || !authorId) {
      return NextResponse.json({ message: "Invalid request" }, { status: 400 });
    }

    const response = await databases.createDocument(db, ANSWERS_COLLECTION, ID.unique(), {
      content: answer,
      questionId: questionId,
      authorId: authorId,
    });

    const prefs = await users.getPrefs<UserPrefs>(authorId);
    await users.updatePrefs<UserPrefs>(authorId, {
      reputation: Number(prefs.reputation) + 1,
    });

    return NextResponse.json({ message: "Answer saved", data: response }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Something went wrong" }, { status: 500 });
  }
}
export async function DELETE(request: NextRequest){
  try {
    const {answerId} = await request.json()

  const answer = await databases.getDocument(db, ANSWERS_COLLECTION, answerId)

  const response = await databases.deleteDocument(db, ANSWERS_COLLECTION, answerId)

    //decrese the reputation
    const prefs = await users.getPrefs<UserPrefs>(answer.authorId)
    await users.updatePrefs<UserPrefs>(answer.authorId, {
      reputation: Number(prefs.reputation) - 1
    })

    return NextResponse.json({ data: response }, { status: 200 });



  } catch (error: any) {
    return NextResponse.json(
      {
        message: error?.message || "Error deleting the answer"
      },
      {
        status: error?.status || error?.code || 500
      }
    )
  }
}