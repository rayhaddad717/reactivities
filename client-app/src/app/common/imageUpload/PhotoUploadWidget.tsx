import { useEffect, useState } from "react";
import { Button, Grid, Header } from "semantic-ui-react";
import PhotoWidgetDropzone from "./PhotoWidgetDropzone";
import { FileWithPreview } from "../../models/profile";
import PhotoWidgetCropper from "./PhotoWidgetCropper";
import { useStore } from "../../stores/store";

interface Props {
  loading: boolean;
  uploadPhoto: (file: Blob) => void;
}

export default function PhotoUploadWidget({ loading, uploadPhoto }: Props) {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [cropper, setCropper] = useState<Cropper>();
  const {
    deviceTypeStore: { isTablet },
  } = useStore();
  function onCrop() {
    if (cropper) {
      cropper.getCroppedCanvas().toBlob((blob) => uploadPhoto(blob!));
    }
  }

  useEffect(() => {
    return () => {
      files.forEach((file: FileWithPreview) =>
        URL.revokeObjectURL(file.preview)
      );
    };
  }, [files]);
  return (
    <Grid>
      <Grid.Column width={isTablet ? 16 : 4}>
        <Header sub color="teal" content="Step 1 - Add Photo" />
        <PhotoWidgetDropzone setFiles={setFiles} />
      </Grid.Column>
      <Grid.Column width={1} />
      <Grid.Column width={isTablet ? 16 : 4}>
        <Header sub color="teal" content="Step 2 - Resize Image" />
        {files && files.length ? (
          <PhotoWidgetCropper
            setCropper={setCropper}
            imagePreview={files[0].preview}
          />
        ) : null}
      </Grid.Column>
      <Grid.Column width={1} />

      <Grid.Column width={isTablet ? 16 : 4}>
        <Header sub color="teal" content="Step 3 - Preview & Upload" />
        <Grid.Column>
          {files && files.length ? (
            <>
              <div
                className="img-preview"
                style={{
                  minHeight: 200,
                  overflow: "hidden",
                  marginLeft: isTablet ? "auto" : 0,
                  marginRight: isTablet ? "auto" : 0,
                }}
              />
              <Button.Group widths={2} style={{ marginTop: isTablet ? 20 : 0 }}>
                <Button
                  loading={loading}
                  onClick={onCrop}
                  positive
                  icon="check"
                />
                <Button
                  disabled={loading}
                  onClick={() => setFiles([])}
                  icon="close"
                />
              </Button.Group>
            </>
          ) : null}
        </Grid.Column>
      </Grid.Column>
    </Grid>
  );
}
