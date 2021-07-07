from flask import Flask
from flask_restful import Resource, Api, reqparse
import pandas as pd
import ast
import requests
app = Flask(__name__)
api = Api(app)

VAULT_TOKEN='VAULT_TOKEN'
POLICY_LABEL="policyLabel"
DELETE_POLICY="deletePolicy"
POLICY_PAYLOAD="policy"
AUTH_METHOD="auth_method"
ROLE="role"
POLICIES="policies"
class Auth(Resource):
    # methods go here
    def get(self):
        print("get Auth")
        parser = reqparse.RequestParser()
        parser.add_argument(VAULT_TOKEN, required=True)  # add arguments
        parser.add_argument(AUTH_METHOD, required=True)  # add arguments
        parser.add_argument(ROLE,required=False)
        args = parser.parse_args()

        headers = {
            'X-Vault-Token': args[VAULT_TOKEN]
        }
        if args[ROLE] is not None:
            response = requests.get('http://vault:8200/v1/auth/' + args[AUTH_METHOD] + '/role/' + args[ROLE], headers=headers)
            return response.json()["data"]["token_policies"]
        else:
            response = requests.get('http://vault:8200/v1/auth/' + args[AUTH_METHOD] + '/role?list=true', headers=headers)
            return response.json()["data"]["keys"]

    def post(self):
        print("post Auth")
        parser = reqparse.RequestParser()
        parser.add_argument(VAULT_TOKEN, required=True)  # add arguments
        parser.add_argument(AUTH_METHOD, required=True)  # add arguments
        parser.add_argument(ROLE,required=True)
        parser.add_argument(POLICIES,required=True)
        args = parser.parse_args()

        headers = {
            'X-Vault-Token': args[VAULT_TOKEN]
        }
        data = {"policies" : args['policies']}

        requests.post('http://vault:8200/v1/auth/' + args[AUTH_METHOD] + '/role/' + args[ROLE],data=data, headers=headers)
        
        return "Successful Post"

class Policies(Resource):
    # methods go here
    def get(self):
        parser = reqparse.RequestParser()
        parser.add_argument(VAULT_TOKEN, required=True)  # add arguments
        parser.add_argument(POLICY_LABEL, required=False)  # add arguments
        args = parser.parse_args()

        headers = {
            'X-Vault-Token': args[VAULT_TOKEN]
        }
        if args[POLICY_LABEL] is not None:
            response = requests.get('http://vault:8200/v1/sys/policy/' + str(args[POLICY_LABEL]), headers=headers)
            return response.json()
        else:
            response = requests.get('http://vault:8200/v1/sys/policy?list=true', headers=headers)
            return response.json()['policies']

    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument(VAULT_TOKEN, required=True)  # add arguments
        parser.add_argument(POLICY_LABEL, required=True)  # add arguments
        parser.add_argument(POLICY_PAYLOAD, required=True)  # add arguments
        args = parser.parse_args()
        headers = {
            'X-Vault-Token': args[VAULT_TOKEN]
        }
        # print(args['policy'])
        data = {"policy" : args['policy']}
        # print("\n\n")
        # print(args['policy'])
        # print("\n\n")
        response = requests.post('http://vault:8200/v1/sys/policy/' + args[POLICY_LABEL], headers=headers,data=data)
        return "Successful POST"

    def delete(self):
        parser = reqparse.RequestParser()
        parser.add_argument(VAULT_TOKEN, required=True)  # add arguments
        parser.add_argument(POLICY_LABEL, required=True)  # add arguments
        args = parser.parse_args()
        headers = {
            'X-Vault-Token': args[VAULT_TOKEN]
        }
        requests.delete('http://vault:8200/v1/sys/policy/' + args[POLICY_LABEL], headers=headers)
        return "Deleted(If it exists)"


api.add_resource(Policies, '/policies')  # '/users' is our entry point

api.add_resource(Auth, '/auth')  # '/users' is our entry point


if __name__ == '__main__':
    app.run(host='0.0.0.0')  # run our Flask app