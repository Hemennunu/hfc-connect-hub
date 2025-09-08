// ...existing code...
const fs = require("fs");
const path = require("path");
const { DataSource } = require("typeorm");
const bcrypt = require("bcryptjs");
// ...existing code...

// resolve the expected User entity path and verify it exists
const userPath = path.join(__dirname, "entities", "User.js");
console.log("seed-admin: checking User entity path ->", userPath);
console.log("seed-admin: exists?", fs.existsSync(userPath));

if (!fs.existsSync(userPath)) {
  console.error("seed-admin: User entity not found at", userPath);
  console.error(
    "Make sure entities/User.js exists and you are running this script from the project folder."
  );
  process.exit(1);
}

let userModule;
try {
  userModule = require(userPath);
} catch (err) {
  console.error("seed-admin: require failed for", userPath);
  console.error(err && err.stack ? err.stack : err);
  process.exit(1);
}

// support both CommonJS export and default export
const User = userModule && userModule.default ? userModule.default : userModule;

// Configure the DataSource (adjust settings if needed)
const AppDataSource = new DataSource({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "root",
  password: "@Nuhamin123", // update if needed
  database: "hfc_database",
  entities: [User],
  synchronize: false,
});

async function seed() {
  try {
    await AppDataSource.initialize();
    const userRepo = AppDataSource.getRepository(User);

    const existing = await userRepo.findOne({
      where: { email: "hello@gmail.com" },
    });
    if (existing) {
      console.log("⚠️ Admin already exists");
      return;
    }

    const hashedPassword = await bcrypt.hash("123456", 10);
    const admin = userRepo.create({
      name: "Admin",
      email: "hello@gmail.com",
      password: hashedPassword,
      role: "admin",
    });

    await userRepo.save(admin);
    console.log("✅ Admin created: hello@gmail.com / 123456");
  } catch (err) {
    console.error(
      "❌ Error seeding admin:",
      err && err.stack ? err.stack : err
    );
  } finally {
    await AppDataSource.destroy().catch(() => {});
  }
}

seed();
// ...existing code...
