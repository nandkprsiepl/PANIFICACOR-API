package niit.fabric.apis.hyperledger.services;

import niit.fabric.apis.hyperledger.config.Constants;
import niit.fabric.apis.hyperledger.utils.NetworkUtils;
import niit.fabric.apis.hyperledger.utils.Utils;
import org.hyperledger.fabric.gateway.Network;
import org.hyperledger.fabric.sdk.*;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Iterator;
import java.util.Set;

@Component
public class LedgerService {

    @Autowired
    private NetworkUtils networkUtils;

    @Autowired
    private Constants constants;

    @Autowired
    private Utils utils;

    public String getBlockByNumber(long blockNo,String channelName,String user,String peerid,String org,String orgName)  {
        JSONObject block = new JSONObject();
        try{
            HFClient client = networkUtils.getHFClient(user);
            Network network = networkUtils.getNetwork(channelName,user,orgName);
            Channel channel = network.getChannel();
            org.json.simple.JSONObject peerDetails = networkUtils.getPeerDetails(peerid,orgName);
            Peer peer = client.newPeer(peerid, (String)peerDetails.get(Constants.URL) , constants.getProperties(org,peerid,orgName) );
            channel.addPeer(peer);

            BlockInfo blockInfo = channel.queryBlockByNumber(peer,blockNo);
            JSONArray blockEnvelopes = blockInfo.getTransactionCount() > 0 ? utils.parseBlockInfo(blockInfo) : new JSONArray();
            block.put("prevHash",new String(utils.bytesToHex(blockInfo.getPreviousHash())));
            block.put("currentBlockHash",new String(utils.bytesToHex(blockInfo.getDataHash())));
            block.put("blockNumber",blockInfo.getBlockNumber());
            block.put("txCount",blockInfo.getTransactionCount());
            block.put("blockInfo",blockEnvelopes);

        }catch(Exception e){
            e.printStackTrace();
        }
        return block.toString();
    }

    public String getTransactionByID(String txId,String channelName,String user,String peerid,String org,String orgName)  {
        JSONArray txEnvelopes = new JSONArray();
        try{
            HFClient client = networkUtils.getHFClient(user);
            Network network = networkUtils.getNetwork(channelName,user,orgName);
            Channel channel = network.getChannel();
            org.json.simple.JSONObject peerDetails = networkUtils.getPeerDetails(peerid,orgName);
            Peer peer = client.newPeer(peerid, (String)peerDetails.get(Constants.URL) , constants.getProperties(org,peerid,orgName) );
            channel.addPeer(peer);

            BlockInfo blockInfo = channel.queryBlockByTransactionID(txId);
            txEnvelopes  = utils.parseTxInfo(blockInfo,txId);
        }catch(Exception e){
            e.printStackTrace();
        }
        return txEnvelopes.get(0).toString();
    }

    public String getBlockByHash(String hash,String channelName,String user,String peerid,String org,String orgName)  {
        JSONObject block = new JSONObject();
        try{
            HFClient client = networkUtils.getHFClient(user);
            Network network = networkUtils.getNetwork(channelName,user,orgName);
            Channel channel = network.getChannel();
            org.json.simple.JSONObject peerDetails = networkUtils.getPeerDetails(peerid,orgName);
            Peer peer = client.newPeer(peerid, (String)peerDetails.get(Constants.URL) , constants.getProperties(org,peerid,orgName) );
            channel.addPeer(peer);

            byte[] hashOb = hash.getBytes();
            BlockInfo blockInfo = channel.queryBlockByHash(peer,hashOb);
            JSONArray blockEnvelopes = blockInfo.getTransactionCount() > 0 ? utils.parseBlockInfo(blockInfo) : new JSONArray();
            block.put("prevHash",new String(utils.bytesToHex(blockInfo.getPreviousHash())));
            block.put("currentBlockHash",new String(utils.bytesToHex(blockInfo.getDataHash())));
            block.put("blockNumber",blockInfo.getBlockNumber());
            block.put("txCount",blockInfo.getTransactionCount());
            block.put("blockInfo",blockEnvelopes);

        }catch(Exception e){
            e.printStackTrace();
        }
        return block.toString();
    }

