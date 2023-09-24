#!/bin/bash

function one_line_pem {
    echo "`awk 'NF {sub(/\\n/, ""); printf "%s\\\\\\\n",$0;}' $1`"
}

function json_ccp {
    local PP=$(one_line_pem $4)
    local CP=$(one_line_pem $5)
    sed -e "s/\${ORG}/$1/" \
        -e "s/\${P0PORT}/$2/" \
        -e "s/\${CAPORT}/$3/" \
        -e "s#\${PEERPEM}#$PP#" \
        -e "s#\${CAPEM}#$CP#" \
        -e "s#\${ORG_MSP}#$6#" \
        -e "s#\${ORG_NAME}#$7#" \
        -e "s#\${CHANNEL}#$8#" \
        organizations/ccp-template.json
}

function yaml_ccp {
    local PP=$(one_line_pem $4)
    local CP=$(one_line_pem $5)
    sed -e "s/\${ORG}/$1/" \
        -e "s/\${P0PORT}/$2/" \
        -e "s/\${CAPORT}/$3/" \
        -e "s#\${PEERPEM}#$PP#" \
        -e "s#\${CAPEM}#$CP#" \
        -e "s#\${ORG_MSP}#$6#" \
        -e "s#\${ORG_NAME}#$7#" \
        -e "s#\${CHANNEL}#$8#" \
        organizations/ccp-template.yaml | sed -e $'s/\\\\n/\\\n          /g'
}

ORG=broker
ORG_MSP=BrokerMSP
ORG_NAME=Broker
P0PORT=7051
CAPORT=7054
CHANNEL=bcmchannel
PEERPEM=organizations/peerOrganizations/broker.example.com/tlsca/tlsca.broker.example.com-cert.pem
CAPEM=organizations/peerOrganizations/broker.example.com/ca/ca.broker.example.com-cert.pem

echo "$(json_ccp $ORG $P0PORT $CAPORT $PEERPEM $CAPEM $ORG_MSP $ORG_NAME $CHANNEL)" > organizations/peerOrganizations/broker.example.com/connection-broker.json
echo "$(yaml_ccp $ORG $P0PORT $CAPORT $PEERPEM $CAPEM $ORG_MSP $ORG_NAME $CHANNEL)" > organizations/peerOrganizations/broker.example.com/connection-broker.yaml

ORG=farmer
ORG_MSP=FarmerMSP
ORG_NAME=Farmer
P0PORT=9051
CAPORT=8054
CHANNEL=bcmchannel
PEERPEM=organizations/peerOrganizations/farmer.example.com/tlsca/tlsca.farmer.example.com-cert.pem
CAPEM=organizations/peerOrganizations/farmer.example.com/ca/ca.farmer.example.com-cert.pem

echo "$(json_ccp $ORG $P0PORT $CAPORT $PEERPEM $CAPEM $ORG_MSP $ORG_NAME $CHANNEL)" > organizations/peerOrganizations/farmer.example.com/connection-farmer.json
echo "$(yaml_ccp $ORG $P0PORT $CAPORT $PEERPEM $CAPEM $ORG_MSP $ORG_NAME $CHANNEL)" > organizations/peerOrganizations/farmer.example.com/connection-farmer.yaml


ORG=cerealist
ORG_MSP=CerealistMSP
ORG_NAME=Cerealist
P0PORT=11051
CAPORT=12054
CHANNEL=bcmchannel
PEERPEM=organizations/peerOrganizations/cerealist.example.com/tlsca/tlsca.cerealist.example.com-cert.pem
CAPEM=organizations/peerOrganizations/cerealist.example.com/ca/ca.cerealist.example.com-cert.pem

echo "$(json_ccp $ORG $P0PORT $CAPORT $PEERPEM $CAPEM $ORG_MSP $ORG_NAME $CHANNEL)" > organizations/peerOrganizations/cerealist.example.com/connection-cerealist.json
echo "$(yaml_ccp $ORG $P0PORT $CAPORT $PEERPEM $CAPEM $ORG_MSP $ORG_NAME $CHANNEL)" > organizations/peerOrganizations/cerealist.example.com/connection-cerealist.yaml


ORG=mills
ORG_MSP=MillsMSP
ORG_NAME=Mills
P0PORT=13051
CAPORT=10054
CHANNEL=bcmchannel
PEERPEM=organizations/peerOrganizations/mills.example.com/tlsca/tlsca.mills.example.com-cert.pem
CAPEM=organizations/peerOrganizations/mills.example.com/ca/ca.mills.example.com-cert.pem

echo "$(json_ccp $ORG $P0PORT $CAPORT $PEERPEM $CAPEM $ORG_MSP $ORG_NAME $CHANNEL)" > organizations/peerOrganizations/mills.example.com/connection-mills.json
echo "$(yaml_ccp $ORG $P0PORT $CAPORT $PEERPEM $CAPEM $ORG_MSP $ORG_NAME $CHANNEL)" > organizations/peerOrganizations/mills.example.com/connection-mills.yaml


ORG=baker
ORG_MSP=BakerMSP
ORG_NAME=Baker
P0PORT=15051
CAPORT=11054
CHANNEL=bcmchannel
PEERPEM=organizations/peerOrganizations/baker.example.com/tlsca/tlsca.baker.example.com-cert.pem
CAPEM=organizations/peerOrganizations/baker.example.com/ca/ca.baker.example.com-cert.pem

echo "$(json_ccp $ORG $P0PORT $CAPORT $PEERPEM $CAPEM $ORG_MSP $ORG_NAME $CHANNEL)" > organizations/peerOrganizations/baker.example.com/connection-baker.json
echo "$(yaml_ccp $ORG $P0PORT $CAPORT $PEERPEM $CAPEM $ORG_MSP $ORG_NAME $CHANNEL)" > organizations/peerOrganizations/baker.example.com/connection-baker.yaml
