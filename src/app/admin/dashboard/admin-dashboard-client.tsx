"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Upload, FileText, CheckCircle, XCircle, Trash2, LogOut, Plus, Search } from "lucide-react";
import { type DocumentData } from "@/lib/dataStore";
import { adminLogout, createDocument, updateDocumentStatus, deleteDocument } from "@/app/actions";

interface AdminDashboardClientProps {
  initialDocuments: DocumentData[];
}

export default function AdminDashboardClient({ initialDocuments }: AdminDashboardClientProps) {
  const [documents, setDocuments] = useState<DocumentData[]>(initialDocuments);
  const [searchQuery, setSearchQuery] = useState("");
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    title: "",
    description: "",
    category: "Templates" as "Templates" | "Guides" | "Resources",
    file: null as File | null,
  });
  const [uploadError, setUploadError] = useState("");
  const router = useRouter();

  const handleLogout = async () => {
    await adminLogout();
    router.push("/admin");
  };

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUploadError("");
    if (!uploadForm.file) return;
    
    try {
      const fileSizeMB = (uploadForm.file.size / (1024 * 1024)).toFixed(1);
      const fileExtension = uploadForm.file.name.split('.').pop()?.toUpperCase() || 'FILE';
      
      const newDoc = await createDocument({
        title: uploadForm.title,
        description: uploadForm.description,
        category: uploadForm.category,
        type: fileExtension,
        size: `${fileSizeMB} MB`,
        status: "pending",
      }, uploadForm.file);
      
      setDocuments([...documents, newDoc]);
      setUploadForm({
        title: "",
        description: "",
        category: "Templates",
        file: null,
      });
      setIsUploadDialogOpen(false);
    } catch (error) {
      console.error("Upload error:", error);
      setUploadError(error instanceof Error ? error.message : "An unknown error occurred");
    }
  };

  const handleStatusChange = useCallback(async (id: string, status: DocumentData["status"]) => {
    const updatedDoc = await updateDocumentStatus(id, status);
    setDocuments(documents.map(doc => doc.id === id ? updatedDoc : doc));
  }, [documents]);

  const handleDelete = useCallback(async (id: string) => {
    await deleteDocument(id);
    setDocuments(documents.filter(doc => doc.id !== id));
  }, [documents]);

  const filteredDocuments = (filterStatus: DocumentData["status"] | "all") => 
    documents.filter(doc => 
      (filterStatus === "all" || doc.status === filterStatus) &&
      doc.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const getStatusBadge = (status: DocumentData["status"]) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-500 hover:bg-green-600">Approved</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">Pending</Badge>;
      case "rejected":
        return <Badge className="bg-red-500 hover:bg-red-600">Rejected</Badge>;
    }
  };

  const getCategoryIcon = () => {
    return <FileText className="h-5 w-5" />;
  };

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <div className="flex gap-2">
              <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Upload Document
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Upload New Document</DialogTitle>
                    <DialogDescription>
                      Add a new document to the toolkit. It will be in pending status until approved.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleUpload} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        value={uploadForm.title}
                        onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Input
                        id="description"
                        value={uploadForm.description}
                        onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select
                        value={uploadForm.category}
                        onValueChange={(val: "Templates" | "Guides" | "Resources") => setUploadForm({ ...uploadForm, category: val })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Templates">Templates</SelectItem>
                          <SelectItem value="Guides">Guides</SelectItem>
                          <SelectItem value="Resources">Resources</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="file">File</Label>
                      <Input
                        id="file"
                        type="file"
                        onChange={(e) => setUploadForm({ ...uploadForm, file: e.target.files?.[0] || null })}
                        required
                      />
                    </div>
                    {uploadError && (
                      <p className="text-destructive text-sm">{uploadError}</p>
                    )}
                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={() => setIsUploadDialogOpen(false)}>Cancel</Button>
                      <Button type="submit">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="text"
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Tabs defaultValue="all">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="approved">Approved</TabsTrigger>
              <TabsTrigger value="rejected">Rejected</TabsTrigger>
            </TabsList>

            {["all", "pending", "approved", "rejected"].map((tab) => (
              <TabsContent key={tab} value={tab} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredDocuments(tab as DocumentData["status"] | "all").map((doc, index) => (
                    <motion.div
                      key={doc.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <Card>
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                {getCategoryIcon()}
                                <span className="text-sm text-muted-foreground">{doc.category}</span>
                              </div>
                              <CardTitle>{doc.title}</CardTitle>
                              <CardDescription className="mt-2">{doc.description}</CardDescription>
                            </div>
                            {getStatusBadge(doc.status)}
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                            <span>{doc.type} • {doc.size}</span>
                            <span>{new Date(doc.createdAt).toLocaleDateString()}</span>
                          </div>
                          <div className="flex gap-2 mb-4">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm" className="flex-1">
                                  <FileText className="h-4 w-4 mr-2" />
                                  Preview
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-5xl max-h-[90vh]">
                                <DialogHeader>
                                  <DialogTitle>{doc.title}</DialogTitle>
                                  <DialogDescription>{doc.description}</DialogDescription>
                                </DialogHeader>
                                <div className="bg-muted rounded-lg p-4 flex flex-col items-center justify-center min-h-[400px] max-h-[70vh] overflow-hidden">
                                  {doc.type.toLowerCase() === 'pdf' ? (
                                    doc.filePath ? (
                                      <iframe
                                        src={doc.filePath}
                                        className="w-full h-full min-h-[500px] rounded-lg border border-border"
                                        title={doc.title}
                                      />
                                    ) : (
                                      <FileText className="h-16 w-16 text-muted-foreground" />
                                    )
                                  ) : ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(doc.type.toLowerCase()) ? (
                                    doc.filePath ? (
                                      <img
                                        src={doc.filePath}
                                        alt={doc.title}
                                        className="max-w-full max-h-full object-contain rounded-lg"
                                      />
                                    ) : (
                                      <FileText className="h-16 w-16 text-muted-foreground" />
                                    )
                                  ) : (
                                    <div className="text-center">
                                      <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                                      <p className="text-muted-foreground">Preview not available for this file type.</p>
                                      <p className="text-sm text-muted-foreground mt-2">Please download the file to view it.</p>
                                    </div>
                                  )}
                                </div>
                              </DialogContent>
                            </Dialog>
                            <Button asChild variant="outline" size="sm" className="flex-1">
                              <a 
                                href={doc.filePath || "#"} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                download={doc.title + '.' + doc.type.toLowerCase()}
                              >
                                <Download className="h-4 w-4 mr-2" />
                                Download
                              </a>
                            </Button>
                          </div>
                          <div className="flex gap-2">
                            {doc.status === "pending" && (
                              <>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleStatusChange(doc.id, "approved")}
                                >
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Approve
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => handleStatusChange(doc.id, "rejected")}
                                >
                                  <XCircle className="h-4 w-4 mr-2" />
                                  Reject
                                </Button>
                              </>
                            )}
                            {doc.status === "approved" && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleStatusChange(doc.id, "pending")}
                              >
                                Unapprove
                              </Button>
                            )}
                            {doc.status === "rejected" && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleStatusChange(doc.id, "pending")}
                              >
                                Reconsider
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="ml-auto"
                              onClick={() => handleDelete(doc.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
                {filteredDocuments(tab as DocumentData["status"] | "all").length === 0 && (
                  <div className="text-center py-16">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No documents found</p>
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </main>
    </div>
  );
}
