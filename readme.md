# Umbriel Discord Bot

## About

Bot I built during my time at [codeup](https://codeup.com/). Used to schedule things along with storing user data and
displaying stats.

## Installation

Node.js v16.0.0 or newer recommended. Mongodb server stores data.
Uses [yarn](https://classic.yarnpkg.com/lang/en/docs/install) for package management.

- Clone the repo
  `git clone https://github.com/daltonkyemiller/umbriel-discord-bot.git`
- Create .env file in root. Configure variables. DISCORD_ variables can be found
  at https://discord.com/developers/applications
    - `DISCORD_TESTING_TOKEN='YOUR DISCORD SECRET HERE'`
    - `DISCORD_TESTING_CLIENT='YOUR BOT CLIENT ID HERE'`
    - `MONGO_TESTING_URI='YOUR MONGODB URI HERE'`
- Start server
  `yarn run dev` (uses nodemon and auto-restarts server on change)
  or
  `node app.js`

## Usage In Discord

### All Commands

- `/stats view` - shows a user's stats like characters typed, words typed, etc.
- `/leaderboard sort` **by** - displays a table of all users and a chosen stat
- `/reminders add` **what**, **when** - adds a reminder, bot will DM the reminder **what** is exactly what it will send
  you **when** is when it will send it (ex. 2 seconds, July 1st, 10 minutes. etc.)
- `/reminders view` - shows all reminders along with their index
- `/reminders remove` **index** - removes a reminder at a certain index

### Admin Commands

Admin commands can only be used by the server creator.

- `/announcements add` **what**, **when** - same as reminder above, but it sends to the whole channel that it is set in
- `/poll add` **commaSeperatedItems**, **lengthOfPoll** - creates a poll for a specified period of time that can be
  voted on with emoji reactions.
- `/clear` **number** - clears most recent messages with amount
- `/restart` - restarts the bot
