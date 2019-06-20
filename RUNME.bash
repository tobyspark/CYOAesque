#!/bin/bash

echo "******************************************************"
echo "*                                                    *"
echo "* Choose Your Own Adventuresque                      *"
echo "*                                                    *"
echo "* Toby Harris                                        *"
echo "* http://sparklive.net                               *"
echo "*                                                    *"
echo "******************************************************"

cd "$( dirname "$BASH_SOURCE" )"

# TASK: Serve the local directory
# Using Python built-in server. Must background, so script can continue to open Chrome
python3 -m http.server &

# TASK: Open Chrome in kiosk mode
# First quit any existing Chrome instances...
killall Google\ Chrome
# ...so a new instance will respect the kiosk flag
# Need autoplay-policy for video to play without user interaction
# For all command-line flags, see https://peter.sh/experiments/chromium-command-line-switches/
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --kiosk --autoplay-policy=no-user-gesture-required http://0.0.0.0:8000/

# TASK: Quit any backgrounded processes
trap 'kill $(jobs -p)' EXIT
