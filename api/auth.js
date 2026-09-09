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

    // 3. Protocole complet de poignée de main (handshake) attendu par Decap CMS
    const content = `
      <!DOCTYPE html>
      <html>
      <head><title>Authentification Decap CMS</title></head>
      <body>
        <p>Connexion en cours, redirection vers le tableau de bord...</p>
        <script>
          (function() {
            const token = ${JSON.stringify(token)};
            const provider = 'github';

            function receiveMessage(e) {
              console.log("Handshake reçu de :", e.origin);
              
              // Envoie du token de succès à la fenêtre principale Decap CMS
              window.opener.postMessage(
                'authorization:' + provider + ':success:' + JSON.stringify({ token: token, provider: provider }),
                e.origin
              );
              
              window.removeEventListener("message", receiveMessage, false);
              
              setTimeout(function() {
                window.close();
              }, 200);
            }

            window.addEventListener("message", receiveMessage, false);

            // Étape 1 du handshake : Notifier le parent que la pop-up est prête à transmettre le token
            if (window.opener) {
              window.opener.postMessage("authorizing:" + provider, "*");
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
