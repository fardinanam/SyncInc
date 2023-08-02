# SyncInc.

## Django Setup
- install python virtual environment
  ```bash
    pip install virtualenv
  ```
- create a virtual environment
  ```bash
    virtualenv ENV
  ```
- activate the virtual environment
  ```bash
    ENV\Scripts\activate
  ```
- install dependencies
  ```bash
    pip install --upgrade pip
    pip install -r requirements.txt
  ```
- run the server
  ```bash
    python manage.py runserver
  ```

## How to run the database migration

```bash
    python manage.py makemigrations accounts
    python manage.py makemigrations project_api
    python manage.py migrate accounts
    python manage.py migrate project_api
    python manage.py migrate
```

## React Setup
- go to the project directory
  ```bash
    cd Front-end/syncinc
  ```
- install dependencies
  ```bash
    npm install
  ```
- run the server
  ```bash
    npm start
  ```