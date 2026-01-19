import fs from "fs";
import path from "path";

const filePath = path.join("data", "crops.json");

const crops = JSON.parse(fs.readFileSync(filePath, "utf-8"));

const slugify = (name) =>
  name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

const updated = crops.map((crop) => {
  const slug = slugify(crop.name);

  return {
    ...crop,
    imageUrl: `/crops/${slug}.jpeg`,
  };
});

fs.writeFileSync(filePath, JSON.stringify(updated, null, 2));

console.log("✅ crops.json updated with local imageUrl paths!");
