from flask import Flask, request, jsonify
from flask_cors import CORS
import boto3
import uuid
from dotenv import load_dotenv
import os
from datetime import datetime

app = Flask(__name__)
CORS(app)

load_dotenv()
# Configs for dynamodb
dynamodb = boto3.resource(
  'dynamodb',
   region_name=os.environ.get('REGION'),
  aws_access_key_id=os.environ.get('ACCESS_KEY'),
  aws_secret_access_key=os.environ.get('SECRET_KEY'))

connection = boto3.client(
  'dynamodb',
  region_name=os.environ.get('REGION'),
  aws_access_key_id=os.environ.get('ACCESS_KEY'),
  aws_secret_access_key=os.environ.get('SECRET_KEY'))

transactions_table = dynamodb.Table('transactions')


# [GET] Get routes
@app.route('/alltransactions', methods=['GET'])
def get_all_accounts():
    try:
        response = transactions_table.scan()
        accounts = response['Items']
        return jsonify(accounts), 200
    except:
        return jsonify({"error" : "not found"},404)



# Post routes

# Create transaction
@app.route('/createTransactionLog', methods=['POST'])
def createTransaction(): 
    data = request.json
    transaction_id = str(uuid.uuid4())
    now = datetime.now()
    now_str = now.strftime('%Y-%m-%d %H:%M:%S')
    print(now_str)

    transaction = {
        'transaction_id': transaction_id,
        'fromAccountUserId': data['fromAccountUserId'],
        'fromAccountBankNumber': data['fromAccountBankNumber'],
        'transactiontype' : data['transactiontype'],
        'toAccountUserId': data['toAccountUserId'],
        'toAccountBankNumber': data['toAccountBankNumber'],
        'amount': data['amount'],
        'dateTransaction': now_str
    }


    transactions_table.put_item(Item=transaction)

    return jsonify(transaction), 200



if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)





