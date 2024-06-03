import { JwtPayload } from "jsonwebtoken";

export interface payloadInterface extends JwtPayload {
  // jangan masukan data sensitif
  email: string;
  role: string;
}