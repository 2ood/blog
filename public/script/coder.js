
/*
async function getCommits(octokit){
  const commits = await octokit.request('GET /repos/2ood/blog/commits', {
    owner: 'octocat',
    repo: 'hello-world'
  });

  return commits;
}
*/



function onAuthLogined(user) {
  onAuthLoginedTopBar(user);
}

function onAuthAnonymous() {
  onAuthAnonymousTopBar();
}
