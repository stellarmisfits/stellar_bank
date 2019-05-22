### Requirements
-	docker-compose (https://docs.docker.com/compose/install/)

### Run
Change values in `.env` (this file is stored in repo just as an example) and run
```
docker-compose up --build
```

### Entering postgres container
In `accounts-service` directory run:
```
docker exec -it <container_name> bash
```
Then you should be redirected to container. In container run:
```
psql -U <.env/DB_USER> -d <.env/DB_NAME>
```