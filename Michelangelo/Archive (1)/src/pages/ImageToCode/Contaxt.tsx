import axios from "axios";
import html2canvas from "html2canvas";
import { ADD_IMAGE_TO_CODE, EDIT_IMAGE_TO_CODE, EXISTING_I2C_PROJECT, GET_SCREENSHOT, IMAGE_TO_CODE, IMAGE_TO_CODE_MODERNISE, NEW_I2C_PROJECT } from "Mike/constants";
import { axiosInstance } from "Mike/utils/axiosConfig";
import React, {
  ChangeEvent,
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState
} from "react";
import { useMsal } from "@azure/msal-react";
import { addImageToCode, addImagetoCodeProject, editImageToCode, getCodeForEditImage, getImageToCode, getScreenshot } from "services/imageToCodeServices";

interface EditableContextType {
  isEditable: boolean;
  setIsEditable: (isEditable: boolean) => void;
  handleScreenshot: () => Promise<void>;
  imgData: string | null;
  showAppComponent: string;
  setShowAppComponent: React.Dispatch<React.SetStateAction<string>>;
  handleNextClickPreview: () => void;
  handleBackClickPreview: () => void;
  handleNextClickCanvas: () => void;
  handleBackClickImgDropper: () => void;
  showAppDrawComponent: string;

  handleAcceptedFiles: (files: any[]) => void;
  deleteImage: (index: number) => void;
  selectedFiles: any[];
  isNextButtonEnabled: boolean;
  uploadedImage: string | null;
  imageURI: string | null;
  handleChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  handleGenerateCode: () => Promise<void>;
  inputValue: string;
  apiResponse: string;
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  loading: boolean;
  handleDownloadImage: () => void;
  dataURIEdited: string | null;
  handleSaveEditedScreenshot: () => void;
  handleGenerateCodeForEditedImage: () => Promise<void>;
  currentComponent: string;
  setCurrentComponent: React.Dispatch<React.SetStateAction<string>>;
  history: string[];
  error: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  selectedButton: string;
  setSelectedButton: React.Dispatch<React.SetStateAction<string>>;
  setApiResponse: React.Dispatch<React.SetStateAction<string>>;
  handleEditScreenshot: () => void;
  isEditButtonDisabled: boolean;
  setScreenshotsData: React.Dispatch<React.SetStateAction<any[]>>;
  setIsSendButtonDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  isSendButtonDisabled: boolean;
  setHistory: React.Dispatch<React.SetStateAction<string[]>>;
  cancelGetScreenshot: (() => void) | null;
  handleBoundingBoxEditor: () => void;
  setCancelGetScreenshot: React.Dispatch<
    React.SetStateAction<(() => void) | null>
  >;
  setImageURI: React.Dispatch<React.SetStateAction<string | null>>;
  handleCloseClick: () => void;
  handleOpenCard: () => void;
  closeCard: boolean;
  projectName: string;
  setProjectName: React.Dispatch<React.SetStateAction<string>>;
  handleSubmitAppname: () => void;
  loadingMessage: string;
  togglePrviewAllProjectModal: () => void;
  setLoadingMessage: React.Dispatch<React.SetStateAction<string>>;
  handleAddProjectName: (projectName: string, category: string, code?:string | null, image?:string | null) => void;
  addProjectNameModalOpen: boolean;
  setAddProjectNameModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  previewAllprojectModalOpen: boolean;
  setPreviewAllProjectModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  toggleAddProjectNameModal: () => void;
  handleEditMergedProjectData: (generatedCode: any) => Promise<void>;
  currentHistoryData: string;
  setCurrentHistroryData: React.Dispatch<React.SetStateAction<string>>;
  isAlertModalOpen: boolean;
  setIsAlertModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  category: string;
  setCategory: React.Dispatch<React.SetStateAction<string>>;
  setErrors: React.Dispatch<
    React.SetStateAction<{
      [key: string]: string;
    }>
  >;
  errors: {
    [key: string]: string;
  };
  setCurr_ProjectId: React.Dispatch<React.SetStateAction<string>>;
  curr_projectId: string;
  setSelectedCode: React.Dispatch<React.SetStateAction<string | null>>;
  selectedCode: string | null;
  projectNameData:any;
}

const EditableContext = createContext<EditableContextType | undefined>(
  undefined
);

export const useEditable = (): EditableContextType => {
  const context = useContext(EditableContext);
  if (!context) {
    throw new Error("useEditable must be used within an EditableProvider");
  }
  return context;
};

