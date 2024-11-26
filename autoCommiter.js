const fs = require("fs");
const simpleGit = require("simple-git");
simpleGit().clean(simpleGit.CleanOptions.FORCE);

// Path to the cloned repository
const filePath =
  process.env.NODE_ENV === "production" ? "/workspace/README.md" : "README.md"; // Adjust path for Cloud Run or local
const commitMessage = "Automated update to README.md";

const REPO = "autoCommiter";
const USER = "j-byron";
const PASS = "Amorfati2024";
const gitHubUrl = `https://${USER}:${PASS}@github.com/${USER}/${REPO}`;

const git = simpleGit();

git
  .addConfig("user.email", "joshhbyron@gmail.com")
  .addConfig("user.name", "j-byron")
  .addRemote("origin", gitHubUrl);

// Random number of commits (0–5)
const commitCount = Math.floor(Math.random() * 6); // Random between 0 and 5

if (commitCount === 0) {
  console.log("No commits scheduled for today.");
  process.exit(0); // Exit if no commits are scheduled
}

// Main commit logic
(async () => {
  try {
    for (let i = 0; i < commitCount; i++) {
      // Step 1: Modify the README.md file
      const timestamp = new Date().toISOString();
      const content = `Last updated: ${timestamp}\n`;
      fs.appendFileSync(filePath, content);

      console.log(`Updated README.md at ${timestamp}`);

      // Step 2: Commit and push changes
      await git
        .add(filePath)
        .commit(commitMessage)
        .push(["-u", "origin", "main"], () =>
          console.log("Changes committed and pushed successfully!")
        );
    }
  } catch (error) {
    console.error("Failed to update README.md:", error);
  }
})();
