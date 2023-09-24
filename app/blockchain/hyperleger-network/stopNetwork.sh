function clearNetwork(){
   ./network.sh down
    docker volume rm $(docker volume ls -qf dangling=true | xargs)
    sudo rm -rf organizations/fabric-ca/* #baker/ broker/ cerealist/ farmer/ mills/ ordererOrg/
}
clearNetwork
<<- 'EOF'