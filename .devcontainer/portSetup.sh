which gh
if [ $? == 0 ]; then  
    echo "Exposing port 50000"
    gh codespace ports visibility 50000:public -c $CODESPACE_NAME
fi