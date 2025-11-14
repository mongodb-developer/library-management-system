#!/bin/bash

cd .devcontainer/data

# Import Library data
mongorestore --uri mongodb://localhost:27017/library --drop library/