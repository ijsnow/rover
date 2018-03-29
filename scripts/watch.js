const fs = require("fs");

console.log("\nWatching manifest.json\n");

fs.watchFile("./manifest.json", function() {
  fs.copyFile("./manifest.json", "./dist/manifest.json", function() {
    console.log("\nUpdated manifest.json\n");
  });
});
