Write-Host ""
Write-Host "  ╔═══════════════════════════════════════════════╗"
Write-Host "  ║     CROSHARA — One-Click Deployment 🚀       ║"
Write-Host "  ╚═══════════════════════════════════════════════╝"
Write-Host ""

# Check prerequisites
$hasGit = $null -ne (Get-Command "git" -ErrorAction SilentlyContinue)
if (-not $hasGit) {
    Write-Host "❌ Git not found. Install from https://git-scm.com/download/win"
    exit 1
}

Write-Host "✅ Git found"

# Step 1: GitHub
Write-Host ""
Write-Host "📌 STEP 1: Create a GitHub repository"
Write-Host "   1. Go to https://github.com/new"
Write-Host "   2. Repository name: croshara"
Write-Host "   3. Make it Public"
Write-Host "   4. Don't initialize with README"
Write-Host "   5. Click 'Create repository'"
Write-Host ""
$repoUrl = Read-Host "Paste your repo URL (e.g. https://github.com/yourname/croshara.git)"

if (-not $repoUrl) {
    Write-Host "❌ No URL provided. Exiting."
    exit 1
}

# Step 2: Push to GitHub
Write-Host ""
Write-Host "📤 Pushing to GitHub..."
git remote add origin $repoUrl 2>$null
git branch -M main
git push -u origin main 2>&1 | Out-Null
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Code pushed to GitHub!"
} else {
    Write-Host ""
    Write-Host "⚠️  Push failed. Run these commands manually:"
    Write-Host "   git remote add origin $repoUrl"
    Write-Host "   git branch -M main"
    Write-Host "   git push -u origin main"
}

# Step 3: Render deploy
Write-Host ""
Write-Host "📌 STEP 3: Deploy on Render (FREE)"
Write-Host "   1. Go to https://dashboard.render.com/register"
Write-Host "   2. Sign up with GitHub (easiest)"
Write-Host "   3. Click 'New +' → 'Blueprint'"
Write-Host "   4. Select your croshara repository"
Write-Host "   5. Render auto-detects render.yaml → click 'Apply'"
Write-Host "   6. Wait 2-3 minutes for build"
Write-Host ""
Write-Host "   🔗 Your site will be live at: https://croshara.onrender.com"
Write-Host ""

# Step 4: Razorpay setup
Write-Host "📌 STEP 4: Add Razorpay (for payments)"
Write-Host "   1. Go to https://dashboard.razorpay.com/register"
Write-Host "   2. Get your Key ID and Key Secret"
Write-Host "   3. In Render dashboard → Environment → add:"
Write-Host "      RAZORPAY_KEY_ID = your_key_id"
Write-Host "      RAZORPAY_KEY_SECRET = your_key_secret"
Write-Host ""

# Step 5: Custom domain
Write-Host "📌 STEP 5: Custom Domain (optional)"
Write-Host "   In Render → Settings → Custom Domain → add your domain"
Write-Host ""

Write-Host "  ╔═══════════════════════════════════════════════╗"
Write-Host "  ║     🎉 YOUR STORE IS LIVE!                    ║"
Write-Host "  ║     Share your link with the world            ║"
Write-Host "  ╚═══════════════════════════════════════════════╝"
Write-Host ""

Read-Host "Press Enter to exit"
