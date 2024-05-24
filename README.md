# Cijfer ntfyer

## What is this?
This simple TypeScript project will notify you when a new grade is available. It
uses [ntfy](https://ntfy.sh) to send notifications to your phone.

Make sure you have nvm installed with node version 20.

## How to use?
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
5. Run ts-node get-id.ts to get your personal id. Add this to your .env file.
6. Create a cronjob to run the script every 10 minutes
```bash
*/10 * * * * /path/to/cijfer-ntfyer/run.sh
```

You should be good to go! You will now receive a notification when a new grade is available.
