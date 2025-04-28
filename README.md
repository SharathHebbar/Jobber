# Jobber


- One stop place to investigate about Jobs

[![Watch the video](https://github.com/SharathHebbar/Jobber/blob/main/Assets/Jobber.png?raw=true)](https://github.com/SharathHebbar/Jobber/blob/main/Assets/Walkthrough.mp4)


## To run this app

### Backend
Navigate to ```jobber-be``` folder

Install the requirements using
```sh
pip install -r requirements.txt
```

Then

```sh
uvicorn main:app
```

Else Start Docker Desktop

Build a Docker Image
```sh
docker build -t <imagename>: <version-name> .
```

Run it through Docker Container
```sh
docker run --name <container-name> -p 80:80 <imagename>
```

### Frontend
Navigate to ```jobber-ui``` folder

Install the requirements using
```sh
npm install
```

Then

```sh
npm run dev
```

Else Start Docker Desktop

Build a Docker Image
```sh
docker build -t <imagename>: <version-name> .
```

Run it through Docker Container
```sh
docker run --name <container-name> -p 80:80 <imagename>
```


### Run it via Docker Compose setup

Start Docker Desktop and run 
```sh
docker-compose up --build
```