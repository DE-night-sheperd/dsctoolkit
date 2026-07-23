"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  FileText,
  Download,
  Search,
  LogIn,
  Briefcase,
  BookOpen,
  Code,
} from "lucide-react";
import { type DocumentData } from "@/lib/dataStore";

interface ResourcesClientProps {
  initialDocuments: DocumentData[];
}

const categories = ["All", "Templates", "Guides", "Resources"];

export default function ResourcesClient({ initialDocuments }: ResourcesClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredDocuments = initialDocuments.filter((doc) => {
    const matchesSearch = doc.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryIcon = (category: DocumentData["category"]) => {
    switch (category) {
      case "Templates":
        return <Briefcase className="h-5 w-5" />;
      case "Guides":
        return <BookOpen className="h-5 w-5" />;
      case "Resources":
        return <Code className="h-5 w-5" />;
    }
  };

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">DSC Toolkit</h1>
              <p className="text-sm text-muted-foreground">Public resources — no login required</p>
            </div>
            <Button variant="ghost" asChild>
              <Link href="/">
                <LogIn className="h-4 w-4 mr-2" />
                Member Login
              </Link>
            </Button>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="text"
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                size="sm"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocuments.map((doc, index) => (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              <Card className="h-full">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getCategoryIcon(doc.category)}
                      <span className="text-sm text-muted-foreground">
                        {doc.category}
                      </span>
                    </div>
                    <span className="text-xs bg-muted px-2 py-1 rounded-full">
                      {doc.type} • {doc.size}
                    </span>
                  </div>
                  <CardTitle className="mt-2">{doc.title}</CardTitle>
                  <CardDescription>{doc.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="flex-1">
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
                  <Button asChild className="flex-1">
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
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
        {filteredDocuments.length === 0 && (
          <div className="text-center py-16">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No documents found</p>
          </div>
        )}
      </main>
    </div>
  );
}
