#!/bin/bash

function one_line_pem {
    echo "`awk 'NF {sub(/\\n/, ""); printf "%s\\\\\\\n",$0;}' $1`"
}

function json_ccp {
    local PP=$(one_line_pem $5)
    local CP=$(one_line_pem $6)
    sed -e "s/\${ORG}/$1/" \
         -e "s/\${ORGMSP}/$2/" \
        -e "s/\${P0PORT}/$3/" \
        -e "s/\${CAPORT}/$4/" \
        -e "s#\${PEERPEM}#$PP#" \
        -e "s#\${CAPEM}#$CP#" \
        -e "s#\${ORG_NAME}#$7#" \
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
        organizations/ccp-template.yaml | sed -e $'s/\\\\n/\\\n          /g'
}

ORG=operator
ORGMSP=OperatorMSP
ORG_NAME=Operator
P0PORT=7051
CAPORT=7054
PEERPEM=organizations/peerOrganizations/operator.example.com/tlsca/tlsca.operator.example.com-cert.pem
CAPEM=organizations/peerOrganizations/operator.example.com/ca/ca.operator.example.com-cert.pem

echo "$(json_ccp $ORG $ORGMSP $P0PORT $CAPORT $PEERPEM $CAPEM $ORG_NAME)" > organizations/peerOrganizations/operator.example.com/connection-operator.json

ORG=edc
ORGMSP=EDCMSP
ORG_NAME=EDC
P0PORT=9051
CAPORT=8054
PEERPEM=organizations/peerOrganizations/edc.example.com/tlsca/tlsca.edc.example.com-cert.pem
CAPEM=organizations/peerOrganizations/edc.example.com/ca/ca.edc.example.com-cert.pem

echo "$(json_ccp $ORG $ORGMSP $P0PORT $CAPORT $PEERPEM $CAPEM $ORG_NAME)" > organizations/peerOrganizations/edc.example.com/connection-edc.json
