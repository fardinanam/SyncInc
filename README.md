# SyncInc.

## Backend Setup
- go to the backend directory
  ```bash
    cd Back-end
  ```
- From `/Syncinc` folder, copy the `.env.example` file and rename it to `.env`
- Fill in the required fields in the `.env` file
    - For using sqlite3, set the following environment variables as follows:
        ```env
        SERVER=LOCAL
        LOCAL_DATABASE_ENGINE="django.db.backends.sqlite3"
        LOCAL_DATABASE_NAME="db.sqlite3"
        ```
- Use `venv` or `conda` to create a virtual environment. For `venv`, run the following commands:

  ```bash
    python -m venv env
    source env/bin/activate
  ```
- install dependencies in the virtual environment
  ```bash
    pip install --upgrade pip
    pip install -r requirements.txt
  ```
> [!WARNING]
> If you face any problem installing `psycopg2`, remove it from the `requirements.txt` file and install `psycopg2-binary` manually instead.

- Migrate the database

  ```bash
      python manage.py makemigrations accounts
      python manage.py makemigrations project_api
      python manage.py migrate accounts
      python manage.py migrate project_api
      python manage.py migrate
  ```
- run the server
  ```bash
    python manage.py runserver
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