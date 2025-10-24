import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { BookOpen, FileUp, Loader2, Plus, Trash2 } from "lucide-react";
import { useState, useCallback, useMemo } from "react";
import { Link, useLocation } from "wouter";
import { toast } from "sonner";

export default function Modules() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [selectedModuleId, setSelectedModuleId] = useState<number | null>(null);
  
  const [moduleName, setModuleName] = useState("");
  const [moduleCode, setModuleCode] = useState("");
  const [moduleDescription, setModuleDescription] = useState("");
  
  const [slideTitle, setSlideTitle] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const utils = trpc.useUtils();
  const { data: modules = [], isLoading } = trpc.modules.list.useQuery();
  
  const createModule = trpc.modules.create.useMutation({
    onSuccess: () => {
      utils.modules.list.invalidate();
      setIsCreateOpen(false);
      setModuleName("");
      setModuleCode("");
      setModuleDescription("");
      toast.success("Module created successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create module");
    },
  });

  const deleteModule = trpc.modules.delete.useMutation({
    onSuccess: () => {
      utils.modules.list.invalidate();
      toast.success("Module deleted successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete module");
    },
  });

  const uploadSlide = trpc.slides.upload.useMutation({
    onSuccess: () => {
      utils.slides.listByModule.invalidate({ moduleId: selectedModuleId! });
      setIsUploadOpen(false);
      setSlideTitle("");
      setSelectedFile(null);
      toast.success("Slide uploaded successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to upload slide");
    },
  });

  const handleCreateModule = useCallback(() => {
    if (!moduleName.trim()) {
      toast.error("Module name is required");
      return;
    }
    createModule.mutate({
      name: moduleName,
      code: moduleCode || undefined,
      description: moduleDescription || undefined,
    });
  }, [moduleName, moduleCode, moduleDescription, createModule]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== "application/pdf") {
        toast.error("Only PDF files are supported");
        return;
      }
      setSelectedFile(file);
    }
  }, []);

  const handleUploadSlide = useCallback(async () => {
    if (!slideTitle.trim() || !selectedFile || !selectedModuleId) {
      toast.error("Please fill in all fields");
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64 = e.target?.result as string;
      const base64Data = base64.split(",")[1];
      
      uploadSlide.mutate({
        moduleId: selectedModuleId,
        title: slideTitle,
        fileName: selectedFile.name,
        fileData: base64Data,
        mimeType: selectedFile.type,
        fileSize: selectedFile.size,
      });
    };
    reader.readAsDataURL(selectedFile);
  }, [slideTitle, selectedFile, selectedModuleId, uploadSlide]);

  if (!isAuthenticated) {
    navigate("/");
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Modules</h1>
            <p className="text-gray-600 mt-1">Manage your course modules and lecture slides</p>
          </div>
          
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                New Module
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Module</DialogTitle>
                <DialogDescription>
                  Add a new course module to organize your lecture slides
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Module Name *</Label>
                  <Input
                    id="name"
                    value={moduleName}
                    onChange={(e) => setModuleName(e.target.value)}
                    placeholder="e.g., Microeconomics"
                  />
                </div>
                <div>
                  <Label htmlFor="code">Module Code</Label>
                  <Input
                    id="code"
                    value={moduleCode}
                    onChange={(e) => setModuleCode(e.target.value)}
                    placeholder="e.g., EC201"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={moduleDescription}
                    onChange={(e) => setModuleDescription(e.target.value)}
                    placeholder="Brief description of the module"
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  onClick={handleCreateModule}
                  disabled={createModule.isPending}
                >
                  {createModule.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Create Module
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {modules.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <BookOpen className="w-16 h-16 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2">No modules yet</h3>
              <p className="text-gray-600 mb-4">Create your first module to get started</p>
              <Button onClick={() => setIsCreateOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Module
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((module) => (
              <ModuleCard
                key={module.id}
                module={module}
                onUpload={(id) => {
                  setSelectedModuleId(id);
                  setIsUploadOpen(true);
                }}
                onDelete={(id) => {
                  if (confirm("Are you sure you want to delete this module?")) {
                    deleteModule.mutate({ id });
                  }
                }}
              />
            ))}
          </div>
        )}

        <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload Lecture Slide</DialogTitle>
              <DialogDescription>
                Upload a PDF file for this module
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Slide Title *</Label>
                <Input
                  id="title"
                  value={slideTitle}
                  onChange={(e) => setSlideTitle(e.target.value)}
                  placeholder="e.g., Lecture 1: Introduction"
                />
              </div>
              <div>
                <Label htmlFor="file">PDF File *</Label>
                <Input
                  id="file"
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                />
                {selectedFile && (
                  <p className="text-sm text-gray-600 mt-2">
                    Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button
                onClick={handleUploadSlide}
                disabled={uploadSlide.isPending}
              >
                {uploadSlide.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Upload
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

function ModuleCard({
  module,
  onUpload,
  onDelete,
}: {
  module: any;
  onUpload: (id: number) => void;
  onDelete: (id: number) => void;
}) {
  const { data: slides = [] } = trpc.slides.listByModule.useQuery({ moduleId: module.id });

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-xl">{module.name}</CardTitle>
            {module.code && (
              <CardDescription className="font-mono">{module.code}</CardDescription>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(module.id)}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
        {module.description && (
          <p className="text-sm text-gray-600 mt-2">{module.description}</p>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="text-sm text-gray-600">
            {slides.length} {slides.length === 1 ? "slide" : "slides"}
          </div>
          
          {slides.length > 0 && (
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {slides.map((slide: any) => (
                <Link key={slide.id} href={`/focus/${slide.id}`}>
                  <div className="flex items-center gap-2 p-2 rounded hover:bg-gray-50 cursor-pointer border border-gray-100">
                    <BookOpen className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                    <span className="text-sm truncate">{slide.title}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onUpload(module.id)}
            className="w-full"
          >
            <FileUp className="w-4 h-4 mr-2" />
            Upload Slide
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

