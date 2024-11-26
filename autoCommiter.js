const fs = require("fs");
const simpleGit = require("simple-git");

// Path to the cloned repository
const repoPath = "/workspace/autoCommiter"; // Cloud Run uses /workspace as the default working directory
const filePath = `${repoPath}/README.md`;
const commitMessage = "Automated update to README.md";

const git = simpleGit(repoPath).env({
  GIT_ASKPASS: "echo",
  GIT_PASSWORD: process.env.GIT_PAT,
});

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
      await git.add(filePath);
      await git.commit(commitMessage);
      await git.push("origin", "main"); // Adjust branch name if needed

      console.log("Changes committed and pushed successfully!");
    }
  } catch (error) {
    console.error("Failed to update README.md:", error);
  }
})();