    public String getChainInfo(String channelName,String user,String peerid,String org,String orgName)  {
        JSONObject infoJson = new JSONObject();
        try{
            HFClient client = networkUtils.getHFClient(user);
            Network network = networkUtils.getNetwork(channelName,user,orgName);
            Channel channel = network.getChannel();
            org.json.simple.JSONObject peerDetails = networkUtils.getPeerDetails(peerid,orgName);
            Peer peer = client.newPeer(peerid, (String)peerDetails.get(Constants.URL) , constants.getProperties(org,peerid,orgName) );
            channel.addPeer(peer);

            BlockchainInfo bcInfo =  channel.queryBlockchainInfo();
            infoJson.put("currentBlockHash",new String(utils.bytesToHex(bcInfo.getCurrentBlockHash())));
            infoJson.put("height", Long.toString(bcInfo.getHeight()));
            infoJson.put("previousBlockHash", new String(utils.bytesToHex(bcInfo.getPreviousBlockHash())));
        }catch(Exception e){
            e.printStackTrace();
        }
        return infoJson.toString();
    }

    public String getInstalledChaincodes(String channelName,String user,String peerid,String org,String orgName)  {
        JSONArray chaincodes = new JSONArray();
        try{
            HFClient client = networkUtils.getHFClient(user);
            Network network = networkUtils.getNetwork(channelName,user,orgName);
            Channel channel = network.getChannel();
            org.json.simple.JSONObject peerDetails = networkUtils.getPeerDetails(peerid,orgName);
            Peer peer = client.newPeer(peerid, (String)peerDetails.get(Constants.URL) , constants.getProperties(org,peerid,orgName) );
            channel.addPeer(peer);

            Collection<Peer> peers= new ArrayList<>();
            peers.add(peer);

            Collection<LifecycleQueryInstalledChaincodesProposalResponse> results = client.sendLifecycleQueryInstalledChaincodes(client.newLifecycleQueryInstalledChaincodesRequest(), peers);
            results.forEach(lifecycleQueryInstalledChaincodesProposalResponse -> {
                try{
                    Collection<LifecycleQueryInstalledChaincodesProposalResponse.LifecycleQueryInstalledChaincodesResult> list = lifecycleQueryInstalledChaincodesProposalResponse.getLifecycleQueryInstalledChaincodesResult();
                    list.forEach(lifecycleQueryInstalledChaincodesResult -> {
                        lifecycleQueryInstalledChaincodesResult.getPackageId();
                        JSONObject chaincode = new JSONObject();
                        chaincode.put("packageId",lifecycleQueryInstalledChaincodesResult.getPackageId());
                        chaincode.put("label",lifecycleQueryInstalledChaincodesResult.getLabel());
                        chaincodes.put(chaincode);
                    });
                }catch(Exception e){e.printStackTrace();}
            });

        }catch(Exception e){
            e.printStackTrace();
        }
        return chaincodes.toString();
    }

    public String getInstantiatedChaincodes(String channelName,String user,String peerid,String org,String orgName)  {
        JSONArray chaincodes = new JSONArray();
        try{
            HFClient client = networkUtils.getHFClient(user);
            Network network = networkUtils.getNetwork(channelName,user,orgName);
            Channel channel = network.getChannel();
            org.json.simple.JSONObject peerDetails = networkUtils.getPeerDetails(peerid,orgName);
            Peer peer = client.newPeer(peerid, (String)peerDetails.get(Constants.URL) , constants.getProperties(org,peerid,orgName) );
            channel.addPeer(peer);

            Collection<Peer> peers= new ArrayList<>();
            peers.add(peer);

            Collection<LifecycleQueryChaincodeDefinitionsProposalResponse> lifecycleQueryChaincodeDefinitions = channel.lifecycleQueryChaincodeDefinitions(client.newLifecycleQueryChaincodeDefinitionsRequest(),peers);
            lifecycleQueryChaincodeDefinitions.forEach(def -> {
                try{
                    def.getLifecycleQueryChaincodeDefinitionsResult().forEach(defn -> {
                        defn.getName();
                        JSONObject chaincode = new JSONObject();
                        chaincode.put("name",defn.getName());
                        chaincode.put("version",defn.getVersion());
                        chaincode.put("sequence",defn.getSequence());
                        chaincodes.put(chaincode);
                    });
                }catch(Exception e){
                }
            });

        }catch(Exception e){
            e.printStackTrace();
        }
        return chaincodes.toString();
    }

    public String getChannels(String user,String peerid,String org,String orgName)  {
        JSONArray channelsArray = new JSONArray();
        try{
            HFClient client = networkUtils.getHFClient(user);
            org.json.simple.JSONObject peerDetails = networkUtils.getPeerDetails(peerid,orgName);
            Peer peer = client.newPeer(peerid, (String)peerDetails.get(Constants.URL) , constants.getProperties(org,peerid,orgName) );

            Set<String> channels = client.queryChannels(peer);
            Iterator<String> itr = channels.iterator();
            while(itr.hasNext()){
                channelsArray.put(itr.next());
            }

        }catch(Exception e){
            e.printStackTrace();
        }
        return channelsArray.toString();
    }
}
