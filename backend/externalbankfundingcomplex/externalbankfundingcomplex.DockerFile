FROM python:3-slim
WORKDIR /usr/src/app
COPY requirements.txt ./
RUN python -m pip install --no-cache-dir -r requirements.txt
COPY ./externalbankfundingcomplex.py ./invokes.py  ./

ENV ACCESS_KEY $ACCESS_KEY
ENV SECRET_KEY $AWS_SECRET_KEY
ENV REGION $REGION

EXPOSE 5003
CMD [ "python", "./externalbankfundingcomplex.py" ]
