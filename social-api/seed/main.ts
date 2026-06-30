import { prisma } from "../lib/prisma";
import bcrypt from "bcrypt";

import { faker } from "@faker-js/faker";

async function main() {
  console.log("User data seeding....");

  await prisma.user.create({
    data: {
      name: "Alice",
      username: "alice",
      bio: "first user",
      password: await bcrypt.hash("password", 10),
    },
  });

  await prisma.user.create({
    data: {
      name: "Bob",
      username: "bob",
      bio: "second user",
      password: await bcrypt.hash("password", 10),
    },
  });

  for (let i = 0; i < 3; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    await prisma.user.create({
      data: {
        name: `${firstName} ${lastName}`,
        username: `${firstName}${lastName}`.toLowerCase(),
        bio: faker.person.bio(),
        password: await bcrypt.hash("password", 10),
      },
    });
  }

  console.log("User data seeding complete");

  console.log("Post seeding started....");
  for (let i = 0; i < 20; i++) {
    await prisma.post.create({
      data: {
        content: faker.lorem.paragraph(),
        userId: faker.number.int({ min: 1, max: 5 }),
      },
    });
  }
  console.log("Post seeding complete");

  console.log("comment seeding started....");
  for (let i = 0; i < 40; i++) {
    await prisma.comment.create({
      data: {
        content: faker.lorem.paragraph(),
        postId: faker.number.int({ min: 1, max: 20 }),
        userId: faker.number.int({ min: 1, max: 5 }),
      },
    });
  }
  console.log("comment seeding complete");
}

main();
