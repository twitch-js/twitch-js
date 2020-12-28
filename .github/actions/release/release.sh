#!/bin/bash

# Setup GIT for pushing.
git config --global user.name "TwitchJS CI"
git config --global user.email "36392591+twitch-js-ci@users.noreply.github.com"

# Retrieve current version.
PACKAGE_VERSION=$(node -p "require('./package.json').version")
LATEST_VERSION=$(npm view twitch-js@$PACKAGE_VERSION)

# If this version is unreleased ...
if [[ ${#LATEST_VERSION} -eq "0" ]]; then
  # ... tag current version ...
  git tag \
    --annotate v${PACKAGE_VERSION} \
    --message "v${PACKAGE_VERSION} release"

  # ... and publish to NPM.
  npm publish
else
  # ... otherwise, determine next version.
  if [[ $PACKAGE_VERSION =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
    # Regular versions get a 'pre' version tag.
    NEXT_VERSION=`$(npm bin)/semver \
      $PACKAGE_VERSION \
      --increment prerelease \
      --preid pre`
  else
    # Prerelease versions retain version tag.
    NEXT_VERSION=`$(npm bin)/semver $PACKAGE_VERSION --increment prerelease`
  fi

  # Incrememnt version.
  npm version $NEXT_VERSION --message "v$NEXT_VERSION"
fi

# Push version increment.
git push --follow-tags