import * as THREE from "three";
import { mergeAttributes } from "three/examples/jsm/utils/BufferGeometryUtils";
import constants from "./constants";
import { GLTFCubicSplineInterpolant } from "./gltf-cubic-spline-interpolant";
import   { ThreeMesh, dest }  from "../interface/IMergeGeomtry"

function mergeMorphTargetInfluences({ meshes, sourceMorphTargetDictionaries, destMorphTargetDictionary }:any) {
  const destMorphTargetInfluences:any = [];
  Object.entries(destMorphTargetDictionary).map(([morphName, destIndex]:[string,any]) => {
    const mesh = meshes.find((mesh:any) => {
      return sourceMorphTargetDictionaries.get(mesh).hasOwnProperty(morphName);
    });

    const sourceIndex = mesh.morphTargetDictionary[morphName];
    destMorphTargetInfluences[destIndex] = mesh.morphTargetInfluences[sourceIndex];
    // TODO: Stop / reset animations so that animated morph influences return to their "at rest" values.
    // Maybe the "at rest" values should be baked into attributes (e.g. eye brow shapes) to allow more
    // active morph targets in the combined mesh. Not all morphs should be baked. (e.g. The eyelids
    // that are animated with the "Blinks" animation should not be baked.)
  });
  return destMorphTargetInfluences;
}

// function findSceneGroup(object3D) {
//   if (object3D.name === "Scene" && object3D.type === "Group") {
//     return object3D;
//   }
//   if (!object3D.parent) {
//     return null;
//   }
//   return findSceneGroup(object3D.parent);
// }

function mergeSourceAttributes({ sourceAttributes }:any) {
  const propertyNames = new Set(); // e.g. ["normal", "position", "skinIndex", "skinWeight", "tangent", "uv", "uv2"]
  const allSourceAttributes = Array.from(sourceAttributes.values());
  allSourceAttributes.forEach((sourceAttributes:any) => {
    Object.keys(sourceAttributes).forEach((name) => propertyNames.add(name));
  });

  const destAttributes:any = {};
  // console.log("allSourceAttributes: " + allSourceAttributes)
  Array.from(propertyNames.keys()).map((name:any) => {
    destAttributes[name] = mergeAttributes(
      allSourceAttributes.map((sourceAttributes:any) => sourceAttributes[name]).flat()
    );
  });

  return destAttributes;
}

function mergeSourceMorphTargetDictionaries({ sourceMorphTargetDictionaries }:any) {
  const morphNames = new Set(); // e.g. ["MouthFlap", "Blink", "Eye Narrow", "Eye Rotation"]
  const allSourceDictionaries = Array.from(sourceMorphTargetDictionaries.values());
  allSourceDictionaries.forEach((dictionary:any) => {
    Object.keys(dictionary).forEach((name) => morphNames.add(name));
  });

  const destMorphTargetDictionary:any = {};
  Array.from(morphNames.keys()).map((name:any, i) => {
    destMorphTargetDictionary[name] = i;
  });

  return destMorphTargetDictionary;
}

function mergeSourceMorphAttributes({
  meshes,
  sourceMorphTargetDictionaries,
  sourceMorphAttributes,
  destMorphTargetDictionary,
}:any) {
  const propertyNameSet = new Set(); // e.g. ["position", "normal"]
  const allSourceMorphAttributes = Array.from(sourceMorphAttributes.values());
  allSourceMorphAttributes.forEach((sourceMorphAttributes:any) => {
    Object.keys(sourceMorphAttributes).forEach((name) => propertyNameSet.add(name));
  });

  const propertyNames = Array.from(propertyNameSet);
  const morphNames = Object.keys(destMorphTargetDictionary);

  const unmerged:any = {};
  propertyNames.forEach((propName:any) => {
    unmerged[propName] = [];
    Object.entries(destMorphTargetDictionary).forEach(([morphName, destMorphIndex]:[any,any]) => {
      unmerged[propName][destMorphIndex] = [];

      meshes.forEach((mesh:any) => {
        let bufferAttribute;
        const morphTargetDictionary = sourceMorphTargetDictionaries.get(mesh);
        if (morphTargetDictionary.hasOwnProperty(morphName)) {
          const sourceMorphIndex = morphTargetDictionary[morphName];
          bufferAttribute = mesh.geometry.morphAttributes[propName][sourceMorphIndex];
        } else {
          const attribute = mesh.geometry.attributes[propName];
          const array = new attribute.array.constructor(new Array(attribute.array.length).fill(0));
          bufferAttribute = new THREE.BufferAttribute(array, attribute.itemSize, attribute.normalized);
        }
        unmerged[propName][destMorphIndex].push(bufferAttribute);
      });
    });
  });

  const merged:any = {};
  propertyNames.forEach((propName:any) => {
    merged[propName] = [];
    Object.entries(destMorphTargetDictionary).forEach(([morphName, destMorphIndex]:[any,any]) => {
      merged[propName][destMorphIndex] = mergeAttributes(unmerged[propName][destMorphIndex]);
    });
  });

  return merged;
}

