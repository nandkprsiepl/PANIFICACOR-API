#!/bin/bash

# imports  
. scripts/envVar.sh
. scripts/utils.sh


CHANNEL_NAME="$1"
DELAY="$2"
MAX_RETRY="$3"
VERBOSE="$4"
BFT="$5"
CHANNEL_ID="$6"

: ${CHANNEL_NAME:="mychannel"}
: ${DELAY:="3"}
: ${MAX_RETRY:="5"}
: ${VERBOSE:="false"}
: ${BFT:=0}

: ${CONTAINER_CLI:="docker"}
: ${CONTAINER_CLI_COMPOSE:="${CONTAINER_CLI}-compose"}
infoln "Using ${CONTAINER_CLI} and ${CONTAINER_CLI_COMPOSE}"

if [ ! -d "channel-artifacts" ]; then
	mkdir channel-artifacts
fi

createChannelGenesisBlock() {
  setGlobals 1
	which configtxgen
	if [ "$?" -ne 0 ]; then
		fatalln "configtxgen tool not found."
	fi
	local bft_true=$1
	set -x

	if [ $bft_true -eq 1 ]; then
		configtxgen -profile ChannelUsingBFT -outputBlock ./channel-artifacts/${CHANNEL_NAME}.block -channelID $CHANNEL_NAME
	else
		if [ $CHANNEL_ID == "BCMChannel" ]; then
			configtxgen -profile BCMChannel -outputBlock ./channel-artifacts/${CHANNEL_NAME}.block -channelID $CHANNEL_NAME
		elif [ $CHANNEL_ID == "BFCChannel" ]; then
			configtxgen -profile BFCChannel -outputBlock ./channel-artifacts/${CHANNEL_NAME}.block -channelID $CHANNEL_NAME
		elif [ $CHANNEL_ID == "FCChannel" ]; then
			configtxgen -profile FCChannel -outputBlock ./channel-artifacts/${CHANNEL_NAME}.block -channelID $CHANNEL_NAME
		elif [ $CHANNEL_ID == "CommonChannel" ]; then
			configtxgen -profile CommonChannel -outputBlock ./channel-artifacts/${CHANNEL_NAME}.block -channelID $CHANNEL_NAME		
		else
			printHelp
			exit 1
		fi	
	fi
	res=$?
	{ set +x; } 2>/dev/null
  verifyResult $res "Failed to generate channel configuration transaction..."
}

createChannel() {
	# Poll in case the raft leader is not set yet
	local rc=1
	local COUNTER=1
	local bft_true=$1
	infoln "Adding orderers"
	while [ $rc -ne 0 -a $COUNTER -lt $MAX_RETRY ] ; do
		sleep $DELAY
		set -x
    . scripts/orderer.sh ${CHANNEL_NAME}> /dev/null 2>&1
    if [ $bft_true -eq 1 ]; then
      . scripts/orderer2.sh ${CHANNEL_NAME}> /dev/null 2>&1
      . scripts/orderer3.sh ${CHANNEL_NAME}> /dev/null 2>&1
      . scripts/orderer4.sh ${CHANNEL_NAME}> /dev/null 2>&1
    fi
		res=$?
		{ set +x; } 2>/dev/null
		let rc=$res
		COUNTER=$(expr $COUNTER + 1)
	done
	cat log.txt
	verifyResult $res "Channel creation failed"
}

# joinChannel ORG
joinChannel() {
  ORG=$1
  PEER=$2
  FABRIC_CFG_PATH=$PWD/../config/
  setGlobals $ORG $PEER
	local rc=1
	local COUNTER=1
	## Sometimes Join takes time, hence retry
	while [ $rc -ne 0 -a $COUNTER -lt $MAX_RETRY ] ; do
    sleep $DELAY
    set -x
    peer channel join -b $BLOCKFILE >&log.txt
    res=$?
    { set +x; } 2>/dev/null
		let rc=$res
		COUNTER=$(expr $COUNTER + 1)
	done
	cat log.txt
	verifyResult $res "After $MAX_RETRY attempts, peer${PEER}.org${ORG} has failed to join channel '$CHANNEL_NAME' "
}

setAnchorPeer() {
  ORG=$1
  ${CONTAINER_CLI} exec cli ./scripts/setAnchorPeer.sh $ORG $CHANNEL_NAME 
}


## User attempts to use BFT orderer in Fabric network with CA
if [ $BFT -eq 1 ] && [ -d "organizations/fabric-ca/ordererOrg/msp" ]; then
  fatalln "Fabric network seems to be using CA. This sample does not yet support the use of consensus type BFT and CA together."
fi


