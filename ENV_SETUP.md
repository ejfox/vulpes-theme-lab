# Environment Variables Setup

## Local Development

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Get your Maptiler API key:
   - Sign up at https://www.maptiler.com/
   - Navigate to Account → Keys
   - Create a new key or copy an existing one

3. Add the key to `.env`:
   ```bash
   NUXT_PUBLIC_MAPTILER_KEY=your_key_here
   ```

4. Start the dev server:
   ```bash
   npm run dev
   ```

The MapLibre preview will now use your API key for tile requests.

## GitHub Actions (CI/CD)

The Maptiler API key is stored as a repository secret and automatically injected during GitHub Pages deployment.

### To Update the Secret:

```bash
gh secret set NUXT_PUBLIC_MAPTILER_KEY --body "your_new_key"
```

Or via GitHub UI:
1. Go to repository Settings
2. Click "Secrets and variables" → "Actions"
3. Click "New repository secret"
4. Name: `NUXT_PUBLIC_MAPTILER_KEY`
5. Value: Your Maptiler API key
6. Click "Add secret"

## Production Deployment

The GitHub Actions workflow (`.github/workflows/deploy.yml`) automatically:
1. Reads the secret from GitHub
2. Injects it as `NUXT_PUBLIC_MAPTILER_KEY` during build
3. The Nuxt runtime config makes it available to the MapPreview component

No manual steps required for deployment!

## Troubleshooting

### Maps not loading locally?
- Check that `.env` exists and contains your key
- Verify the key format: `NUXT_PUBLIC_MAPTILER_KEY=xxxxx`
- Restart the dev server after adding/changing `.env`

### Maps not loading on GitHub Pages?
- Verify the secret is set: `gh secret list`
- Check GitHub Actions logs for build errors
- Ensure the secret name matches exactly: `NUXT_PUBLIC_MAPTILER_KEY`

### Rate limiting errors?
- Maptiler free tier has usage limits
- Consider upgrading or using a different vector tile source
- Fallback demo key has very limited usage

## Security Notes

- ✅ `.env` is gitignored - never commit it!
- ✅ Use `NUXT_PUBLIC_` prefix for client-side env vars
- ✅ GitHub secrets are encrypted and only visible to workflows
- ⚠️ Public env vars are visible in client-side code
- ⚠️ Don't store sensitive secrets in public env vars

For truly sensitive keys, use server-side only env vars (without `PUBLIC_` prefix).
