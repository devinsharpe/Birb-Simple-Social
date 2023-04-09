import { useS3Upload } from "next-s3-upload";

const useUpload = () => {
  const { uploadToS3 } = useS3Upload();
  const handleUpload = async (file: File) => {
    const blob = file.slice(0, file.size, file.type);
    const filename = `${crypto.randomUUID()}.${file.type.split("/")[1]}`;
    const { url } = await uploadToS3(
      new File([blob], filename, {
        type: file.type,
      })
    );
    return url;
  };

  return {
    handleUpload,
  };
};

export default useUpload;
