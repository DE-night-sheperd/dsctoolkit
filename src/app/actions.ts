"use server";

import { cookies } from "next/headers";
import { 
  readDocuments, 
  type DocumentData, 
  createDocumentSupabase, 
  updateDocumentStatusSupabase, 
  deleteDocumentSupabase 
} from "@/lib/dataStore";
import { createServerClient } from "@/lib/supabase";
import { v4 as uuidv4 } from "uuid";

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
  const id = uuidv4();
  const supabase = createServerClient();
  
  if (!supabase) {
    throw new Error("Supabase client not available for file upload");
  }
  
  // Get file extension correctly
  const fileExtension = file.name.split('.').pop()?.toUpperCase() || 'FILE';
  
  // Upload file to Supabase Storage with correct Content-Type
  const fileName = `${id}-${file.name}`;
  const fileBuffer = Buffer.from(await file.arrayBuffer());
  
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from("documents")
    .upload(fileName, fileBuffer, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type,
    });
  
  if (uploadError) {
    console.error("Error uploading file:", uploadError);
    throw new Error(`Failed to upload file: ${uploadError.message}`);
  }
  
  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from("documents")
    .getPublicUrl(uploadData.path);
  
  const newDoc: Omit<DocumentData, "createdAt"> = {
    ...data,
    id,
    type: fileExtension,
    filePath: publicUrl,
  };
  
  return await createDocumentSupabase(newDoc);
}

// New: Get a signed URL for downloading
export async function getSignedDownloadUrl(filePath: string) {
  const supabase = createServerClient();
  if (!supabase) {
    return null;
  }
  
  // Extract the file name from the full URL
  const fileName = filePath.split('/').pop();
  if (!fileName) return null;
  
  const { data, error } = await supabase.storage
    .from("documents")
    .createSignedUrl(fileName, 60); // 60 seconds expiry
  
  if (error) {
    console.error("Error creating signed URL:", error);
    return null;
  }
  
  return data.signedUrl;
}

export async function updateDocumentStatus(id: string, status: DocumentData["status"]) {
  return await updateDocumentStatusSupabase(id, status);
}

export async function deleteDocument(id: string) {
  const supabase = createServerClient();
  
  if (supabase) {
    // Try to get the document first to find the file path
    // For now, we'll just delete from the database, and leave the file in storage
    // You could add logic here to delete the file from storage too if you want
  }
  
  return await deleteDocumentSupabase(id);
}
