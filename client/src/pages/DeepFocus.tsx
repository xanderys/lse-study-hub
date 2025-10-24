import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, Highlighter, Loader2, Pen, Send, Settings, Trash2, Upload, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { useLocation, useRoute } from "wouter";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

type AnnotationTool = "none" | "highlight" | "pen";

export default function DeepFocus() {
  const [match, params] = useRoute("/focus/:slideId");
  const slideId = params?.slideId ? parseInt(params.slideId) : null;
  const [, navigate] = useLocation();
  const { isAuthenticated } = useAuth();

  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [activeTool, setActiveTool] = useState<AnnotationTool>("none");
  const [questionInput, setQuestionInput] = useState("");
  const [chatInput, setChatInput] = useState("");
  const [systemPrompt, setSystemPrompt] = useState("");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [pdfFile, setPdfFile] = useState<File | null>(null);

  const utils = trpc.useUtils();
  
  const { data: slide, isLoading: slideLoading } = trpc.slides.getById.useQuery(
    { id: slideId! },
    { enabled: !!slideId }
  );

  const { data: questions = [] } = trpc.questions.list.useQuery(
    { slideId: slideId! },
    { enabled: !!slideId }
  );

  const getOrCreateSessionMutation = trpc.chat.getOrCreateSession.useMutation();
  const session = getOrCreateSessionMutation.data;
  const sessionId = session?.id;

  const { data: messages = [] } = trpc.chat.getMessages.useQuery(
    { sessionId: sessionId! },
    { enabled: !!sessionId }
  );

  const createQuestion = trpc.questions.create.useMutation({
    onSuccess: () => {
      utils.questions.list.invalidate({ slideId: slideId! });
      setQuestionInput("");
      toast.success("Question added");
    },
  });

  const deleteQuestion = trpc.questions.delete.useMutation({
    onSuccess: () => {
      utils.questions.list.invalidate({ slideId: slideId! });
      toast.success("Question deleted");
    },
  });

  const sendMessage = trpc.chat.sendMessage.useMutation({
    onSuccess: () => {
      utils.chat.getMessages.invalidate({ sessionId: sessionId! });
      setChatInput("");
    },
  });

  const updatePrompt = trpc.chat.updateSystemPrompt.useMutation({
    onSuccess: () => {
      setIsSettingsOpen(false);
      toast.success("System prompt updated");
    },
  });

  useEffect(() => {
    if (slideId && !sessionId) {
      getOrCreateSessionMutation.mutate({ slideId });
    }
  }, [slideId, sessionId, getOrCreateSessionMutation]);

  useEffect(() => {
    if (session?.systemPrompt) {
      setSystemPrompt(session.systemPrompt);
    }
  }, [session]);

  const handleAddQuestion = useCallback(() => {
    if (!questionInput.trim() || !slideId) return;
    createQuestion.mutate({
      slideId,
      content: questionInput,
    });
  }, [questionInput, slideId, createQuestion]);

  const handleSendMessage = useCallback(() => {
    if (!chatInput.trim() || !sessionId) return;
    sendMessage.mutate({
      sessionId,
      message: chatInput,
    });
  }, [chatInput, sessionId, sendMessage]);

  const handleUpdatePrompt = useCallback(() => {
    if (!sessionId) return;
    updatePrompt.mutate({
      sessionId,
      systemPrompt,
    });
  }, [sessionId, systemPrompt, updatePrompt]);

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setPdfFile(file);
    } else {
      toast.error("Please select a PDF file");
    }
  }, []);

  if (!isAuthenticated) {
    navigate("/");
    return null;
  }

  if (!match || !slideId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Invalid slide ID</p>
      </div>
    );
  }

  if (slideLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const pdfUrl = pdfFile ? URL.createObjectURL(pdfFile) : slide?.fileUrl;

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/modules")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="font-semibold">{slide?.title || "Deep Focus"}</h1>
            <p className="text-sm text-gray-600">{slide?.fileName}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant={activeTool === "highlight" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveTool(activeTool === "highlight" ? "none" : "highlight")}
          >
            <Highlighter className="w-4 h-4" />
          </Button>
          <Button
            variant={activeTool === "pen" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveTool(activeTool === "pen" ? "none" : "pen")}
          >
            <Pen className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* PDF Viewer - 2/3 width */}
        <div className="w-2/3 bg-gray-100 flex flex-col">
          {!pdfUrl && !pdfFile ? (
            <div className="flex-1 flex items-center justify-center">
              <Card className="p-8 text-center max-w-md">
                <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No PDF loaded</h3>
                <p className="text-gray-600 mb-4">
                  Import from cloud storage or drag and drop a new file
                </p>
                <div className="space-y-2">
                  <Button className="w-full" disabled={!slide}>
                    Import from Cloud
                  </Button>
                  <Label htmlFor="pdf-upload" className="block">
                    <Button variant="outline" className="w-full" asChild>
                      <span>Upload New PDF</span>
                    </Button>
                  </Label>
                  <input
                    id="pdf-upload"
                    type="file"
                    accept="application/pdf"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                </div>
              </Card>
            </div>
          ) : (
            <div className="flex-1 overflow-auto p-4">
              <div className="max-w-4xl mx-auto">
                <Document
                  file={pdfUrl}
                  onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                  loading={
                    <div className="flex items-center justify-center p-8">
                      <Loader2 className="w-8 h-8 animate-spin" />
                    </div>
                  }
                >
                  <Page
                    pageNumber={currentPage}
                    scale={scale}
                    renderTextLayer={true}
                    renderAnnotationLayer={false}
                  />
                </Document>
              </div>
            </div>
          )}

          {/* PDF Controls */}
          {pdfUrl && (
            <div className="bg-white border-t px-4 py-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage <= 1}
                >
                  Previous
                </Button>
                <span className="text-sm">
                  Page {currentPage} of {numPages}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setCurrentPage(Math.min(numPages, currentPage + 1))}
                  disabled={currentPage >= numPages}
                >
                  Next
                </Button>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setScale(Math.max(0.5, scale - 0.1))}
                >
                  -
                </Button>
                <span className="text-sm w-16 text-center">{Math.round(scale * 100)}%</span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setScale(Math.min(2, scale + 0.1))}
                >
                  +
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar - 1/3 width */}
        <div className="w-1/3 flex flex-col bg-white border-l">
          {/* Questions Section - Top Half */}
          <div className="h-1/2 border-b flex flex-col">
            <div className="px-4 py-3 border-b bg-gray-50">
              <h2 className="font-semibold">Questions & Notes</h2>
            </div>
            
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-2">
                {questions.map((q: any) => (
                  <div
                    key={q.id}
                    className="bg-gray-50 p-3 rounded-lg flex items-start justify-between group"
                  >
                    <p className="text-sm flex-1">{q.content}</p>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => deleteQuestion.mutate({ id: q.id })}
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  placeholder="Type your question..."
                  value={questionInput}
                  onChange={(e) => setQuestionInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddQuestion()}
                />
                <Button onClick={handleAddQuestion} disabled={createQuestion.isPending}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Chat Section - Bottom Half */}
          <div className="h-1/2 flex flex-col">
            <div className="px-4 py-3 border-b bg-gray-50 flex items-center justify-between">
              <h2 className="font-semibold">AI Study Assistant</h2>
              <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Settings className="w-4 h-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Chat Settings</DialogTitle>
                    <DialogDescription>
                      Customize the AI assistant's behavior
                    </DialogDescription>
                  </DialogHeader>
                  <div>
                    <Label htmlFor="prompt">System Prompt</Label>
                    <Textarea
                      id="prompt"
                      value={systemPrompt}
                      onChange={(e) => setSystemPrompt(e.target.value)}
                      rows={5}
                      placeholder="You are a helpful study assistant..."
                    />
                  </div>
                  <DialogFooter>
                    <Button onClick={handleUpdatePrompt} disabled={updatePrompt.isPending}>
                      {updatePrompt.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                      Save
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((msg: any) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        msg.role === "user"
                          ? "bg-indigo-600 text-white"
                          : "bg-gray-100 text-gray-900"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                    </div>
                  </div>
                ))}
                {sendMessage.isPending && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 rounded-lg p-3">
                      <Loader2 className="w-4 h-4 animate-spin" />
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  placeholder="Ask a question..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage()}
                />
                <Button onClick={handleSendMessage} disabled={sendMessage.isPending}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

