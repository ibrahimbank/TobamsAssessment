import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { hash } from "bcryptjs";
import { join } from "path";

// Prisma CLI resolves "file:./dev.db" relative to schema dir (prisma/),
// so the actual DB is at <project>/prisma/dev.db.
// The better-sqlite3 adapter needs an absolute path.
const dbPath = join(process.cwd(), "dev.db");
const adapter = new PrismaBetterSqlite3({ url: "file:" + dbPath });
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
