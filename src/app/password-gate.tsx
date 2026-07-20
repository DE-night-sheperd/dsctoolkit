"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { verifyPassword } from "./actions";

export default function PasswordGate() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await verifyPassword(password);
    if (result.success) {
      router.refresh();
      router.push("/dashboard");
    } else {
      setError(result.error || "Invalid password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">DSC Toolkit</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Enter Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter toolkit password"
                  autoComplete="off"
                />
                {error && <p className="text-destructive text-sm">{error}</p>}
              </div>
              <Button type="submit" className="w-full">
                Access Toolkit
              </Button>
            </form>
            <p className="text-center text-sm text-muted-foreground mt-4">
              Just browsing?{" "}
              <Link href="/resources" className="underline hover:text-foreground">
                View public resources
              </Link>{" "}
              — no login needed.
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
