import type { Request } from "express";
import { Document } from "mongoose";
import type { Role } from "./rbacTypes.js";

export type UserRequest = {
  id: string;
  email?: string;
	profilePicture?: string;
  role: Role;
  name: string;
  tokenVersion: number;
}

export interface DecodedToken extends UserRequest{
  exp: 0;
}

export interface AuthRequest extends Request {
  user: UserRequest;
}

export interface IUser extends Document {
  name: string;
  email: string | null;
	googleid: string | null;
	profilePicture: string | null;
  password: string;
  role: 'admin' | 'user';
  tokenVersion: number;
  isLoggedIn: boolean;

  comparePassword(candidatePassword: string): Promise<boolean>;
  login(): Promise<IUser>;
  logout(): Promise<IUser>;
  incrementTokenVersion(): Promise<IUser>;
}
