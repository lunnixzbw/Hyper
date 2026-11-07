# Hyper dashboard: full setup for hyperbot.bond

Do the steps in order. Every place people usually get stuck is marked STUCK?

## 1. Put the code on GitHub
1. GitHub > New repository > name it `Hyper-Dashboard`, Private, no README.
2. Upload the CONTENTS of the `hyper-dashboard` folder (app, components, lib, public, package.json ...), not the folder itself.
   STUCK? package.json must be at the top level of the repo, not inside another folder. Vercel fails with "No Next.js version detected" otherwise.
3. Never upload `VERCEL-ENV.txt` or any `.env` file. They hold secrets. The included .gitignore already blocks .env files.

## 2. Discord application (OAuth)
1. discord.com/developers/applications > your Hyper bot > OAuth2.
2. Copy the Client ID and press Reset Secret to get the Client Secret. Save both.
3. Under Redirects add exactly: https://hyperbot.bond/api/auth/callback/discord and Save Changes.
   STUCK? Login says "invalid redirect_uri": the redirect has a typo, a trailing slash, http instead of https, or you did not press Save.

## 3. Vercel project
1. vercel.com > Add New > Project > import the repo > Framework Next.js (auto).
2. Before pressing Deploy open Environment Variables and paste every line from VERCEL-ENV.txt. Fill in the < > ones.
   STUCK? Variables starting with NEXT_PUBLIC_ must NOT be marked Sensitive/Secret. Vercel then hides them and they will not save or work.
3. Deploy. Wait for green.
   STUCK? Build error about apostrophes or "defined multiple times": copy the log to me.
   STUCK? You changed a variable later: it only applies after Deployments > ... > Redeploy.

## 4. Domain
1. Vercel > Project > Settings > Domains > add `hyperbot.bond`, then `www.hyperbot.bond` (set www to redirect to hyperbot.bond), then `auth.hyperbot.bond`.
2. Vercel shows the DNS records it wants. In Cloudflare > hyperbot.bond > DNS add them:
   - A       @     76.76.21.21              (or the value Vercel shows)
   - CNAME   www   cname.vercel-dns.com
   - CNAME   auth  cname.vercel-dns.com
   Set the proxy to DNS only (grey cloud) for these three.
   STUCK? "Invalid Configuration" in Vercel: wait 5 to 10 minutes and press Refresh. An old A/CNAME record for the same name must be deleted first.
   STUCK? Orange cloud on: use Cloudflare SSL/TLS mode Full (strict), or keep it grey. Grey is simpler.
3. NEXTAUTH_URL and NEXT_PUBLIC_SITE_URL must be exactly https://hyperbot.bond (no slash at the end).

## 5. Bot side (your bot host)
1. Set DASHBOARD_API_KEY to the same key as in Vercel. Copy it exactly, including the "/" and "=" at the end, with no quotes or spaces.
2. Set VERIFY_URL=https://auth.hyperbot.bond (needed for the website verification link).
3. Restart the bot.
   STUCK? Dashboard shows "Unauthorized" or every server fails to load: the key in Vercel and the bot are not identical, or you did not restart the bot or redeploy Vercel.
   STUCK? "Cannot reach the bot": BOT_API_URL is wrong or the bot is offline. Open https://api.hyperbot.bond/api/v1 in a browser. Any answer (even "unauthorized") means it is reachable.
4. Make the API address api.hyperbot.bond (Cloudflare > hyperbot.bond):
   a. DNS > Add record: Type A, Name `api`, IPv4 = your bot host's IP (the part before the colon in its address), Proxy ON (orange cloud).
   b. Rules > Origin Rules > Create rule: When hostname equals `api.hyperbot.bond` > Rewrite destination port to your bot's main port (the number after the colon, for example 25626) > Deploy.
      Cloudflare only talks to a few standard ports, so without this rule the API will time out.
   c. Rules > Configuration Rules > Create rule: When hostname equals `api.hyperbot.bond` > SSL: Flexible > Deploy.
      Your bot speaks plain http, so Full mode gives error 525/526 and Flexible gives it a plain connection.
   d. Test in a browser: https://api.hyperbot.bond/api/v1 . Any answer (even "unauthorized") means it works. Error 521 = bot offline or wrong IP/port. Error 522/524 = the port rule is missing or wrong.

## 6. Website verification (Cloudflare Turnstile)
1. Cloudflare > Turnstile > Add widget. Hostnames: hyperbot.bond and auth.hyperbot.bond. Mode: Managed.
2. Copy the Site Key into NEXT_PUBLIC_TURNSTILE_SITE_KEY and the Secret Key into TURNSTILE_SECRET_KEY on Vercel, then Redeploy.
   STUCK? The check never appears: the hostname is missing in the widget, or the site key variable was marked Sensitive.

## 7. Admin and support access
- NEXT_PUBLIC_ADMIN_IDS has the owner's Discord ID (1500822700338184212). Add more IDs separated by commas, no spaces. This alone opens the admin panel.
- SUPPORT_USER_IDS: staff who may read website tickets.
- To find an ID: Discord > Settings > Advanced > Developer Mode, then right click the user > Copy User ID.

## 8. Final test
1. Open https://hyperbot.bond: logo is the white H, no other bot's name.
2. /dashboard while logged out: shows the login page. Log in with Discord.
3. Pick a server: it loads, and a save works.
4. /dashboard/admin opens for your ID.
5. Send a test ticket from /contact and see it under /dashboard/support.

## Security
The key in VERCEL-ENV.txt was shared in a chat. If you ever post it anywhere public, generate a new one (openssl rand -hex 32) and change it on BOTH the bot and Vercel.
