from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os, sys
import requests
from invokes import invoke_http

app = Flask(__name__)
CORS(app)
details_bankaccount_URL = "http://localhost:5000/bankaccounts"
balance_bankaccount_URL = "http://localhost:5000/bankAccountBalance"
transaction_URL = "http://localhost:5001/createTransactionLog"


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
    transaction_json_data_useraccount = json.dumps({'fromAccountUserId': None , 'fromAccountBankNumber': None, 'transactiontype': "Deposited From External Bank" , 'toAccountUserId': None, 'toAccountBankNumber': None, 'amount': fundsFromBank})
    fromAccountTransaction = invoke_http(transaction_URL,method="POST", json=json.loads(transaction_json_data_useraccount))
    return jsonify({'message': 'Successfully deposited from external bank!','user_account_id': user_account_id, "bankaccountnumber": userAccount['bankaccountnumber']  }), 200



if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5003, debug=True)