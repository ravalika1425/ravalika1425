import { BaseFragment } from "./response";

interface EmailPayload {
    userEmail:string
}

interface ProjectsResponse {
    brainstormerProjects:any[]
}

interface EditPayload {
    id:string,
    updateData:any
    userSignature : string,
}

interface AddPayload{
    userEmail:string;
    base: BaseFragment
}
export type {EmailPayload,EditPayload,AddPayload, ProjectsResponse}