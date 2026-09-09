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

    // 3. Script d'échange postMessage standard Netlify/Decap CMS
    const content = `
      <!DOCTYPE html>
      <html>
      <head><title>Authentification Decap CMS</title></head>
      <body>
        <p>Authentification réussie. Fermeture...</p>
        <script>
          (function() {
            function receiveMessage(e) {
              console.log("Handshake reçu de l'origine :", e.origin);
              
              // Envoi de la réponse de succès à la fenêtre mère
              window.opener.postMessage(
                'authorization:${provider}:success:${JSON.stringify({ token: token, provider: provider })}',
                e.origin
              );
            }

            // Écoute de la confirmation de la fenêtre parente
            window.addEventListener("message", receiveMessage, false);

            // Signal initial d'ouverture de session envoyé au CMS
            if (window.opener) {
              window.opener.postMessage("authorizing:${provider}", "*");
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
