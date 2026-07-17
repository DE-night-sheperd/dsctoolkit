"use server";

import { cookies } from "next/headers";
import { readDocuments, writeDocuments, type DocumentData } from "@/lib/dataStore";
import { v4 as uuidv4 } from "uuid";
import * as fs from "fs";
import * as path from "path";

export async function verifyPassword(password: string) {
  const validPassword = process.env.TOOLKIT_PASSWORD || "password123";
  if (password === validPassword) {
    (await cookies()).set("auth", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    });
    return { success: true };
  }
  return { success: false, error: "Invalid password" };
}

export async function checkAuth() {
  const cookieStore = await cookies();
  return cookieStore.get("auth")?.value === "true";
}

export async function verifyAdminPassword(password: string) {
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
  if (password === adminPassword) {
    (await cookies()).set("adminAuth", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    });
    return { success: true };
  }
  return { success: false, error: "Invalid admin password" };
}

export async function checkAdminAuth() {
  const cookieStore = await cookies();
  return cookieStore.get("adminAuth")?.value === "true";
}

export async function adminLogout() {
  (await cookies()).delete("adminAuth");
}

export async function getDocuments() {
  return await readDocuments();
}

export async function getApprovedDocuments() {
  const docs = await readDocuments();
  return docs.filter(doc => doc.status === "approved");
}

export async function createDocument(data: Omit<DocumentData, "id" | "createdAt" | "filePath">, file: File) {
  const docs = await readDocuments();
  const id = uuidv4();
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  const fileName = `${id}-${file.name}`;
  const filePath = path.join(uploadDir, fileName);
  const fileBuffer = Buffer.from(await file.arrayBuffer());
  fs.writeFileSync(filePath, fileBuffer);
  
  const newDoc: DocumentData = {
    ...data,
    id,
    createdAt: new Date().toISOString(),
    filePath: `/uploads/${fileName}`,
  };
  
  docs.push(newDoc);
  await writeDocuments(docs);
  return newDoc;
}

export async function updateDocumentStatus(id: string, status: DocumentData["status"]) {
  const docs = await readDocuments();
  const index = docs.findIndex(doc => doc.id === id);
  if (index === -1) {
    throw new Error("Document not found");
  }
  docs[index].status = status;
  await writeDocuments(docs);
  return docs[index];
}

export async function deleteDocument(id: string) {
  const docs = await readDocuments();
  const filteredDocs = docs.filter(doc => doc.id !== id);
  await writeDocuments(filteredDocs);
  return true;
}
