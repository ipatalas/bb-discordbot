[![Build Status](https://travis-ci.org/ipatalas/bb-discordbot.svg?branch=master)](https://travis-ci.org/ipatalas/bb-discordbot)
[![Coverage Status](https://coveralls.io/repos/github/ipatalas/bb-discordbot/badge.svg?branch=master)](https://coveralls.io/github/ipatalas/bb-discordbot?branch=master)
[![Dependencies status](https://david-dm.org/ipatalas/bb-discordbot.svg)](https://david-dm.org/ipatalas/bb-discordbot)

# Boom Beach Discord Bot
This is a bot for [Discord](https://discordapp.com/). It's aim is to help people with operations and to provide some statistics about them to give more fun. The bot itself will contain several commands to allow player to check in their attack to allow the bot to use that data later for its features.  
The list of features is open to suggestions. Feel free to open an issue with your idea.

## Installation

This project is also a nice playground for me to play with Typescript, node.js and stuff. I host this on my Raspberry PI 3 which is actually my media center, but suits well for this project :) There is a deployment gulp task which I use to deploy the project on the RPi. It might not be generic enough for your needs. If you have different enviornment you can always extend it or fork the project and implement your own way of deployment.

### Requirements
- Typescript 2.0 (bundled)
- node.js 6.x 

## Features:
- [x] Per command permissions
- [x] Ping command
- [x] Uptime command
- [ ] Operation attack reminder
  - [ ] For all
  - [ ] For those who haven't checked in their attack
  - [ ] Info about how many bases and attacks left on specified interval
  - [ ] Info about which bases are still open
- [ ] Operation statistics
  - [ ] Number of attacks needed to complete
  - [ ] Number of attacks per base (need to collect it first)
  - [ ] Number of solo attacks
  - [ ] Posted after finish
  - [ ] Historical access
  - [ ] Graphical charts:
    - [ ] attacks timeline with dots on each attack and color dots on base kill
    - [ ] pie chart with troops used
- [ ] Warning system for players

## Commands

All commands must be prefixed with characters that should be configured in _config.json_ in `command_prefix` field.

- `ping` - just a test command to see if the bot is up
- `write` - type anything on behalf of the bot (can use #channelMentions for the bot to type on a different channel)
- `uptime` - gets basic information about the bot, including it's uptime
