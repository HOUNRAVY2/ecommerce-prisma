import { PrismaClient } from "@prisma/client";
import { hashSync } from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding users...");

  await prisma.user.createMany({
    data: [
      {
        name: "Erico",
        email: "ericoo.gmail.com",
        password: hashSync("hashed_password_456", 10),
        role: "USER",
      },
      {
        name: "koy poy",
        email: "koy.poy@gmail.com",
        password: hashSync("hashed_password_456", 10),
        role: "ADMIN",
      },
    ],
  });

  console.log("Seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
