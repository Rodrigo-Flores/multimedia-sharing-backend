export interface User {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
}

// Media type
export interface Media {
  id: string;
  userId: string;
  url: string;
  type: 'image' | 'video' | 'audio';
  createdAt: Date;
  updatedAt: Date;
}

// Comment type
export interface Comment {
  id: string;
  userId: string;
  mediaId: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

// Like type
export interface Like {
  id: string;
  userId: string;
  mediaId: string;
  createdAt: Date;
}

// Global types
export type UUID = string;
export type Timestamp = Date;