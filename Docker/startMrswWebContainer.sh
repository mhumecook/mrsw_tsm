docker build -f Docker/Dockerfile-web -t mhumecook/mrsw_web:1.0 .
docker run --name mrsw_web -d -p 80:80 --link mysql:db mhumecook/mrsw_web:1.0
