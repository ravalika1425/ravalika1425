import { combineReducers } from "redux";

// Front
import LayoutReducer from "./layouts/reducer";

// Authentication
// import LoginReducer from "./auth/login/reducer";
// import AccountReducer from "./auth/register/reducer";
// import ForgetPasswordReducer from "./auth/forgetpwd/reducer";
import ProfileReducer from "./auth/profile/reducer";

//Calendar
//Chat
import chatReducer from "./chat/reducer";
//Ecommerce

//Project

// Tasks

//Crypto

//TicketsList
//Crm

//Invoice

//Mailbox
// import MailboxReducer from "./mailbox/reducer";

// Dashboard Analytics

// Dashboard CRM

// Dashboard Ecommerce

// Dashboard Cryto

// Dashboard Cryto

// Dashboard NFT

// Pages > Team

// File Manager

// To do

// Job

// API Key
// import APIKeyReducer from "./apiKey/reducer";


const rootReducer = combineReducers({
  Layout: LayoutReducer,
//   Login: LoginReducer,
  // Account: AccountReducer,
  // ForgetPassword: ForgetPasswordReducer,
  Profile: ProfileReducer,
  // Calendar: CalendarReducer,
  Chat: chatReducer,
  // Projects: ProjectsReducer,
  // Ecommerce: EcommerceReducer,
  // Tasks: TasksReducer,
  // Crypto: CryptoReducer,
  // Tickets: TicketsReducer,
  // Crm: CrmReducer,
  // Invoice: InvoiceReducer,
  // Mailbox: MailboxReducer,
  // DashboardAnalytics: DashboardAnalyticsReducer,
  // DashboardCRM: DashboardCRMReducer,
  // DashboardEcommerce: DashboardEcommerceReducer,
  // DashboardCrypto: DashboardCryptoReducer,
  // DashboardProject: DashboardProjectReducer,
  // DashboardNFT: DashboardNFTReducer,
  // Team: TeamDataReducer,
  // FileManager: FileManagerReducer,
  // // Todos: TodosReducer,
  // Jobs: JobReducer,
//    APIKey: APIKeyReducer,
  // form: FormReducer,
});
export default rootReducer;
