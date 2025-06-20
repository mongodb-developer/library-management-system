#!/bin/bash

cd .devcontainer/data

# Import Library data WITHOUT embeddings

tar xvfz library.tgz

mongorestore --uri mongodb://localhost:27017/library --username admin --password mongodb  --drop --authenticationDatabase=admin library

# Import Library data WITH embeddings

cd library_with_embeddings

# some files in the DB are > 100 MB, Github does not allow files this big, so we've used split 
# split -b 5m books.bson.gz
# we join the generated files using cat
cat xa* > books.bson.gz 

# uncompress all the files (all the .gz files will be deleted)
gzip --force -d *.gz 

# delete the splitted files, no longer needed
rm xa* 

cd ..

mongorestore --uri mongodb://localhost/library_with_embeddings --drop library_with_embeddings --username admin --password mongodb --authenticationDatabase=admin

cd ..
