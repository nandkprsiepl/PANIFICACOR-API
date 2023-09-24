#!/bin/bash
#
# Copyright IBM Corp All Rights Reserved
#
# SPDX-License-Identifier: Apache-2.0
#

# This is a collection of bash functions used by different scripts

# imports
. scripts/utils.sh

export CORE_PEER_TLS_ENABLED=true
export ORDERER_CA=${PWD}/organizations/ordererOrganizations/example.com/tlsca/tlsca.example.com-cert.pem
export PEER0_ORG1_CA=${PWD}/organizations/peerOrganizations/broker.example.com/tlsca/tlsca.broker.example.com-cert.pem
export PEER0_ORG2_CA=${PWD}/organizations/peerOrganizations/farmer.example.com/tlsca/tlsca.farmer.example.com-cert.pem
export PEER0_ORG3_CA=${PWD}/organizations/peerOrganizations/cerealist.example.com/tlsca/tlsca.cerealist.example.com-cert.pem
export PEER0_ORG4_CA=${PWD}/organizations/peerOrganizations/mills.example.com/tlsca/tlsca.mills.example.com-cert.pem
export PEER0_ORG5_CA=${PWD}/organizations/peerOrganizations/baker.example.com/tlsca/tlsca.baker.example.com-cert.pem

# Set environment variables for the peer org
setGlobals() {
  local USING_ORG=""
  if [ -z "$OVERRIDE_ORG" ]; then
    USING_ORG=$1
  else
    USING_ORG="${OVERRIDE_ORG}"
  fi

  local USING_PEER=""
  if [ -z "$OVERRIDE_PEER" ]; then
    USING_PEER=$2
  else
    USING_PEER="${OVERRIDE_PEER}"
  fi

  infoln "Using organization ${USING_ORG}"
  if [ $USING_ORG -eq 1 ]; then
    export CORE_PEER_LOCALMSPID="BrokerMSP"
    export CORE_PEER_TLS_ROOTCERT_FILE=$PEER0_ORG1_CA
    export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/broker.example.com/users/Admin@broker.example.com/msp
      if [ $USING_PEER -eq 1 ]; then
          export CORE_PEER_ADDRESS=localhost:17051 
      else
          export CORE_PEER_ADDRESS=localhost:7051
      fi
  elif [ $USING_ORG -eq 2 ]; then
    export CORE_PEER_LOCALMSPID="FarmerMSP"
    export CORE_PEER_TLS_ROOTCERT_FILE=$PEER0_ORG2_CA
    export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/farmer.example.com/users/Admin@farmer.example.com/msp
      if [ $USING_PEER -eq 1 ]; then
          export CORE_PEER_ADDRESS=localhost:19051 
      else
          export CORE_PEER_ADDRESS=localhost:9051
      fi
  elif [ $USING_ORG -eq 3 ]; then
    export CORE_PEER_LOCALMSPID="CerealistMSP"
    export CORE_PEER_TLS_ROOTCERT_FILE=$PEER0_ORG3_CA
    export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/cerealist.example.com/users/Admin@cerealist.example.com/msp
      if [ $USING_PEER -eq 1 ]; then
          export CORE_PEER_ADDRESS=localhost:21051 
      else
          export CORE_PEER_ADDRESS=localhost:11051
      fi
  elif [ $USING_ORG -eq 4 ]; then
    export CORE_PEER_LOCALMSPID="MillsMSP"
    export CORE_PEER_TLS_ROOTCERT_FILE=$PEER0_ORG4_CA
    export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/mills.example.com/users/Admin@mills.example.com/msp
    if [ $USING_PEER -eq 1 ]; then
          export CORE_PEER_ADDRESS=localhost:23051 
    else
          export CORE_PEER_ADDRESS=localhost:13051
    fi
  elif [ $USING_ORG -eq 5 ]; then
    export CORE_PEER_LOCALMSPID="BakerMSP"
    export CORE_PEER_TLS_ROOTCERT_FILE=$PEER0_ORG5_CA
    export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/baker.example.com/users/Admin@baker.example.com/msp
    export CORE_PEER_ADDRESS=localhost:15051 
    if [ $USING_PEER -eq 1 ]; then
          export CORE_PEER_ADDRESS=localhost:25051 
    else
          export CORE_PEER_ADDRESS=localhost:15051
    fi 
  else
    errorln "ORG Unknown"
  fi

  if [ "$VERBOSE" == "true" ]; then
    env | grep CORE
  fi
}

# Set environment variables for use in the CLI container
setGlobalsCLI() {
  setGlobals $1 0

  local USING_ORG=""
  if [ -z "$OVERRIDE_ORG" ]; then
    USING_ORG=$1
  else
    USING_ORG="${OVERRIDE_ORG}"
  fi
  if [ $USING_ORG -eq 1 ]; then
    export CORE_PEER_ADDRESS=peer0.broker.example.com:7051
  elif [ $USING_ORG -eq 2 ]; then
    export CORE_PEER_ADDRESS=peer0.farmer.example.com:9051
  elif [ $USING_ORG -eq 3 ]; then
    export CORE_PEER_ADDRESS=peer0.cerealist.example.com:11051
  elif [ $USING_ORG -eq 4 ]; then
    export CORE_PEER_ADDRESS=peer0.mills.example.com:13051
  elif [ $USING_ORG -eq 5 ]; then
    export CORE_PEER_ADDRESS=peer0.baker.example.com:15051    
  else
    errorln "ORG Unknown"
  fi
}

# parsePeerConnectionParameters $@
# Helper function that sets the peer connection parameters for a chaincode
# operation
parsePeerConnectionParameters() {
  PEER_CONN_PARMS=()
  PEERS=""
  while [ "$#" -gt 0 ]; do
    setGlobals $1
    PEER="peer0.org$1"
    ## Set peer addresses
    if [ -z "$PEERS" ]
    then
	PEERS="$PEER"
    else
	PEERS="$PEERS $PEER"
    fi
    PEER_CONN_PARMS=("${PEER_CONN_PARMS[@]}" --peerAddresses $CORE_PEER_ADDRESS)
    ## Set path to TLS certificate
    CA=PEER0_ORG$1_CA
    TLSINFO=(--tlsRootCertFiles "${!CA}")
    PEER_CONN_PARMS=("${PEER_CONN_PARMS[@]}" "${TLSINFO[@]}")
    # shift by one to get to the next organization
    shift
  done
}

verifyResult() {
  if [ $1 -ne 0 ]; then
    fatalln "$2"
  fi
}
