import { collection, doc } from "@firebase/firestore"
import { getDocs, getDoc, deleteDoc, updateDoc, setDoc} from "firebase/firestore"
import { firestore } from "logic/storage/firebase/firebaseConfig"

import Member from "models/Member"

const COLLECTION_NAME = "members"

export const handleAddMember = (newMember: Member) => {
    const data: Member = {
        id: crypto.randomUUID(),
        firstName: newMember.firstName,
        lastName: newMember.lastName,
        middleName: newMember.middleName,
        status: newMember.status,
        position: newMember.position,
        mobileNumber: newMember.mobileNumber,
        mail: newMember.mail,
        address: newMember.address,
    }

    try {
        setDoc(doc(firestore, COLLECTION_NAME.toString(), data.id.toString()), {...data});
    } catch (err) {
        console.log(err)
    }

}

export const handleGetMemberList = async () => {
    const ref = collection(firestore, COLLECTION_NAME)
    const data = await getDocs(ref)
        .then((querySnapshot) => {
            const membersList = querySnapshot.docs
                .map((doc) => {
                    const member = { ...doc.data() }

                    const formattedMember: Member = {
                        id: doc.id,
                        firstName: member.firstName,
                        lastName: member.lastName,
                        middleName: member.middleName,
                        status: member.status,
                        position: member.position,
                        mobileNumber: member.mobileNumber,
                        mail: member.mail,
                        address: member.address
                    }
                    return formattedMember;
                }    
                );
            return membersList;
        })
    return data;
}

export const handleGetMember = async (memberId: string) => {
    const ref = doc(firestore, COLLECTION_NAME, memberId);
    return await getDoc(ref)
        .then((querySnapshot) => {
            const member = querySnapshot.data();
            return member;
        })
    
}

export const handleRemoveMember = async (memberId: string) => {
    const ref = doc(firestore, COLLECTION_NAME, memberId);
    await deleteDoc(ref)
}

export const handleUpdateMember = async (memberId: string, updatedMember: Member) => {
    const ref = doc(firestore, COLLECTION_NAME, memberId);
    await updateDoc(ref, {...updatedMember});
}
