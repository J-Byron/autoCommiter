const express = require("express");
const app = express();
const port = process.env.PORT || 8080;
const fs = require("fs");
const simpleGit = require("simple-git");
simpleGit().clean(simpleGit.CleanOptions.FORCE);

// Path to the cloned repository
const filePath =
  process.env.NODE_ENV === "production" ? "/workspace/readme.md" : "readme.md"; // Adjust path for Cloud Run or local
const commitMessage = "Automated update to README.md";

const REPO = "autoCommiter";
const USER = "j-byron";
const gitHubUrl = `https://github.com/${USER}/${REPO}`;

const git = simpleGit("/").env({
  GIT_ASKPASS: "echo",
  GIT_PASSWORD: process.env.GIT_PAT,
});

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

const autoCommitFunction = async (req, res) => {
  try {
    await git.version();
  } catch (err) {
    res.status(500).send(`Git not available, ${error}`);
  }

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

      res.status(200).send("Changes committed and pushed successfully!");
    }
  } catch (error) {
    res.status(500).send(`Failed to update readme.md: ${error.message}`);
  }
};

// HTTP route to trigger your function
app.post("/", autoCommitFunction);

app.listen(port, () => {
  console.log(`Auto Committer is listening on port ${port}`);
});
