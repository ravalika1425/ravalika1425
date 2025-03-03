import config from '../config';

const MLO_SERVER = config.server.MLO_SERVER

// Brainstormer
const GET_BRAINSTORMER_ENDPOINT = "/brainstormer/get-brainstormer"
const UPDATE_BRAINSTORMER_ENDPOINT = "/brainstormer/edit-brainstormer"
const ADD_BRAINSTORMER_ENDPOINT = "/brainstormer/add-brainstormer"
const PRODUCT_RESEARCH = "/brainstormer/product_research"
const REGENRATE_BRAINSTORMER_ENDPOINT = "/brainstormer/product_research/regenerate"
const UPDATE_DESIGN_SYSTEM_ENDPOINT = 'https://michelangelomiddleware-fqc9a3c0f4d4afgs.eastus-01.azurewebsites.net/api/v1/design_system';

// Image to Code
const IMAGE_TO_CODE = "/image_to_code/image_to_code"
const IMAGE_TO_CODE_MODERNISE = "/image_to_code/image_to_code_ModernizedUI"
const ADD_IMAGE_TO_CODE = "/image_to_code/add-image_to_code"
const EDIT_IMAGE_TO_CODE = "/image_to_code/edit_image_to_code"
const GET_SCREENSHOT = "/wireframe/get_screenshot"
const IMAGE_TO_CODE_CONVERT = "/image_to_code/code_convert"
const GET_IMAGE_TO_CODE = "/image_to_code/get_image_to_code"
const DELETE_IMAGE_TO_CODE = '/image_to_code/delete_image_to_code';
const GENERATE_IMAGE = "/wireframe/generate_images"
// Design Generator

const WIREFRAME_EDITOR = "/wireframe/WIREFRAME-EDITOR"
const WIREFRAME_REPHRASE = "/wireframe/create_wireframe/rephrase"
const WIREFRAME_LAYOUT = "/wireframe/create_wireframe/layout"
const WIREFRAME_GENERATE = "/wireframe/create_wireframe/generate"

const NEW_I2C_PROJECT = "projectAdded";
const EXISTING_I2C_PROJECT = "project_Data_History";
const REACT_APP_DEFAULTAUTH = "Admin";
export {WIREFRAME_GENERATE, WIREFRAME_LAYOUT,WIREFRAME_REPHRASE,WIREFRAME_EDITOR,IMAGE_TO_CODE_MODERNISE,GET_SCREENSHOT,GENERATE_IMAGE,EDIT_IMAGE_TO_CODE,ADD_IMAGE_TO_CODE,IMAGE_TO_CODE,IMAGE_TO_CODE_CONVERT,GET_IMAGE_TO_CODE,DELETE_IMAGE_TO_CODE,PRODUCT_RESEARCH,MLO_SERVER, GET_BRAINSTORMER_ENDPOINT,UPDATE_BRAINSTORMER_ENDPOINT,REGENRATE_BRAINSTORMER_ENDPOINT, ADD_BRAINSTORMER_ENDPOINT,UPDATE_DESIGN_SYSTEM_ENDPOINT,NEW_I2C_PROJECT, EXISTING_I2C_PROJECT, REACT_APP_DEFAULTAUTH }