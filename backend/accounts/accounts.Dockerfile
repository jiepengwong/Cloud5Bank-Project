FROM python:3-slim
WORKDIR /usr/src/app
COPY requirements.txt ./
RUN python -m pip install --no-cache-dir -r requirements
COPY ./reject_offer.py ./invokes.py ./amqp_setup.py ./
CMD [ "python", "./account.py" ]