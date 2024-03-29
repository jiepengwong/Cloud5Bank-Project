from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os, sys
import requests
from invokes import invoke_http

app = Flask(__name__)
CORS(app)

response = requests.get('http://169.254.169.254/latest/meta-data/public-ipv4')
public_ip_address = response.text
details_bankaccount_URL = "http://cloud5bank-alb2-46227631.ap-southeast-1.elb.amazonaws.com:5000/bankaccounts"
balance_bankaccount_URL = "http://cloud5bank-alb2-46227631.ap-southeast-1.elb.amazonaws.com:5000/bankAccountBalance"
transaction_URL = "http://cloud5bank-alb1-518477221.ap-southeast-1.elb.amazonaws.com:5001/createTransactionLog"

@app.route('/')
def hello():
    return "External Complex Connected!"

# Logic:
# To post: (user_account_id, amount_user_wants)
# 1. Take money from EXTERNAL bank API, store amount - Fake it and just update the amount that they want, don't need create another API - Much simpler
# 2. Update balance of account for user
@app.route("/depositFromBank", methods=['POST'])
def depositFromBank():
    if request.is_json:
        data = request.json
        print(data)
        print("\nReceived an process in JSON:", data)
        # do the actual work
        # 1. Send order info {cart items}
        result = processTransferDeposit(data["fundsFromBank"],data["user_account_id"])
        # Returns a tuple
        jsonobject = result[0].json
        return jsonify(jsonobject), 200

def processTransferDeposit(fundsFromBank, user_account_id):
    # ==== Assume amount has been obtained from the bank ====
    # Process

    # Get original balance amount from user
    userAccount = invoke_http(details_bankaccount_URL+ '/' + user_account_id, method="GET")
    currentUserAccountBalance = userAccount["balance"]

    # Update the value of the balance now
    updatedUserAccountBalance = int(currentUserAccountBalance) + fundsFromBank

    # Update to end point via PUT
    json_update = json.dumps({"user_account_id":user_account_id, "balance": updatedUserAccountBalance })
    updateUserAccountResponse = invoke_http(balance_bankaccount_URL, method="PUT", json=json.loads(json_update))
    print(updateUserAccountResponse)
    print("Updated Successfully")
    # Create the transaction
    print("========= Creating Transaction ==========")
    transaction_json_data_useraccount = json.dumps({'fromAccountUserId': userAccount["user_account_id"] , 'fromAccountBankNumber': None, 'transactiontype': "Deposited From External Bank" , 'toAccountUserId': None, 'toAccountBankNumber': None, 'amount': fundsFromBank})
    fromAccountTransaction = invoke_http(transaction_URL,method="POST", json=json.loads(transaction_json_data_useraccount))
    return jsonify({'message': 'Successfully deposited from external bank!','user_account_id': user_account_id, "bankaccountnumber": userAccount['bankaccountnumber'], 'amountreceived': fundsFromBank,"oldbalance": int(currentUserAccountBalance),  "currentbalance": int(updateUserAccountResponse['balance'])}), 200

@app.route("/withdrawToBank", methods=['POST'])
def withdrawToBank():
    if request.is_json:
        data = request.json
        print(data)
        print("\nReceived an process in JSON:", data)
        # do the actual work
        # 1. Send order info {cart items}
        result = processTransferWithdrawToBank(data["fundsToBank"],data["user_account_id"])
        # Returns a tuple
        jsonobject = result[0].json
        return jsonify(jsonobject), 200
    
def processTransferWithdrawToBank(fundsToBank, user_account_id):
    # ==== Assume amount has been obtained from the bank ====
    # Process

    # Get original balance amount from user
    userAccount = invoke_http(details_bankaccount_URL+ '/' + user_account_id, method="GET")
    currentUserAccountBalance = userAccount["balance"]

    # Update the value of the balance now
    updatedUserAccountBalance = int(currentUserAccountBalance) - fundsToBank

    if (updatedUserAccountBalance < 0 ):
        return jsonify({'message': 'insufficient funds in bank account to withdraw selected fund to bank', "amount": fundsToBank }), 200


    # Update to end point via PUT
    json_update = json.dumps({"user_account_id":user_account_id, "balance": updatedUserAccountBalance })
    updateUserAccountResponse = invoke_http(balance_bankaccount_URL, method="PUT", json=json.loads(json_update))
    print(updateUserAccountResponse)
    print("Updated Successfully")
    # Create the transaction
    print("========= Creating Transaction ==========")
    transaction_json_data_useraccount = json.dumps({'fromAccountUserId': userAccount["user_account_id"] , 'fromAccountBankNumber': None, 'transactiontype': "Withdrawn To External Bank" , 'toAccountUserId': None, 'toAccountBankNumber': None, 'amount': fundsToBank})
    fromAccountTransaction = invoke_http(transaction_URL,method="POST", json=json.loads(transaction_json_data_useraccount))
    return jsonify({'message': 'Successfully withdrawn to external bank!','user_account_id': user_account_id, "bankaccountnumber": userAccount['bankaccountnumber'], "amountwithdrawn": fundsToBank, "oldbalance": int(currentUserAccountBalance),"currentbalance": int(updateUserAccountResponse['balance'])}), 200


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5003, debug=True)