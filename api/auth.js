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

    // 3. Envoyer le script HTML gérant la poignée de main postMessage avec la fenêtre parente (Decap CMS)
    const content = `
      <!DOCTYPE html>
      <html>
      <head><title>Authentification en cours...</title></head>
      <body>
        <script>
          (function() {
            function recieveToken(e) {
              console.log("Handshake Decap CMS reçu de :", e.origin);
              
              // Préparation de la réponse de succès
              const data = ${JSON.stringify({
                token: token,
                provider: 'github'
              })};
              
              const message = "authorization:github:success:" + JSON.stringify(data);
              
              // Envoie du message de succès à la fenêtre parent
              window.opener.postMessage(message, e.origin);
              
              // Fermeture de la pop-up
              window.close();
            }

            // Écoute du message initial envoyé par la fenêtre principale de Decap CMS
            window.addEventListener("message", recieveToken, false);
            
            // Signale à la fenêtre principale que la pop-up est prête à transmettre le token
            if (window.opener) {
              window.opener.postMessage("authorizing:github", "*");
            }
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