export const EditableProvider: React.FC<{ children: ReactNode }> = ({
  children
}) => {
  const [isEditable, setIsEditable] = useState<boolean>(false);
  const [imgData, setImgData] = useState<string | null>(null);
  const [showAppComponent, setShowAppComponent] =
    useState<string>("ImageDropper");
  const [showAppDrawComponent] = useState<string>("");

  //State for Image Dropper
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isNextButtonEnabled, setIsNextButtonEnabled] = useState<boolean>(true);
  const [selectedFiles, setSelectedFiles] = useState<any[]>([]);
  const [imageURI, setImageURI] = useState<string | null>(null);

  const [inputValue, setInputValue] = useState<string>(
    "Convert the given image into code"
  );
  const [apiResponse, setApiResponse] = useState<string>("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedButton, setSelectedButton] = useState("computer");
  //state for AppDraw Component
  const [dataURIEdited] = useState<string | null>(null);
  // In your context or parent component
  const [history, setHistory] = useState<string[]>([]);
  const [currentComponent, setCurrentComponent] =
    useState<string>("ImageDropper");
  // Handling Error page
  const [error, setError] = useState<string | null>(null);
  const [screenshotsData, setScreenshotsData] = useState<any[]>([]);
  const [canvasScreenshot, setCanvasScreenshot] = useState("");
  const [isEditButtonDisabled, setIsEditButtonDisabled] = useState(false);
  const [isSendButtonDisabled, setIsSendButtonDisabled] = useState(false);
  const [closeCard, setCloseCard] = useState(true);
  const [projectName, setProjectName] = useState<string>("");
  const [addProjectNameModalOpen, setAddProjectNameModalOpen] =
    useState<boolean>(false);
  const [previewAllprojectModalOpen, setPreviewAllProjectModalOpen] =
    useState<boolean>(true);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [currentHistoryData, setCurrentHistroryData] = useState<string>("");
  const [curr_projectId, setCurr_ProjectId] = useState<string>("");
  const [projectNameData, setProjectNameData] = useState<any>(null);
  const [selectedCode, setSelectedCode] = useState<string | null>(null);

  // let screenshotsData: any[] = [];
  const [cancelGetScreenshot, setCancelGetScreenshot] = useState<
    (() => void) | null
  >(null);
  // const [projectName, setProjectName] = useState<string>("");
  const [isAlertModalOpen, setIsAlertModalOpen] = useState<boolean>(false);

  const [category, setCategory] = useState("");

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!projectName.trim()) newErrors.projectName = "Project name is required";
    if (!category.trim()) newErrors.category = "Project type  is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  // console.log("Screnshot Data for three devices", screenshotsData);
  const { accounts } = useMsal();

  const handleScreenshot = async () => {
    console.log(
      "Automatically handle the API for Screenshot Data dependent on apiResponse"
    );

    if (cancelGetScreenshot) {
      cancelGetScreenshot(); // Cancel any previous screenshot request if in progress
    }

    const source = axios.CancelToken.source();
    setCancelGetScreenshot(() => source.cancel);
    const apiPayload = { userSignature:accounts[0].username ,  html_content: apiResponse };

    try {
      // const response = await axiosInstance.post(GET_SCREENSHOT, apiPayload, {
      //   cancelToken: source.token
      // });

      const response = await getScreenshot(apiPayload);

      if (response.data.screenshots) {
        const { mobile, tablet, monitor } = response.data.screenshots;

        setScreenshotsData([
          { device: "mobile", data: mobile },
          { device: "tablet", data: tablet },
          { device: "monitor", data: monitor }
        ]);
        setIsEditButtonDisabled(true);
        console.log("Updated Screenshot Data:", screenshotsData);
      } else {
        console.error("Error response data:", response.data);
        setError("Failed to get a valid response from the server.");
        setIsEditButtonDisabled(false);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Error in API call:", error.message);
        if (error.response) {
          console.error("Error status:", error.response.status);
          console.error("Error data:", error.response.data);
        }
        setIsEditButtonDisabled(false);
      } else {
        console.error("Unexpected error:", error);
        setIsEditButtonDisabled(false);
      }
      // If API call fails, use html2canvas to capture a screenshot
      try {
        const iframe = document.getElementById(
          "preview-iframe"
        ) as HTMLIFrameElement;

        if (iframe) {
          const iframeDoc =
            iframe.contentDocument || iframe.contentWindow?.document;
          if (iframeDoc) {
            const body = iframeDoc.body;
            setIsEditButtonDisabled(true);

            // Use html2canvas to capture the iframe body content
            const canvas = await html2canvas(body);
            const imgData = canvas.toDataURL("image/png");
            console.log("Screenshot data over failed APi", imgData);
            setCanvasScreenshot(imgData);

            // Set screenshotsData with the html2canvas result

            setScreenshotsData([{ device: "computer", data: imgData }]);

            console.log("Captured Screenshot using html2canvas:", imgData);
            console.log(
              "Captured Screenshot using in state ScreeenShotData:",
              screenshotsData
            );
          }
        } else {
          throw new Error("Iframe element not found.");
        }
      } catch (canvasError) {
        console.error(
          "Error capturing screenshot with html2canvas:",
          canvasError
        );
        setIsEditButtonDisabled(false);
        // setError("Failed to capture screenshot using html2canvas.");
      }
    }
  };

  useEffect(() => {
    const checkIfScreenshotDataExists = () => {
      let selectedImageData;

      if (screenshotsData) {
        if (selectedButton === "computer") {
          selectedImageData = screenshotsData.find(
            (item) => item.device === "monitor"
          );
          console.log("selectedImageData", selectedImageData);
        } else if (selectedButton === "smartphone") {
          selectedImageData = screenshotsData.find(
            (item) => item.device === "mobile"
          );
        } else if (selectedButton === "tablet") {
          selectedImageData = screenshotsData.find(
            (item) => item.device === "tablet"
          );
        }
      }
    };

    checkIfScreenshotDataExists();
  }, [selectedButton, screenshotsData]);

  const handleEditScreenshot = () => {
    let selectedImageData;
    setLoading(true);
    console.log("Selected button:", selectedButton);
    console.log("Screenshots data:", screenshotsData);

    if (selectedButton === "computer") {
      selectedImageData = screenshotsData.find(
        (item) => item.device === "monitor"
      );
    } else if (selectedButton === "smartphone") {
      selectedImageData = screenshotsData.find(
        (item) => item.device === "mobile"
      );
    } else if (selectedButton === "tablet") {
      selectedImageData = screenshotsData.find(
        (item) => item.device === "tablet"
      );
    }

    // If screenshot data exists for the selected device, use it
    if (selectedImageData) {
      console.log("Selected image data:", selectedImageData);
      setImgData("data:image/jpeg;base64," + selectedImageData.data);
    }
    // If no data is found, fallback to canvasScreenshot
    else if (canvasScreenshot) {
      console.log(
        "No screenshot data found for the selected device, using canvasScreenshot data."
      );
      setImgData(canvasScreenshot); // Use the canvasScreenshot data here
    }
    // If no data and no canvasScreenshot available, log an error
    else {
      console.error("No screenshot data or canvasScreenshot available.");
    }
    setLoading(false);
    setShowAppComponent("AppDraw");
  };

  const handleNextClickPreview = () => {
    setShowAppComponent("priviewIframe"); // Set state to show Preview Iframe
  };
  const handleBoundingBoxEditor = () => {
    setShowAppComponent("BoundingBoxEditor"); // Set state to show Bounding Box Editor
  };

  const handleBackClickPreview = () => {
    setShowAppComponent("priviewIframe"); // Set state to show ImageDropper
  };
  const handleBackClickImgDropper = () => {
    setShowAppComponent("ImageDropper"); // Set state to show ImageDropper
    setIsSendButtonDisabled(false);
    setInputValue(inputValue);
  };
  const handleNextClickCanvas = () => {
    setShowAppComponent("AppDraw"); // Set state to show AppDraw
    setInputValue("");
  };

  // handle CardModal in Image Dropper
  const handleOpenCard = () => {
    const element = document.getElementById("card-container");
    element?.classList.remove("fade-out");
    element?.classList.add("fade-in");
    setTimeout(() => {
      setCloseCard(false);
    }, 100);
  };

  const handleCloseClick = () => {
    const element = document.getElementById("card-container");
    element?.classList.remove("fade-in");
    element?.classList.add("fade-out");
    setTimeout(() => {
      setCloseCard(true);
    }, 800);
  };

  // Image Dropper Function
  const handleAcceptedFiles = (files: any[]) => {
    if (files.length > 0) {
      setIsNextButtonEnabled(true);
    }

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        const imageURI = reader.result as string;
        // console.log("image uri", imageURI)
        const newFile = {
          name: file.name,
          preview: URL.createObjectURL(file),
          byteURI: [imageURI],
          formattedSize: formatBytes(file.size)
        };

        setSelectedFiles((prevFiles) => [...prevFiles, newFile]);

        // Example: Setting uploaded image state for preview
        setUploadedImage(newFile.preview);
        setImageURI(imageURI);

        // Call API to upload the image
        // uploadImageToAPI(newFile);
      };

      reader.readAsDataURL(file);
    });
    // opens the for fpr app name

    handleOpenCard();
  };

  const handleSubmitAppname = () => {
    console.log("Project name value :-", projectName);
    handleCloseClick();
  };

  const handleGenerateCode = async () => {
    setScreenshotsData([]);

    if (!inputValue && !imageURI) return;

    console.log("Handle Click ImageDropper and Preview Working");

    // Default API payload for new product
    let apiPayload = {
      userSignature:accounts[0].username,
      mode: "MLO_I2C_HTML_BOOTSTRAP", // Mode for "NEW PRODUCT"
      prompt: `The following instruction have precedance over the input image provided. Update the html code based on the previous html.  ${inputValue}. Here is the previous html generated code for the reference, modify this html as required ${selectedCode}. Only return the HTML inside the \`\`\`html markdown.`,
      image: [imageURI] // Ensure imageURI is a valid base64 string
    };

    // Modify payload for "LEGACY MODERNIZATION"
    if (category === "LEGACY_MODERNIZATION") {
      apiPayload = {
        userSignature:accounts[0].username,
        mode: "MLO_I2C_UI_MODERNIZATION", // Mode for "LEGACY MODERNIZATION"
        prompt: `${inputValue}. Here is the previous html generated code for the reference, modify this html as required ${selectedCode}. Only return the HTML inside the \`\`\`html markdown.`,
        image: [imageURI]
      };
    }

    // Determine the endpoint based on category
    const endpoint =
      category === "LEGACY_MODERNIZATION"
        ? IMAGE_TO_CODE_MODERNISE
        : IMAGE_TO_CODE; // Default for "NEW PRODUCT"

    // Reset error state before making the API call
    let newCode;
    const projectNameInLocal = localStorage.getItem("projectAdded");
    const projectHistoryInLocal = localStorage.getItem("project_Data_History");

    if (projectNameInLocal || projectHistoryInLocal) {
      setLoading(true);
      setError(null);

      try {
        // Make the API call based on the selected endpoint
        // const response = await axiosInstance.post(endpoint, apiPayload);
        const response = await getImageToCode(endpoint, apiPayload);
        if (response.data.status_code === 200) {
          newCode = response.data.code;

          if (projectNameInLocal || projectHistoryInLocal)
            // setHistory((prevHistory) => [...prevHistory, newCode]);
            setApiResponse(newCode);
        } else {
          console.log("There seems to be some error");
          console.error("Error response data:", response.data);
          setError(null);
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error("Error in API call:", error.message);

          if (error.response) {
            console.error("Error status:", error.response.status);
            console.error("Error data:", error.response.data);
            setError(
              `Server error: ${error.response.data.message || error.message}`
            );
          } else {
            setError(`Network error: ${error.message}`);
          }
        } else {
          console.error("Unexpected error:", error);
          setError("An unexpected error occurred.");
        }
      }

      setInputValue("");
      setProjectName("");
      setSelectedFiles([]);
      setLoading(false);
      handleNextClickPreview();
    } else {
      setIsAlertModalOpen(true);
      console.log("Modal is open");
    }

    console.log("history storage data Out:", currentHistoryData);

    if (newCode) {
      await handleEditMergedProjectData(newCode);
    }
  };

  // Prompt Text Input field
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "52px";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        160
      )}px`;
    }
  }, [inputValue]);

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
  };

  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  };
  // delete Image
  const deleteImage = (index: number) => {
    const updatedFiles = [...selectedFiles];
    updatedFiles.splice(index, 1);
    setSelectedFiles(updatedFiles);

    if (updatedFiles.length === 0) {
      setIsNextButtonEnabled(false);
    }
  };

  // function from App Draw for downlode code
  const handleDownloadImage = () => {
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    const context = canvas.getContext("2d");
    if (!context) {
      console.error("Canvas context is not available");
      return;
    }
    // Check if the canvas is empty
    const canvasData = context.getImageData(
      0,
      0,
      canvas.width,
      canvas.height
    ).data;
    let isEmpty = true;

    for (let i = 0; i < canvasData.length; i += 4) {
      if (canvasData[i + 3] !== 0) {
        isEmpty = false;
        break;
      }
    }
    if (isEmpty) {
      alert("Nothing to Download");
      return;
    }

    const dataURL = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = dataURL;
    link.download = "canvas-image.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // handle Save Edited Screenshot
  const handleSaveEditedScreenshot = () => {
    alert("Image Save Successfully");
  };

  const handleGenerateCodeForEditedImage = async () => {
    setScreenshotsData([]);
    const histori_retriv = localStorage.getItem("project_Data_History");
    if (histori_retriv) {
      // const data = JSON.parse(histori_retriv);
    }

    const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    const dataURL = canvas.toDataURL();
    if (!inputValue && !dataURL) return;
    console.log("Handle Click ImageDropper and Preview Working");
    const apiPayload = {
      userSignature:accounts[0].username,

      mode: "MLO_I2C_HTML_BOOTSTRAP",
      prompt: `The following instruction have precedance over the input image provided. Update the html code based on the previous html.  ${inputValue}. Here is the previous html generated code for the reference, modify this html as required ${apiResponse}. Only return the HTML inside the \`\`\`html markdown.`,

      image: [imageURI, dataURL] // Ensure imageURI is a valid base64 string
    };
    setLoading(true);
    setError(null); // Reset error state before making the API call
    let newCode;
    try {
      // const response = await axiosInstance.post(IMAGE_TO_CODE, apiPayload);

      const response = await getCodeForEditImage(apiPayload);
      if (response.data.status_code === 200) {
        newCode = response.data.code;
        setApiResponse(newCode);
      } else {
        console.log("There seems to be some error");
        console.error("Error response data:", response.data);
        setError("Failed to get a valid response from the server.");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Error in API call:", error.message);
        // Accessing and logging error details from Axios response
        if (error.response) {
          console.error("Error status:", error.response.status);
          console.error("Error data:", error.response.data);
          setError(
            `Server error: ${error.response.data.message || error.message}`
          );
        } else {
          setError(`Network error: ${error.message}`);
        }
      } else {
        console.error("Unexpected error:", error);
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
    console.log("history storage data out:", currentHistoryData);

    setInputValue("");
    setSelectedFiles([]);
    handleNextClickPreview();
    if (newCode) {
      await handleEditMergedProjectData(newCode);
    }
  };

  const toggleAddProjectNameModal = () => {
    setAddProjectNameModalOpen(!addProjectNameModalOpen);
  };

  // Handle priview all project modal
  const togglePrviewAllProjectModal = () => {
    setPreviewAllProjectModalOpen(!previewAllprojectModalOpen);
  };

  // Handle Add Project name
  const handleAddProjectName = async (projectName:string, category:string, code:string | null = null, image:string | null = null) => {
    if (curr_projectId) {
      setCurr_ProjectId("");
      console.log(
        "Clear Current project Id state for New project",
        curr_projectId
      );
    }
    // if (!validateForm()) return;

    const projectNameInLocal = localStorage.getItem("projectAdded");
    const projectHistoryInLocal = localStorage.getItem("project_Data_History");
    if (projectNameInLocal || projectHistoryInLocal) {
      localStorage.clear();
    }

    if (projectName) {
      const newProject = {

        projectName: projectName,
        projectType: category,
        author: accounts[0].username,
        ...(code ? { code: code, history: [code] } : {}),
        ...(image ? { image: [image] } : {})
      };

      setLoading(true); // Show loading state
      setLoadingMessage("Adding project, please wait...");
      try {
        const response = await addImagetoCodeProject(newProject);
        console.log("Project added successfully:", response);

        const addedProject = response.data;

        setCurr_ProjectId(addedProject._id);
        setProjectNameData(addedProject);
        console.log("Add Project Data: ", addedProject);

        // Store the added project in localStorage
        localStorage.setItem("projectAdded", JSON.stringify(addedProject));
    } catch (error) {
        console.error("Error adding project:", error);
    } finally {
        setLoading(false);
        setLoadingMessage("");
        setProjectName("");
        setPreviewAllProjectModalOpen(false);
        setAddProjectNameModalOpen(false);
    }
}
  };
  //     return axiosInstance
  //       .post(ADD_IMAGE_TO_CODE, newProject)
  //     // addImageToCode(newProject)
  //       .then((response) => {
  //         console.log("Project added successfully:", response);

  //         const addedProject = response.data;

  //         setCurr_ProjectId(addedProject._id);
  //         setProjectNameData(addedProject);
  //         console.log("Add Project Data: ", addedProject);

  //         // Store the added project in localStorage
  //         localStorage.setItem("projectAdded", JSON.stringify(addedProject));
          
  //       })
  //       .catch((error) => {
  //         console.error("Error adding project:", error);
  //       })
  //       .finally(() => {
  //         setLoading(false);
  //         setLoadingMessage("");
  //         setProjectName("");
  //         setPreviewAllProjectModalOpen(false);
  //         setAddProjectNameModalOpen(false);
  //       });
  //   }
  // };

  const handleEditMergedProjectData = async (
    generatedCode: any
    // dataUri: any
  ) => {
    try {
      const projectAddedKey = NEW_I2C_PROJECT;
      const projectHistoryKey = EXISTING_I2C_PROJECT;

      const key = localStorage.getItem(projectAddedKey)
        ? projectAddedKey
        : localStorage.getItem(projectHistoryKey)
        ? projectHistoryKey
        : projectAddedKey;

      // Retrieve the project data from localStorage
      const storedProjectString = localStorage.getItem(key);

      if (!storedProjectString) {
        console.error("No project data found in localStorage.");
        return;
      }

      const storedProject = JSON.parse(storedProjectString);
      if (curr_projectId || projectNameData) {
        console.log("Project ID from state:", curr_projectId);
      }

      // Prepare the payload by merging the data
      const mergedData = {
        id: curr_projectId,
        prompt: inputValue || storedProject.prompt,
        projectName: storedProject.projectName,
        projectType: storedProject.projectType,
        author: accounts[0].username,
        image: [imageURI],
        code: generatedCode,
        history: [generatedCode]
      };

      console.log("Merged payload to be sent:", mergedData);

      // Send the payload to the API
      // const response = await axiosInstance.post(
      //   EDIT_IMAGE_TO_CODE,
      //   mergedData
      // );
      const response = await editImageToCode(mergedData);
      const projectData = response.data;

      localStorage.setItem(key, JSON.stringify(projectData));

      // Log the response
      console.log("Project updated successfully:", projectData);
    } catch (error) {
      console.error("Error updating project:", error);
    } finally {
      setHistory((prevState) => {
        return [...prevState, generatedCode];
      });
    }
  };

  return (
    <EditableContext.Provider
      value={{
        isEditable,
        setIsEditable,
        handleScreenshot,
        imgData,
        showAppComponent,
        setShowAppComponent,
        handleNextClickPreview,
        handleBackClickPreview,
        handleNextClickCanvas,
        handleBackClickImgDropper,
        showAppDrawComponent,
        handleAcceptedFiles,
        deleteImage,
        selectedFiles,
        isNextButtonEnabled,
        uploadedImage,
        imageURI,
        apiResponse,
        handleGenerateCode,
        inputValue,
        textareaRef,
        handleChange,
        loading,
        handleDownloadImage,
        dataURIEdited,
        handleSaveEditedScreenshot,
        handleGenerateCodeForEditedImage,
        currentComponent,
        setCurrentComponent,
        history,
        setHistory,
        error,
        setError,
        selectedButton,
        setSelectedButton,
        setApiResponse,
        handleEditScreenshot,
        isEditButtonDisabled,
        setScreenshotsData,
        setIsSendButtonDisabled,
        isSendButtonDisabled,

        setCancelGetScreenshot,
        cancelGetScreenshot,
        handleBoundingBoxEditor,
        setImageURI,
        handleCloseClick,
        handleOpenCard,
        closeCard,
        projectName,
        setProjectName,
        handleSubmitAppname,
        loadingMessage,
        togglePrviewAllProjectModal,
        setLoadingMessage,
        previewAllprojectModalOpen,
        setPreviewAllProjectModalOpen,
        toggleAddProjectNameModal,
        handleAddProjectName,
        addProjectNameModalOpen,
        setAddProjectNameModalOpen,
        handleEditMergedProjectData,
        currentHistoryData,
        setCurrentHistroryData,
        isAlertModalOpen,
        setIsAlertModalOpen,
        setCategory,
        category,
        setErrors,
        errors,
        setCurr_ProjectId,
        curr_projectId,
        setSelectedCode,
        selectedCode,
        projectNameData
      }}
    >
      {children}
    </EditableContext.Provider>
  );
};
