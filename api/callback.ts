export default async function handler(req: any, res: any) {
  const code = req.query?.code || (req.url && new URL(req.url, 'http://localhost').searchParams.get('code'));
  const clientId = process.env.GITHUB_CLIENT_ID || process.env.OAUTH_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET || process.env.OAUTH_CLIENT_SECRET;

  if (!code) {
    res.statusCode = 400;
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.end('<h3>Code d\'autorisation GitHub manquant.</h3>');
  }

  if (!clientId || !clientSecret) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.end('<h3>Variables GITHUB_CLIENT_ID ou GITHUB_CLIENT_SECRET manquantes sur Vercel.</h3>');
  }

  try {
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
      }),
    });

    const data: any = await tokenResponse.json();

    if (data.error || !data.access_token) {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      return res.end(`<h3>Erreur GitHub OAuth : ${data.error_description || data.error || 'Échec de récupération du token'}</h3>`);
    }

    const token = data.access_token;
    const provider = 'github';

    const htmlResponse = `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>Authentification Réussie</title>
  <style>
    body { font-family: system-ui, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #0f172a; color: #f8fafc; }
    .card { background: #1e293b; padding: 2rem; border-radius: 1rem; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.5); text-align: center; border: 1px solid #334155; }
    h2 { color: #10b981; margin: 0 0 0.5rem 0; font-size: 1.25rem; }
    p { color: #94a3b8; font-size: 0.9rem; margin: 0; }
  </style>
</head>
<body>
  <div class="card">
    <h2>✓ Authentification Réussie</h2>
    <p>Connexion à Decap CMS en cours...</p>
  </div>
  <script>
    (function() {
      function receiveMessage(e) {
        window.opener.postMessage(
          'authorization:${provider}:success:${JSON.stringify({ token, provider })}',
          e.origin
        );
        window.removeEventListener("message", receiveMessage, false);
      }
      window.addEventListener("message", receiveMessage, false);
      window.opener.postMessage("authorizing:${provider}", "*");
    })();
  </script>
</body>
</html>`;

    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.end(htmlResponse);
  } catch (err: any) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.end(`<h3>Erreur serveur : ${err?.message || err}</h3>`);
  }
}
