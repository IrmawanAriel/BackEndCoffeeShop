import { JwtPayload } from "jsonwebtoken";

export interface payloadInterface extends JwtPayload {
  email: string; //
  role: string;
  uuid:string;
}