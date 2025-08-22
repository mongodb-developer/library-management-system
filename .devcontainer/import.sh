#!/bin/bash

cd .devcontainer/data

# Import Library data WITHOUT embeddings

mongorestore --uri mongodb://localhost:27017/library --username admin --password mongodb  --drop --authenticationDatabase=admin library