initiateChannelCreation() {

	## Create channel genesis block
	FABRIC_CFG_PATH=$PWD/../config/
	BLOCKFILE="./channel-artifacts/${CHANNEL_NAME}.block"

	infoln "Generating channel genesis block '${CHANNEL_NAME}.block'"
	FABRIC_CFG_PATH=${PWD}/configtx
	if [ $BFT -eq 1 ]; then
	FABRIC_CFG_PATH=${PWD}/bft-config
	fi
	createChannelGenesisBlock $BFT


	## Create channel
	infoln "Creating channel ${CHANNEL_NAME}"
	createChannel $BFT
	successln "Channel '$CHANNEL_NAME' created"

	if [ $CHANNEL_ID == "BCMChannel" ]; then
			## Join all the peers to the channel
			infoln "Joining org1 peer0 to the channel..."
			joinChannel 1 0
			infoln "Joining org3 peer0 to the channel..."
			joinChannel 3 0
			infoln "Joining org4 peer0 to the channel..."
			joinChannel 4 0

			infoln "Joining org1 peer1 to the channel..."
			joinChannel 1 1
			infoln "Joining org3 peer1 to the channel..."
			joinChannel 3 1
			infoln "Joining org4 peer1 to the channel..."
			joinChannel 4 1

			## Set the anchor peers for each org in the channel
			infoln "Setting anchor peer for org1..."
			setAnchorPeer 1
			infoln "Setting anchor peer for org3..."
			setAnchorPeer 3
			infoln "Setting anchor peer for org4..."
			setAnchorPeer 4

	elif [ $CHANNEL_ID == "BFCChannel" ]; then
			## Join all the peers to the channel
			infoln "Joining org1 peer0 to the channel..."
			joinChannel 1 0
			infoln "Joining org2 peer0 to the channel..."
			joinChannel 2 0
			infoln "Joining org3 peer0 to the channel..."
			joinChannel 3 0
			infoln "Joining org1 peer1 to the channel..."
			joinChannel 1 1
			infoln "Joining org2 peer1 to the channel..."
			joinChannel 2 1
			infoln "Joining org3 peer1 to the channel..."
			joinChannel 3 1

			## Set the anchor peers for each org in the channel
			infoln "Setting anchor peer for org1..."
			setAnchorPeer 1
			infoln "Setting anchor peer for org2..."
			setAnchorPeer 2
			infoln "Setting anchor peer for org3..."
			setAnchorPeer 3

	elif [ $CHANNEL_ID == "FCChannel" ]; then
			## Join all the peers to the channel
			infoln "Joining org2 peer0 to the channel..."
			joinChannel 2 0
			infoln "Joining org3 peer0 to the channel..."
			joinChannel 3 0

			infoln "Joining org2 peer1 to the channel..."
			joinChannel 2 1
			infoln "Joining org3 peer1 to the channel..."
			joinChannel 3 1
	
	
			## Set the anchor peers for each org in the channel
			infoln "Setting anchor peer for org2..."
			setAnchorPeer 2
			infoln "Setting anchor peer for org3..."
			setAnchorPeer 3

	elif [ $CHANNEL_ID == "CommonChannel" ]; then
			## Join all the peers to the channel
			infoln "Joining org1 peer0 to the channel..."
			joinChannel 1 0
			infoln "Joining org2 peer0 to the channel..."
			joinChannel 2 0
			infoln "Joining org3 peer0 to the channel..."
			joinChannel 3 0
			infoln "Joining org4 peer0 to the channel..."
			joinChannel 4 0
			infoln "Joining org5 peer0 to the channel..."
			joinChannel 5 0

			infoln "Joining org1 peer1 to the channel..."
			joinChannel 1 1
			infoln "Joining org2 peer1 to the channel..."
			joinChannel 2 1
			infoln "Joining org3 peer1 to the channel..."
			joinChannel 3 1
			infoln "Joining org4 peer1 to the channel..."
			joinChannel 4 1
			infoln "Joining org5 peer1 to the channel..."
			joinChannel 5 1

			## Set the anchor peers for each org in the channel
			infoln "Setting anchor peer for org1..."
			setAnchorPeer 1
			infoln "Setting anchor peer for org2..."
			setAnchorPeer 2
			infoln "Setting anchor peer for org3..."
			setAnchorPeer 3
			infoln "Setting anchor peer for org4.."
			setAnchorPeer 4
			infoln "Setting anchor peer for org5..."
			setAnchorPeer 5

	else
			## Join all the peers to the channel
			infoln "Joining org1 peer0 to the channel..."
			joinChannel 1 0
			infoln "Joining org2 peer0 to the channel..."
			joinChannel 2 0
			infoln "Joining org3 peer0 to the channel..."
			joinChannel 3 0
			infoln "Joining org1 peer1 to the channel..."
			joinChannel 1 1
			infoln "Joining org2 peer1 to the channel..."
			joinChannel 2 1
			infoln "Joining org3 peer1 to the channel..."
			joinChannel 3 1


			## Set the anchor peers for each org in the channel
			infoln "Setting anchor peer for org1..."
			setAnchorPeer 1
			infoln "Setting anchor peer for org2..."
			setAnchorPeer 2
			infoln "Setting anchor peer for org3..."
			setAnchorPeer 3
	fi


successln "Channel '$CHANNEL_NAME' joined"

}

initiateChannelCreation