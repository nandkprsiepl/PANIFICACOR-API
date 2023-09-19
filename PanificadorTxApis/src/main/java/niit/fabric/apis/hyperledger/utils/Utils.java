package niit.fabric.apis.hyperledger.utils;

import com.fasterxml.jackson.databind.ObjectMapper;
import niit.fabric.apis.hyperledger.config.Constants;
import org.apache.commons.codec.binary.Hex;
import org.hyperledger.fabric.gateway.Identities;
import org.hyperledger.fabric.gateway.Wallet;
import org.hyperledger.fabric.gateway.Wallets;
import org.hyperledger.fabric.gateway.X509Identity;
import org.hyperledger.fabric.protos.ledger.rwset.kvrwset.KvRwset;
import org.hyperledger.fabric.sdk.BlockInfo;
import org.hyperledger.fabric.sdk.Enrollment;
import org.hyperledger.fabric.sdk.TxReadWriteSetInfo;
import org.hyperledger.fabric.sdk.User;
import org.json.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Component;
import org.springframework.util.ResourceUtils;

import java.io.*;
import java.net.URL;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.PrivateKey;
import java.util.Set;
import java.util.stream.Collectors;

@Component
public class Utils {

    public Wallet getWallet() throws IOException {
        Path walletPath = Paths.get(Constants.WALLET);
        Wallet wallet = Wallets.newFileSystemWallet(walletPath);
        //Wallet wallet = Wallets.newCouchDBWallet(new URL(this.getJsonConfig("config.json").get("walletURL").toString()),"wallet");
        return wallet;
    }

    public JSONObject getJsonConfig(String fileName){
       JSONObject ob = new JSONObject();
        try {
            Resource resource = new ClassPathResource(fileName);
            BufferedReader reader = new BufferedReader(new InputStreamReader(resource.getInputStream()));
            JSONParser parser = new JSONParser();
            ob = (JSONObject) parser.parse(reader.lines().collect(Collectors.joining(System.lineSeparator())));
        }catch(Exception e){
            e.printStackTrace();
        }
        return ob;
    }

        public JSONObject getConfig(String file){
        JSONObject ob = new JSONObject();
        try {
            Resource resource = new ClassPathResource(file);
            BufferedReader reader = new BufferedReader(new InputStreamReader(resource.getInputStream()));
            JSONParser parser = new JSONParser();
            ob = (JSONObject) parser.parse(reader.lines().collect(Collectors.joining(System.lineSeparator())));
        }catch(Exception e){
            e.printStackTrace();
        }
        return ob;
    }

    char[] HEX_ARRAY = "0123456789ABCDEF".toCharArray();
    public  String bytesToHex(byte[] bytes) {
        char[] hexChars = new char[bytes.length * 2];
        for (int j = 0; j < bytes.length; j++) {
            int v = bytes[j] & 0xFF;
            hexChars[j * 2] = HEX_ARRAY[v >>> 4];
            hexChars[j * 2 + 1] = HEX_ARRAY[v & 0x0F];
        }
        return new String(hexChars);
    }

    public User getAdminUser(){
        User admin = null;
        try{
            Path walletPath = Paths.get("wallet");
          //  Wallet wallet = Wallets.newCouchDBWallet(new URL(this.getJsonConfig("config.json").get("walletURL").toString()),"wallet");
            Wallet wallet = Wallets.newFileSystemWallet(walletPath);
            X509Identity adminIdentity = (X509Identity)wallet.get("admin");
             admin = new User() {

                public String getName() {
                    return "admin";
                }

                public Set<String> getRoles() {
                    return null;
                }

                public String getAccount() {
                    return null;
                }

                public String getAffiliation() {
                    return null;
                }

                // Enrollment is an interface to retrieve certificate and private key of the user in context
                public Enrollment getEnrollment() {
                    return new Enrollment() {
                        public PrivateKey getKey() {
                            return adminIdentity.getPrivateKey();
                        }

                        public String getCert() {
                            return Identities.toPemString(adminIdentity.getCertificate());
                        }
                    };
                }

                public String getMspId() {
                    return adminIdentity.getMspId();
                }
            };

        }catch(Exception e){
            e.printStackTrace();
        }
        return admin;
    }

