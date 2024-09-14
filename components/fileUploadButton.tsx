import { Button } from '@fucina/ui';
import React, { useRef } from 'react';

interface IProps {
  onSelectFile: (file: File) => Promise<void>;
}

const FileUploadButton = ({ onSelectFile }: IProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleButtonClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const onFileChange = async (ev: React.ChangeEvent<HTMLInputElement>) => {
    const file = ev.target.files?.[0];
    if (file) {
      await onSelectFile(file);
    }
  };
  return (
    <>
      <input
        type="file"
        className="!hidden"
        ref={inputRef}
        onChange={onFileChange}
        accept="image/*"
      />
      <Button variant="text" type="button" onClick={handleButtonClick}>
        Upload
      </Button>
    </>
  );
};

export default FileUploadButton;
