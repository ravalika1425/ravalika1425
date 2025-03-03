import React, { useEffect, useState, useRef } from "react";
import { OrbitControls, Environment } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { TextureLoader } from 'three';

export interface AvatarViewerProps {
  gltfPath: string;
  jsonFile: {
    headIcons: any[];
    shirtIcons: any[];
    beardIcons: any[];
    eyeIcons: any[];
    glassIcons: any[];
  };
  groupRef: React.RefObject<THREE.Group | undefined>;

}
interface AvatarRefs {
  HEAD: THREE.Group,
  OUTFIT: THREE.Group,
  HAIR: THREE.Group,
  GLASS: THREE.Group,
  SKIN: THREE.Texture,
  BEARD: THREE.Group,
  EYE: THREE.Texture,
  FACE: THREE.Texture
}
interface AvatarRefs {
  HEAD: THREE.Group,
  OUTFIT: THREE.Group,
  HAIR: THREE.Group,
  GLASS: THREE.Group,
  SKIN: THREE.Texture,
  BEARD: THREE.Group,
  EYE: THREE.Texture,
  FACE: THREE.Texture
}

let isLoaded:boolean = false;
let avatarGroup: THREE.Group = new THREE.Group();
  let avatarCache:AvatarRefs = {
    HEAD : new THREE.Group(),
    HAIR: new THREE.Group(),
    OUTFIT: new THREE.Group(),
    GLASS: new THREE.Group(),
    BEARD: new THREE.Group(),
    SKIN: new THREE.Texture(),
    EYE: new THREE.Texture(),
    FACE: new THREE.Texture()
  }; 


let textureLoader = new TextureLoader();
export default function AvatarViewer({ gltfPath, jsonFile, groupRef}: AvatarViewerProps) {

// export default function AvatarViewer({ gltfPath, jsonFile, groupRef }: AvatarViewerProps) {

  const [gltf, setGltf] = useState<THREE.Group | undefined>(undefined);
  const gltfPosition = new THREE.Vector3(-0.5, 1, 2);

  useEffect(()=>{
    if(!isLoaded){
      console.log("loading.....")

    
  
      isLoaded = true;
    }
  },[])

  useEffect(() => {
    loadBodyPart(gltfPath)
  }, [gltfPath]);


  return (
    <Canvas camera={{ position: gltfPosition }}>
      <Environment files="./image/brown_photostudio_02_1k.hdr" background blur={0.5} />
      <directionalLight position={[3.3, 1.0, 4.4]} intensity={4} />
      <OrbitControls target={[0, 1, 0]} />
      <primitive object={avatarGroup}/>
    </Canvas>
  );
}

async function loadBodyPart(url: string) {
  if (url === ".") return;
  const load = loadGLTF;
  const gltf: any = await load(url);
  const type = localStorage.getItem("Category");

  switch (type) {
    case "headIcons":
      let headTexture = textureLoader.load('headIcons');
      headTexture.flipY = false;
      let headMesh: any;
      avatarCache.HEAD.traverse((object) => {
        if (object.type === "Mesh" && object.name === "head") {
          headMesh = object;
          headMesh.material.map = headTexture;
        }
      });
      // avatarGroup.remove(avatarCache.HEAD);
      // avatarCache.HEAD.clear();
      // avatarCache.HEAD = gltf.scene;
      // replacePart(avatarCache.HEAD, gltf.scene);
      break;
    case "shirtIcons":
      avatarGroup.remove(avatarCache.OUTFIT);
      avatarCache.OUTFIT.clear();
      avatarCache.OUTFIT = gltf.scene;
      // replacePart(avatarCache.OUTFIT, gltf.scene);
      break;
    case "beardIcons":
      avatarGroup.remove(avatarCache.BEARD);
      avatarCache.BEARD.clear();
      avatarCache.BEARD = gltf.scene;
      // replacePart(avatarCache.BEARD, gltf.scene);
      break;
    case "eyeIcons":
      let eyeTexture = textureLoader.load('eyeIcons');
      eyeTexture.flipY = false;
      let EyeMesh: any;
      avatarCache.HEAD.traverse((object) => {
        if (object.type === "Mesh" && object.name === "eye") {
          EyeMesh = object;
          EyeMesh.material.map = eyeTexture;
        }
      });
      break;
    case "glassIcons":
      avatarGroup.remove(avatarCache.GLASS);
      avatarCache.GLASS.clear();
      avatarCache.GLASS = gltf.scene;
      break;
  }

  avatarGroup.add(gltf.scene);
  console.log(avatarGroup);
}
const loadGLTF = (function () {
  const loader = new GLTFLoader();
  return function loadGLTF(url:string) {
    return new Promise(function (resolve, reject) {
      loader.load(url, resolve, ()=>{}, reject);
    });
  };
})();
