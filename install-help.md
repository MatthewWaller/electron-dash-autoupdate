# Installation Help for macOS

Since this app is unsigned, macOS will block it by default. Here's how to install and run it:

## Method 1: Remove Quarantine (Recommended)

After downloading and installing the app to Applications:

```bash
# Remove the quarantine attribute
sudo xattr -d com.apple.quarantine "/Applications/Dash Auto Update Demo.app"
```

Then you can open the app normally.

## Method 2: Manual Override

1. Try to open the app (it will be blocked)
2. Go to System Preferences → Security & Privacy → General
3. Click "Open Anyway" next to the blocked app message
4. Confirm you want to open it

## Method 3: Right-click Open

1. Right-click on the app in Applications
2. Select "Open" from the context menu
3. Click "Open" in the security dialog

## For Developers

To avoid this issue entirely, you would need to:
1. Join the Apple Developer Program ($99/year)
2. Code sign the app with your developer certificate
3. Optionally notarize the app with Apple