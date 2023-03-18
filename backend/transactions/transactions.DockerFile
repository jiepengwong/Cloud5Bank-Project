FROM python:3-slim
WORKDIR /usr/src/app
COPY requirements.txt ./
RUN python -m pip install --no-cache-dir -r requirements.txt
COPY ./transactions.py ./
ENV PORT = 5001
EXPOSE 5001
CMD [ "python", "./transactions.py" ]