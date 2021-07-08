## Storybook
This docker-compose setups `Storybook` site for development only.

## Deploy with docker-compose

```
$ docker compose up -d
[+] Building 311.1s (15/15) FINISHED
 => [internal] load build definition from storybook.Dockerfile                                      0.1s
 ..
 ..
 => => naming to docker.io/library/storybook_storybook                                              0.0s
[+] Running 2/2
 ⠿ Network storybook_default        Created                                                         4.6s
 ⠿ Container storybook_storybook_1  Started                                                         3.2s

```

## Expected result
Check containers are running and the port mapping:
```
$ docker compose ps
NAME                    SERVICE             STATUS              PORTS
storybook_storybook_1   storybook           running             0.0.0.0:3000->80/tcp, :::3000->80/tcp
```

After the application starts, navigate to `http://localhost:3000` in your web browser:

* Storybook: [`http://localhost:3000`](http://localhost:3000)

Stop and remove the containers

```
$ docker compose down
[+] Running 2/2
 ⠿ Container storybook_storybook_1  Removed                                                          0.8s
 ⠿ Network storybook_default        Removed                                                          2.0s
```