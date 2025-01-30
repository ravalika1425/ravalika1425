import React, { useRef, useState } from 'react'
import Header from '../header-toolbar/Header';
import FemaleAvatarViewer, { FemaleAvatarViewerProps } from './FemaleAvatarViewer';
import FemaleCustomizationPanel, { FemaleCustomizationPanelProps } from './FemaleCustomizationPanel';
import jsonData from "../categories-variants/images.json";
import './FemaleAvatar.css';
export const TypeDefaultVariant: any = {
    male: { path: "./models/defaultfemaleavatar.glb" },
  };
const  FemaleAvatar: React.FC = () => {
    const group = useRef<THREE.Group | null>(null);
    const [gltfPath, setGltfPath] = useState<string>(TypeDefaultVariant.male.path); 

  // const [gltfPath, setGltfPath] = useState<string>("");



  const handleVariantClick = (newGltfPath: string) => {
    setGltfPath(newGltfPath);
  };

  const femaleavatarViewerProps: FemaleAvatarViewerProps = {
    gltfPath: gltfPath,

    jsonFile: jsonData, 
    groupRef: group,
  };
    const femalecustomizationPanelProps: FemaleCustomizationPanelProps = {
        onVariantClick: handleVariantClick,
        onIconClick: () => {},
      };
  return (
    <div className='avatarbg'>
        <Header/>
        <FemaleAvatarViewer {...femaleavatarViewerProps}/>
        <FemaleCustomizationPanel {...femalecustomizationPanelProps} />
    </div>
  )
}

export default FemaleAvatar