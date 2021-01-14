# This workflow will do a clean install of node dependencies, build the source code and run tests across different versions of node
# For more information see: https://help.github.com/actions/language-and-framework-guides/using-nodejs-with-github-actions

name: Node.js CI

on:
  push:
    branches: [ master ]

jobs:
  build:

    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [14.x]
        # See supported Node.js release schedule at https://nodejs.org/en/about/releases/

    steps:
    - uses: actions/checkout@master
    - name: copy file via ssh password
      uses: appleboy/scp-action@master
      with:
        host: ${{ secrets.HOST }}
        username: ${{ secrets.USERNAME }}
        key: ${{ secrets.ID_RSA }}
        port: ${{ secrets.PORT }}
        source: "x.py"
        target: "/tmp"


    #- name: scp and ssh
      #env:
        #SECRET_KEY: ${{ secrets.ID_RSA }}
        #USER: ${{ secrets.USERNAME }}
        #PORT: ${{ secrets.PORT }}
        #HOST: ${{ secrets.HOST }}
      #run: |
        #echo "${SECRET_KEY}" > secret_key
        #chmod 600 secret_key
        #scp -P ${PORT} -rp x.py -i secret_key ${USER}@${HOST}:/tmp/
        #ssh -p ${PORT} -oStrictHostKeyChecking=no ${USER}@${HOST} -i secret_key "cd ~/ && touch hoge"

