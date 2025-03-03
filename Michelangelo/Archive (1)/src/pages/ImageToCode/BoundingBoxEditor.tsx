import React, { useRef, useState, useEffect } from "react";
import {
  Button,
  Card,
  Input,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "reactstrap";
import { useEditable } from "./Contaxt";
import { BoundingBox } from "Mike/models/response";
const CanvasEditor: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [boundingBoxes, setBoundingBoxes] = useState<BoundingBox[]>([]);
  const [currentBox, setCurrentBox] = useState<Partial<BoundingBox> | null>(
    null
  );
  const [isDragging, setIsDragging] = useState(false);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const {
    imageURI,
    handleBackClickImgDropper,
  } = useEditable();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempBox, setTempBox] = useState<Partial<BoundingBox> | null>(null);
  const [tagName, setTagName] = useState("");

  useEffect(() => {
    if (imageURI) {
      const img = new Image();
      img.src = imageURI;
      img.onload = () => {
        setImage(img);
      };
    }
  }, [imageURI]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (image) {
      const scaleFactor = Math.min(
        canvas.width / image.width,
        canvas.height / image.height
      );
      const newWidth = image.width * scaleFactor;
      const newHeight = image.height * scaleFactor;
      const x = (canvas.width - newWidth) / 2;
      const y = (canvas.height - newHeight) / 2;
      ctx.drawImage(image, x, y, newWidth, newHeight);
    }

    // Draw existing bounding boxes
    boundingBoxes.forEach((box) => {
      ctx.setLineDash([5, 5]);
      ctx.strokeStyle = "blue";
      ctx.strokeRect(box.x1, box.y1, box.x2 - box.x1, box.y2 - box.y1);
      ctx.fillStyle = "blue";
      ctx.font = "25px Arial";
      ctx.fillText(box.tag, box.x1, box.y1 - 5);

      // Draw remove button
      ctx.fillStyle = "red";
      ctx.beginPath();
      ctx.arc(box.x2, box.y1, 10, 5, 10 * Math.PI);
      ctx.fill();
      ctx.fillStyle = "black";
      ctx.font = "12px Arial";
      ctx.fillText("X", box.x2 - 3, box.y1 + 3);
    });

    // Draw current box being created
    if (currentBox && isDragging) {
      ctx.strokeStyle = "red";
      ctx.lineWidth = 2;
      ctx.strokeRect(
        currentBox.x1 || 0,
        currentBox.y1 || 0,
        (currentBox.x2 || 0) - (currentBox.x1 || 0),
        (currentBox.y2 || 0) - (currentBox.y1 || 0)
      );
    }
  }, [boundingBoxes, currentBox, isDragging, image]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check if clicking on a remove button
    const clickedBox = boundingBoxes.find(
      (box) => Math.sqrt(Math.pow(x - box.x2, 2) + Math.pow(y - box.y1, 2)) <= 6
    );

    if (clickedBox) {
      setBoundingBoxes((boxes) =>
        boxes.filter((box) => box.id !== clickedBox.id)
      );
    } else {
      setCurrentBox({ x1: x, y1: y, x2: x, y2: y });
      setIsDragging(true);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging || !currentBox) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setCurrentBox((prev) => ({ ...prev, x2: x, y2: y }));
  };

  const handleMouseUp = () => {
    if (!isDragging || !currentBox) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const x1 = Math.min(currentBox.x1 || 0, currentBox.x2 || 0);
    const y1 = Math.min(currentBox.y1 || 0, currentBox.y2 || 0);
    const x2 = Math.max(currentBox.x1 || 0, currentBox.x2 || 0);
    const y2 = Math.max(currentBox.y1 || 0, currentBox.y2 || 0);
    const width = x2 - x1;
    const height = y2 - y1;

    // Create a temporary canvas to hold the selected area
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = width;
    tempCanvas.height = height;
    const tempCtx = tempCanvas.getContext("2d");

    if (tempCtx) {
      // Draw the selected portion of the main canvas onto the temporary canvas
      tempCtx.drawImage(canvas, x1, y1, width, height, 0, 0, width, height);

      // Convert the temporary canvas to a data URI
      const dataUri = tempCanvas.toDataURL("image/png");

      setTempBox({ x1, y1, x2, y2, dataUri });
      setIsModalOpen(true);
    }

    setCurrentBox(null);
    setIsDragging(false);
  };


  const handleModalCancel = () => {
    setIsModalOpen(false);
    setTempBox(null);
    setTagName("");
  };
  const handleModalSubmit = () => {
    if (tempBox) {
      const newBox: BoundingBox = {
        id: Date.now(),
        x1: tempBox.x1!,
        y1: tempBox.y1!,
        x2: tempBox.x2!,
        y2: tempBox.y2!,
        tag: tagName || "Untitled",
        dataUri: tempBox.dataUri!,
      };

      setBoundingBoxes((prev) => {
        const updatedBoxes = [...prev, newBox];
        console.log("Updated Bounding Boxes:", updatedBoxes);
        return updatedBoxes;
      });
    }

    setIsModalOpen(false);
    setTempBox(null);
    setTagName("");
  };

  return (
    <React.Fragment>
      <Card>
        <div
          className="page-content"
          style={{ margin: "90px 15px 15px 15px", border: "1px solid #ccc" }}
        >
          <div
            className="border-black"
            style={{
              position: "fixed",
              top: "14%",
              left: "17%",
              padding: "8px",
              fontSize: "24px",
            }}
          >
            <i
              aria-label="back buttton"
              className="px-3 py-3 mx-2 ri-arrow-left-line rounded-pill shadow-lg back-btn"
              onClick={handleBackClickImgDropper}
              style={{ cursor: "pointer" }}
            ></i>
          </div>
          <canvas
            ref={canvasRef}
            width={window.innerWidth}
            height={window.innerHeight}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          />
        </div>
      </Card>
      <Modal isOpen={isModalOpen} toggle={handleModalCancel}>
        <ModalHeader toggle={handleModalCancel}>Enter tag name</ModalHeader>
        <ModalBody>
          <Input
            type="text"
            value={tagName}
            onChange={(e) => setTagName(e.target.value)}
            placeholder="Enter a tag for this bounding box"
          />
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleModalSubmit}>
            OK
          </Button>{" "}
          <Button color="secondary" onClick={handleModalCancel}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </React.Fragment>
  );
};

export default CanvasEditor;
