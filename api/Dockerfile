FROM python:3

ADD PolicyPythonAPI.py /

RUN pip install pandas
RUN pip install flask
RUN pip install flask_restful
RUN pip install requests

CMD python ./PolicyPythonAPI.py