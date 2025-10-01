"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, UserIcon, ShieldAlert, Edit, Trash2, Currency } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

import { API_URL } from "@/lib/config/apiConfig";
import { useAuth } from "@/lib/AuthContext";
import User from "@/types/user";

export default function AdminPage() {
 
}
