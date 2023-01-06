FROM python:3.11-slim-buster

RUN apt-get -y update
RUN apt-get -y upgrade
RUN pip install poetry==1.3.1
RUN poetry config virtualenvs.create false
COPY . /code
WORKDIR /code
RUN poetry install --without dev

CMD ["/bin/bash","-c","cd src && python3 main.py"]