#!/bin/bash

echo 'installing dependencies'
npm install

# Run checks and output to a directory
echo 'running benchmarks'
npm test

# cleanup
echo 'cleanup'
git checkout . && git clean -df
rm -rf node_modules package-lock.json

# move to master branch
echo 'changing back to master branch'
git checkout origin/master

# install
echo 'installing dependencies'
npm install

# Run checks and output to a directory
echo 'running benchmarks'
npm test

# run comparision between two scripts
echo "success"