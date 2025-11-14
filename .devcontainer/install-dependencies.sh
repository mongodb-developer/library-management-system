export NG_CLI_ANALYTICS="false"
cd client
npm install

cd ../server
./mvnw clean install -DskipTests

cd ..