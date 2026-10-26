import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      rank: string;
      enrollment_id?: string;
      serviceNumber?: string;
      accessToken: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
    rank: string;
    enrollment_id?: string;
    serviceNumber?: string;
    accessToken: string;
    refreshToken: string;
  }
}
