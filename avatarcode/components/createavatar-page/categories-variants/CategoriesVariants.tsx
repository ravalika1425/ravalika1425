import './CategoriesVariants.css';
import React, { useState, startTransition } from "react";
import jsonData from "./images.json"; 

export interface Icon {
  id: string;
  src: string;
  alt: string;
  gltfPath: string;
  // Add any other properties if needed
}

export interface CategoriesVariantsProps {
  onVariantClick: (gltfPath: string) => void;
  onIconClick: (icon: Icon) => void; 
}

const CategoriesVariants: React.FC<CategoriesVariantsProps> = ({ onVariantClick, onIconClick }) => {
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
            <button className="face" onClick={() => handleCategoryClick("headIcons")}>
              <svg className="categoryIconStyle" viewBox="0 0 2560 2560">
              <g><path d="M1089 2301 c-65 -44 -191 -163 -258 -244 -85 -105 -128 -200 -160 -352 -19 -94 -28 -108 -61 -101 -65 12 -80 -12 -119 -188 -34 -151 -38 -223 -16 -266 18 -36 44 -44 92 -31 20 6 39 8 42 5 3 -3 9 -81 12 -172 7 -179 13 -208 65 -319 53 -111 155 -188 321 -242 177 -58 311 -62 492 -15 119 31 199 70 278 134 50 40 69 64 97 123 52 111 58 140 65 319 3 91 9 169 13 173 4 4 23 2 42 -5 46 -15 72 -6 91 30 22 43 19 99 -16 260 -27 127 -35 148 -61 173 -24 23 -35 27 -62 22 -32 -7 -33 -6 -45 42 -49 190 -87 281 -155 377 -51 72 -220 236 -285 277 -44 28 -48 29 -186 29 -140 0 -142 0 -186 -29z"></path></g>
              </svg>
            </button>
          </div>
          <div className="categoryImg">
            <button className="shirt" onClick={() => handleCategoryClick("shirtIcons")}>
              <i className="fa-solid fa-shirt"></i>
            </button>
          </div>
          

          <div className="categoryImg">
            <button className="beard" onClick={() => handleCategoryClick("beardIcons")}>
              <svg className="categoryIconStyle" viewBox="0 0 2560 2560">
              <filter id="drop-shadow"><feGaussianBlur in="SourceAlpha" stdDeviation="4"></feGaussianBlur><feOffset dx="1" dy="1" result="offsetblur"></feOffset><feFlood flood-color="#B958AE" flood-opacity="0.75"></feFlood><feComposite in2="offsetblur" operator="in"></feComposite><feMerge><feMergeNode></feMergeNode><feMergeNode in="SourceGraphic"></feMergeNode></feMerge></filter><g><path d="M1055 2166 c-287 -47 -479 -156 -559 -317 -59 -118 -71 -193 -70 -444 1 -165 7 -282 27 -467 15 -136 27 -265 27 -288 0 -29 4 -40 15 -40 8 0 15 3 15 8 12 197 90 397 200 515 32 35 69 69 83 76 29 16 49 7 181 -82 136 -91 185 -110 292 -115 132 -6 179 10 284 98 129 109 184 129 248 96 70 -36 100 -93 157 -285 49 -167 77 -221 117 -221 15 0 18 8 18 45 0 25 12 179 26 342 18 216 24 346 22 473 -3 175 -3 176 -36 242 -80 164 -279 290 -547 349 -117 26 -385 34 -500 15z m130 -626 c36 -16 77 -30 91 -30 14 0 56 14 94 30 77 34 143 39 179 14 21 -15 23 -23 19 -74 -5 -71 -42 -134 -85 -144 -15 -3 -102 -9 -193 -12 -154 -7 -168 -6 -205 14 -22 11 -50 31 -62 44 -26 28 -48 108 -39 143 13 53 103 60 201 15z"></path></g>
              </svg>
            </button>
          </div>
          <div className="categoryImg">
            <button className="eye" onClick={() => handleCategoryClick("eyeIcons")}>
              <i className="fa-solid fa-eye"></i>
            </button>
          </div>
          
          <div className="categoryImg">
            <button className="glass" onClick={() => handleCategoryClick("glassIcons")}>
              <i className="fa-solid fa-glasses"></i>
            </button>
          </div>
        </div>
      </div>


      {selectedCategory === "headIcons" && (
        <ul className="variantWrapper">
          <li className="flex-container">
            {jsonData.headIcons.map((icon, index) => (
              <button className="variant-btn" key={index} onClick={() => handleVariantClick(icon.gltfPath, "head")}>
                <img className="variant" src={icon.src} alt={icon.alt} />
              </button>
            ))}
          </li>
        </ul>
      )}


      {selectedCategory === "shirtIcons" && (
        <ul className="variantWrapper">
          <li className="flex-container">
            {jsonData.shirtIcons.map((icon, index) => (
              <button className="variant-btn" key={index} onClick={() => handleVariantClick(icon.gltfPath,"outfit")}>
                <img className="variant" src={icon.src} alt={icon.alt} />
              </button>
            ))}
          </li>
        </ul>
      )}

      
      {selectedCategory === "beardIcons" && (
        <ul className="variantWrapper">
          <li className="flex-container">
            {jsonData.beardIcons.map((icon, index) => (
              <button className="variant-btn" key={index} onClick={() => handleVariantClick(icon.gltfPath, "beard")}>
                <img className="variant" src={icon.src} alt={icon.alt} />
              </button>
            ))}
          </li>
        </ul>
      )}
      {selectedCategory === 'eyeIcons' && (
        <ul className="variantWrapper">
          <li className="flex-container">
            {jsonData.eyeIcons.map((icon, index) => (
              <button className="variant-btn" key={index} onClick={() => handleVariantClick(icon.gltfPath, "eye")}>
                <img className="variant" src={icon.src} alt={icon.alt} />
              </button>
            ))}
          </li>
        </ul>
      )}
      {selectedCategory === 'glassIcons' && (
        <ul className="variantWrapper">
          <li className="flex-container">
            {jsonData.glassIcons.map((icon, index) => (
              <button className="variant-btn" key={index} onClick={() => handleVariantClick(icon.gltfPath,"glass")}>
                <img className="variant" src={icon.src} alt={icon.alt} />
              </button>
            ))}
          </li>
        </ul>
      )}
    </div>
  );
};

export default CategoriesVariants;