    public User getRegisteredUser(String userName){
        User user = null;
        try{
            Path walletPath = Paths.get("wallet");
            //Wallet wallet = Wallets.newCouchDBWallet(new URL(this.getJsonConfig("config.json").get("walletURL").toString()),"wallet");
            Wallet wallet = Wallets.newFileSystemWallet(walletPath);
            X509Identity userIdentity = (X509Identity)wallet.get(userName);
            user = new User() {

                public String getName() {
                    return userName;
                }

                public Set<String> getRoles() {
                    return null;
                }

                public String getAccount() {
                    return null;
                }

                public String getAffiliation() {
                    return null;
                }

                // Enrollment is an interface to retrieve certificate and private key of the user in context
                public Enrollment getEnrollment() {
                    return new Enrollment() {
                        public PrivateKey getKey() {
                            return userIdentity.getPrivateKey();
                        }

                        public String getCert() {
                            return Identities.toPemString(userIdentity.getCertificate());
                        }
                    };
                }

                public String getMspId() {
                    return userIdentity.getMspId();
                }
            };

        }catch(Exception e){
            e.printStackTrace();
        }
        return user;
    }

    public JSONArray parseBlockInfo(BlockInfo blockInfo){
        org.json.JSONArray blockEnvelopes = new org.json.JSONArray();
              try{
                for(BlockInfo.EnvelopeInfo info : blockInfo.getEnvelopeInfos()) {
                   JSONObject envelopeInfo = new JSONObject();
                   //JSONObject envelopeJson = new JSONObject();
                   /* envelopeInfo.put("channelId", info.getChannelId());
                    envelopeInfo.put("transactionID", info.getTransactionID());
                    envelopeInfo.put("validationCode", info.getValidationCode());
                    envelopeInfo.put("type", info.getType());
                    envelopeInfo.put("createId", info.getCreator().getId());
                    envelopeInfo.put("createMSPID", info.getCreator().getMspid());
                    envelopeInfo.put("isValid", info.isValid());
                    envelopeInfo.put("nonce", Hex.encodeHexString(info.getNonce()));
                    envelopeInfo.put("timestamp", info.getTimestamp());
*/
                    //envelopeInfo.put("envelopeInfo",envelopeJson);

                  /*  System.out.println("channelId = " + info.getChannelId());
                    System.out.println("nonce = " + Hex.encodeHexString(info.getNonce()));
                    System.out.println("createId = " + info.getCreator().getId());
                    System.out.println("createMSPID = " + info.getCreator().getMspid());
                    System.out.println("isValid = " + info.isValid());
                    System.out.println("transactionID = " + info.getTransactionID());
                    System.out.println("validationCode = " + info.getValidationCode());
                    System.out.println("type = " + info.getType());
*/
                    org.json.JSONObject transInfo = new org.json.JSONObject();

                    BlockInfo.TransactionEnvelopeInfo txeInfo = (BlockInfo.TransactionEnvelopeInfo) info;
                    int txCount = txeInfo.getTransactionActionInfoCount();
                    /*System.out.println("Transaction number " + " has actions count = " + txCount);
                    System.out.println("Transaction number " + " isValid = " + txeInfo.isValid());
                    System.out.println("Transaction number " + " validation code = " + txeInfo.getValidationCode());*/
                    transInfo.put("txCount",txCount);
                    transInfo.put("isvalid",txeInfo.isValid());
                    transInfo.put("validationCode",txeInfo.getValidationCode());

                    org.json.JSONArray txs = new org.json.JSONArray();
                    for (int i = 0; i < txCount; i++) {
                        org.json.JSONObject txOb = new org.json.JSONObject();
                        BlockInfo.TransactionEnvelopeInfo.TransactionActionInfo txInfo = txeInfo.getTransactionActionInfo(i);
                       /* System.out.println("Transaction action " + i + " has response status " + txInfo.getResponseStatus());
                        System.out.println("Transaction action " + i + " has endorsements " + txInfo.getEndorsementsCount());*/
                        txOb.put("respStatus",txInfo.getResponseStatus());
                        txOb.put("endorsements",txInfo.getEndorsementsCount());

                        TxReadWriteSetInfo rwsetInfo = txInfo.getTxReadWriteSet();
                        if (null != rwsetInfo) {
                        }
                        txOb.put("rwSetCount",rwsetInfo.getNsRwsetCount());

                        org.json.JSONArray rwSet = new org.json.JSONArray();
                        for (TxReadWriteSetInfo.NsRwsetInfo nsRwsetInfo : rwsetInfo.getNsRwsetInfos()) {
                            org.json.JSONObject rdWtSetInfo = new org.json.JSONObject();

                            final String namespace = nsRwsetInfo.getNamespace();
                            KvRwset.KVRWSet rws = nsRwsetInfo.getRwset();


                            org.json.JSONArray readSetArray = new org.json.JSONArray();
                            int rs = -1;
                            for (KvRwset.KVRead readList : rws.getReadsList()) {
                                org.json.JSONObject readSet = new org.json.JSONObject();
                                rs++;
                                readSet.put("Namespace",namespace);
                                readSet.put("seqNo",rs);
                                readSet.put("key",readList.getKey());

                                org.json.JSONObject version = new org.json.JSONObject();
                                version.put("blockNumber",readList.getVersion().getBlockNum());
                                version.put("txNumber",readList.getVersion().getTxNum());

                                readSet.put("version",version);
                                readSetArray.put(readSet);
                            }
                            rdWtSetInfo.put("rdSet",readSetArray);

                            org.json.JSONArray writeSetArray = new org.json.JSONArray();
                            rs = -1;
                            for (KvRwset.KVWrite writeList : rws.getWritesList()) {
                                org.json.JSONObject writeSet = new org.json.JSONObject();
                                rs++;
                                String valAsString = new String(writeList.getValue().toByteArray(), "UTF-8");
                                writeSet.put("Namespace",namespace);
                                writeSet.put("seqNo",rs);
                                writeSet.put("key",writeList.getKey());
                                writeSet.put("value",valAsString);
                                writeSet.put("isDelete",writeList.getIsDelete());
                                writeSetArray.put(writeSet);
                            }
                            rdWtSetInfo.put("wtSet",writeSetArray);
                            rdWtSetInfo.put("Namespace",namespace);
                            rwSet.put(rdWtSetInfo);
                        }
                        txOb.put("rwSet",rwSet);
                        txOb.put("channelId", info.getChannelId());
                        txOb.put("transactionID", info.getTransactionID());
                        txOb.put("validationCode", info.getValidationCode());
                        txOb.put("type", info.getType());
                        txOb.put("createId", info.getCreator().getId());
                        txOb.put("createMSPID", info.getCreator().getMspid());
                        txOb.put("isValid", info.isValid());
                        txOb.put("nonce", Hex.encodeHexString(info.getNonce()));
                        txOb.put("timestamp", info.getTimestamp());
                        txs.put(txOb);
                    }
                    transInfo.put("txs",txs);
                    envelopeInfo.put("txs",txs);
                    blockEnvelopes.put(envelopeInfo);
                }
            }catch (Exception e){
                e.printStackTrace();
            }
    return blockEnvelopes;
    }

