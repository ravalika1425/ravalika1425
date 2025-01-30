import React, { useRef, useState } from "react";
import Header from "../header-toolbar/Header";
import CustomizationPanel, { CustomizationPanelProps } from "../customization-panel/CustomizationPanel";
import AvatarViewer, { AvatarViewerProps } from "../avatar-viewer/AvatarViewer";
import jsonData from "../categories-variants/images.json"; 
import './CreateAvatar.css';

export const TypeDefaultVariant: any = {
  male: { path: "./models/man.glb" },
};

const CreateAvatar: React.FC = () => {
  const group = useRef<THREE.Group | null>(null);

  const [gltfPath, setGltfPath] = useState<string>(TypeDefaultVariant.male.path); 

  // const [gltfPath, setGltfPath] = useState<string>("");



  const handleVariantClick = (newGltfPath: string) => {
    setGltfPath(newGltfPath);
  };

  const avatarViewerProps: AvatarViewerProps = {
    gltfPath: gltfPath,

    jsonFile: jsonData, 
    groupRef: group,
  };

  const customizationPanelProps: CustomizationPanelProps = {
    onVariantClick: handleVariantClick,
    onIconClick: () => {},
  };

  return (
    <div className='avatarbg'>
      <Header />
      <AvatarViewer {...avatarViewerProps} />
      <CustomizationPanel {...customizationPanelProps} />
    </div>
  );
};

export default CreateAvatar;
