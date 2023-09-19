#!/bin/bash

function createOrg1() {
  infoln "Enrolling the CA admin"
  mkdir -p organizations/peerOrganizations/operator.example.com/

  export FABRIC_CA_CLIENT_HOME=${PWD}/organizations/peerOrganizations/operator.example.com/

  set -x
  fabric-ca-client enroll -u https://admin:adminpw@localhost:7054 --caname ca-operator --tls.certfiles ${PWD}/organizations/fabric-ca/operator/tls-cert.pem
  { set +x; } 2>/dev/null

  echo 'NodeOUs:
  Enable: true
  ClientOUIdentifier:
    Certificate: cacerts/localhost-7054-ca-operator.pem
    OrganizationalUnitIdentifier: client
  PeerOUIdentifier:
    Certificate: cacerts/localhost-7054-ca-operator.pem
    OrganizationalUnitIdentifier: peer
  AdminOUIdentifier:
    Certificate: cacerts/localhost-7054-ca-operator.pem
    OrganizationalUnitIdentifier: admin
  OrdererOUIdentifier:
    Certificate: cacerts/localhost-7054-ca-operator.pem
    OrganizationalUnitIdentifier: orderer' >${PWD}/organizations/peerOrganizations/operator.example.com/msp/config.yaml

  infoln "Registering peer0"
  set -x
  fabric-ca-client register --caname ca-operator --id.name peer0 --id.secret peer0pw --id.type peer --tls.certfiles ${PWD}/organizations/fabric-ca/operator/tls-cert.pem
  { set +x; } 2>/dev/null

  infoln "Registering user"
  set -x
  fabric-ca-client register --caname ca-operator --id.name user1 --id.secret user1pw --id.type client --tls.certfiles ${PWD}/organizations/fabric-ca/operator/tls-cert.pem
  { set +x; } 2>/dev/null

  infoln "Registering the org admin"
  set -x
  fabric-ca-client register --caname ca-operator --id.name operatoradmin --id.secret operatoradminpw --id.type admin --tls.certfiles ${PWD}/organizations/fabric-ca/operator/tls-cert.pem
  { set +x; } 2>/dev/null

  infoln "Generating the peer0 msp"
  set -x
  fabric-ca-client enroll -u https://peer0:peer0pw@localhost:7054 --caname ca-operator -M ${PWD}/organizations/peerOrganizations/operator.example.com/peers/peer0.operator.example.com/msp --csr.hosts peer0.operator.example.com --tls.certfiles ${PWD}/organizations/fabric-ca/operator/tls-cert.pem
  { set +x; } 2>/dev/null

  cp ${PWD}/organizations/peerOrganizations/operator.example.com/msp/config.yaml ${PWD}/organizations/peerOrganizations/operator.example.com/peers/peer0.operator.example.com/msp/config.yaml

  infoln "Generating the peer0-tls certificates"
  set -x
  fabric-ca-client enroll -u https://peer0:peer0pw@localhost:7054 --caname ca-operator -M ${PWD}/organizations/peerOrganizations/operator.example.com/peers/peer0.operator.example.com/tls --enrollment.profile tls --csr.hosts peer0.operator.example.com --csr.hosts localhost --tls.certfiles ${PWD}/organizations/fabric-ca/operator/tls-cert.pem
  { set +x; } 2>/dev/null

  cp ${PWD}/organizations/peerOrganizations/operator.example.com/peers/peer0.operator.example.com/tls/tlscacerts/* ${PWD}/organizations/peerOrganizations/operator.example.com/peers/peer0.operator.example.com/tls/ca.crt
  cp ${PWD}/organizations/peerOrganizations/operator.example.com/peers/peer0.operator.example.com/tls/signcerts/* ${PWD}/organizations/peerOrganizations/operator.example.com/peers/peer0.operator.example.com/tls/server.crt
  cp ${PWD}/organizations/peerOrganizations/operator.example.com/peers/peer0.operator.example.com/tls/keystore/* ${PWD}/organizations/peerOrganizations/operator.example.com/peers/peer0.operator.example.com/tls/server.key

  mkdir -p ${PWD}/organizations/peerOrganizations/operator.example.com/msp/tlscacerts
  cp ${PWD}/organizations/peerOrganizations/operator.example.com/peers/peer0.operator.example.com/tls/tlscacerts/* ${PWD}/organizations/peerOrganizations/operator.example.com/msp/tlscacerts/ca.crt

  mkdir -p ${PWD}/organizations/peerOrganizations/operator.example.com/tlsca
  cp ${PWD}/organizations/peerOrganizations/operator.example.com/peers/peer0.operator.example.com/tls/tlscacerts/* ${PWD}/organizations/peerOrganizations/operator.example.com/tlsca/tlsca.operator.example.com-cert.pem

  mkdir -p ${PWD}/organizations/peerOrganizations/operator.example.com/ca
  cp ${PWD}/organizations/peerOrganizations/operator.example.com/peers/peer0.operator.example.com/msp/cacerts/* ${PWD}/organizations/peerOrganizations/operator.example.com/ca/ca.operator.example.com-cert.pem

  infoln "Generating the user msp"
  set -x
  fabric-ca-client enroll -u https://user1:user1pw@localhost:7054 --caname ca-operator -M ${PWD}/organizations/peerOrganizations/operator.example.com/users/User1@operator.example.com/msp --tls.certfiles ${PWD}/organizations/fabric-ca/operator/tls-cert.pem
  { set +x; } 2>/dev/null

  cp ${PWD}/organizations/peerOrganizations/operator.example.com/msp/config.yaml ${PWD}/organizations/peerOrganizations/operator.example.com/users/User1@operator.example.com/msp/config.yaml

  infoln "Generating the org admin msp"
  set -x
  fabric-ca-client enroll -u https://operatoradmin:operatoradminpw@localhost:7054 --caname ca-operator -M ${PWD}/organizations/peerOrganizations/operator.example.com/users/Admin@operator.example.com/msp --tls.certfiles ${PWD}/organizations/fabric-ca/operator/tls-cert.pem
  { set +x; } 2>/dev/null

  cp ${PWD}/organizations/peerOrganizations/operator.example.com/msp/config.yaml ${PWD}/organizations/peerOrganizations/operator.example.com/users/Admin@operator.example.com/msp/config.yaml
}


function createOrg2() {
  infoln "Enrolling the CA admin"
  mkdir -p organizations/peerOrganizations/edc.example.com/

  export FABRIC_CA_CLIENT_HOME=${PWD}/organizations/peerOrganizations/edc.example.com/

  set -x
  fabric-ca-client enroll -u https://admin:adminpw@localhost:8054 --caname ca-edc --tls.certfiles ${PWD}/organizations/fabric-ca/edc/tls-cert.pem
  { set +x; } 2>/dev/null

  echo 'NodeOUs:
  Enable: true
  ClientOUIdentifier:
    Certificate: cacerts/localhost-8054-ca-edc.pem
    OrganizationalUnitIdentifier: client
  PeerOUIdentifier:
    Certificate: cacerts/localhost-8054-ca-edc.pem
    OrganizationalUnitIdentifier: peer
  AdminOUIdentifier:
    Certificate: cacerts/localhost-8054-ca-edc.pem
    OrganizationalUnitIdentifier: admin
  OrdererOUIdentifier:
    Certificate: cacerts/localhost-8054-ca-edc.pem
    OrganizationalUnitIdentifier: orderer' >${PWD}/organizations/peerOrganizations/edc.example.com/msp/config.yaml

  infoln "Registering peer0"
  set -x
  fabric-ca-client register --caname ca-edc --id.name peer0 --id.secret peer0pw --id.type peer --tls.certfiles ${PWD}/organizations/fabric-ca/edc/tls-cert.pem
  { set +x; } 2>/dev/null

  infoln "Registering user"
  set -x
  fabric-ca-client register --caname ca-edc --id.name user1 --id.secret user1pw --id.type client --tls.certfiles ${PWD}/organizations/fabric-ca/edc/tls-cert.pem
  { set +x; } 2>/dev/null

  infoln "Registering the org admin"
  set -x
  fabric-ca-client register --caname ca-edc --id.name edcadmin --id.secret edcadminpw --id.type admin --tls.certfiles ${PWD}/organizations/fabric-ca/edc/tls-cert.pem
  { set +x; } 2>/dev/null

  infoln "Generating the peer0 msp"
  set -x
  fabric-ca-client enroll -u https://peer0:peer0pw@localhost:8054 --caname ca-edc -M ${PWD}/organizations/peerOrganizations/edc.example.com/peers/peer0.edc.example.com/msp --csr.hosts peer0.edc.example.com --tls.certfiles ${PWD}/organizations/fabric-ca/edc/tls-cert.pem
  { set +x; } 2>/dev/null

  cp ${PWD}/organizations/peerOrganizations/edc.example.com/msp/config.yaml ${PWD}/organizations/peerOrganizations/edc.example.com/peers/peer0.edc.example.com/msp/config.yaml

  infoln "Generating the peer0-tls certificates"
  set -x
  fabric-ca-client enroll -u https://peer0:peer0pw@localhost:8054 --caname ca-edc -M ${PWD}/organizations/peerOrganizations/edc.example.com/peers/peer0.edc.example.com/tls --enrollment.profile tls --csr.hosts peer0.edc.example.com --csr.hosts localhost --tls.certfiles ${PWD}/organizations/fabric-ca/edc/tls-cert.pem
  { set +x; } 2>/dev/null

  cp ${PWD}/organizations/peerOrganizations/edc.example.com/peers/peer0.edc.example.com/tls/tlscacerts/* ${PWD}/organizations/peerOrganizations/edc.example.com/peers/peer0.edc.example.com/tls/ca.crt
  cp ${PWD}/organizations/peerOrganizations/edc.example.com/peers/peer0.edc.example.com/tls/signcerts/* ${PWD}/organizations/peerOrganizations/edc.example.com/peers/peer0.edc.example.com/tls/server.crt
  cp ${PWD}/organizations/peerOrganizations/edc.example.com/peers/peer0.edc.example.com/tls/keystore/* ${PWD}/organizations/peerOrganizations/edc.example.com/peers/peer0.edc.example.com/tls/server.key

  mkdir -p ${PWD}/organizations/peerOrganizations/edc.example.com/msp/tlscacerts
  cp ${PWD}/organizations/peerOrganizations/edc.example.com/peers/peer0.edc.example.com/tls/tlscacerts/* ${PWD}/organizations/peerOrganizations/edc.example.com/msp/tlscacerts/ca.crt

  mkdir -p ${PWD}/organizations/peerOrganizations/edc.example.com/tlsca
  cp ${PWD}/organizations/peerOrganizations/edc.example.com/peers/peer0.edc.example.com/tls/tlscacerts/* ${PWD}/organizations/peerOrganizations/edc.example.com/tlsca/tlsca.edc.example.com-cert.pem

  mkdir -p ${PWD}/organizations/peerOrganizations/edc.example.com/ca
  cp ${PWD}/organizations/peerOrganizations/edc.example.com/peers/peer0.edc.example.com/msp/cacerts/* ${PWD}/organizations/peerOrganizations/edc.example.com/ca/ca.edc.example.com-cert.pem

  infoln "Generating the user msp"
  set -x
  fabric-ca-client enroll -u https://user1:user1pw@localhost:8054 --caname ca-edc -M ${PWD}/organizations/peerOrganizations/edc.example.com/users/User1@edc.example.com/msp --tls.certfiles ${PWD}/organizations/fabric-ca/edc/tls-cert.pem
  { set +x; } 2>/dev/null

  cp ${PWD}/organizations/peerOrganizations/edc.example.com/msp/config.yaml ${PWD}/organizations/peerOrganizations/edc.example.com/users/User1@edc.example.com/msp/config.yaml

  infoln "Generating the org admin msp"
  set -x
  fabric-ca-client enroll -u https://edcadmin:edcadminpw@localhost:8054 --caname ca-edc -M ${PWD}/organizations/peerOrganizations/edc.example.com/users/Admin@edc.example.com/msp --tls.certfiles ${PWD}/organizations/fabric-ca/edc/tls-cert.pem
  { set +x; } 2>/dev/null

  cp ${PWD}/organizations/peerOrganizations/edc.example.com/msp/config.yaml ${PWD}/organizations/peerOrganizations/edc.example.com/users/Admin@edc.example.com/msp/config.yaml
}

function createOrderer() {
  infoln "Enrolling the CA admin"
  mkdir -p organizations/ordererOrganizations/example.com

  export FABRIC_CA_CLIENT_HOME=${PWD}/organizations/ordererOrganizations/example.com

  set -x
  fabric-ca-client enroll -u https://admin:adminpw@localhost:9054 --caname ca-orderer --tls.certfiles ${PWD}/organizations/fabric-ca/ordererOrg/tls-cert.pem
  { set +x; } 2>/dev/null

  echo 'NodeOUs:
  Enable: true
  ClientOUIdentifier:
    Certificate: cacerts/localhost-9054-ca-orderer.pem
    OrganizationalUnitIdentifier: client
  PeerOUIdentifier:
    Certificate: cacerts/localhost-9054-ca-orderer.pem
    OrganizationalUnitIdentifier: peer
  AdminOUIdentifier:
    Certificate: cacerts/localhost-9054-ca-orderer.pem
    OrganizationalUnitIdentifier: admin
  OrdererOUIdentifier:
    Certificate: cacerts/localhost-9054-ca-orderer.pem
    OrganizationalUnitIdentifier: orderer' >${PWD}/organizations/ordererOrganizations/example.com/msp/config.yaml

  infoln "Registering orderer"
  set -x
  fabric-ca-client register --caname ca-orderer --id.name orderer --id.secret ordererpw --id.type orderer --tls.certfiles ${PWD}/organizations/fabric-ca/ordererOrg/tls-cert.pem
  { set +x; } 2>/dev/null

  infoln "Registering the orderer admin"
  set -x
  fabric-ca-client register --caname ca-orderer --id.name ordererAdmin --id.secret ordererAdminpw --id.type admin --tls.certfiles ${PWD}/organizations/fabric-ca/ordererOrg/tls-cert.pem
  { set +x; } 2>/dev/null

  infoln "Generating the orderer msp"
  set -x
  fabric-ca-client enroll -u https://orderer:ordererpw@localhost:9054 --caname ca-orderer -M ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp --csr.hosts orderer.example.com --csr.hosts localhost --tls.certfiles ${PWD}/organizations/fabric-ca/ordererOrg/tls-cert.pem
  { set +x; } 2>/dev/null

  cp ${PWD}/organizations/ordererOrganizations/example.com/msp/config.yaml ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/config.yaml

  infoln "Generating the orderer-tls certificates"
  set -x
  fabric-ca-client enroll -u https://orderer:ordererpw@localhost:9054 --caname ca-orderer -M ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/tls --enrollment.profile tls --csr.hosts orderer.example.com --csr.hosts localhost --tls.certfiles ${PWD}/organizations/fabric-ca/ordererOrg/tls-cert.pem
  { set +x; } 2>/dev/null

  cp ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/tls/tlscacerts/* ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/tls/ca.crt
  cp ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/tls/signcerts/* ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/tls/server.crt
  cp ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/tls/keystore/* ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/tls/server.key

  mkdir -p ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts
  cp ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/tls/tlscacerts/* ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem

  mkdir -p ${PWD}/organizations/ordererOrganizations/example.com/msp/tlscacerts
  cp ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/tls/tlscacerts/* ${PWD}/organizations/ordererOrganizations/example.com/msp/tlscacerts/tlsca.example.com-cert.pem

  infoln "Generating the admin msp"
  set -x
  fabric-ca-client enroll -u https://ordererAdmin:ordererAdminpw@localhost:9054 --caname ca-orderer -M ${PWD}/organizations/ordererOrganizations/example.com/users/Admin@example.com/msp --tls.certfiles ${PWD}/organizations/fabric-ca/ordererOrg/tls-cert.pem
  { set +x; } 2>/dev/null

  cp ${PWD}/organizations/ordererOrganizations/example.com/msp/config.yaml ${PWD}/organizations/ordererOrganizations/example.com/users/Admin@example.com/msp/config.yaml
}
