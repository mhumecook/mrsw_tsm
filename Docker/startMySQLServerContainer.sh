docker build -t mhumecook/mrsw_mysql_server:1.0 .
docker run --name mysql -e MYSQL_ROOT_PASSWORD=project1x -d mhumecook/mrsw_mysql_server:1.0
