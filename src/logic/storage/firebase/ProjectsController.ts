import { collection, doc, setDoc } from "@firebase/firestore"
import { getDocs, getDoc, deleteDoc, updateDoc } from "firebase/firestore"
import { firestore } from "logic/storage/firebase/firebaseConfig"

import Project from "models/Project"

const COLLECTION_NAME = "projects"

export const handleAddProject = (newProject: Project) => {
    const data: Project = {
        id: crypto.randomUUID(),
        name: newProject.name,
        description: newProject.description,
        status: newProject.status,
        participantList: newProject.participantList
    }

    try {
        setDoc(doc(firestore, COLLECTION_NAME.toString(), data.id.toString()), {...data});
    } catch (err) {
        console.log(err)
    }
}

export const handleGetProjectList = async () => {
    const ref = collection(firestore, COLLECTION_NAME)
    const data = await getDocs(ref)
        .then((querySnapshot) => {
            const projectList = querySnapshot.docs
                .map((doc) => {
                    const project = { ...doc.data() }
                    project.id = doc.id;
                    return project;
                }    
                );
            return projectList;
        })
    return data;
}

export const handleGetProject = async (projectId: string) => {
    const ref = doc(firestore, COLLECTION_NAME, projectId);
    return await getDoc(ref)
        .then((querySnapshot) => {
            const project = querySnapshot.data();
            return project;
        })
    
}

export const handleRemoveProject = async (projectId: string) => {
    const ref = doc(firestore, COLLECTION_NAME, projectId);
    await deleteDoc(ref)
}

export const handleUpdateProject = async (projectId: string, updatedProject: Project) => {
    const ref = doc(firestore, COLLECTION_NAME, projectId);
    await updateDoc(ref, {...updatedProject});
}