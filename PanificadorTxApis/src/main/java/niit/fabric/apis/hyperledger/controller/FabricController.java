package niit.fabric.apis.hyperledger.controller;

import niit.fabric.apis.hyperledger.services.LedgerService;
import niit.fabric.apis.hyperledger.utils.NetworkUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.File;

@RestController
public class FabricController {

    @Autowired
    private LedgerService ledgerService;

    @GetMapping("/getBlockByNumber")
    public String getBlockByNumber(
            @RequestParam(required = true,name="blockNo") String blockNo,
            @RequestParam(required = true,name="channelName") String channelName,
            @RequestParam(required = true,name="user") String user,
            @RequestParam(required = true,name="peer") String peerid,
            @RequestParam(required = true,name="org") String org,
            @RequestParam(required = true,name="orgName") String orgName) {
        return ledgerService.getBlockByNumber(Long.parseLong(blockNo),channelName,user,peerid,org,orgName);
    }

    @GetMapping("/getTransactionByID")
    public String getTransactionByID(@RequestParam(required = true,name="txId") String txId,
                                     @RequestParam(required = true,name="channelName") String channelName,
                                     @RequestParam(required = true,name="user") String user,
                                     @RequestParam(required = true,name="peer") String peerid,
                                     @RequestParam(required = true,name="org") String org,
                                     @RequestParam(required = true,name="orgName") String orgName)  {
        return ledgerService.getTransactionByID(txId,channelName,user,peerid,org,orgName);
    }

    @GetMapping("/getBlockByHash")
    public String getBlockByHash(@RequestParam(required = true,name="hash") String hash,
                                 @RequestParam(required = true,name="channelName") String channelName,
                                 @RequestParam(required = true,name="user") String user,
                                 @RequestParam(required = true,name="peer") String peerid,
                                 @RequestParam(required = true,name="org") String org,
                                 @RequestParam(required = true,name="orgName") String orgName)  {
        return ledgerService.getBlockByHash(hash,channelName,user,peerid,org,orgName);
    }

    @GetMapping("/getChainInfo")
    public String getChainInfo( @RequestParam(required = true,name="channelName") String channelName,
                                @RequestParam(required = true,name="user") String user,
                                @RequestParam(required = true,name="peer") String peerid,
                                @RequestParam(required = true,name="org") String org,
                                @RequestParam(required = true,name="orgName") String orgName) {
            return ledgerService.getChainInfo(channelName,user,peerid,org,orgName);
    }

    @GetMapping("/getInstalledChaincodes")
    public String getInstalledChaincodes(@RequestParam(required = true,name="channelName") String channelName,
                                         @RequestParam(required = true,name="user") String user,
                                         @RequestParam(required = true,name="peer") String peerid,
                                         @RequestParam(required = true,name="org") String org,
                                         @RequestParam(required = true,name="orgName") String orgName) {
        return ledgerService.getInstalledChaincodes(channelName,user,peerid,org,orgName);
    }

    @GetMapping("/getInstantiatedChaincodes")
    public String getInstantiatedChaincodes(@RequestParam(required = true,name="channelName") String channelName,
                                            @RequestParam(required = true,name="user") String user,
                                            @RequestParam(required = true,name="peer") String peerid,
                                            @RequestParam(required = true,name="org") String org,
                                            @RequestParam(required = true,name="orgName") String orgName) {
        return ledgerService.getInstantiatedChaincodes(channelName,user,peerid,org,orgName);
    }

    @GetMapping("/getChannels")
    public String getChannels(@RequestParam(required = true,name="user") String user,
                              @RequestParam(required = true,name="peer") String peerid,
                              @RequestParam(required = true,name="org") String org,
                              @RequestParam(required = true,name="orgName") String orgName) {
        return ledgerService.getChannels(user,peerid,org,orgName);
    }
}
