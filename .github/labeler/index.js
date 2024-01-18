const { Octokit } = require("@octokit/rest");
const auth = process.env.GITHUB_TOKEN;
const issue_number = process.env.ISSUE_NUMBER;
const octokit = new Octokit({ auth });

async function run() {
  const issue = await octokit.issues.get({
    owner: 'pieces-app',
    repo: 'support',
    issue_number
  });

  const issueBodyLines = issue.data.body.split('\n');
  const labels = [];
  
  // Handle multiple software values
  if (issueBodyLines[0] === '### Software') {
    const softwareLines = issueBodyLines[2].split(','); // assuming comma-separated values
    softwareLines.forEach(software => {
      labels.push(`app:${software.trim().toLowerCase()}`);
    });
  }

  // Handle multiple OS values
  if (issueBodyLines[4] === '### Operating System') {
    const osLines = issueBodyLines[6].split(','); // assuming comma-separated values
    osLines.forEach(os => {
      labels.push(`os:${os.trim().toLowerCase()}`);
    });
  }

  if (labels.length) {
    await octokit.issues.addLabels({
      owner: 'pieces-app',
      repo: 'support',
      issue_number,
      labels
    });
  }
}

run().catch(err => console.error(err));
