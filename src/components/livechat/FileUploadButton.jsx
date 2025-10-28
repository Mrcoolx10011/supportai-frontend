import React, { useRef } from "react";
import { base44 } from "../../api/base44Client";
import { useMutation } from "@tanstack/react-query";
import { Button } from "../ui/button";
import { Paperclip, Loader2 } from "lucide-react";
import { useToast } from "../ui/use-toast";

export default function FileUploadButton({ conversationId, onFileUploaded }) {
  const fileInputRef = useRef(null);
  const { toast } = useToast();

  const uploadMutation = useMutation({
    mutationFn: async (file) => {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      
      await base44.entities.ChatAttachment.create({
        conversation_id: conversationId,
        file_url,
        file_name: file.name,
        file_type: file.type,
        file_size: file.size
      });

      return { file_url, file_name: file.name };
    },
    onSuccess: (data) => {
      onFileUploaded(data);
      toast({
        title: "File uploaded",
        description: "File attached successfully",
      });
    },
    onError: () => {
      toast({
        title: "Upload failed",
        description: "Could not upload file. Try again.",
        variant: "destructive",
      });
    },
  });

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Maximum file size is 10MB",
          variant: "destructive",
        });
        return;
      }
      uploadMutation.mutate(file);
    }
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={handleFileSelect}
        accept="image/*,.pdf,.doc,.docx,.txt"
      />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => fileInputRef.current?.click()}
        disabled={uploadMutation.isPending}
      >
        {uploadMutation.isPending ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Paperclip className="w-4 h-4" />
        )}
      </Button>
    </>
  );
}
