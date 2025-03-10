import * as THREE from "three";
import { createTextureAtlas } from "./create-texture-atlas";
import { mergeGeometry } from "./merge-geometry";
import { remapUVs } from "./remap-uvs";
import { findChildrenByType } from "./utils";
import constants from "./constants";
import { cloneSkeleton } from "./export";


export async function combine({ avatar }: any) {
  
    const meshes = findChildrenByType(avatar, "SkinnedMesh");
  
    const { textures, uvs } = await createTextureAtlas({ meshes });
    meshes.forEach((mesh:any) => remapUVs({ mesh, uvs: uvs.get(mesh) }));
  
    meshes.forEach((mesh:any) => removeBakedMorphs(mesh, bakeMorphs(mesh)));
  
    meshes.forEach((mesh:any) => {
      const geometry = mesh.geometry;
      if (!geometry.attributes.uv2) {
        geometry.attributes.uv2 = geometry.attributes.uv;
      }
      // Exlude the currently "activated" morph attributes before merging.
      // The BufferAttributes are not lost; they remain in `mesh.geometry.morphAttributes`
      // and the influences remain in `mesh.morphTargetInfluences`.
      for (let i = 0; i < 8; i++) {
        delete geometry.attributes[`morphTarget${i}`];
        delete geometry.attributes[`morphNormal${i}`];
      }
    });
    
    meshes.concat(findChildrenByType(avatar,"Mesh"))
    console.log("meshes" + meshes)
    const { source, dest } = mergeGeometry({ meshes });
  
    const geometry:any = new THREE.BufferGeometry();
    geometry.attributes = dest.attributes;
    geometry.morphAttributes = dest.morphAttributes;
    geometry.morphTargetsRelative = true;
    geometry.setIndex(dest.index);
  
    const material = new THREE.MeshStandardMaterial({
      map: textures["diffuse"],
      normalMap: textures["normal"],
      aoMap: textures["orm"],
      roughnessMap: textures["orm"],
      metalnessMap: textures["orm"],
    });
    material.metalness = 1;
  
    const mesh:any = new THREE.SkinnedMesh(geometry, material);
    mesh.name = constants.combinedMeshName;
    mesh.morphTargetInfluences = dest.morphTargetInfluences;
    mesh.morphTargetDictionary = dest.morphTargetDictionary;
  
    if ("MouthFlap" in mesh.morphTargetDictionary) {
      mesh.userData = {
        gltfExtensions: {
          MOZ_hubs_components: {
            "morph-audio-feedback": {
              minValue: 0,
              maxValue: 1,
              name: "MouthFlap",
            },
          },
        },
      };
    }
  
    // Add unmerged meshes
    // const clones = meshesToExclude.map((o) => {
    //   return o.clone(false);
    // });
  
    const skeleton = cloneSkeleton(meshes[0]);
    mesh.bind(skeleton);

  
    const group = new THREE.Object3D();
    group.name = "AvatarRoot";
    // group.animations = dest.animations;
    group.add(mesh);
    group.add(skeleton.bones[0]);

  
    // group.userData = {
    //   gltfExtensions: {
    //     MOZ_hubs_components: {
    //       "loop-animation": {
    //         clip: "idle_eyes,Blinks",
    //         paused: false,
    //       },
    //     },
    //   },
    // };
    return group;
  }

  function bakeMorphs(mesh:(THREE.Mesh | THREE.SkinnedMesh)) {
    const bakedMorphIndices = new Set<number>();
    if (!mesh.morphTargetInfluences) return bakedMorphIndices;
    if (!mesh.geometry.morphTargetsRelative) return bakedMorphIndices;
  
    const morphAttributes = mesh.geometry.morphAttributes;
  
    Object.entries(morphAttributes).forEach(([propertyName, buffers]) => {
      buffers.forEach((morphBufferAttribute, index) => {
        const weight = mesh.morphTargetInfluences?.[index];
        if (weight != undefined && weight > 0) {
          bakedMorphIndices.add(index);
          addIn({
            bakedAttribute: mesh.geometry.attributes[propertyName],
            morphAttribute: morphBufferAttribute,
            weight,
          });
        }
      });
    });
  
    return bakedMorphIndices;
  }

  function removeBakedMorphs(mesh:any, bakedMorphIndices:Set<number>) {
    bakedMorphIndices.forEach((morphIndex) => {
      delete mesh.geometry.morphAttributes[morphIndex];
      mesh.morphTargetInfluences?.splice(morphIndex, 1);
  
      const [morphName, _morphIndex]:any= Object.entries(mesh.morphTargetDictionary).find(
        ([morphName, index]) => index === morphIndex
      );
      delete mesh.morphTargetDictionary?.[morphName];
    });
  }
  function addIn({ bakedAttribute, morphAttribute, weight }:any) {
    for (let i = 0; i < bakedAttribute.array.length; i++) {
      bakedAttribute.array[i] += morphAttribute.array[i] * weight;
    }
  }
