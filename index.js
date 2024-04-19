function extractRepoName(url) {
    // Regular expression to match the repository name in the URL
    const regex = /(?:https?:\/\/)?github\.com\/([^\/]+)\/([^\/]+)\.git/;
    const match = url.match(regex);

    if (match && match.length === 3) {
        // Extract the repository name from the matched groups
        return match[2];
    } else {
        // If the URL format doesn't match, return null or handle the error accordingly
        return null;
    }
}

const server = Bun.serve({
  port: 3000,
  fetch(req) {
	  
	  const { searchParams } = new URL(req.url);
	  
	  // Params
	  const repoURL = searchParams.get("repo_url");
	  const adminToken = searchParams.get("admin_token");
	  const userToken = searchParams.get("user_token");
	  const workspaceName = searchParams.get("workspace_name");
	  const apiHost = searchParams.get("api_host") ?? 'https://api.tinybird.co';
	  
	  const repoName = extractRepoName(repoURL);
	  const currentTime = Math.floor(Date.now() / 1000);
	  const localRepoDir = `${currentTime.toString()}_${repoName}`
	  
	  console.log(`Repo URL: ${repoURL}`);
	  console.log(`Admin token: ${adminToken}`);
	  console.log(`User token: ${userToken}`);
	  console.log(`API host: ${apiHost}`);
	  console.log(`Workspace name: ${workspaceName}`);
	  console.log(`Local repo dir: ${localRepoDir}`);
	  
	  const cloneProc = Bun.spawn(["git", "clone", repoURL, `/tmp/repos/${localRepoDir}`], {
	  	onExit(cloneProc, exitCode, signalCode, error) {
			console.log(exitCode);
			const deployProc = Bun.spawn(["/tmp/repos/deploy.sh", localRepoDir, adminToken, apiHost, workspaceName, userToken], {
		                onExit(deployProc, exitCode, signalCode, error) {
                		        console.log(exitCode);
                		},
           		});
  	  	},
	   });

           return new Response(cloneProc.pid);
  },
});

console.log(`Listening on port ${server.port} ...`);
