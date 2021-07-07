import unittest
import requests
import subprocess
from flask import Flask
from flask_restful import Resource, Api, reqparse
import time
from requests.models import Response
app = Flask(__name__)
api = Api(app)
VAULT_TOKEN=""
headers = {}
class APITestSuite(unittest.TestCase):

    def test_initialPolicies(self):
        response = requests.get('http://localhost:5000/policies?VAULT_TOKEN=' + VAULT_TOKEN)
        self.assertEqual(response.json(), ['default','root'])

    def test_addPolicy(self):
        data ={"policy":'# need these paths to grant permissions:\\npath \\"secret/data/*\\" {\\n  capabilities = [\\"create\\", \\"update\\"]\\n}\\n\\npath \\"secret/data/foo\\" {\\n  capabilities = [\\"read\\"]\\n}\\n'}
        response = requests.post('http://localhost:5000/policies?VAULT_TOKEN=' + VAULT_TOKEN + '&policyLabel=foo-policy',data=data,verify=False)
        self.assertEqual(response.json(),"Successful POST")
        response = requests.get('http://localhost:5000/policies?VAULT_TOKEN=' + VAULT_TOKEN + '&policyLabel=foo-policy')
        response = response.json()
        self.assertEqual(response['name'],'foo-policy')
        self.assertEqual(response['rules'],data['policy'])

        response = requests.delete('http://localhost:5000/policies?VAULT_TOKEN=' + VAULT_TOKEN + '&policyLabel=foo-policy',verify=False)

    def test_deletePolicy(self):
        data ={"policy":'# need these paths to grant permissions:\\npath \\"secret/data/*\\" {\\n  capabilities = [\\"create\\", \\"update\\"]\\n}\\n\\npath \\"secret/data/foo\\" {\\n  capabilities = [\\"read\\"]\\n}\\n'}
        response = requests.post('http://localhost:5000/policies?VAULT_TOKEN=' + VAULT_TOKEN + '&policyLabel=foo-policy',data=data,verify=False)
        response = requests.delete('http://localhost:5000/policies?VAULT_TOKEN=' + VAULT_TOKEN + '&policyLabel=foo-policy',verify=False)
        self.assertEqual(response.json(),"Deleted(If it exists)")
        response = requests.get('http://localhost:5000/policies?VAULT_TOKEN=' + VAULT_TOKEN + '&policyLabel=foo-policy')
        self.assertEqual(response.json(),{'errors': []})

    def test_ViewlistOfNewlyAddedPolicies(self):
        data ={"policy":'# need these paths to grant permissions:\\npath \\"secret/data/*\\" {\\n  capabilities = [\\"create\\", \\"update\\"]\\n}\\n\\npath \\"secret/data/foo\\" {\\n  capabilities = [\\"read\\"]\\n}\\n'}
        response = requests.post('http://localhost:5000/policies?VAULT_TOKEN=' + VAULT_TOKEN + '&policyLabel=foo-policy',data=data,verify=False)
        response = requests.post('http://localhost:5000/policies?VAULT_TOKEN=' + VAULT_TOKEN + '&policyLabel=foo1-policy',data=data,verify=False)
        response = requests.post('http://localhost:5000/policies?VAULT_TOKEN=' + VAULT_TOKEN + '&policyLabel=foo2-policy',data=data,verify=False)
        time.sleep(1)
        response = requests.get('http://localhost:5000/policies?VAULT_TOKEN=' + VAULT_TOKEN)
        self.assertEqual(response.json(), ['default','foo-policy','foo1-policy','foo2-policy','root'])

        response = requests.delete('http://localhost:5000/policies?VAULT_TOKEN=' + VAULT_TOKEN + '&policyLabel=foo-policy',verify=False)
        response = requests.delete('http://localhost:5000/policies?VAULT_TOKEN=' + VAULT_TOKEN + '&policyLabel=foo1-policy',verify=False)
        response = requests.delete('http://localhost:5000/policies?VAULT_TOKEN=' + VAULT_TOKEN + '&policyLabel=foo2-policy',verify=False)

    def test_ViewlistOfNewlyAddedDifferentPolicies(self):
        foodata ={"policy":'# need these paths to grant permissions:\\npath \\"secret/data/*\\" {\\n  capabilities = [\\"create\\", \\"update\\"]\\n}\\n\\npath \\"secret/data/foo\\" {\\n  capabilities = [\\"read\\"]\\n}\\n'}
        foo1data ={"policy":'# need these paths to grant permissions:\\npath \\"secret/data/*\\" {\\n  capabilities = [\\"create\\", \\"update\\",\\"read\\",\\"delete\\"]\\n}\\n\\npath \\"secret/data/foo1\\" {\\n  capabilities = [\\"read\\",\\"write\\"]\\n}\\n'}
        foo2data ={"policy":'# need these paths to grant permissions:\\npath \\"secret/data/*\\" {\\n  capabilities = []\\n}\\n\\npath \\"secret/data/foo2\\" {\\n  capabilities = [\\"read\\",\\"create\\"]\\n}\\n'}
        response = requests.post('http://localhost:5000/policies?VAULT_TOKEN=' + VAULT_TOKEN + '&policyLabel=foo-policy',data=foodata,verify=False)
        response = requests.post('http://localhost:5000/policies?VAULT_TOKEN=' + VAULT_TOKEN + '&policyLabel=foo1-policy',data=foo1data,verify=False)
        response = requests.post('http://localhost:5000/policies?VAULT_TOKEN=' + VAULT_TOKEN + '&policyLabel=foo2-policy',data=foo2data,verify=False)
        time.sleep(1)
        response = requests.get('http://localhost:5000/policies?VAULT_TOKEN=' + VAULT_TOKEN)
        self.assertEqual(response.json(), ['default','foo-policy','foo1-policy','foo2-policy','root'])

        response = requests.get('http://localhost:5000/policies?VAULT_TOKEN=' + VAULT_TOKEN + '&policyLabel=foo-policy')
        response = response.json()
        self.assertEqual(response['name'],'foo-policy')
        self.assertEqual(response['rules'],foodata['policy'])

        response = requests.get('http://localhost:5000/policies?VAULT_TOKEN=' + VAULT_TOKEN + '&policyLabel=foo1-policy')
        response = response.json()
        self.assertEqual(response['name'],'foo1-policy')
        self.assertEqual(response['rules'],foo1data['policy'])

        response = requests.get('http://localhost:5000/policies?VAULT_TOKEN=' + VAULT_TOKEN + '&policyLabel=foo2-policy')
        response = response.json()
        self.assertEqual(response['name'],'foo2-policy')
        self.assertEqual(response['rules'],foo2data['policy'])

        response = requests.delete('http://localhost:5000/policies?VAULT_TOKEN=' + VAULT_TOKEN + '&policyLabel=foo-policy',verify=False)
        response = requests.delete('http://localhost:5000/policies?VAULT_TOKEN=' + VAULT_TOKEN + '&policyLabel=foo1-policy',verify=False)
        response = requests.delete('http://localhost:5000/policies?VAULT_TOKEN=' + VAULT_TOKEN + '&policyLabel=foo2-policy',verify=False)

    def test_updatePolicy(self):
        data ={"policy":'# need these paths to grant permissions:\\npath \\"secret/data/*\\" {\\n  capabilities = [\\"create\\", \\"update\\"]\\n}\\n\\npath \\"secret/data/foo\\" {\\n  capabilities = [\\"read\\"]\\n}\\n'}
        newData ={"policy":'# need these paths to grant permissions:\\npath \\"secret/data/*\\" {\\n  capabilities = [\\"create\\"]\\n}\\n\\npath \\"secret/data/foo\\" {\\n  capabilities = [\\"read\\"]\\n}\\n'}
        response = requests.post('http://localhost:5000/policies?VAULT_TOKEN=' + VAULT_TOKEN + '&policyLabel=foo-policy',data=data,verify=False)
        time.sleep(1)
        response = requests.get('http://localhost:5000/policies?VAULT_TOKEN=' + VAULT_TOKEN + '&policyLabel=foo-policy')
        self.assertEqual(response.json()['rules'],data['policy'])
        response = requests.post('http://localhost:5000/policies?VAULT_TOKEN=' + VAULT_TOKEN + '&policyLabel=foo-policy',data=newData,verify=False)
        time.sleep(1)
        response = requests.get('http://localhost:5000/policies?VAULT_TOKEN=' + VAULT_TOKEN + '&policyLabel=foo-policy')
        self.assertEqual(response.json()['rules'],newData['policy'])
        response = requests.get('http://localhost:5000/policies?VAULT_TOKEN=' + VAULT_TOKEN + '&policyLabel=foo-policy')
        response = requests.delete('http://localhost:5000/policies?VAULT_TOKEN=' + VAULT_TOKEN + '&policyLabel=foo-policy',verify=False)

    def test_deleteMultiplePolicies(self):
        data ={"policy":'# need these paths to grant permissions:\\npath \\"secret/data/*\\" {\\n  capabilities = [\\"create\\", \\"update\\"]\\n}\\n\\npath \\"secret/data/foo\\" {\\n  capabilities = [\\"read\\"]\\n}\\n'}
        response = requests.post('http://localhost:5000/policies?VAULT_TOKEN=' + VAULT_TOKEN + '&policyLabel=foo-policy',data=data,verify=False)
        response = requests.post('http://localhost:5000/policies?VAULT_TOKEN=' + VAULT_TOKEN + '&policyLabel=foo1-policy',data=data,verify=False)
        response = requests.post('http://localhost:5000/policies?VAULT_TOKEN=' + VAULT_TOKEN + '&policyLabel=foo2-policy',data=data,verify=False)
        time.sleep(1)
        response = requests.get('http://localhost:5000/policies?VAULT_TOKEN=' + VAULT_TOKEN)
        self.assertEqual(response.json(), ['default','foo-policy','foo1-policy','foo2-policy','root'])

        response = requests.delete('http://localhost:5000/policies?VAULT_TOKEN=' + VAULT_TOKEN + '&policyLabel=foo1-policy',verify=False)

        time.sleep(1)
        response = requests.get('http://localhost:5000/policies?VAULT_TOKEN=' + VAULT_TOKEN)
        self.assertEqual(response.json(), ['default','foo-policy','foo2-policy','root'])

        response = requests.delete('http://localhost:5000/policies?VAULT_TOKEN=' + VAULT_TOKEN + '&policyLabel=foo-policy',verify=False)
        response = requests.delete('http://localhost:5000/policies?VAULT_TOKEN=' + VAULT_TOKEN + '&policyLabel=foo2-policy',verify=False)



if __name__ == '__main__':
    p1 = subprocess.Popen('docker compose down', shell=True)
    p1.wait()
    p3 = subprocess.Popen('docker compose up -d',shell=True)
    p3.wait()
    time.sleep(5)
    f = subprocess.check_output('docker logs vault-policy-manager_vault_1 | findstr "Root Token"',shell=True)

    print("Vault Token of Interest ", f[12:-1])
    VAULT_TOKEN = f[12:-1].decode("utf-8") 
    headers = {
        'X-Vault-Token': VAULT_TOKEN
    }
    unittest.main()