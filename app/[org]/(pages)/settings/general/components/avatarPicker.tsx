import React, { useState } from "react";
import { useQueryClient } from "react-query";

import { Avatar, AvatarFallback, AvatarImage } from "@fucina/ui";
import FileUploadButton from "@/components/fileUploadButton";
import { createClient } from "@/utils/supabase/client";
import { Endpoints } from "@/app/api/endpoints";
import { useWorkspace } from "@/context/workspaceContext";

const AvatarPicker = () => {
  const { workspace, onChangeImage } = useWorkspace();
  const [isLoadingImage, setIsLoadingImage] = useState(false);
  const queryClient = useQueryClient();
  const onSelectFile = async (file: File) => {
    if (!workspace?.id) {
      return;
    }
    setIsLoadingImage(true);
    try {
      const supabase = createClient();
      const res = await supabase.storage
        .from("images")
        .upload(workspace.id, file, {
          upsert: true,
          cacheControl: "3600",
        });
      onChangeImage();
      queryClient.invalidateQueries([Endpoints.workspace.main]);
    } catch (e) {
      console.log("Error", e);
    } finally {
      setIsLoadingImage(false);
    }
  };

  return (
    <div className="flex justify-start items-center gap-4">
      <Avatar className="text-heading-subsection size-20">
        <AvatarImage src={workspace?.imageUrl || undefined}></AvatarImage>
        <AvatarFallback className="text-3xl">
          {workspace?.name?.[0]}
        </AvatarFallback>
      </Avatar>
      <FileUploadButton onSelectFile={onSelectFile} />
    </div>
  );
};

export default AvatarPicker;
