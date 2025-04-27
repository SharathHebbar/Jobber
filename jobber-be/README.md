# Jobber Backend using Fast API

- To start this app follow the below steps

Create a .env file
```python
COHERE_API_KEY = "<Your Cohere Key>"
COHERE_MODEL = "<Cohere Model>"
TEMPERATURE = 0.0
```

First install the requirements.txt
```sh
pip install -r requirements.txt
```

Then run uvicorn
```sh
uvicorn main:app
```

Navigate to 
```sh
http://localhost:8000/
```