function mergeSourceIndices({ meshes }:any) {
  var indexOffset = 0;
  var mergedIndex: any[] = [];

  meshes.forEach((mesh:any) => {
    const index = mesh.geometry.index;

    for (var j = 0; j < index.count; ++j) {
      mergedIndex.push(index.getX(j) + indexOffset);
    }

    indexOffset += mesh.geometry.attributes.position.count;
  });

  return mergedIndex;
}

// function dedupBy(items, propName) {
//   const deduped = new Set();
//   items.forEach((item) => {
//     deduped.add(item[propName]);
//   });
//   return Array.from(deduped).map((value) => {
//     return items.find((item) => item[propName] === value);
//   });
// }

function CubicSplineFrameOffsets({ numMorphs }:any) {
  const frameSize = numMorphs * 3;
  return {
    frameSize,
    tanIn: 0,
    value: frameSize / 3,
    tanOut: (frameSize * 2) / 3,
  };
}

// remapMorphTrack
//
//   Remap tracks that animate morph target influences.
//
//   We assume the sourceTrack is
//   - using CubicSpline interpolation and
//   - animating morphTargetInfluences.
//
//   TODO: Support other interpolation types. (Adding linear should be easy.)
//
//   The values buffer of the sourceTrack contains a sequence of keyframes:
//
//   [ frame 0 | frame 1 | frame 2 | frame 3 ... ]
//
//   Each keyframe contains three numbers for each morph target (influence) of the sourceMesh:
//   - an inTangent (tanIn)
//   - an influence (value)
//   - an outTangent (tanOut)
//
//   Each frame orders the numbers by type: inTangents first, then values, then outTangents.
//   So if there are M morph targets, frame N will look like:
//   [
//     ...
//     |                              |                             |                                |
//     | tanIn_N_0, ... ,  tanIn_N_M, | value_N_0, ... , value_N_M, | tanOut_N_0,  ... , tanOut_N_M, |  // < -- frame N
//     |                              |                             |                                |
//     ...
//   ]
//
//   So for example, if the sourceMesh has 2 morph targets and the track has three keyframes, the values buffer contains:
//   [
//      tanIn_0_0, tanIn_0_1, value_0_0, value_0_1, tanOut_0_0, tanOut_0_1, // <-- Frame 0
//      tanIn_1_0, tanIn_1_1, value_1_0, value_1_1, tanOut_1_0, tanOut_1_1, // <-- Frame 1
//      tanIn_2_0, tanIn_2_1, value_2_0, value_2_1, tanOut_2_0, tanOut_2_1  // <-- Frame 2
//   ]
//
//   See the GLTF spec for details about how this is represented in GLTF:
//     https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#animations
//   See THREE's GLTFLoader for details about how this is loaded and represented in THREE:
//     https://github.com/mrdoob/three.js/blob/350f0a021943d6fa1d039a7c14c303653daa463f/examples/jsm/loaders/GLTFLoader.js#L3634
//
//   This function creates a new (dest) track that can will work with the combined (dest) mesh.
//   Each morph target influence index in the source mesh has a corresponding index in the dest mesh.
//   The dest mesh will have the sum of all the morph targets of its source meshes, so we will
//   insert several zeros into the track so the dest mesh's morphTargetInfluences that should not
//   be changed by this track are left alone.
//
//   Continuing the example above,
//   If the sourceMesh has two morph targets and sourceTrack has three keyframes,
//   and if the destMesh has three morph targets, then there will be some mapping
//   of morphTargetInfluences from source to dest:
//   {
//     sourceMorph0 -> destMorph2,
//     sourceMorph1 -> destMorph1
//   }
//
//   Assuming the same values buffer from before, the new values buffer will be:
//   [
//      0, tanIn_0_1, tanIn_0_0, 0, value_0_1, value_0_0, 0, tanOut_0_1, tanOut_0_0, // <-- Frame 0
//      0, tanIn_1_1, tanIn_1_0, 0, value_1_1, value_1_0, 0, tanOut_1_1, tanOut_1_0, // <-- Frame 1
//      0, tanIn_2_1, tanIn_2_0, 0, value_2_1, value_2_0, 0, tanOut_2_1, tanOut_2_0  // <-- Frame 2
//   ]
//
//   Notice that:
//   - zeroes have been inserted for destMorph0,
//   - the numbers associated with sourceMorph0 will now be associated with destMorph2, and
//   - the numbers associated with sourceMorph1 will now be associated with destMorph1
// function remapMorphTrack({ track, sourceMorphTargetDictionary, destMorphTargetDictionary }) {
//   const sourceOffsets = CubicSplineFrameOffsets({ numMorphs: Object.keys(sourceMorphTargetDictionary).length });
//   const destOffsets = CubicSplineFrameOffsets({ numMorphs: Object.keys(destMorphTargetDictionary).length });

