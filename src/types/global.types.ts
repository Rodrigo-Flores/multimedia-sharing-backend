// ! examples, remove asap
export interface User {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Media {
  id: string;
  userId: string;
  url: string;
  type: 'image' | 'video' | 'audio';
  createdAt: Date;
  updatedAt: Date;
}

export interface Comment {
  id: string;
  userId: string;
  mediaId: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Like {
  id: string;
  userId: string;
  mediaId: string;
  createdAt: Date;
}

export type UUID = string;
export type Timestamp = Date;