UFN TRAINING PORTAL // HOME ICON AS WEB APP ICON

Upload the ZIP contents to the repo root, preserving folders.

Files:
- index.html
- manifest.webmanifest
- assets/app-icons/favicon-32.png
- assets/app-icons/apple-touch-icon.png
- assets/app-icons/home-192.png
- assets/app-icons/home-512.png
- assets/app-icons/home-maskable-512.png

What changes:
- The Home portal artwork becomes the browser favicon.
- The same Home artwork becomes the icon when the site is added to a phone/tablet home screen.
- Adds a proper web-app manifest for Android/Chrome installation.
- Adds Apple touch icon support for iPhone/iPad.
- Installed app opens directly on #/home.
- Adds a mask-safe icon so Android circular/squircle icon crops do not cut off the artwork.
- Does NOT add a service worker or alter caching/performance behaviour.

Note:
If the site was already saved to a device home screen, the old icon may be cached.
Remove the existing saved shortcut/app and add/install it again after the GitHub Pages update.
