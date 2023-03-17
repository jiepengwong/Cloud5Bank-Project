from flask import Flask, request, jsonify
from flask_cors import CORS
import boto3
import uuid


app = Flask(__name__)
CORS(app)

dynamodb = boto3.resource(
  'dynamodb',
 region_name='ap-southeast-1',
  aws_access_key_id='',
  aws_secret_access_key='')

connection = boto3.client(
  'dynamodb',
  region_name='ap-southeast-1',
  aws_access_key_id='',
  aws_secret_access_key='')

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

    transaction = {
        'id': transaction_id,
        'bankAccountNumber':  data['bankAccountNumber'],
        'transactiontype' : data['transactiontype'],
        'amount': data['amount']
    }

    transactions_table.put_item(Item=transaction)

    return jsonify(transaction), 200



if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)





