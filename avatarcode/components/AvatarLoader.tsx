import * as THREE from 'three'
import React, { Suspense, useEffect, useRef, useState} from 'react'
import { useLoader, useThree } from '@react-three/fiber';
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { TextureLoader } from 'three';
import { exportAvatar } from '../utils/export';






export const Model = ()=> {
    const avatarGroup: THREE.Group = new THREE.Group();
    let load = loadGLTF;
    var bodyParts:string[] = ["./racing_outfit.glb", "./head.glb" ]
    loadBodyParts(avatarGroup)
    avatarGroup.remove()
    
return ( 
    <></>
  )

}

async function loadBodyParts(avatarGroup: THREE.Group){
  let load = loadGLTF;
  var body:any = await load("./racing_outfit.glb");
  avatarGroup.add(body.scene)
               
  var head:any = await load("./head_skl.glb");

   
   avatarGroup.add(head.scene)
   console.log(avatarGroup);
   exportAvatar(avatarGroup)
  }

const loadGLTF = (function () {
    const loader = new GLTFLoader();
    return function loadGLTF(url:string) {
      return new Promise(function (resolve, reject) {
        loader.load(url, resolve, ()=>{}, reject);
      });
    };
  })();
