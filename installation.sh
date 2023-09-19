#./network.sh deployCC -ccn fab -ccv 1 -cci initLedger -ccl ${CC_SRC_LANGUAGE} -ccp ${CC_SRC_PATH}
cd /smartbolt_API/app/blockchain/hyperleger-network

//po chaincode Instantiation
export PATH=${PWD}/bin:${PWD}:$PATH
export FABRIC_CFG_PATH=$PWD/../config/
peer lifecycle chaincode package po.tar.gz --path ../chaincode/po/ --lang golang --label po_1.0

export CORE_PEER_TLS_ENABLED=true
export CORE_PEER_LOCALMSPID="OperatorMSP"
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/operator.example.com/peers/peer0.operator.example.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/operator.example.com/users/Admin@operator.example.com/msp
export CORE_PEER_ADDRESS=localhost:7051
peer lifecycle chaincode install po.tar.gz

export CORE_PEER_LOCALMSPID="EDCMSP"
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/edc.example.com/peers/peer0.edc.example.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/edc.example.com/users/Admin@edc.example.com/msp
export CORE_PEER_ADDRESS=localhost:9051
peer lifecycle chaincode install po.tar.gz

peer lifecycle chaincode queryinstalled
export CC_PACKAGE_ID=po_1.0:7b235c817a4f73bcb7d69e3d54f7b0585f7ca14aeda48245ba2daf9a14dd3504

peer lifecycle chaincode approveformyorg -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --channelID mychannel --name po --version 1.0 --package-id $CC_PACKAGE_ID --sequence 1 --tls --cafile ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem

export CORE_PEER_LOCALMSPID="OperatorMSP"
export CORE_PEER_MSPCONFIGPATH=${PWD}//organizations/peerOrganizations/operator.example.com/users/Admin@operator.example.com/msp
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}//organizations/peerOrganizations/operator.example.com/peers/peer0.operator.example.com/tls/ca.crt
export CORE_PEER_ADDRESS=localhost:7051

peer lifecycle chaincode approveformyorg -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --channelID mychannel --name po --version 1.0 --package-id $CC_PACKAGE_ID --sequence 1 --tls --cafile ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem

 peer lifecycle chaincode checkcommitreadiness --channelID mychannel --name po --version 1.0 --sequence 1 --tls --cafile ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem --output json
peer lifecycle chaincode commit -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --channelID mychannel --name po --version 1.0 --sequence 1 --tls --cafile ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem --peerAddresses localhost:7051 --tlsRootCertFiles ${PWD}/organizations/peerOrganizations/operator.example.com/peers/peer0.operator.example.com/tls/ca.crt --peerAddresses localhost:9051 --tlsRootCertFiles ${PWD}/organizations/peerOrganizations/edc.example.com/peers/peer0.edc.example.com/tls/ca.crt

peer lifecycle chaincode querycommitted --channelID mychannel --name po --cafile ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem


//po chaincode Upgrade
export SEQUENCE="24"
export PATH=${PWD}/bin:${PWD}:$PATH
export FABRIC_CFG_PATH=$PWD/../config/
peer lifecycle chaincode package po.tar.gz --path ../chaincode/po/ --lang golang --label po_1.0

export CORE_PEER_TLS_ENABLED=true
export CORE_PEER_LOCALMSPID="OperatorMSP"
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/operator.example.com/peers/peer0.operator.example.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/operator.example.com/users/Admin@operator.example.com/msp
export CORE_PEER_ADDRESS=localhost:7051
peer lifecycle chaincode install po.tar.gz

export CORE_PEER_LOCALMSPID="EDCMSP"
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/edc.example.com/peers/peer0.edc.example.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/edc.example.com/users/Admin@edc.example.com/msp
export CORE_PEER_ADDRESS=localhost:9051
peer lifecycle chaincode install po.tar.gz

peer lifecycle chaincode queryinstalled
export CC_PACKAGE_ID=po_1.0:661aca5f2c3dcacac758b8a51780c902f8fedce4cf321aa36a05b29c7c8ee1dc