//   const destKeyframes = [];
//   const numFrames = track.times.length;
//   const destMorphNames = Object.keys(destMorphTargetDictionary);
//   for (let frameIndex = 0; frameIndex < numFrames; frameIndex++) {
//     const sourceFrame = track.values.slice(
//       frameIndex * sourceOffsets.frameSize,
//       frameIndex * sourceOffsets.frameSize + sourceOffsets.frameSize
//     );
//     const destFrame: any[] = [];
//     destMorphNames.forEach((morphName) => {
//       const destMorphIndex = destMorphTargetDictionary[morphName];
//       const isMorphInSourceTrack = sourceMorphTargetDictionary.hasOwnProperty(morphName);
//       if (isMorphInSourceTrack) {
//         const sourceMorphIndex = sourceMorphTargetDictionary[morphName];
//         destFrame[destOffsets.tanIn + destMorphIndex] = sourceFrame[sourceOffsets.tanIn + sourceMorphIndex];
//         destFrame[destOffsets.value + destMorphIndex] = sourceFrame[sourceOffsets.value + sourceMorphIndex];
//         destFrame[destOffsets.tanOut + destMorphIndex] = sourceFrame[sourceOffsets.tanOut + sourceMorphIndex];
//       } else {
//         destFrame[destOffsets.tanIn + destMorphIndex] = 0;
//         destFrame[destOffsets.value + destMorphIndex] = 0;
//         destFrame[destOffsets.tanOut + destMorphIndex] = 0;
//       }
//     });
//     destKeyframes.push(destFrame);
//   }

//   const destTrackName = `${constants.combinedMeshName}.morphTargetInfluences`;
//   const destTrack = new THREE.NumberKeyframeTrack(destTrackName, track.times, destKeyframes.flat());

//   // Make sure the track will interpolate correctly
//   // (Copied from THREE.GLTFLoader : https://github.com/mrdoob/three.js/blob/350f0a021943d6fa1d039a7c14c303653daa463f/examples/jsm/loaders/GLTFLoader.js#L3634 )

//   // TODO
//   // destTrack.createInterpolant = function InterpolantFactoryMethodGLTFCubicSpline(result: any) {
//   //   return() => new GLTFCubicSplineInterpolant(this.times, this.values, this.getValueSize() / 3, result);
//   // };
//   // destTrack.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline = true;

