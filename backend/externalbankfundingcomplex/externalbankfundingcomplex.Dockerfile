FROM python:3-slim
WORKDIR /usr/src/app
COPY requirements.txt ./
RUN python -m pip install --no-cache-dir -r requirements.txt
COPY ./externalbankfundingcomplex.py ./invokes.py  ./
ENV PORT = 5003
EXPOSE 5003
CMD [ "python", "./externalbankfundingcomplex.py" ]