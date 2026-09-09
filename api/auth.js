export default async function handler(req, res) {
  const { code } = req.query;

  // 1. Redirection vers GitHub si aucun code n'est fourni
  if (!code) {
    return res.redirect(
      `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&scope=repo,user`
    );
  }

  try {
    // 2. Échange du code contre le token d'accès
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

    if (data.error || !data.access_token) {
      return res.status(400).send(`Erreur GitHub: ${data.error_description || data.error}`);
    }

    const token = data.access_token;
    const provider = 'github';

    // 3. Envoi direct du token et fermeture automatique
    const content = `
      <!DOCTYPE html>
      <html>
      <head><title>Authentification Decap CMS</title></head>
      <body>
        <p>Authentification réussie. Redirection...</p>
        <script>
          (function() {
            const token = ${JSON.stringify(token)};
            const provider = 'github';

            if (window.opener) {
              // Send authorization success directly to parent
              window.opener.postMessage(
                'authorization:' + provider + ':success:' + JSON.stringify({ token: token, provider: provider }),
                '*'
              );

              // Auto-close pop-up
              setTimeout(function() {
                window.close();
              }, 500);
            }
          })();
        </script>
      </body>
      </html>
    `;

    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(content);
  } catch (error) {
    console.error('Erreur Serveur:', error);
    res.status(500).send('Erreur lors du traitement OAuth.');
  }
}
