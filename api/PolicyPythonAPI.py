from flask import Flask
from flask_restful import Resource, Api, reqparse
import os
import requests
app = Flask(__name__)
api = Api(app)

VAULT_ADDR=os.environ.get('VAULT_ADDR') #http://vault:8200
VAULT_TOKEN_FILE_PATH=os.environ.get('VAULT_TOKEN_FILE_PATH')
AUTH_ROLE=os.environ.get('AUTH_ROLE')
ROLE=os.environ.get('VAULT_ROLE')
VAULT_TOKEN='VAULT_TOKEN'
POLICY_LABEL="policyLabel"
DELETE_POLICY="deletePolicy"
POLICY_PAYLOAD="policy"
AUTH_METHOD="auth_method"
ROLE="role"
POLICIES="policies"
class Token(Resource):
    # methods go here
    def get(self):
        if os.path.isfile(VAULT_TOKEN_FILE_PATH):
            file1 = open(VAULT_TOKEN_FILE_PATH, 'r')
            return file1.readline().strip()
        else:
            return "NA"

class AuthRole(Resource):
    # methods go here
    def get(self):
        return AUTH_ROLE

class Auth(Resource):
    # methods go here
    def get(self):
        parser = reqparse.RequestParser()
        parser.add_argument(VAULT_TOKEN, required=True)  # add arguments
        parser.add_argument(AUTH_METHOD, required=True)  # add arguments
        parser.add_argument(ROLE,required=False)
        args = parser.parse_args()

        headers = {
            'X-Vault-Token': args[VAULT_TOKEN]
        }
        if args[ROLE] is not None:
            response = requests.get(VAULT_ADDR + '/v1/auth/' + args[AUTH_METHOD] + '/role/' + args[ROLE], headers=headers)
            return response.json()["data"]["token_policies"]
        else:
            response = requests.get(VAULT_ADDR + '/v1/auth/' + args[AUTH_METHOD] + '/role?list=true', headers=headers)
            return response.json()["data"]["keys"]

    def post(self):
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

        requests.post(VAULT_ADDR + '/v1/auth/' + args[AUTH_METHOD] + '/role/' + args[ROLE],data=data, headers=headers)
        
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
        print("in policies get")
        if args[POLICY_LABEL] is not None:
            response = requests.get(VAULT_ADDR + '/v1/sys/policy/' + str(args[POLICY_LABEL]), headers=headers)
            return response.json()
        else:
            print(headers)
            response = requests.get(VAULT_ADDR + '/v1/sys/policy?list=true', headers=headers)
            print("response")
            print(response.json())
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
        response = requests.post(VAULT_ADDR + '/v1/sys/policy/' + args[POLICY_LABEL], headers=headers,data=data)
        return "Successful POST"

    def delete(self):
        parser = reqparse.RequestParser()
        parser.add_argument(VAULT_TOKEN, required=True)  # add arguments
        parser.add_argument(POLICY_LABEL, required=True)  # add arguments
        args = parser.parse_args()
        headers = {
            'X-Vault-Token': args[VAULT_TOKEN]
        }
        requests.delete(VAULT_ADDR + '/v1/sys/policy/' + args[POLICY_LABEL], headers=headers)
        return "Deleted(If it exists)"


api.add_resource(Policies, '/policies')  # '/policies' is our entry point
api.add_resource(Auth, '/auth')  # '/auth' is our entry point
api.add_resource(AuthRole, '/authRole')  # '/auth' is our entry point
api.add_resource(Token, '/token')  # '/token' is our entry point



if __name__ == '__main__':
    print("vault address " + str(VAULT_ADDR))
    print("vault address file path " + str(VAULT_TOKEN_FILE_PATH))
    app.run(host='0.0.0.0')  # run our Flask app