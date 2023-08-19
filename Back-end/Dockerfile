# Use an official Python runtime as a parent image
FROM python:3.9.5-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set the working directory
WORKDIR /app

# Install dependencies
RUN apt-get update && apt-get -y install libpq-dev gcc && pip install psycopg2
COPY requirements.txt /app/
RUN python3 -m pip install --no-cache-dir -r requirements.txt

# Copy the current directory contents into the container
COPY . /app/

# Expose the port the app runs on
EXPOSE 8000

# change the directory to SyncInc and run the django commands 
WORKDIR /app/SyncInc

# migrate the database
RUN python manage.py makemigrations accounts
RUN python manage.py makemigrations project_api
RUN python manage.py migrate

# Start the Django development server
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
