export default async function handler(req: any, res: any) {
  const clientId = process.env.GITHUB_CLIENT_ID || process.env.OAUTH_CLIENT_ID;

  if (!clientId) {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.status(500).send(`
      <!doctype html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Configuration Vercel Requise</title>
        <style>
          body { font-family: system-ui, sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; background: #0f172a; color: #f8fafc; padding: 1.5rem; }
          .card { max-width: 520px; background: #1e293b; border: 1px solid #334155; border-radius: 1rem; padding: 2rem; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.5); }
          h2 { color: #38bdf8; margin-top: 0; font-size: 1.25rem; }
          p { font-size: 0.925rem; line-height: 1.6; color: #94a3b8; }
          code { background: #0f172a; color: #f43f5e; padding: 0.2rem 0.4rem; border-radius: 0.375rem; font-size: 0.85rem; }
          ol { font-size: 0.9rem; line-height: 1.7; color: #cbd5e1; padding-left: 1.25rem; }
          a { color: #38bdf8; text-decoration: none; }
          a:hover { text-decoration: underline; }
        </style>
      </head>
      <body>
        <div class="card">
          <h2>⚠️ Variable GITHUB_CLIENT_ID manquante sur Vercel</h2>
          <p>Pour activer l'authentification Decap CMS avec GitHub sur Vercel :</p>
          <ol>
            <li>Rendez-vous sur <a href="https://github.com/settings/developers" target="_blank">GitHub Developer Settings &gt; OAuth Apps</a>.</li>
            <li>Créez une application OAuth avec l'URL de rappel : <code>https://votre-domaine.vercel.app/api/callback</code></li>
            <li>Dans votre tableau de bord Vercel (<strong>Settings &gt; Environment Variables</strong>), ajoutez :
              <br>• <code>GITHUB_CLIENT_ID</code>
              <br>• <code>GITHUB_CLIENT_SECRET</code>
            </li>
          </ol>
        </div>
      </body>
      </html>
    `);
  }

  const scope = (req.query && req.query.scope) || 'repo,user';
  const state = Math.random().toString(36).substring(7);
  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&scope=${scope}&state=${state}`;

  if (typeof res.redirect === 'function') {
    return res.redirect(302, githubAuthUrl);
  } else {
    res.writeHead(302, { Location: githubAuthUrl });
    return res.end();
  }
}
