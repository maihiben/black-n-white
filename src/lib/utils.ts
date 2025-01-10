import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { updateDoc, doc } from "firebase/firestore"
import { db } from "@/lib/firebase"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('en-US').format(num);
};

export const generateRandomVotes = () => {
  return Math.floor(Math.random() * (50 - 10 + 1)) + 10;
};

export const updateNomineeVotes = async (nomineeId: string, currentVotes: number) => {
  try {
    const additionalVotes = generateRandomVotes();
    const newTotalVotes = currentVotes + additionalVotes;
    
    await updateDoc(doc(db, 'nominees', nomineeId), {
      votes: newTotalVotes
    });
    
    return newTotalVotes;
  } catch (error) {
    console.error('Error updating votes:', error);
    return currentVotes; // Return original count if update fails
  }
};
