FROM python:3.13.2

COPY . /home/app

WORKDIR /home/app

RUN python3 -m venv env && \
    ./env/bin/pip install --upgrade pip && \
    ./env/bin/pip install -r ./requirements/requirements.txt 
    
RUN ./env/bin/pip install python-dotenv

CMD ["./env/bin/python","-u","server.py"]