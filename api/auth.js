export default async function handler(req, res) {
  const { code } = req.query;

  // 1. Si aucun code n'est fourni, rediriger vers l'autorisation GitHub
  if (!code) {
    return res.redirect(
      `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&scope=repo`
    );
  }

  try {
    // 2. Échanger le code contre un jeton d'accès auprès de GitHub
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

    if (!token) {
      return res.status(400).send('Erreur lors de la récupération du token GitHub.');
    }

    // 3. Transmission directe avec répétition rapide via postMessage
    const content = `
      <!DOCTYPE html>
      <html>
      <head><title>Authentification Decap CMS</title></head>
      <body>
        <p>Connexion réussie ! Redirection en cours...</p>
        <script>
          (function() {
            const token = ${JSON.stringify(token)};
            const provider = 'github';

            function send() {
              if (window.opener) {
                // Notifier le parent que l'autorisation est prête
                window.opener.postMessage("authorizing:" + provider, "*");
                
                // Envoyer le token au parent
                window.opener.postMessage(
                  'authorization:' + provider + ':success:' + JSON.stringify({ token: token, provider: provider }),
                  "*"
                );
              }
            }

            // Envoi immédiat et répétition rapide pour garantir la réception par la fenêtre parente
            send();
            const interval = setInterval(send, 200);

            setTimeout(function() {
              clearInterval(interval);
              window.close();
            }, 1000);
          })();
        </script>
      </body>
      </html>
    `;

    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(content);
  } catch (error) {
    console.error('Erreur OAuth:', error);
    res.status(500).send('Erreur interne du serveur lors de l\'authentification.');
  }
}
