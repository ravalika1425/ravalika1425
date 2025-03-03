import { useMsal } from "@azure/msal-react";
import { GET_BRAINSTORMER_ENDPOINT, MLO_SERVER } from "Mike/constants";
import { EmailPayload, EditPayload } from 'Mike/models/playResponse';
import { axiosInstance } from "Mike/utils/axiosConfig";
import Content from "pages/ProductResearch/MyIdeas";
import { useEffect, useState } from "react";
import { fetchBrainstormerProjects } from "services/brainStormerServices";

interface Project {
    base: { name: string };
    roadmap: boolean;
    id: string;
}

const MyIdeas = () => {
    const { accounts } = useMsal();
    const [projects, setProjects] = useState<Project[]>([]);

    useEffect(() => {
        const fetchProjects = async () => {
            const payload: EmailPayload = { userEmail: accounts[0].username };
            try {
                const response = await fetchBrainstormerProjects(payload);
                if (response.status === 200) {
                    setProjects(response.data.brainstormerProjects || []);
                }
            } catch (error) {
                console.error("Error fetching projects:", error);
            }
        };
        fetchProjects();
        // const payload: EmailPayload = { userEmail: accounts[0].username };
        // axiosInstance
        //     .post(MLO_SERVER + GET_BRAINSTORMER_ENDPOINT, payload)
        //     .then((response) => {
        //         if (response.status === 200) {
        //             setProjects(response.data.brainstormerProjects || []);
        //         }
        //     });
    }, [accounts]);

    const handleDelete = async (id: string) => {

    };

    return (
        <div>
            <Content
                projects={projects}
                setProjects={setProjects}
                onDelete={handleDelete}
            />
        </div>
    );
};

export default MyIdeas;
