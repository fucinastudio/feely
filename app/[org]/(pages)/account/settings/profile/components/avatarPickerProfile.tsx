import FileUploadButton from '@/components/fileUploadButton';
import { createClient } from '@/utils/supabase/client';
import { Avatar, AvatarFallback, AvatarImage } from '@fucina/ui';
import React, { useState } from 'react';
import { LoaderCircle } from 'lucide-react';
import { useAuth } from '@/context/authContext';
import { usePatchUser } from '@/app/api/controllers/userController';

const AvatarPickerProfile = () => {
  const { user } = useAuth();
  const [isLoadingImage, setIsLoadingImage] = useState(false);
  const { mutateAsync: patchUserAsync } = usePatchUser();
  const onSelectFile = async (file: File) => {
    console.log('File', file);
    if (!user?.id) {
      return;
    }
    setIsLoadingImage(true);
    try {
      const supabase = createClient();
      const res = await supabase.storage.from('images').upload(user.id, file, {
        upsert: true,
        cacheControl: '3600',
      });
      if (res.data?.path) {
        await patchUserAsync({
          id: user.id,
          image_url: supabase.storage
            .from('images')
            .getPublicUrl(res.data?.path).data.publicUrl,
        });
      }
    } catch (e) {
      console.log('Error', e);
    } finally {
      setIsLoadingImage(false);
    }
  };

  return (
    <div className="flex justify-start items-center gap-4">
      <Avatar className="text-heading-subsection size-20">
        <AvatarImage src={user?.image_url || undefined}></AvatarImage>
        <AvatarFallback className="text-3xl">{user?.name?.[0]}</AvatarFallback>
      </Avatar>
      <FileUploadButton onSelectFile={onSelectFile} />
    </div>
  );
};

export default AvatarPickerProfile;
