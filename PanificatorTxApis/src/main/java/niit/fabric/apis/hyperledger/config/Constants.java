package niit.fabric.apis.hyperledger.config;

import niit.fabric.apis.hyperledger.utils.NetworkUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Properties;

@Component
public class Constants {

    public static final String WALLET = "wallet";
    private static final String PEM_FILE="pemFile";
    private static final String CLIENT_KEY_FILE="clientKeyFile";
    private static final String CLIENT_CERT_FILE="clientCertFile";
    private static final String TRUST_SERVER_CERTIFICATE="trustServerCertificate";
    private static final String HOST_NAME_OVERRIDE="hostnameOverride";
    private static final String SSL_PROVIDER="sslProvider";
    private static final String NEGOTIATION_TYPE="negotiationType";

    public static final String PEERS = "peers";
    public static final String URL = "url";
    public static final String ORGANISATIONS = "peerOrganizations";
    public static final String SERVER_CRT = "tls/server.crt";
    public static final String USERS = "users";
    public static final String MSP = "msp";
    public static final String KEYSTORE = "keystore";
    public static final String SIGNCERTS = "signcerts";

    public static final String CERT_PEM = "-cert.pem";
    public static final String PRIVATE_KEY = "priv_sk";
    public static final String ARTIFACTS_PATH = "organizations";
    public static final String FIRST_ORGANISATION = "Operator";
    public static final String CONFIG_PATH = "config.json";

    @Autowired
    private NetworkUtils networkUtils;

    public Properties getProperties(String org,String peer,String orgName){
        Properties properties = new Properties();
        String cwd   = System.getProperty("user.dir");

            properties.setProperty(PEM_FILE,  networkUtils.getPemFilePath(org,peer,orgName));
            properties.setProperty(CLIENT_KEY_FILE, networkUtils.getClientKeyPath(org,peer,orgName));
            properties.setProperty(CLIENT_CERT_FILE, networkUtils.getClientCertPath(org,peer,orgName));
            properties.setProperty(TRUST_SERVER_CERTIFICATE, "true");
            properties.setProperty(HOST_NAME_OVERRIDE,peer);
            properties.setProperty(SSL_PROVIDER, "openSSL");
            properties.setProperty(NEGOTIATION_TYPE, "TLS");

        return properties;
    }
}
