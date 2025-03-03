import React from 'react';
import { Container } from "@mui/material";
import FemaleCategoriesVariants from './FemaleCategoriesVariants';
export interface Icon {
    id: string;
    src: string;
    alt: string;
    gltfPath: string;
    // Add any other properties if needed
  }
  
  export interface FemaleCustomizationPanelProps {
    onVariantClick: (gltfPath: string) => void;
    onIconClick: (icon: Icon) => void;
  }
  

  const FemaleCustomizationPanel: React.FC<FemaleCustomizationPanelProps> = ({ onVariantClick, onIconClick }) => {
    const handleVariantClick = (gltfPath: string) => {
      onVariantClick(gltfPath);
    };
  
    const handleIconClick = (icon: Icon) => {
      onIconClick(icon);
    };
  
    return (
      <div style={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
        <div style={{ flexGrow: 1, overflow: "hidden" }}>
          <Container
            maxWidth={false}
            component="footer"
            sx={{
              borderTop: (theme) => `1px solid ${theme.palette.divider}`,
              py: [1.5, 1.5],
              bgcolor: "#a4a6bd",
              display: "flex",
              flexDirection: "column",
              flexGrow: 1,
              minHeight: "30vh",
            }}
          >
            <FemaleCategoriesVariants onVariantClick={handleVariantClick} onIconClick={handleIconClick} />
          </Container>
        </div>
      </div>
    );
  };
  
export default FemaleCustomizationPanel