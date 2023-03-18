FROM python:3-slim
WORKDIR /usr/src/app
COPY requirements.txt ./
RUN python -m pip install --no-cache-dir -r requirements.txt
COPY ./accounts.py ./
ENV PORT=5000
EXPOSE 5000
CMD [ "python", "./accounts.py" ]