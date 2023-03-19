FROM python:3-slim
WORKDIR /usr/src/app
COPY requirements.txt ./

ENV ACCESS_KEY $ACCESS_KEY
ENV SECRET_KEY $AWS_SECRET_KEY
ENV REGION $REGION
EXPOSE 5000

RUN python -m pip install --no-cache-dir -r requirements.txt
COPY ./accounts.py ./
CMD [ "python", "./accounts.py" ]