    public JSONArray parseTxInfo(BlockInfo blockInfo,String txId){
        org.json.JSONArray blockEnvelopes = new org.json.JSONArray();
        JSONArray result = null;
        try{
            for(BlockInfo.EnvelopeInfo info : blockInfo.getEnvelopeInfos()) {
                org.json.JSONObject envelopeInfo = new org.json.JSONObject();

              /*  org.json.JSONObject envelopeJson = new org.json.JSONObject();
                envelopeJson.put("channelId", info.getChannelId());
                envelopeJson.put("transactionID", info.getTransactionID());
                envelopeJson.put("validationCode", info.getValidationCode());
                envelopeJson.put("type", info.getType());
                envelopeJson.put("createId", info.getCreator().getId());
                envelopeJson.put("createMSPID", info.getCreator().getMspid());
                envelopeJson.put("isValid", info.isValid());
                envelopeJson.put("nonce", Hex.encodeHexString(info.getNonce()));

                envelopeInfo.put("envelopeInfo",envelopeJson);*/

              /*  System.out.println("channelId = " + info.getChannelId());
                System.out.println("nonce = " + Hex.encodeHexString(info.getNonce()));
                System.out.println("createId = " + info.getCreator().getId());
                System.out.println("createMSPID = " + info.getCreator().getMspid());
                System.out.println("isValid = " + info.isValid());
                System.out.println("transactionID = " + info.getTransactionID());
                System.out.println("validationCode = " + info.getValidationCode());
                System.out.println("type = " + info.getType());
*/

                org.json.JSONObject transInfo = new org.json.JSONObject();

                BlockInfo.TransactionEnvelopeInfo txeInfo = (BlockInfo.TransactionEnvelopeInfo) info;
                int txCount = txeInfo.getTransactionActionInfoCount();
                transInfo.put("txCount",txCount);
                transInfo.put("isvalid",txeInfo.isValid());
                transInfo.put("validationCode",txeInfo.getValidationCode());

                if(!txeInfo.getTransactionID().equals(txId)){
                    continue;
                }

                JSONArray txs = new JSONArray();
                for (int i = 0; i < txCount; i++) {
                    org.json.JSONObject txOb = new org.json.JSONObject();
                    BlockInfo.TransactionEnvelopeInfo.TransactionActionInfo txInfo = txeInfo.getTransactionActionInfo(i);
                    txOb.put("respStatus",txInfo.getResponseStatus());
                    txOb.put("endorsements",txInfo.getEndorsementsCount());

                    TxReadWriteSetInfo rwsetInfo = txInfo.getTxReadWriteSet();
                    if (null != rwsetInfo) {
                    }
                    txOb.put("rwSetCount",rwsetInfo.getNsRwsetCount());

                    JSONArray rwSet = new JSONArray();
                    for (TxReadWriteSetInfo.NsRwsetInfo nsRwsetInfo : rwsetInfo.getNsRwsetInfos()) {
                        org.json.JSONObject rdWtSetInfo = new org.json.JSONObject();

                        final String namespace = nsRwsetInfo.getNamespace();
                        KvRwset.KVRWSet rws = nsRwsetInfo.getRwset();


                        JSONArray readSetArray = new JSONArray();
                        int rs = -1;
                        for (KvRwset.KVRead readList : rws.getReadsList()) {
                            org.json.JSONObject readSet = new org.json.JSONObject();
                            rs++;
                            readSet.put("Namespace",namespace);
                            readSet.put("seqNo",rs);
                            readSet.put("key",readList.getKey());

                            org.json.JSONObject version = new org.json.JSONObject();
                            version.put("blockNumber",readList.getVersion().getBlockNum());
                            version.put("txNumber",readList.getVersion().getTxNum());

                            readSet.put("version",version);
                            readSetArray.put(readSet);
                        }
                        rdWtSetInfo.put("rdSet",readSetArray);

                        JSONArray writeSetArray = new JSONArray();
                        rs = -1;
                        for (KvRwset.KVWrite writeList : rws.getWritesList()) {
                            org.json.JSONObject writeSet = new org.json.JSONObject();
                            rs++;
                            String valAsString = new String(writeList.getValue().toByteArray(), "UTF-8");
                            writeSet.put("Namespace",namespace);
                            writeSet.put("seqNo",rs);
                            writeSet.put("key",writeList.getKey());
                            writeSet.put("value",valAsString);
                            writeSet.put("isDelete",writeList.getIsDelete());
                            writeSetArray.put(writeSet);
                        }
                        rdWtSetInfo.put("wtSet",writeSetArray);
                        rdWtSetInfo.put("Namespace",namespace);
                        rwSet.put(rdWtSetInfo);
                    }
                    txOb.put("rwSet",rwSet);
                    txOb.put("channelId", info.getChannelId());
                    txOb.put("transactionID", info.getTransactionID());
                    txOb.put("validationCode", info.getValidationCode());
                    txOb.put("type", info.getType());
                    txOb.put("createId", info.getCreator().getId());
                    txOb.put("createMSPID", info.getCreator().getMspid());
                    txOb.put("isValid", info.isValid());
                    txOb.put("nonce", Hex.encodeHexString(info.getNonce()));
                    txOb.put("timestamp", info.getTimestamp());
                    txOb.put("blockNumber", blockInfo.getBlockNumber());
                    txs.put(txOb);
                }
                transInfo.put("txs",txs);
                result=txs;
                envelopeInfo.put("txs",txs);
                blockEnvelopes.put(envelopeInfo);
            }
        }catch (Exception e){
            e.printStackTrace();
        }
        return result;
    }

}
