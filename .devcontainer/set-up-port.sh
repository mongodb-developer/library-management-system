#!/bin/bash

echo "Exposing port 5400"
gh codespace ports visibility 5400:public -c $CODESPACE_NAME

echo "Exposing port 4200"
gh codespace ports visibility 4200:public -c $CODESPACE_NAME
