# Newtown MDM Workstation

Medical Decision Making documentation tool for Newtown Foot & Ankle Specialists.

## Features

- **Smart Mode**: Paste or dictate S/O notes → auto-detects condition → generates Plan
- **Terminal Mode**: Dot phrase commands for quick documentation
- **Light/Dark Mode**: Toggle based on preference or system setting
- **Voice Input**: Dictate notes using device microphone
- **iPad Optimized**: Touch-friendly, PWA-capable

## Deployment to Vercel (10 minutes)

### Step 1: Create Vercel Account

1. Go to [vercel.com](https://vercel.com)
2. Click "Sign Up"
3. Sign up with GitHub, GitLab, or email

### Step 2: Deploy the App

**Option A: Deploy via GitHub (Recommended)**

1. Create a new GitHub repository
2. Upload all files from this folder to the repository
3. In Vercel dashboard, click "Add New..." → "Project"
4. Import your GitHub repository
5. Click "Deploy"

**Option B: Deploy via Vercel CLI**

1. Install Vercel CLI: `npm i -g vercel`
2. Navigate to this folder: `cd newtown-mdm-app`
3. Run: `vercel`
4. Follow the prompts

**Option C: Deploy via Drag & Drop**

1. Zip this entire folder
2. Go to [vercel.com/new](https://vercel.com/new)
3. Drag and drop the zip file

### Step 3: Get Your URL

After deployment, Vercel will give you a URL like:
- `newtown-mdm.vercel.app` (or similar)

You can customize this in Project Settings → Domains.

### Step 4: Add to iPad Home Screen

On each iPad:

1. Open **Safari** (must be Safari, not Chrome)
2. Go to your Vercel URL
3. Tap the **Share** button (square with arrow)
4. Scroll down and tap **"Add to Home Screen"**
5. Name it "MDM" or "MDM Workstation"
6. Tap **Add**

The app will now appear as an icon on the home screen and launch in fullscreen mode.

## Generating App Icons

After deploying:

1. Visit `your-site.vercel.app/generate-icons.html`
2. Right-click each icon size and "Save Image As"
3. Upload to your Vercel project's `/public` folder:
   - `icon-512.png` (512x512)
   - `icon-192.png` (192x192)
   - `apple-touch-icon.png` (180x180)

This will give you proper app icons on the iPad home screen.

## Customization

### Adding New Conditions

Edit `pages/index.js` and add to the `CONDITIONS` object:

```javascript
'new-condition': {
  name: 'Condition Name',
  code: 'ICD-10',
  dotPhrase: '.xx',
  patterns: [/regex patterns/i],
  generate: (data) => {
    return `Your template here...`;
  }
}
```

### Changing Colors

Edit the `BRAND` and `THEMES` objects at the top of `pages/index.js`.

## Troubleshooting

**Voice not working?**
- Ensure you're using Safari on iPad
- Allow microphone permissions when prompted
- Check that your device isn't muted

**App not showing as fullscreen?**
- Must be added via Safari's "Add to Home Screen"
- Other browsers don't support PWA features on iOS

**Changes not appearing?**
- Hard refresh: hold Shift and tap reload
- Or remove from home screen and re-add

## Support

For issues or feature requests, contact your practice administrator.

---

Built for Newtown Foot & Ankle Specialists
