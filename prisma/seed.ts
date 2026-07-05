import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { hash } from "bcryptjs";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  const hashedPassword = await hash("password123", 12);

  const user = await prisma.user.upsert({
    where: { email: "admin@taskflow.com" },
    update: {},
    create: {
      name: "Admin User",
      email: "admin@taskflow.com",
      hashedPassword,
    },
  });

  console.log("Default user created:", user.email);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
