#!/bin/bash

# Retrieve current version.
PACKAGE_VERSION=$(node -p "require('./package.json').version")

# Determine next version.
if [[ $PACKAGE_VERSION =~ ^[0-9]\.[0-9]\.[0-9]$ ]]; then
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
npm version $NEXT_VERSION -m "$NEXT_VERSION"

# Travis CI should take care of deploying build to NPM from here.
