from flask import Flask, request, jsonify
from flask_cors import CORS
import boto3
import uuid


app = Flask(__name__)
CORS(app)

# Configs for dynamodb
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


bank_accounts_table = dynamodb.Table('bank_accounts')

# Assume userid tied to only 1 BANK account 
################################################
@app.route('/')
def hello():
    return "Account connected"


# [GET] Get routes

# Get all bank account
@app.route('/allbankaccounts', methods=['GET'])
def get_all_accounts():
    response = bank_accounts_table.scan()
    accounts = response['Items']
    return jsonify(accounts), 200

# Get particular bank account
@app.route('/bankaccounts/<id>', methods=['GET'])
def get_account(id):
    response = bank_accounts_table.get_item(Key={'user_account_id': id})
    if 'Item' not in response:
        return jsonify({'message': 'Account not found'}), 404

    account = response['Item']
    return jsonify(account), 200

# Create Account
@app.route('/createBankAccount', methods=['POST'])
def create_account(): 

    data = request.json
    user_account_id = data["user_account_id"]
    # Generate a unique ID for the account / Change and get it from the cognito side, this would be the authorization headers; Post it  to this endpoint
    # Simulate this , but this is obtain from cognito, posted to the backend
    # user_account_id = str(uuid.uuid4())

    # Generate new account for each user
    accountnumber = str(uuid.uuid4())

    # Check if the user ID already exists in the table
    response = bank_accounts_table.get_item(Key={'user_account_id': user_account_id})
    if 'Item' in response:
        return jsonify({'message': f"User ID '{user_account_id}' already exists"}), 400

    # Create a new account in DynamoDB
    account = {
        'user_account_id': data["user_account_id"], # From cognito side? can hardcode
        'accountnumber': accountnumber,
        'name': data['name'],
        'email': data['email'],
        "balance": 0,
        'is_active': True,
        'type': "admin"
    }
    print(account)
    bank_accounts_table.put_item(Item=account)

    return jsonify({'accountnumber': accountnumber, 'message': "Banking account successfully created"}, 201)


# [PUT] Put routes
# Modify Active Status of bank account
@app.route('/bankAccountStatus', methods=['PUT'])
def update_bank_account_active_status():
    data = request.json

    # From frontend
    user_account_id = data["user_account_id"]

    # Check if the account exists in DynamoDB
    try:
        account = bank_accounts_table.get_item(Key={'user_account_id': user_account_id})['Item']
    except KeyError:
        return jsonify({'error': 'Account not found'}), 404
    
    # Update the account with the new data
    account.update({
        'is_active': data.get('is_active', account['is_active'])
    })
    
    # Save the updated account to DynamoDB
    bank_accounts_table.put_item(Item=account)
    
    return jsonify(account), 200

# Modify Balance of bank account
@app.route('/bankAccountBalance', methods=['PUT'])
def update_bank_account_balance():
    data = request.get_json()
    
    # From frontend
    user_account_id = data["user_account_id"]
    # Check if the account exists in DynamoDB
    try:
        print("Error")
        account = bank_accounts_table.get_item(Key={'user_account_id': user_account_id})['Item']
    except KeyError:
        return jsonify({'error': 'Account not found'}), 404
    
    # Update the account with the new data
    account.update({
        'balance': data["balance"]
    })
    
    # Save the updated account to DynamoDB
    print("no error")

    bank_accounts_table.put_item(Item=account)
    
    return jsonify(account), 200


# [DELETE] Delete route

# Delete bank account
@app.route('/deletebankaccount/<user_account_id>', methods=['DELETE'])
def delete_account(user_account_id):
    try:
        response = bank_accounts_table.delete_item(Key={'user_account_id': user_account_id})
        if 'Attributes' not in response:
            return jsonify({'message': 'Account deleted successfully'})
    except Exception as e:
        if 'ResourceNotFoundException' in str(e):
            return jsonify({'error': f"Account with ID {user_account_id} not found"}), 404
        else:
            return jsonify({'error': f"Failed to delete account with ID {user_account_id}"}), 500
    
    return jsonify({'error': f"Failed to delete account with ID {user_account_id}"}), 500



if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)