const bcrypt = require("bcryptjs");

const rawPassword = "aman";
const hashedPasswordFromMongo = "$2b$10$SRUh3mdAi2mHD/ffoGsES.cmVQtNHl4AVjpCeYI.ZLoG5elmfPrMi";

bcrypt.compare(rawPassword, hashedPasswordFromMongo)
  .then(result => console.log("✅ Manual match:", result))
  .catch(err => console.log("❌ Error comparing:", err));
