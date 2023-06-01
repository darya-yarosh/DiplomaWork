import { collection, doc } from "@firebase/firestore"
import { getDocs, getDoc, deleteDoc, updateDoc, setDoc} from "firebase/firestore"
import { firestore } from "logic/storage/firebase/firebaseConfig"

import User from "models/User"

const COLLECTION_NAME = "users"

export const handleAddUser = (newUser: User) => {
    const data: User = {
        id: crypto.randomUUID(),
        login: newUser.login,
        password: newUser.password,
        role: 'user',
    }

    try {
        setDoc(doc(firestore, COLLECTION_NAME.toString(), data.id.toString()), {...data});
    } catch (err) {
        console.log(err)
    }
}

export const handleGetUserList = async () => {
    const ref = collection(firestore, COLLECTION_NAME)
    const data = await getDocs(ref)
        .then((querySnapshot) => {
            const usersList = querySnapshot.docs
                .map((doc) => {
                    const user = { ...doc.data() }
                    user.id = doc.id;
                    return user;
                }    
                );
            return usersList;
        })
    return data;
}

export const handleGetUser = async (userId: string) => {
    const ref = doc(firestore, COLLECTION_NAME, userId);
    return await getDoc(ref)
        .then((querySnapshot) => {
            const user = querySnapshot.data();
            return user;
        })
    
}

export const handleRemoveUser = async (userId: string) => {
    const ref = doc(firestore, COLLECTION_NAME, userId);
    await deleteDoc(ref)
}

export const handleUpdateUser = async (userId: string, updatedUser: User) => {
    const ref = doc(firestore, COLLECTION_NAME, userId);
    await updateDoc(ref, {...updatedUser});
}