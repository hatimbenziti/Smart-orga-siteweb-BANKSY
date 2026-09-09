export default async function handler(req, res) {
  const { code } = req.query;
  if (!code) {
    return res.redirect(
      `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&scope=repo`
    );
  }
  const response = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code,
    }),
  });
  const data = await response.json();
  const token = data.access_token;
  const content = `
    <script>
      const token = "${token}";
      const provider = "github";
      if (window.opener) {
        window.opener.postMessage("authorization:" + provider + ":success:{\\"token\\":\\"" + token + "\\",\\"provider\\":\\"" + provider + "\\"}", "*");
        window.close();
      }
    </script>
  `;
  res.setHeader('Content-Type', 'text/html');
  res.send(content);
}
