# Cijfer ntfyer
[!["Buy Me A Coffee"](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://www.buymeacoffee.com/tijme)
## What is this?
This simple TypeScript project will notify you when a new grade is available. It
uses [ntfy](https://ntfy.sh) to send notifications to your phone.

## Why?
Previously, I only reveiced notifications after a couple of hours when a new grade was available. Now, you'll know within 10 minutes how bad you did.

## How to use?
Make sure you have nvm installed with node version 20.

You can either use your own ntfy server or use the public one. If you want to use the public one, make sure you choose a unique id. If you don't, other people might receive your notifications.

1. Clone this repository
```bash
git clone https://github.com/7ijme/cijfer-ntfyer.git
cd cijfer-ntfyer
```
2. Install dependencies
```bash
npm install
```
3. Find your school's name in schools.json
4. Copy .env.example to .env and fill in the required fields
5. When METHOD is set to "token" (for SSO), it'll try to authenticate using a refresh token from the "refresh_token" file, you can obtain a refresh_token using a tool like [STAP](https://github.com/MattterSteege/SomtodayProxy).
6. Run `ts-node get-id.ts` to get your personal id. Add this to your .env file.
7. Create a cronjob to run the script every 10 minutes
```bash
*/10 * * * * /path/to/cijfer-ntfyer/run.sh
```

You should be good to go! You will now receive a notification when a new grade is available.

Note: The first time you run the script, you will receive a notification for every grade that is available. This is because the script doesn't know which grades you have already received a notification for. After the first run, you will only receive notifications for new grades. Comment out the axios request for ntfy in index.ts if you don't want to receive notifications for every grade.
