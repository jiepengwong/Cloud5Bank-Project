from flask import Flask, request, jsonify
from flask_cors import CORS
import json

import os, sys

import requests
from invokes import invoke_http

app = Flask(__name__)
CORS(app)


# Updated, need to fetch metadata from ec2 instances where container instances is residing in
# can edit this accordingly to get the private ipv4 as well. This is the ip u need to specify to get metadata from the ec2 instance
response = requests.get('http://169.254.169.254/latest/meta-data/public-ipv4')
public_ip_address = response.text

details_bankaccount_URL = "http://cloud5bank-alb2-46227631.ap-southeast-1.elb.amazonaws.com:5000/bankaccounts"
balance_bankaccount_URL = "http://cloud5bank-alb2-46227631.ap-southeast-1.elb.amazonaws.com:5000/bankAccountBalance"
transaction_URL = "http://cloud5bank-alb1-518477221.ap-southeast-1.elb.amazonaws.com:5001/createTransactionLog"

# details_bankaccount_URL = "http://ecs-bank-service.test-service-discovery-namespace.ap-southeast-1.compute.internal:5000/bankaccounts"
# balance_bankaccount_URL = "http://cloud5bank-alb2-46227631.ap-southeast-1.elb.amazonaws.com:5000/bankAccountBalance"
# transaction_URL = "http://cloud5bank-alb1-518477221.ap-southeast-1.elb.amazonaws.com:5001/createTransactionLog"

# For local
# details_bankaccount_URL = "http://bank-accounts:5000/bankaccounts"
# balance_bankaccount_URL = "http://bank-accounts:5000/bankAccountBalance"
# transaction_URL = "http://transactions:5001/createTransactionLog"


# Logic:
# Post data that would include account to and account from 
# /*
# {
#     toAccount: 123,
#     fromAccount: 231,
#     amount: 50
# }
@app.route("/", methods=["GET"])
def transfercomplex():
    response = requests.get('http://169.254.169.254/latest/meta-data/public-ipv4')
    public_ip_address = response.text
    return public_ip_address

@app.route("/test",methods=["GET"])
def transfercomplex_test():
    fromAccount = invoke_http(details_bankaccount_URL + '/' + "serial3", method="GET")
    fromAccountBalance = fromAccount["balance"]
    return fromAccountBalance

@app.route("/transferfunds", methods=['POST'])
def transferfunds():
    if request.is_json:
        data = request.json
        print(data)
        print("\nReceived an process in JSON:", data)

        # do the actual work
        # 1. Send order info {cart items}
        result = processTransfer(data["amount"],data["fromAccountUserid"], data["toAccountUserid"])
        # Returns a tuple
        jsonobject = result[0].json
        return jsonify(jsonobject), 200

def processTransfer(amount, fromAccountID, toAccountID):

    # Process
    # Get balance fromAccount
    fromAccount = invoke_http(details_bankaccount_URL+ '/' + fromAccountID, method="GET")
    print(fromAccount)
    fromAccountBalance = fromAccount["balance"]
    print(type(fromAccount))
    # Get amount transferrable
    newAmount = int(fromAccountBalance) - amount
    print("New Amount of From account: " + str(newAmount))
    if (newAmount < 0):
        return jsonify({'message': 'insufficient funds'}), 404

    # update fromAccount balance
    json_data_1 = json.dumps({"balance": newAmount, "user_account_id":fromAccountID})
    # Wtf use json.loads ok ?? 
    updateFromAccount = invoke_http(balance_bankaccount_URL, method="PUT", json=json.loads(json_data_1))
    # updateFromAccount = requests.request("PUT", balance_bankaccount_URL, json=json_data)
    print("============== Updating From Account User ID (There should be a decrease) ====================")

    print(updateFromAccount)

    # Get balance from toAccount
    toAccount = invoke_http(details_bankaccount_URL+ '/' + toAccountID, method="GET")
    # Add amount to balance 
    newAmountToAccount = int(toAccount["balance"]) + amount
    # Update toAccount balance
    json_data_2= json.dumps({"balance": newAmountToAccount, "user_account_id": toAccountID})
    updateToAccount = invoke_http(balance_bankaccount_URL, method="PUT", json=json.loads(json_data_2))
    print("============== Updating To Account User ID (There should be a increase)====================")
    print(updateToAccount)


    # Create the relevant transactions

    # Create transaction for fromAccountID
    transaction_json_data_fromaccount = json.dumps({'fromAccountUserId': fromAccountID , 'fromAccountBankNumber': fromAccount['bankaccountnumber'], 'transactiontype': "transferred" , 'toAccountUserId': toAccountID, 'toAccountBankNumber': toAccount['bankaccountnumber'], 'amount': amount})
    print(transaction_json_data_fromaccount)
    fromAccountTransaction = invoke_http(transaction_URL,method="POST", json=json.loads(transaction_json_data_fromaccount))

    # # Create transaction for toAccountID
    # transaction_json_data_toaccount = json.dumps({'fromAccountUserId': toAccountID , 'fromAccountBankNumber': toAccount['accountnumber'], 'transactiontype': "received" , 'toAccountUserId': fromAccountID, 'toAccountBankNumber': fromAccount['accountnumber'], 'amount': amount})
    # toAccountTransaction = invoke_http(transaction_URL,method="POST", json=json.loads(transaction_json_data_toaccount))

    return jsonify({'message': 'Successfully transferred','amount': amount, 'fromAccount':updateFromAccount,'toAccount': toAccount, 'transaction': fromAccountTransaction }), 200



if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5002, debug=True)