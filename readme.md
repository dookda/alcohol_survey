pull postgis

```
docker pull postgis/postgis
```

run postgis container
```
docker run --name container_postgis -e POSTGRES_PASSWORD=1234 -p 5432:5432 -d postgis/postgis 
```

build image from docker file
```
docker build -t img_alcohol .
```
run alcohol container
```
docker run --name container_alcohol -p 4000:4000 -d img_alcohol
```