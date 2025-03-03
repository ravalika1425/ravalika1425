import './FemaleCategoriesVariants';
import React, { useState, startTransition } from "react";
import jsonData from "../categories-variants/images.json";

export interface Icon {
    id: string;
    src: string;
    alt: string;
    gltfPath: string;
    // Add any other properties if needed
  }
  
  export interface FemaleCategoriesVariantsProps {
    onVariantClick: (gltfPath: string) => void;
    onIconClick: (icon: Icon) => void; 
  }
  const FemaleCategoriesVariants: React.FC<FemaleCategoriesVariantsProps> = ({ onVariantClick, onIconClick }) => {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const handleVariantClick = (gltfPath: string, type: string) => {
      startTransition(() => {
        onVariantClick(gltfPath);
      });
    };
    const handleCategoryClick = (category: string) => {
      setSelectedCategory(category);
      localStorage.setItem("Category", category);
    };
  return (
    <div>
        <div className="categoryWrapper">
            <div className="flex-container">
                <div className="categoryImg">
                    <button className="face"  onClick={() => handleCategoryClick("femaleheadIcons")}>
                    <svg className="categoryIconStyle" viewBox="0 0 2560 2560">
                    <g><path d="M1089 2301 c-65 -44 -191 -163 -258 -244 -85 -105 -128 -200 -160 -352 -19 -94 -28 -108 -61 -101 -65 12 -80 -12 -119 -188 -34 -151 -38 -223 -16 -266 18 -36 44 -44 92 -31 20 6 39 8 42 5 3 -3 9 -81 12 -172 7 -179 13 -208 65 -319 53 -111 155 -188 321 -242 177 -58 311 -62 492 -15 119 31 199 70 278 134 50 40 69 64 97 123 52 111 58 140 65 319 3 91 9 169 13 173 4 4 23 2 42 -5 46 -15 72 -6 91 30 22 43 19 99 -16 260 -27 127 -35 148 -61 173 -24 23 -35 27 -62 22 -32 -7 -33 -6 -45 42 -49 190 -87 281 -155 377 -51 72 -220 236 -285 277 -44 28 -48 29 -186 29 -140 0 -142 0 -186 -29z"></path></g>
                    </svg>
                    </button>
                </div>
                <div className="categoryImg">
                <button className="shirt"  onClick={() => handleCategoryClick("femaleshirtIcons")} style={{ background: 'none', border: 'none' }}>
                <i className="fa-solid fa-shirt"></i>
                </button>
                </div>
                <div className="categoryImg">
                <button className="eye" onClick={() => handleCategoryClick("femaleeyeIcons")}>
                <i className="fa-solid fa-eye"></i>
                </button>
                </div>
                <div className="categoryImg">
                <button className="glass" onClick={() => handleCategoryClick("femaleglassIcons")}>
                <i className="fa-solid fa-glasses"></i>
                </button>
                </div>
                <div className="categoryImg">
                <button className="hair" onClick={() => handleCategoryClick("hairIcons")} style={{border: 'none', background: 'none', padding: 0, cursor:'pointer'}}>
                    <svg className="CustomizationIcons_customizationIconActive__LL_Rr" width="35px" height="35px" viewBox="0 0 2650 2650" style={{ marginTop: '10px' }}>
                    <rect width="100%" height="100%" fill="none"/>
                        <g fill=' #6c6f78'><path d="M704 2483 c30 -99 34 -237 11 -328 -30 -115 -56 -156 -180 -281 -184 -186 -209 -262 -166 -514 11 -69 28 -172 36 -230 37 -249 83 -408 168 -575 41 -81 66 -116 131 -181 90 -91 149 -125 264 -156 67 -17 108 -20 312 -20 204 0 245 3 312 20 115 31 174 65 264 156 155 156 243 384 304 786 11 74 27 176 35 225 20 119 19 181 -3 253 -24 77 -65 135 -177 252 -177 186 -264 300 -291 383 -23 72 -29 76 -64 42 -75 -72 -107 -179 -95 -321 6 -80 7 -81 47 -112 98 -75 180 -226 198 -364 11 -82 10 -92 -13 -175 -14 -48 -37 -133 -51 -188 -45 -177 -106 -296 -208 -406 -38 -42 -54 -50 -143 -78 -107 -34 -144 -38 -149 -18 -41 132 -70 207 -131 333 -80 165 -135 240 -282 390 l-90 91 9 69 c16 120 104 276 196 346 39 30 40 33 47 107 15 176 -46 314 -204 454 -64 58 -97 72 -87 40z"></path></g>
                    </svg>
                </button>
                </div>
            </div>
        </div>

      {selectedCategory === "femaleheadIcons" && (
        <ul className="variantWrapper">
          <li className="flex-container">
            {jsonData.femaleheadIcons.map((icon, index) => (
              <button className="variant-btn" key={index} onClick={() => handleVariantClick(icon.gltfPath, "head")}>
                <img className="variant" src={icon.src} alt={icon.alt} />
              </button>
            ))}
          </li>
        </ul>
      )}

      {selectedCategory === "femaleshirtIcons" && (
        <ul className="variantWrapper">
          <li className="flex-container">
            {jsonData.femaleshirtIcons.map((icon, index) => (
              <button className="variant-btn" key={index} onClick={() => handleVariantClick(icon.gltfPath,"outfit")}>
                <img className="variant" src={icon.src} alt={icon.alt} />
              </button>
            ))}
          </li>
        </ul>
      )}

      {selectedCategory === 'femaleeyeIcons' && (
        <ul className="variantWrapper">
          <li className="flex-container">
            {jsonData.femaleeyeIcons.map((icon, index) => (
              <button className="variant-btn" key={index} onClick={() => handleVariantClick(icon.gltfPath, "eye")}>
                <img className="variant" src={icon.src} alt={icon.alt} />
              </button>
            ))}
          </li>
        </ul>
      )}

      {selectedCategory === 'femaleglassIcons' && (
        <ul className="variantWrapper">
          <li className="flex-container">
            {jsonData.femaleglassIcons.map((icon, index) => (
              <button className="variant-btn" key={index} onClick={() => handleVariantClick(icon.gltfPath,"glass")}>
                <img className="variant" src={icon.src} alt={icon.alt} />
              </button>
            ))}
          </li>
        </ul>
      )}

      {selectedCategory === 'hairIcons' && (
        <ul className="variantWrapper">
          <li className="flex-container">
            {jsonData.hairIcons.map((icon, index) => (
              <button className="variant-btn" key={index} onClick={() => handleVariantClick(icon.gltfPath,"hair")}>
                <img className="variant" src={icon.src} alt={icon.alt} />
              </button>
            ))}
          </li>
        </ul>
      )}

    </div>
  )
}

export default FemaleCategoriesVariants;