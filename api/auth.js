export default async function handler(req, res) {
  const { code } = req.query;

  if (!code) {
    return res.redirect(
      `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&scope=repo,user`
    );
  }

  try {
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

    const content = `
      <!DOCTYPE html>
      <html>
      <head><title>Authentification Decap CMS</title></head>
      <body>
        <p>Connexion réussie, ouverture du tableau de bord...</p>
        <script>
          (function() {
            const token = ${JSON.stringify(token)};
            const provider = 'github';

            function receiveMessage(e) {
              console.log("Handshake reçu depuis :", e.origin);
              
              // Envoi du token au format JSON Netlify standard
              window.opener.postMessage(
                'authorization:' + provider + ':success:' + JSON.stringify({
                  token: token,
                  provider: provider
                }),
                e.origin
              );

              window.removeEventListener("message", receiveMessage, false);

              setTimeout(function() {
                window.close();
              }, 300);
            }

            window.addEventListener("message", receiveMessage, false);

            // Signal initial obligatoire envoyé à la fenêtre principale
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
    res.status(500).send('Erreur serveur lors de l\'authentification.');
  }
}
