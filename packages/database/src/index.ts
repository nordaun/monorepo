import { PrismaClient } from "../prisma/generated/client.js";

const prismaClientSingleton = () => {
  return new PrismaClient();
};

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

/**
 * ## Prisma Database
 * @description The Prisma (PostgreSQL) Database storing all data
 */
const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;
export * from "../prisma/generated/client.js";

if (process.env.NODE_ENV === "development") globalThis.prismaGlobal = prisma;
