import type { ReactNode } from "react";
interface User {
  id: string;
  role: string;
  name: string;
  email: string;
}

interface UserDump {
  // this is for res login, register, get user profile, update profile user
  id: number;
  email: string;
  name: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

interface UserListAdmin {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface UserCreateByAdmin {
  name: string;
  email: string;
  role: string;
  password: string;
}

interface UserUpdate {
  id?: number;
  name?: string;
  username?: string;
  email?: string;
  phone?: string;
  role?: string;
  profile_url?: string;
  profile?: File | null;
}

interface UserDetail {
  // req update user
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  profile_url: string | null;
  role: string;
}

interface UserContextType {
  currentUser: User;
  setCurrentUser: React.Dispatch<React.SetStateAction<User>>;
  setLocalStrorage: (value: User) => void;
  logout: () => void;
}

interface UsersProviderProps {
  children: ReactNode;
}

export type {
  User,
  UserContextType,
  UsersProviderProps,
  UserDump,
  UserUpdate,
  UserListAdmin,
  UserCreateByAdmin,
  UserDetail,
};
