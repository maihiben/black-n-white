export interface ChatUser {
  id: string;
  name: string;
  avatar: string;
  isVerified?: boolean;
}

export interface ChatMessage {
  id: string;
  userId: string;
  text: string;
  timestamp: Date;
  likes?: number;
  isHighlighted?: boolean;
}

export type MessageTemplate = {
  text: string;
  userTypes: string[];  // types of users who might say this
  requiresNominee?: boolean;  // if the message needs a nominee name
  requiresCategory?: boolean;  // if the message needs a category name
}; 