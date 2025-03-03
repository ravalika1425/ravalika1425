import React, { useState } from "react";
import AppDraw from "./AppDraw";
import IframePreview from "./PreviewIFrame";
import ImageDropper from "./ImageDropper";
import { useEditable } from "./Contaxt";
import I2CLoader from "./Loading/Loader";
import CanvasEditor from "./BoundingBoxEditor";
const ImageToCodeContainer: React.FC = () => {
  useState<boolean>(false);

  const { showAppComponent, showAppDrawComponent, loading } = useEditable();

  return (
    <>
      {!showAppDrawComponent && (
        <div>
          {showAppComponent === "AppDraw" ? (
            loading ? (
              <I2CLoader />
            ) : (
              <AppDraw></AppDraw>
            )
          ) : showAppComponent === "priviewIframe" ? (
            loading ? (
              <I2CLoader />
            ) : (
              <IframePreview></IframePreview>
            )
          ) : showAppComponent === "ImageDropper" ? (
            loading ? (
              <I2CLoader />
            ) : (
              <ImageDropper></ImageDropper>
            )
          ) : showAppComponent === "BoundingBoxEditor" ? (
            loading ? (
              <I2CLoader />
            ) : (
              <CanvasEditor></CanvasEditor>
            )
          ) : loading ? (
            <I2CLoader />
          ) : (
            <AppDraw></AppDraw>
          )}
        </div>
      )}

      {showAppDrawComponent === "AppDraw" && <AppDraw></AppDraw>}
    </>
  );
};

export default ImageToCodeContainer;
