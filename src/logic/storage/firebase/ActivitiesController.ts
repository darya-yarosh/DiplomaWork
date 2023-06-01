import { collection, doc } from "@firebase/firestore"
import { getDocs, getDoc, deleteDoc, updateDoc, setDoc } from "firebase/firestore"
import { firestore } from "logic/storage/firebase/firebaseConfig"

import Activity from "models/Activity"

const COLLECTION_NAME = "activities"

export const handleAddActivity = (newActivity: Activity) => {
    const data: Activity = {
        id: crypto.randomUUID(),
        name: newActivity.name,
        description: newActivity.description,
        status: newActivity.status,
        location: newActivity.location,
        dataStart: newActivity.dataStart,
        timeStart: newActivity.timeStart,
        dataEnd: newActivity.dataEnd,
        timeEnd: newActivity.timeEnd,
        participantList: newActivity.participantList,
        projectList: []
    }

    try {
        setDoc(doc(firestore, COLLECTION_NAME.toString(), data.id.toString()), {...data});
    } catch (err) {
        console.log(err)
    }
}

export const handleGetActivityList = async () => {
    const ref = collection(firestore, COLLECTION_NAME)
    const data = await getDocs(ref)
        .then((querySnapshot) => {
            const activityList = querySnapshot.docs
                .map((doc) => {
                    const activity = { ...doc.data() }
                    activity.id = doc.id;
                    return activity;
                }
                );
            return activityList;
        })
    return data;
}

export const handleGetActivity = async (activityId: string) => {
    const ref = doc(firestore, COLLECTION_NAME, activityId);
    return await getDoc(ref)
        .then((querySnapshot) => {
            const activity = querySnapshot.data();
            return activity;
        })

}

export const handleRemoveActivity = async (activityId: string) => {
    const ref = doc(firestore, COLLECTION_NAME, activityId);
    await deleteDoc(ref)
}

export const handleUpdateActivity = async (activityId: string, updatedActivity: Activity) => {
    const ref = doc(firestore, COLLECTION_NAME, activityId);
    await updateDoc(ref, { ...updatedActivity });
}