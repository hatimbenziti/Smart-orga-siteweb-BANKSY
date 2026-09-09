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

    // 3. Envoyer immédiatement le message de succès via postMessage à Decap CMS dès le chargement
    const content = `
      <!DOCTYPE html>
      <html>
      <head><title>Authentification réussie</title></head>
      <body>
        <p>Connexion en cours, veuillez patienter...</p>
        <script>
          (function() {
            const token = ${JSON.stringify(token)};
            const provider = 'github';
            
            // Format standard attendu par Decap CMS
            const match = window.location.origin;
            
            function sendMessage() {
              if (window.opener) {
                // Envoi de l'événement de succès
                window.opener.postMessage(
                  'authorization:' + provider + ':success:' + JSON.stringify({ token: token, provider: provider }),
                  '*'
                );
                setTimeout(function() {
                  window.close();
                }, 300);
              }
            }

            sendMessage();
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
