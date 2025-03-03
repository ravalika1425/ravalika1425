import React, {
  MouseEvent,
  useEffect,
  useLayoutEffect,
  useRef,
  useState
} from "react";
import { Card } from "reactstrap";
import rough from "roughjs";
import { ActionBar } from "../../component/action-bar/action-bar";
import { ControlPanel } from "../../component/control-panel/control-panel";
import { Info } from "../../component/info/info";
import { useHistory } from "../../hooks/useHistory";
import {
  ActionsType,
  ElementType,
  ExtendedElementType,
  PointType,
  SelectedElementType,
  Tools,
  ToolsType
} from "../../types";
import {
  createElement,
  cursorForPosition,
  drawElement,
  getElementAtPosition,
  resizedCoordinates
} from "../../utilities";
// import { LuEraser, LuPencil } from "react-icons/lu";
import { BoundingBox } from "Mike/models/response";
import { useEditable } from "./Contaxt";
// Save image screenshot inside useEditable
export default function AppDraw() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const initialTool: ToolsType = Tools.selection;
  const { elements, setElements, undo, redo } = useHistory([]);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [startPanMousePosition, setStartPanMousePosition] = useState({
    x: 0,
    y: 0
  });
  const [action, setAction] = useState<ActionsType>("none");
  const [tool, setTool] = useState<ToolsType>(initialTool);
  const [selectedElement, setSelectedElement] = useState<ElementType | null>();
  const [scale, setScale] = useState(1);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [selectedElements, setSelectedElements] = useState<ElementType[]>([]);
  const [multiSelectedElements, setMultiSelectedElements] = useState<
    ElementType[]
  >([]);
  const [multiSelectAction, setMultiSelectAction] = useState<ActionsType>("");
  const [
    startMultiSelectPanMousePosition,
    setStartMultiSelectPanMousePosition
  ] = useState<PointType>({ x: 0, y: 0 });
  const [uploadedImage, setUploadedImage] = useState<HTMLImageElement | null>(
    null
  );
  const [uploadedImagePosition, setUploadedImagePosition] = useState<PointType>(
    { x: 50, y: 0 }
  );
  const [uploadedImageSize, setUploadedImageSize] = useState({
    width: 800,
    height: 550
  });
  // const pressedKeys = usePressedKeys();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctx = useRef<CanvasRenderingContext2D | null>(null);

  const [boundingBoxes, setBoundingBoxes] = useState<BoundingBox[]>([]);
  const [currentBox, setCurrentBox] = useState<Partial<BoundingBox> | null>(
    null
  );
  const [isDragging, setIsDragging] = useState(false);
  const { imgData, handleScreenshot, handleBackClickPreview } = useEditable();
  const [editingImage, setEditingImage] = useState<HTMLImageElement | null>(
    null
  );
  // const [isResizingImage, setIsResizingImage] = useState(false);
  useLayoutEffect(() => {
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    const context = canvas.getContext("2d") as CanvasRenderingContext2D;
    const roughCanvas = rough.canvas(canvas);
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.save();
    context.scale(scale, scale);
    context.translate(panOffset.x, panOffset.y);
    const _canvas = canvasRef.current;
    if (!_canvas) return;
    ctx.current = _canvas.getContext("2d");
    if (!ctx.current) return;
    ctx.current.clearRect(0, 0, canvas.width, canvas.height);

    if (selectedImage && !editingImage) {
      console.log("Screenshot API Image Data in Appdraw ii", selectedImage);

      const img = new Image();
      img.src = selectedImage;
      img.onload = () => {
        ctx.current = context;
        ctx.current.drawImage(
          img,
          canvas.width / 2 - img.width / 2,
          canvas.height / 2 - img.height / 2,
          img.width,
          img.height
        );
        setEditingImage(img);
      };
    } else if (editingImage) {
      ctx.current.drawImage(
        editingImage,
        canvas.width / 2 - editingImage.width / 2,
        canvas.height / 2 - editingImage.height / 2,
        editingImage.width,
        editingImage.height
      );
    }

    if (uploadedImage) {
      console.log("Image uploaded");
      const { x, y } = uploadedImagePosition;
      const { width, height } = uploadedImageSize;
      context.drawImage(uploadedImage, x, y, width, height);
    }
    // Draw the elements on top of the screenshot or uploaded image
    elements.forEach((element) => {
      if (
        action === "writing" &&
        selectedElement &&
        selectedElement.id === element.id
      )
        return;
      drawElement(roughCanvas, context, element);
    });
    boundingBoxes.forEach((box) => {
      context.setLineDash([5, 5]);
      context.strokeStyle = "blue";
      context.strokeRect(box.x1, box.y1, box.x2 - box.x1, box.y2 - box.y1);
      context.fillStyle = "blue";
      context.font = "25px Arial";
      context.fillText(box.tag, box.x1, box.y1 - 5);

      // Draw remove button
      context.fillStyle = "red";
      context.beginPath();
      context.arc(box.x2, box.y1, 10, 0, 2 * Math.PI);
      context.fill();
      context.fillStyle = "white";
      context.font = "bold 16px Arial";
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.fillText("X", box.x2, box.y1);
    });
    // Draw current box being created
    if (tool === Tools.boundingBox && currentBox && isDragging) {
      context.strokeStyle = "red";
      context.lineWidth = 2;
      context.strokeRect(
        currentBox.x1 || 0,
        currentBox.y1 || 0,
        (currentBox.x2 || 0) - (currentBox.x1 || 0),
        (currentBox.y2 || 0) - (currentBox.y1 || 0)
      );
    }

    // Draw the elements on top of the screenshot or uploaded image

    context.restore();
  }, [
    elements,
    selectedImage,
    action,
    selectedElement,
    panOffset,
    scale,
    tool,
    uploadedImage,
    uploadedImagePosition,
    uploadedImageSize,
    boundingBoxes,
    currentBox,
    isDragging
  ]);

  useEffect(() => {
    setSelectedImage(imgData);
  }, [selectedImage, handleScreenshot]);

  const handleCursor = () => {
    switch (tool) {
      // case Tools.pan:
      //   return "grabbing";
      case Tools.selection:
        return "move";
      case Tools.rectangle:
        return "crosshair";
      case Tools.line:
        return "crosshair";
      case Tools.pencil:
        return "crosshair";
      case Tools.erease:
        return "crosshair";
      case Tools.text:
        return "text";
      case Tools.boundingBox:
        return "crosshair";
      default:
        return "default";
    }
  };

  useEffect(() => {
    const undoRedoFunction = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey) {
        if (event.key === "z") {
          if (event.shiftKey) {
            redo();
          } else {
            undo();
          }
        } else if (event.key === "y") {
          redo();
        }
      }
    };

    document.addEventListener("keydown", undoRedoFunction);
    return () => {
      document.removeEventListener("keydown", undoRedoFunction);
    };
  }, [undo, redo]);

  useEffect(() => {
    const textArea = textAreaRef.current;
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    canvas.style.cursor = handleCursor();
    if (action === "writing" && textArea && selectedElement) {
      setTimeout(() => {
        textArea.focus();
        textArea.value = selectedElement.text || "";
      }, 0);
    }
  }, [action, selectedElement, tool]);

  const updateElement = (
    id: number,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    type: ToolsType,
    options?: { text: string }
  ) => {
    const elementsCopy = [...elements];
    switch (type) {
      case Tools.line:
      case Tools.importImage:
      case Tools.rectangle: {
        elementsCopy[id] = createElement(id, x1, y1, x2, y2, type);
        break;
      }
      case Tools.pencil: {
        const existingPoints = elementsCopy[id].points || [];
        elementsCopy[id].points = [...existingPoints, { x: x2, y: y2 }];
        break;
      }
      case Tools.text: {
        const canvas = document.getElementById("canvas");
        if (!(canvas instanceof HTMLCanvasElement)) {
          throw new Error("Canvas element not found");
        }
        const context = canvas.getContext("2d");
        if (!context) {
          throw new Error("Could not get 2D context from canvas");
        }
        if (!options) {
          throw new Error("No text options provided for text tool");
        }
        const textWidth = context.measureText(options.text).width;
        const textHeight = 5;
        elementsCopy[id] = {
          ...createElement(id, x1, y1, x1 + textWidth, y1 + textHeight, type),
          text: options.text
        };
        break;
      }
      default:
        throw new Error(`Type not recognised: ${type}`);
    }
    setElements(elementsCopy, true);
  };

  const getMouseCoordinates = (event: MouseEvent<HTMLCanvasElement>) => {
    const canvas = event.currentTarget;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    // Calculate the mouse position relative to the canvas
    const mouseX = (event.clientX - rect.left) * scaleX;
    const mouseY = (event.clientY - rect.top) * scaleY;

    // Adjust for zoom and pan
    const adjustedX = (mouseX - panOffset.x) / scale;
    const adjustedY = (mouseY - panOffset.y) / scale;

    return { clientX: adjustedX, clientY: adjustedY };
  };

  //Handle erease Functionality
  const handleEraseElement = (x: number, y: number) => {
    // Find the element at the clicked coordinates
    const element = getElementAtPosition(x, y, elements);
    if (element) {
      // Remove the element from the elements array
      const updatedElements = elements.filter((el) => el.id !== element.id);
      setElements(updatedElements);
    }
  };
  const handleMouseDown = (event: MouseEvent<HTMLCanvasElement>) => {
    if (action === "writing") return;

    const { clientX, clientY } = getMouseCoordinates(event);
    if (tool === Tools.erease) {
      handleEraseElement(clientX, clientY);
      return;
    }

    const clickedBoxIndex = boundingBoxes.findIndex((box) => {
      const removeButtonRadius = 10; // Adjust this value based on your UI
      const dx = clientX - box.x2;
      const dy = clientY - box.y1;
      return Math.sqrt(dx * dx + dy * dy) <= removeButtonRadius;
    });

    if (clickedBoxIndex !== -1) {
      // Remove the clicked bounding box
      setBoundingBoxes((prevBoxes) => {
        const newBoxes = [...prevBoxes];
        newBoxes.splice(clickedBoxIndex, 1);
        console.log("Bounding box removed. Updated boxes:", newBoxes);
        return newBoxes;
      });
      return; // Exit the function after removing the box
    }

    if (tool === Tools.boundingBox) {
      setCurrentBox({ x1: clientX, y1: clientY, x2: clientX, y2: clientY });
      setIsDragging(true);
      return;
    }
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

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

    if (uploadedImage) {
      const { x, y } = uploadedImagePosition;
      const { width, height } = uploadedImageSize;

      if (
        clientX >= x &&
        clientX <= x + width &&
        clientY >= y &&
        clientY <= y + height
      ) {
        // Check if the click is near the bottom-right corner for resizing
      }
    }

    if (tool === Tools.selection) {
      const element = getElementAtPosition(clientX, clientY, elements);
      if (element) {
        let selectedElement: SelectedElementType = { ...element };

        if (element.type === "pencil" && element.points) {
          const xOffsets = element.points.map((point) => clientX - point.x);
          const yOffsets = element.points.map((point) => clientY - point.y);
          selectedElement = { ...selectedElement, xOffsets, yOffsets };
        } else {
          const offsetX = clientX - selectedElement.x1;
          const offsetY = clientY - selectedElement.y1;
          selectedElement = { ...selectedElement, offsetX, offsetY };
        }

        setSelectedElement(selectedElement);
        setElements((prevState) => prevState);

        if (element.position === "inside") {
          setAction("moving");
        } else {
          setAction("resizing");
        }
      }
    } else {
      const id = elements.length;
      const newElement = createElement(
        id,
        clientX,
        clientY,
        clientX,
        clientY,
        tool
      );
      setElements((prevState) => [...prevState, newElement]);
      setSelectedElement(newElement);
      setAction(tool === "text" ? "writing" : "drawing");
    }
  };

  const handleMouseMove = (event: MouseEvent<HTMLCanvasElement>) => {
    const { clientX, clientY } = getMouseCoordinates(event);

    if (tool === Tools.boundingBox && isDragging && currentBox) {
      setCurrentBox((prev) => ({ ...prev, x2: clientX, y2: clientY }));
      return;
    }

    if (action === "panning") {
      const deltaX = clientX - startPanMousePosition.x;
      const deltaY = clientY - startPanMousePosition.y;
      setPanOffset({
        x: panOffset.x + deltaX,
        y: panOffset.y + deltaY
      });
      return;
    }

    if (!isDragging || !currentBox) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    setCurrentBox((prev) => ({ ...prev, x2: x, y2: y }));

    if (multiSelectAction === "panning") {
      const deltaX = clientX - startMultiSelectPanMousePosition.x;
      const deltaY = clientY - startMultiSelectPanMousePosition.y;
      setPanOffset({
        x: panOffset.x + deltaX,
        y: panOffset.y + deltaY
      });
      return;
    }

    if (
      multiSelectAction === "multi_moving" &&
      multiSelectedElements.length > 0
    ) {
      const deltaX = clientX - startMultiSelectPanMousePosition.x;
      const deltaY = clientY - startMultiSelectPanMousePosition.y;
      const updatedElements = elements.map((element) => {
        if (
          multiSelectedElements.some((selected) => selected.id === element.id)
        ) {
          return {
            ...element,
            x1: element.x1 + deltaX,
            x2: element.x2 + deltaX,
            y1: element.y1 + deltaY,
            y2: element.y2 + deltaY
          };
        }
        return element;
      });
      setElements(updatedElements);
      setStartMultiSelectPanMousePosition({ x: clientX, y: clientY });
      return;
    }

    if (tool === Tools.selection) {
      const element = getElementAtPosition(clientX, clientY, elements);

      if (element && element.position) {
        (event.target as HTMLElement).style.cursor = cursorForPosition(
          element.position
        );
      } else {
        (event.target as HTMLElement).style.cursor = "default";
      }
    }

    if (action === "moving" && selectedElements.length > 0) {
      const deltaX = clientX - startPanMousePosition.x;
      const deltaY = clientY - startPanMousePosition.y;
      const updatedElements = elements.map((element) => {
        if (selectedElements.some((selected) => selected.id === element.id)) {
          return {
            ...element,
            x1: element.x1 + deltaX,
            x2: element.x2 + deltaX,
            y1: element.y1 + deltaY,
            y2: element.y2 + deltaY
          };
        }
        return element;
      });
      setElements(updatedElements);
      setStartPanMousePosition({ x: clientX, y: clientY });
      return;
    }

    if (action === "drawing") {
      const index = elements.length - 1;
      const { x1, y1 } = elements[index];
      updateElement(index, x1, y1, clientX, clientY, tool);
    } else if (action === "moving" && selectedElement) {
      if (
        selectedElement.type === "pencil" &&
        "points" in selectedElement &&
        "xOffsets" in selectedElement &&
        "yOffsets" in selectedElement
      ) {
        const extendedElement = selectedElement as ExtendedElementType;
        const newPoints = extendedElement.points!.map((_, index) => ({
          x: clientX - extendedElement.xOffsets![index],
          y: clientY - extendedElement.yOffsets![index]
        }));
        const elementsCopy = [...elements];
        elementsCopy[extendedElement.id] = {
          ...elementsCopy[extendedElement.id],
          points: newPoints
        };
        setElements(elementsCopy, true);
      } else {
        const { id, x1, x2, y1, y2, type, offsetX, offsetY } =
          selectedElement as ExtendedElementType;
        const safeOffsetX = offsetX ?? 0;
        const safeOffsetY = offsetY ?? 0;
        const newX1 = clientX - safeOffsetX;
        const newY1 = clientY - safeOffsetY;
        const newX2 = newX1 + (x2 - x1);
        const newY2 = newY1 + (y2 - y1);
        const options =
          type === "text" && selectedElement.text
            ? { text: selectedElement.text }
            : undefined;
        updateElement(id, newX1, newY1, newX2, newY2, type, options);
      }
    } else if (
      action === "resizing" &&
      selectedElement &&
      selectedElement.position
    ) {
      const { id, type, position, ...coordinates } =
        selectedElement as ExtendedElementType;

      if (typeof position === "string") {
        const { x1, y1, x2, y2 } = resizedCoordinates(
          clientX,
          clientY,
          position,
          coordinates
        );
        updateElement(id, x1, y1, x2, y2, type);
      }
    }
  };
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      console.log("Datta from Image", img);
      img.onload = () => {
        const canvas = document.getElementById("canvas") as HTMLCanvasElement;
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;

        let width = img.width;
        let height = img.height;

        // Scale the image to fit within the canvas dimensions
        if (width > canvasWidth || height > canvasHeight) {
          const widthRatio = canvasWidth / width;
          const heightRatio = canvasHeight / height;
          const minRatio = Math.min(widthRatio, heightRatio);

          width *= minRatio;
          height *= minRatio;
        }

        setUploadedImage(img);
        setUploadedImageSize({ width, height });
        setUploadedImagePosition({
          x: (canvasWidth - width) / 2,
          y: (canvasHeight - height) / 2
        });
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleMouseUp = (event: MouseEvent<HTMLCanvasElement>) => {
    const { clientX, clientY } = getMouseCoordinates(event);

    if (tool === Tools.boundingBox && isDragging && currentBox) {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const x1 = Math.min(currentBox.x1 || 0, clientX);
      const y1 = Math.min(currentBox.y1 || 0, clientY);
      const x2 = Math.max(currentBox.x1 || 0, clientX);
      const y2 = Math.max(currentBox.y1 || 0, clientY);
      const width = x2 - x1;
      const height = y2 - y1;

      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = width;
      tempCanvas.height = height;
      const tempCtx = tempCanvas.getContext("2d");

      if (tempCtx) {
        tempCtx.drawImage(canvas, x1, y1, width, height, 0, 0, width, height);
        const dataUri = tempCanvas.toDataURL("image/png");

        const tag = prompt("Enter a tag for this bounding box:") || "Untitled";

        const newBox: BoundingBox = {
          id: Date.now(),
          x1,
          y1,
          x2,
          y2,
          tag,
          dataUri
        };

        setBoundingBoxes((prev) => {
          const updatedBoxes = [...prev, newBox];
          console.log("New Bounding Box:", newBox);
          console.log("Updated Bounding Boxes:", updatedBoxes);
          return updatedBoxes;
        });
      }

      setCurrentBox(null);
      setIsDragging(false);
    }

    if (action === "writing") {
      return;
    }

    if (action === "panning") {
      document.body.style.cursor = "pen";
    }
    if (multiSelectAction === "multi_moving") {
      setMultiSelectAction("");
    }
    document.body.style.cursor = "default";

    setAction("none");
    setSelectedElement(null);
  };

  const handleBlur = (event: React.FocusEvent<HTMLTextAreaElement>) => {
    if (selectedElement) {
      const { id, x1, y1, type } = selectedElement;

      const x2 = selectedElement.x2 || x1;
      const y2 = selectedElement.y2 || y1;

      setAction("none");
      setSelectedElement(null);
      updateElement(id, x1, y1, x2, y2, type, { text: event.target.value });
    } else {
      console.error("No element selected when handleBlur was called");
    }
  };

  const onZoom = (delta: number) => {
    setScale((prevState) => Math.min(Math.max(prevState + delta, 0.1), 20));
  };

  const handleZoom = (event: React.WheelEvent<HTMLCanvasElement>) => {
    if (event.shiftKey) {
      event.preventDefault();
      const { deltaY } = event;
      const zoomFactor = 0.001; // Adjust zoom factor
      const newScale = scale * (1 - deltaY * zoomFactor);
      setScale(Math.min(Math.max(0.1, newScale), 2)); // Limit scale between 0.1 and 5
    }
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.shiftKey && (event.key === "+" || event.key === "-")) {
      event.preventDefault();
      const step = event.key === "+" ? 0.1 : -0.1;
      const newScale = scale + step;
      setScale(Math.min(Math.max(0.1, newScale))); // Limit scale between 0.1 and 5
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [scale]);

  return (
    <React.Fragment>
      <div className="page-content">
        <Card>
          <Info />
          <ActionBar
            tool={tool}
            setTool={setTool}
            handleImageUpload={handleImageUpload}
          />

          <ControlPanel
            undo={undo}
            redo={redo}
            onZoom={onZoom}
            scale={scale}
            setScale={setScale}
          />
          {action === "writing" ? (
            <textarea
              ref={textAreaRef}
              onBlur={handleBlur}
              className="textArea"
              style={{ font: `${24 * scale}px sans-serif` }}
            />
          ) : null}
          <i
            style={{
              position: "absolute",
              top: "30px",
              left: "25px",
              padding: "7px 11px",
              fontSize: "24px",
              cursor: "pointer"
            }}
            className="ri-arrow-left-line rounded-pill shadow-lg back-btn"
            onClick={handleBackClickPreview}
          ></i>

          <canvas
            id="canvas"
            ref={canvasRef}
            width={window.innerWidth}
            height={window.innerHeight}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onWheel={handleZoom}
            style={{ border: "1px solid #ccc", height: "80vh" }}
          />
        </Card>
      </div>
    </React.Fragment>
  );
}