peer lifecycle chaincode approveformyorg -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --channelID mychannel --name po --version 1.0 --package-id $CC_PACKAGE_ID --sequence $SEQUENCE --tls --cafile ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem

export CORE_PEER_LOCALMSPID="OperatorMSP"
export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/operator.example.com/users/Admin@operator.example.com/msp
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/operator.example.com/peers/peer0.operator.example.com/tls/ca.crt
export CORE_PEER_ADDRESS=localhost:7051

peer lifecycle chaincode approveformyorg -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --channelID mychannel --name po --version 1.0 --package-id $CC_PACKAGE_ID --sequence $SEQUENCE --tls --cafile ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem

peer lifecycle chaincode checkcommitreadiness --channelID mychannel --name po --version 1.0 --sequence $SEQUENCE --tls --cafile ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem --output json
peer lifecycle chaincode commit -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --channelID mychannel --name po --version 1.0 --sequence $SEQUENCE --tls --cafile ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem --peerAddresses localhost:7051 --tlsRootCertFiles ${PWD}/organizations/peerOrganizations/operator.example.com/peers/peer0.operator.example.com/tls/ca.crt --peerAddresses localhost:9051 --tlsRootCertFiles ${PWD}/organizations/peerOrganizations/edc.example.com/peers/peer0.edc.example.com/tls/ca.crt

peer lifecycle chaincode querycommitted --channelID mychannel --name po --cafile ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem

peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --tls --cafile ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem -C mychannel -n poa6 --peerAddresses localhost:7051 --tlsRootCertFiles ${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt --peerAddresses localhost:9051 --tlsRootCertFiles ${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt -c '{"function":"Invoke","Args":["createPO","{\"originationOrgId\":\"org1\",\"originationOrgName\":\"Microsoft\",\"poNumber\":\"1234\"}"]}'

{"originationOrgId":"org1","originationOrgName":"Microsoft","poNumber":"1234"}
"{\"originationOrgId\":\"org1\",\"originationOrgName\":\"Microsoft\",\"poNumber\":\"1234\"}"

peer chaincode query -C mychannel -n fabcar -c '{"Args":["GetAllAssets"]}'
peer chaincode query -C mychannel -n fabcar -c '{"Args":["queryAllCars"]}'

peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --tls --cafile ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem -C mychannel -n fabcar --peerAddresses localhost:7051 --tlsRootCertFiles ${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt --peerAddresses localhost:9051 --tlsRootCertFiles ${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt -c '{"function":"initLedger","Args":[]}'
peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --tls --cafile /home/smartbolt/fabric-samples/test-network/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem -C mychannel -n fabcar --peerAddresses localhost:7051 --tlsRootCertFiles /home/smartbolt/fabric-samples/test-network/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt --peerAddresses localhost:9051 --tlsRootCertFiles /home/smartbolt/fabric-samples/test-network/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt --isInit -c '{"function":"initLedger","Args":[]}'


//org chaincode Instantiation
export PATH=${PWD}/../bin:${PWD}:$PATH
export FABRIC_CFG_PATH=$PWD/../config/
peer lifecycle chaincode package org.tar.gz --path ../chaincode/org/ --lang golang --label org_1.0

export CORE_PEER_TLS_ENABLED=true
export CORE_PEER_LOCALMSPID="OperatorMSP"
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/operator.example.com/peers/peer0.operator.example.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/operator.example.com/users/Admin@operator.example.com/msp
export CORE_PEER_ADDRESS=localhost:7051
peer lifecycle chaincode install org.tar.gz

export CORE_PEER_LOCALMSPID="EDCMSP"
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/edc.example.com/peers/peer0.edc.example.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/edc.example.com/users/Admin@edc.example.com/msp
export CORE_PEER_ADDRESS=localhost:9051
peer lifecycle chaincode install org.tar.gz

peer lifecycle chaincode queryinstalled
export CC_PACKAGE_ID=org_1.0:30bdc4bb966ea55f585d904ed580eba06537c4d168b5e3a2e2a4a819647fb7df

peer lifecycle chaincode approveformyorg -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --channelID mychannel --name org --version 1.0 --package-id $CC_PACKAGE_ID --sequence 1 --tls --cafile ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem

export CORE_PEER_LOCALMSPID="OperatorMSP"
export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/operator.example.com/users/Admin@operator.example.com/msp
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/operator.example.com/peers/peer0.operator.example.com/tls/ca.crt
export CORE_PEER_ADDRESS=localhost:7051

peer lifecycle chaincode approveformyorg -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --channelID mychannel --name org --version 1.0 --package-id $CC_PACKAGE_ID --sequence 1 --tls --cafile ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem

peer lifecycle chaincode checkcommitreadiness --channelID mychannel --name org --version 1.0 --sequence 1 --tls --cafile ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem --output json
peer lifecycle chaincode commit -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --channelID mychannel --name org --version 1.0 --sequence 1 --tls --cafile ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem --peerAddresses localhost:7051 --tlsRootCertFiles ${PWD}/organizations/peerOrganizations/operator.example.com/peers/peer0.operator.example.com/tls/ca.crt --peerAddresses localhost:9051 --tlsRootCertFiles ${PWD}/organizations/peerOrganizations/edc.example.com/peers/peer0.edc.example.com/tls/ca.crt

peer lifecycle chaincode querycommitted --channelID mychannel --name org --cafile ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem


//org chaincode Upgrade
export PATH=${PWD}/bin:${PWD}:$PATH
export FABRIC_CFG_PATH=$PWD/../config/
peer lifecycle chaincode package org.tar.gz --path ../chaincode/org/ --lang golang --label org_1.0

export CORE_PEER_TLS_ENABLED=true
export CORE_PEER_LOCALMSPID="OperatorMSP"
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/operator.example.com/peers/peer0.operator.example.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/operator.example.com/users/Admin@operator.example.com/msp
export CORE_PEER_ADDRESS=localhost:7051
peer lifecycle chaincode install org.tar.gz

export CORE_PEER_LOCALMSPID="EDCMSP"
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/edc.example.com/peers/peer0.edc.example.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/edc.example.com/users/Admin@edc.example.com/msp
export CORE_PEER_ADDRESS=localhost:9051
peer lifecycle chaincode install org.tar.gz

peer lifecycle chaincode queryinstalled
export CC_PACKAGE_ID=org_1.0:fffb4759fc3ae878129cd31bc23a656b7a12ed762c25a2b4eb944daeb3e83655

peer lifecycle chaincode approveformyorg -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --channelID mychannel --name org --version 1.0 --package-id $CC_PACKAGE_ID --sequence 2 --tls --cafile ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem

export CORE_PEER_LOCALMSPID="OperatorMSP"
export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/operator.example.com/users/Admin@operator.example.com/msp
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/operator.example.com/peers/peer0.operator.example.com/tls/ca.crt
export CORE_PEER_ADDRESS=localhost:7051

peer lifecycle chaincode approveformyorg -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --channelID mychannel --name org --version 1.0 --package-id $CC_PACKAGE_ID --sequence 2 --tls --cafile ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem

peer lifecycle chaincode checkcommitreadiness --channelID mychannel --name org --version 1.0 --sequence 2 --tls --cafile ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem --output json
peer lifecycle chaincode commit -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --channelID mychannel --name org --version 1.0 --sequence 2 --tls --cafile ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem --peerAddresses localhost:7051 --tlsRootCertFiles ${PWD}/organizations/peerOrganizations/operator.example.com/peers/peer0.operator.example.com/tls/ca.crt --peerAddresses localhost:9051 --tlsRootCertFiles ${PWD}/organizations/peerOrganizations/edc.example.com/peers/peer0.edc.example.com/tls/ca.crt

peer lifecycle chaincode querycommitted --channelID mychannel --name org --cafile ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem

{"orgId":"org1","orgName":"Microsoft","email":"1234","phone":"888888888","status":"Active","orgAdminId":"user1","role":"Operator"}
"{\"orgId\":\"org1\",\"orgName\":\"Microsoft\",\"email\":\"1234\",\"phone\":\"888888888\",\"status\":\"Active\",\"orgAdminId\":\"user1\",\"role\":\"Operator\"}"
peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --tls --cafile ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem -C mychannel -n orgc1 --peerAddresses localhost:7051 --tlsRootCertFiles ${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt --peerAddresses localhost:9051 --tlsRootCertFiles ${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt -c '{"function":"createOrg","Args":["{\"orgId\":\"org1\",\"orgName\":\"Microsoft\",\"email\":\"1234\",\"phone\":\"888888888\",\"status\":\"Active\",\"orgAdminId\":\"user1\",\"role\":\"Operator\"}"]}'



//user chaincode Instantiation
export PATH=${PWD}/../bin:${PWD}:$PATH
export FABRIC_CFG_PATH=$PWD/../config/
peer lifecycle chaincode package user.tar.gz --path ../chaincode/user/ --lang golang --label user_1.0

export CORE_PEER_TLS_ENABLED=true
export CORE_PEER_LOCALMSPID="OperatorMSP"
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/operator.example.com/peers/peer0.operator.example.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/operator.example.com/users/Admin@operator.example.com/msp
export CORE_PEER_ADDRESS=localhost:7051
peer lifecycle chaincode install user.tar.gz

export CORE_PEER_LOCALMSPID="EDCMSP"
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/edc.example.com/peers/peer0.edc.example.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/edc.example.com/users/Admin@edc.example.com/msp
export CORE_PEER_ADDRESS=localhost:9051
peer lifecycle chaincode install user.tar.gz

peer lifecycle chaincode queryinstalled
export CC_PACKAGE_ID=user_1.0:3a4ef1f6e338c20adcd76de54924f5e28e8dd23f3cefb85dec6e95bf3460563d

peer lifecycle chaincode approveformyorg -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --channelID mychannel --name user --version 1.0 --package-id $CC_PACKAGE_ID --sequence 1 --tls --cafile ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem

export CORE_PEER_LOCALMSPID="OperatorMSP"
export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/operator.example.com/users/Admin@operator.example.com/msp
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/operator.example.com/peers/peer0.operator.example.com/tls/ca.crt
export CORE_PEER_ADDRESS=localhost:7051

peer lifecycle chaincode approveformyorg -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --channelID mychannel --name user --version 1.0 --package-id $CC_PACKAGE_ID --sequence 1 --tls --cafile ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem

peer lifecycle chaincode checkcommitreadiness --channelID mychannel --name user --version 1.0 --sequence 1 --tls --cafile ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem --output json
peer lifecycle chaincode commit -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --channelID mychannel --name user --version 1.0 --sequence 1 --tls --cafile ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem --peerAddresses localhost:7051 --tlsRootCertFiles ${PWD}/organizations/peerOrganizations/operator.example.com/peers/peer0.operator.example.com/tls/ca.crt --peerAddresses localhost:9051 --tlsRootCertFiles ${PWD}/organizations/peerOrganizations/edc.example.com/peers/peer0.edc.example.com/tls/ca.crt

peer lifecycle chaincode querycommitted --channelID mychannel --name user --cafile ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem


//user chaincode Upgrade
export PATH=${PWD}/bin:${PWD}:$PATH
export FABRIC_CFG_PATH=$PWD/../config/
peer lifecycle chaincode package user.tar.gz --path ../chaincode/user/ --lang golang --label user_1.0

export CORE_PEER_TLS_ENABLED=true
export CORE_PEER_LOCALMSPID="OperatorMSP"
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/operator.example.com/peers/peer0.operator.example.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/operator.example.com/users/Admin@operator.example.com/msp
export CORE_PEER_ADDRESS=localhost:7051
peer lifecycle chaincode install user.tar.gz

export CORE_PEER_LOCALMSPID="EDCMSP"
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/edc.example.com/peers/peer0.edc.example.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/edc.example.com/users/Admin@edc.example.com/msp
export CORE_PEER_ADDRESS=localhost:9051
peer lifecycle chaincode install user.tar.gz

peer lifecycle chaincode queryinstalled
export CC_PACKAGE_ID=user_1.0:3a4ef1f6e338c20adcd76de54924f5e28e8dd23f3cefb85dec6e95bf3460563d

peer lifecycle chaincode approveformyorg -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --channelID mychannel --name user --version 1.0 --package-id $CC_PACKAGE_ID --sequence 6 --tls --cafile ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem

export CORE_PEER_LOCALMSPID="OperatorMSP"
export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/operator.example.com/users/Admin@operator.example.com/msp
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/operator.example.com/peers/peer0.operator.example.com/tls/ca.crt
export CORE_PEER_ADDRESS=localhost:7051

peer lifecycle chaincode approveformyorg -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --channelID mychannel --name user --version 1.0 --package-id $CC_PACKAGE_ID --sequence 6 --tls --cafile ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem

peer lifecycle chaincode checkcommitreadiness --channelID mychannel --name user --version 1.0 --sequence 6 --tls --cafile ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem --output json
peer lifecycle chaincode commit -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --channelID mychannel --name user --version 1.0 --sequence 6 --tls --cafile ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem --peerAddresses localhost:7051 --tlsRootCertFiles ${PWD}/organizations/peerOrganizations/operator.example.com/peers/peer0.operator.example.com/tls/ca.crt --peerAddresses localhost:9051 --tlsRootCertFiles ${PWD}/organizations/peerOrganizations/edc.example.com/peers/peer0.edc.example.com/tls/ca.crt

peer lifecycle chaincode querycommitted --channelID mychannel --name user --cafile ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem

{"userId":"user2","userName":"tarun","password":"1234","orgId":"operator","orgName":"Microsoft","email":"1234","phone":"888888888","status":"Active","role":"Operator"}
"{\"userId\":\"user2\",\"userName\":\"tarun\",\"password\":\"1234\",\"orgId\":\"operator\",\"orgName\":\"Microsoft\",\"email\":\"1234\",\"phone\":\"888888888\",\"status\":\"Active\",\"role\":\"Operator\"}"
peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --tls --cafile ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem -C mychannel -n user --peerAddresses localhost:7051 --tlsRootCertFiles ${PWD}/organizations/peerOrganizations/operator.example.com/peers/peer0.operator.example.com/tls/ca.crt --peerAddresses localhost:9051 --tlsRootCertFiles ${PWD}/organizations/peerOrganizations/edc.example.com/peers/peer0.edc.example.com/tls/ca.crt -c '{"function":"Invoke","Args":["createUser","{\"userId\":\"user2\",\"userName\":\"tarun\",\"password\":\"1234\",\"orgId\":\"operator\",\"orgName\":\"Microsoft\",\"email\":\"1234\",\"phone\":\"888888888\",\"status\":\"Active\",\"role\":\"Operator\"}"]}'


{
"orgId":"microsoftt1",
"orgName":"Microsoftt1",
"email":"microsoftt1@gmail.com",
"phone":"999999991999",
"status":"ACTIVE",
"userName":"Tarun Kumar",
"userId":"tk1k6@microsoft.com",
"role":"Operator",
"password":"admin"
}

{
"originationOrgId":"microsoftt1",
"originationOrgName":"microsoftt1",
"destinationOrgId":"microsoftt1",
"destinationOrgName":"microsoftt1",
"poNumber":"microsoftt1",
"productID":"microsoftt1",
"productDesc":"microsoftt1",
"UOM":"microsoftt1",
"quantity":"microsoftt1",
"comments":"microsoftt1",
"status":"microsoftt1",
}

OriginationOrgId		 string     			`json:"originationOrgId"`
	OriginationOrgName     	 string					`json:"originationOrgName"`
	DestinationOrgId 		 string					`json:"destinationOrgId"`
	DestinationOrgName		 string					`json:"destinationOrgName"`
	PONumber				 string					`json:"poNumber"`
	Product_ID				 string					`json:"productID"`
	ProductDesc				 string					`json:"productDesc"`
	Specification			 string					`json:"specification"`
	UOM						 string					`json:"UOM"`
	Quantity				 string					`json:"quantity"`
	Comments				 string					`json:"comments"`
	Status					 string					`json:"status"`



Org1	operatororg1@gmail.com / 4i62uxbl    ORG2021620105052923  Operator Org	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJvcGVyYXRvcm9yZzFAZ21haWwuY29tIiwib3JnTmFtZSI6Ik9wZXJhdG9yIiwiaWF0IjoxNjMwMzM0ODQ2fQ.8LNgCcKgq9CE1iRLydDJjj_iAsZwQbCVgoKN9rXNzPY
Org2	engineerorg@gmail.com / u0h2ab36    ORG202162013021647    Engineer Org		eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJlbmdpbmVlcm9yZ0BnbWFpbC5jb20iLCJvcmdOYW1lIjoiT3BlcmF0b3IiLCJpYXQiOjE2MzAzMzQ5NDd9.Q0xc-tHg5PecgBHuhFJt7FEQxSqkYuN2KBMbZIN8lrQ
Org3	manufaturer@gmail.com/ q8gi9jzn	ORG2021730144252590		manufaturer@gmail.com eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJtYW51ZmF0dXJlckBnbWFpbC5jb20iLCJvcmdOYW1lIjoiT3BlcmF0b3IiLCJpYXQiOjE2MjY3MDYxMDl9.kLFiNOm4DWMSMjAwVFEq2etl0LjvXzAJHzCdo9nSwgE
Org4 	transporter@gmail.com / 9CWnh2uT ORG2021620131250242  Transporter Org eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ0cmFuc3BvcnRlckBnbWFpbC5jb20iLCJvcmdOYW1lIjoiT3BlcmF0b3IiLCJpYXQiOjE2MzAzMzgxNzd9.FrUEOochx76tmRN21tnys1tPrpEGL51v5YeRMlTl9Gs

POOrder = operator -- >  PO2021619151056242
POOrder = Eng Org ===> PO2021619151511177

To change User Password
POST http://20.51.241.42:5000/api/changeUserPassword
{
"userId":"tk1k@microsoft.com",
"oldPassword":"BPOZryD7",
"password":"1234"
}

To reset User Password
POST http://20.51.241.42:5000/api/resetUserPassword
{
    "userId":"tk1k@microsoft.com",
    "emailId":"microsoftt1@gmail.com"
}


To accept the PO
POST http://20.51.241.42:5000/api/acceptPO
{
    "comments":"tk1k@microsoft.com",
    "poID":"PO2021611121833389"
}

To Reject the PO
POST http://20.51.241.42:5000/api/rejectPO
{
    "comments":"tk1k@microsoft.com",
    "poID":"PO2021611121833389"
}

To check PO History of Transaction
GET http://20.51.241.42:5000/api/getPOHistory/PO2021611121833389


Product Apis:
Add product  : TODOS : UOM
POST http://20.51.241.42:5000/api/product
Body : 
		{
			"productID":"P001",
			"productDesc":"Smartbolts",
			"quantity":100,
		}
Token : Manufacturer Token		

Raise Product Stock
PUT http://20.51.241.42:5000/api/productStock
Body :
		{
			"productID":"P001",
			"quantity":100
		}
Token : Manufacturer Token		


gGet product By id
GET http://20.51.241.42:5000/api/product/P001
Token : GENERIC Token

Query all Product 
GET http://20.51.241.42:5000/api/products
Token : GENERIC Token

Query productS By Org ID:
GET http://20.51.241.42:5000/api/getProductByOrgID/ORG2021611152039814
Token : MANF Token


INVOICE APIS:
POST : http://20.51.241.42:5000/api/dispatchNote
	{
		"destinationOrgId": "ORG202161112140281",
		"invoiceNumber":"IN004",
		"refPOID":"PO202161892545729",
		"transporterID":"ORG202161893843170",
		"transporterName":"Ali Express",
		"shippingDoc":"Test",
		"productID":"P001",
		"productDesc":"Smartbolts",
		"heatIndex":"23",
		"labCert":"123",
		"certFile":"FILE_UPLOAD",
		"quantity":25,
		"uom":"nos",
		"rmCert":"samnsa",
		"comments":"sdasd",
		"status":"Created",
		"createdDate":"12-sep-2021"
	}

//Get Dispatch Note By ID
GET : http://20.51.241.42:5000/api/dispatchNote/IN2021618143024751

//Get Dispatch Note By OrgID
GET : http://20.51.241.42:5000/api/getDispatchNoteByOrgID/ORG202161893843170

//Get Dispatch Note By Status
GET : http://20.51.241.42:5000/api/getDispatchNoteByStatus/Created

//Get Dispatch Note By Invoice Number
GET : http://20.51.241.42:5000/api/getDispatchNotebyNumber/IN001

To Update Comments
PUT : http://20.51.241.42:5000/api/dispatchNote
{
            "invoiceID": "IN20216189593472",
            "comments":"Transpoter Shipped"
}
Token : Transporter


TO Accept
POST : http://20.51.241.42:5000/api/acceptDispatchNote
{
	"invoiceID": "IN20216189593472",
	"quantity":25,
	"comments":"EngComp Accepted"
}

TO Reject
POST : http://20.51.241.42:5000/api/rejectDispatchNote
{
	"invoiceID": "IN20216189593472",
	"comments":"EngComp Rejected"
}

To Update PO Comments
PUT : http://20.51.241.42:5000/api/purchaseOrder
{
	"poID": "PO20216191754451",
	"comments":"Comments"
}

Download File : 
http://20.51.241.42:5000/download?hash=QmRnav67do74rn8oePRUeHWB7si4J6L5NFa97i1qVWWoRZ
http://20.51.241.42:5000/api/download?hash=QmUfBLqZRKyU985AXwTF79vGEFUk6fYwcpp8LMysdDMABm


Organization Approvals

1] OrGANIZATION Approvals
POST : http://20.51.241.42:5000/api/approve
{
	"orgId": "XYZ"
}
Token Of Org which is approving

2]  //fetch all approved organizations
GET : http://20.51.241.42:5000/api/getApprovedOrgs
Pass Token it will fetch all approved organizations

3] //fetch all approved organizations By Type
GET : http://20.51.241.42:5000/api/getApprovedOrgsByType/ORGANIZATION_TYPE
Pass Token it will fetch all approved organizations  and also type in URL like Operator, Manufacturer


4] //Fetch all notifications By Organization ID
GET : http://20.51.241.42:5000/api/getNotification
Pass Token it will fetch all Notification by fetching Notifications It will internally fetch OrgID

5] //Fetch all notifications By Notification ID
GET : http://20.51.241.42:5000/api/getNotificationByID/:ID
Pass Token it will fetch all Notification by Notifictaion ID


//TO Do List
1] Notification Module : PO Created, Accepts PO, Reject PO     (Priority) 2
						 DispatchNote Createtion , Reject , Reject	
			Done			 

2] Org Approvals Required  (Priority) 1 Done

3] Recall : Previous Org will recall the product  (Priority) 3

updtatePO comments Done

Blockchain
Get Details By TxID


Recall invoice
POST :: URL : http://20.51.241.42:5000/api/recallDispatchNote
Pass : Creator Invoice Token
Body : 
{
  "invoiceID": "IN2021730155625991",
  "comments": "Recalled"
}

Query Invoice By PONUmber
GET :: URL :: http://20.51.241.42:5000/api/getInvoiceByPONumber/POKK11_Man

Query Invoice By POID
GET :: URL ::http://20.51.241.42:5000/api/getInvoiceByPOID/PO2021730145035724

Query PO By refPOID
GET :: URL ::http://20.51.241.42:5000/api/getPOByRefPOID/:poID
