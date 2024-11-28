const express = require("express");
const app = express();
const port = process.env.PORT || 8080;
const fs = require("fs");
const simpleGit = require("simple-git");
const path = require("path");
simpleGit().clean(simpleGit.CleanOptions.FORCE);

// Path to the cloned repository
const filePath =
  process.env.NODE_ENV === "production" ? "/app/readme.md" : "readme.md"; // Adjust path for Cloud Run or local

// const repoPath = process.env.NODE_ENV === "production" ? "/app" : "/";
const commitMessage = "Automated update to README.md";

const REPO = "autoCommiter";
const USER = "j-byron";
const gitHubUrl = `https://${USER}:${process.env.GIT_PAT}@github.com/${USER}/${REPO}.git`;

const git = simpleGit(process.cwd()).env({
  GIT_ASKPASS: "echo",
  GIT_PASSWORD: process.env.GIT_PAT,
});

git
  .addConfig("user.email", "joshhbyron@gmail.com")
  .addConfig("user.name", "j-byron")
  .addRemote("origin", gitHubUrl);

const autoCommitFunction = async (req, res) => {
  try {
    const v = await git.version();
    const gitDirectoryExists = fs.existsSync(path.join(process.cwd(), ".git"));
    console.log(
      `using git version ${v} in ${process.cwd()}, .git ${
        gitDirectoryExists ? "found" : "not found"
      } 1`
    );
  } catch (err) {
    res.status(500).send(`Git not available, ${err}`);
    return;
  }

  // Random number of commits (0–5)
  const commitCount = Math.floor(Math.random() * 6); // Random between 0 and 5

  if (commitCount === 0) {
    res.status(200).send("No commits scheduled for today.");
    return;
  }

  try {
    for (let i = 0; i < commitCount; i++) {
      // Step 1: Modify the README.md file
      const timestamp = new Date().toISOString();
      const content = `Last updated: ${timestamp}\n`;
      fs.appendFileSync(filePath, content);

      console.log(`Updated readme.md at ${timestamp}`);

      // Step 2: Commit and push changes
      await git
        .add(filePath)
        .commit(commitMessage)
        .push(["-u", "origin", "main"], () => {
          console.log("Pushed sucessfully!");
        });
    }
  } catch (error) {
    console.log("github url", gitHubUrl);
    console.log("cwd", process.cwd());
    res.status(500).send(`Failed to update readme.md: ${error.message}`);
    return;
  }

  res.status(200).send("Changes committed and pushed successfully!");
};

// HTTP route to trigger your function
app.post("/", autoCommitFunction);

app.listen(port, () => {
  console.log(`Auto Committer is listening on port ${port}`);
});
