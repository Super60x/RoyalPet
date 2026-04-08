# File: .github/workflows/generate-pages.yml

Create this folder structure in your repo root:
`.github/workflows/generate-pages.yml`

This workflow runs every Monday at 3am, generates any new breed pages,
and opens a Pull Request automatically for you to review.

Before it works, add your API keys to GitHub:
Go to repo Settings → Secrets and variables → Actions → New repository secret

Add these secrets:
- `ANTHROPIC_API_KEY`
- `REPLICATE_API_TOKEN`

---

```yaml
name: Generate breed pages

on:
  # Run every Monday at 3am Amsterdam time (1am UTC)
  schedule:
    - cron: '0 1 * * 1'

  # Also allows you to trigger it manually from GitHub Actions tab
  workflow_dispatch:

jobs:
  generate:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repo
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Install tsx
        run: npm install -g tsx

      - name: Run breed page generator
        run: npx tsx scripts/generate-pages.js
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
          REPLICATE_API_TOKEN: ${{ secrets.REPLICATE_API_TOKEN }}

      - name: Check if breeds.json changed
        id: changes
        run: |
          git diff --quiet data/breeds.json || echo "changed=true" >> $GITHUB_OUTPUT

      - name: Commit and create PR if changed
        if: steps.changes.outputs.changed == 'true'
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"

          # Create a unique branch name
          BRANCH="automation/breed-pages-$(date +%Y%m%d)"
          git checkout -b $BRANCH

          git add data/breeds.json
          git commit -m "auto: update breed pages $(date +%Y-%m-%d)"
          git push origin $BRANCH

          # Open a Pull Request using GitHub CLI
          gh pr create \
            --title "Auto: breed pages update $(date +%Y-%m-%d)" \
            --body "Generated automatically by the breed page script. Review the Vercel preview URL before merging." \
            --base main \
            --head $BRANCH
        env:
          GH_TOKEN: ${{ github.token }}

      - name: No changes
        if: steps.changes.outputs.changed != 'true'
        run: echo "No new breeds to add — all done!"
```
