import React, { ChangeEvent } from "react";
import { Tools, ToolsType } from "../../types";
import { LuEraser, LuPencil } from "react-icons/lu";
import { FiBox, FiMinus, FiMousePointer, FiSquare } from "react-icons/fi";
import { IoHandRightOutline, IoText } from "react-icons/io5";
import { UploadFileRounded } from "@mui/icons-material";
import "./action-bar-style.css";

type ActionBarProps = {
  tool: ToolsType;
  setTool: (tool: ToolsType) => void;
  handleImageUpload: (event: ChangeEvent<HTMLInputElement>) => void;
};

export function ActionBar({
  tool,
  setTool,
  handleImageUpload,
}: ActionBarProps) {
  const handleImageButtonClick = () => {
    const fileInput = document.getElementById(
      "imageUploadInput"
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  };

  return (
    <div className="actionBar">
      {Object.values(Tools).map((t, index) => (
        <div
          className={`inputWrapper ${tool === t ? "selected" : ""}`}
          key={t}
          onClick={() => setTool(t)}
        >
          <input
            className="inputStyle"
            type="radio"
            id={t}
            checked={tool === t}
            onChange={() => setTool(t)}
            readOnly
          />
          <label className="labelStyle" htmlFor={t}>
            {t}
          </label>
          {t === "boundingBox" && <FiBox />}
          {t === "pan" && <IoHandRightOutline />}
          {t === "selection" && <FiMousePointer />}
          {t === "rectangle" && <FiSquare />}
          {t === "line" && <FiMinus />}
          {t === "erease" && <LuEraser />}
          {t === "pencil" && <LuPencil />}
          {t === "text" && <IoText />}
          {t === "importImage" && (
            <>
              <UploadFileRounded onClick={handleImageButtonClick} />
              <input
                className="inputStyle"
                type="file"
                id="imageUploadInput"
                accept="image/*"
                onChange={handleImageUpload}
              />
            </>
          )}
          <span className="span-style">{index + 1}</span>
        </div>
      ))}
    </div>
  );
}