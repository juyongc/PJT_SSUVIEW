FROM pytorch/pytorch
RUN apt -y update

COPY . /workspace

WORKDIR /workspace
RUN     pip install -r requirements.txt

RUN apt-get update
RUN yes | apt-get -y install libgl1-mesa-glx
RUN yes | apt-get install libglib2.0-0

EXPOSE 3000

WORKDIR /workspace
CMD ["gunicorn", "app:app", "-b", "0.0.0.0:3000", "--timeout", "0", "-w", "2", "--worker-class", "gevent"]
