import { EntityDTO } from "@mikro-orm/core";
import type { Request } from "express";
import { User } from "./user.entity";

export type AccessToken = {
	uid: string;
};

export type AuthedRequest = {
	user: EntityDTO<User>;
} & Request;