//   return destTrack;
// }

// function remapKeyframeTrack({ track, sourceMorphTargetDictionaries, meshes, destMorphTargetDictionary }) {
//   if (track.name.endsWith("morphTargetInfluences")) {
//     return remapMorphTrack({
//       track,
//       sourceMorphTargetDictionary: sourceMorphTargetDictionaries.get(
//         meshes.find((mesh) => mesh.name === track.name.split(".")[0])
//       ),
//       destMorphTargetDictionary,
//     });
//   } else {
//     return track;
//   }
// }

// function remapAnimationClips({ animationClips, sourceMorphTargetDictionaries, meshes, destMorphTargetDictionary }) {
//   return animationClips.map(
//     (clip) =>
//       new THREE.AnimationClip(
//         clip.name,
//         clip.duration,
//         clip.tracks.map((track) =>
//           remapKeyframeTrack({ track, sourceMorphTargetDictionaries, meshes, destMorphTargetDictionary })
//         ),
//         clip.blendMode
//       )
//   );
// }

export function mergeGeometry({ meshes }:ThreeMesh) {
  console.log(meshes)
  const source = {
    meshes,
    attributes: new Map(meshes.map((m:any)  => [m, m.geometry.attributes])),
    morphAttributes: new Map(meshes.map((m:any) => [m, m.geometry.morphAttributes])),
    morphTargetDictionaries: new Map(meshes.map((m:any) => [m, m.morphTargetDictionary || {}])),
    morphTargetInfluences: new Map(meshes.map((m:any) => [m, m.morphTargetInfluences || []])),
    // animationClips: new Map(meshes.map((m:any) => [m, findSceneGroup(m).animations])),
  };

  meshes.forEach((element:any)=>{
    if(element.geometry.getAttribute('tangent') == null)
      element.geometry.computeTangents()
    console.log(element.geometry.attributes)
  })

  const attributes = mergeSourceAttributes({ sourceAttributes: source.attributes })
  const morphTargetDictionary = mergeSourceMorphTargetDictionaries({sourceMorphTargetDictionaries: source.morphTargetDictionaries,})
  const morphAttributes = mergeSourceMorphAttributes({
    meshes,
    sourceMorphAttributes: source.morphAttributes,
    sourceMorphTargetDictionaries: source.morphTargetDictionaries,
    destMorphTargetDictionary: morphTargetDictionary,
  });
  const morphTargetInfluences = mergeMorphTargetInfluences({
    meshes,
    sourceMorphTargetDictionaries: source.morphTargetDictionaries,
    destMorphTargetDictionary: morphTargetDictionary,
  });
  const index = mergeSourceIndices({ meshes });
  const dest:dest = {
    attributes: attributes,
    morphTargetDictionary: morphTargetDictionary,
    morphAttributes: morphAttributes,
    morphTargetInfluences: morphTargetInfluences,
    index : index
  };
  // dest.attributes = mergeSourceAttributes({ sourceAttributes: source.attributes });
  // const destMorphTargetDictionary = mergeSourceMorphTargetDictionaries({
  //   sourceMorphTargetDictionaries: source.morphTargetDictionaries,
  // });
  // dest.morphTargetDictionary = destMorphTargetDictionary;
  // dest.morphAttributes = mergeSourceMorphAttributes({
  //   meshes,
  //   sourceMorphAttributes: source.morphAttributes,
  //   sourceMorphTargetDictionaries: source.morphTargetDictionaries,
  //   destMorphTargetDictionary,
  // });
  // dest.morphTargetInfluences = mergeMorphTargetInfluences({
  //   meshes,
  //   sourceMorphTargetDictionaries: source.morphTargetDictionaries,
  //   destMorphTargetDictionary,
  // });
  // dest.index = mergeSourceIndices({ meshes });
  // dest.animations = remapAnimationClips({
  //   meshes,
  //   animationClips: dedupBy(Array.from(source.animationClips.values()).flat(), "name"),
  //   sourceMorphTargetDictionaries: source.morphTargetDictionaries,
  //   destMorphTargetDictionary,
  // });

  return { source, dest };
}
