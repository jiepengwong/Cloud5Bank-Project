FROM python:3-slim
WORKDIR /usr/src/app
COPY requirements.txt ./
RUN python -m pip install --no-cache-dir -r requirements
COPY ./transferaccountcomplex.py ./invokes.py  ./
ENV PORT = 5002
EXPOSE 5002
CMD [ "python", "./transferaccountcomplex.py" ]