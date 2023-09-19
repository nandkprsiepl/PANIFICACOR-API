package niit.fabric.apis.hyperledger.utils;

import niit.fabric.apis.hyperledger.config.Constants;
import org.apache.tomcat.util.bcel.Const;
import org.hyperledger.fabric.gateway.Gateway;
import org.hyperledger.fabric.gateway.Network;
import org.hyperledger.fabric.gateway.Wallet;
import org.hyperledger.fabric.sdk.Channel;
import org.hyperledger.fabric.sdk.HFClient;
import org.hyperledger.fabric.sdk.Peer;
import org.hyperledger.fabric.sdk.security.CryptoSuite;
import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Component;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.file.Path;
import java.nio.file.Paths;

@Component
public class NetworkUtils {

    @Autowired
    private Utils utils;

    @Autowired
    private Constants constants;

    public Network getNetwork(String channelName,String user,String orgName) throws IOException {
        System.out.println("cwd-->"+System.getProperty("user.dir"));
        Wallet wallet = utils.getWallet();
        if(wallet.get(user) != null){
        }
        Gateway.Builder builder = Gateway.createBuilder();
        //Path networkConfigPath = Paths.get(this.getConnectionFilePath(orgName));
        Resource resource = new ClassPathResource(this.getConnectionFilePath(orgName));
        //builder.identity(wallet, user).networkConfig(networkConfigPath).discovery(true);
        builder.identity(wallet, user).networkConfig(resource.getInputStream()).discovery(true);
        Gateway gateway = builder.connect();
        Network network = gateway.getNetwork(channelName);
        return network;
    }

    public JSONObject getPeerDetails(String peer,String orgName){
        JSONObject config = utils.getConfig(this.getConnectionFilePath(orgName));
        JSONObject peerOb = (JSONObject) ((JSONObject) config.get(Constants.PEERS)).get(peer);
        return  peerOb;
    }

    public Channel getChannel(String channelName, String user, String peerid,String org,String orgName){
        Channel channel= null;
        try{
            Network network = this.getNetwork(channelName,user,orgName);
            channel = network.getChannel();
            HFClient client = HFClient.createNewInstance();
            client.setCryptoSuite(CryptoSuite.Factory.getCryptoSuite());
            client.setUserContext(utils.getRegisteredUser(user));
            org.json.simple.JSONObject peerDetails = this.getPeerDetails(peerid,orgName);
            Peer peer = client.newPeer(peerid, (String)peerDetails.get(Constants.URL) , constants.getProperties(org,peerid,orgName) );
            channel.addPeer(peer);
        }catch(Exception e) {
            e.printStackTrace();
        }
        return channel;
    }

    public HFClient getHFClient(String user){
        HFClient client = null;
        try{
            client = HFClient.createNewInstance();
            client.setCryptoSuite(CryptoSuite.Factory.getCryptoSuite());
            client.setUserContext(utils.getRegisteredUser(user));
        }catch(Exception e){
           e.printStackTrace();
        }
        return client;
    }

    public Peer getPeer(String peerid,String user,String org,String orgName){
        Peer peer= null;
        try{
            HFClient client = this.getHFClient(user);
            JSONObject peerDetails = this.getPeerDetails(peerid,orgName);
            peer = client.newPeer(peerid, (String)peerDetails.get(Constants.URL) , constants.getProperties(org,peerid,orgName) );
        }catch(Exception e){
            e.printStackTrace();
        }
        return peer;

    }

    public String getPemFilePath(String org,String peer,String orgName){
        String basePATH = utils.getJsonConfig(Constants.CONFIG_PATH).get("basePath").toString();
        if(orgName.equals(Constants.FIRST_ORGANISATION)){
             return Paths.get(basePATH,Constants.ARTIFACTS_PATH, Constants.ORGANISATIONS, org, Constants.PEERS, peer, Constants.SERVER_CRT).toString();
        }else{
             return Paths.get(basePATH,Constants.ARTIFACTS_PATH,orgName+"-artifacts", Constants.ORGANISATIONS, org, Constants.PEERS, peer, Constants.SERVER_CRT).toString();
        }
    }

    public String getClientKeyPath(String org,String peer,String orgName){
        String basePATH = utils.getJsonConfig(Constants.CONFIG_PATH).get("basePath").toString();
        if(orgName.equals(Constants.FIRST_ORGANISATION)){
            return Paths.get(basePATH,Constants.ARTIFACTS_PATH, Constants.ORGANISATIONS, org, Constants.USERS,"Admin@"+org, Constants.MSP, Constants.KEYSTORE , Constants.PRIVATE_KEY).toString();
        }else{
            return Paths.get(basePATH,Constants.ARTIFACTS_PATH,orgName+"-artifacts", Constants.ORGANISATIONS, org, Constants.USERS,"Admin@"+org, Constants.MSP, Constants.KEYSTORE , Constants.PRIVATE_KEY).toString();
        }
    }

    public String getClientCertPath(String org,String peer,String orgName){
        String basePATH = utils.getJsonConfig(Constants.CONFIG_PATH).get("basePath").toString();
        if(orgName.equals(Constants.FIRST_ORGANISATION)){
            return Paths.get(basePATH,Constants.ARTIFACTS_PATH, Constants.ORGANISATIONS, org, Constants.USERS, "Admin@"+org, Constants.MSP, Constants.SIGNCERTS, "Admin@"+org+Constants.CERT_PEM).toString();
        }else{
            return Paths.get(basePATH,Constants.ARTIFACTS_PATH,orgName+"-artifacts", Constants.ORGANISATIONS, org, Constants.USERS, "Admin@"+org, Constants.MSP, Constants.SIGNCERTS, "Admin@"+org+Constants.CERT_PEM).toString();
        }
    }

    public String getConnectionFilePath(String orgName){
        return Paths.get("peer1org.json").toString();
    }
}

