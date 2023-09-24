#
wget https://dist.ipfs.io/go-ipfs/v0.9.0/go-ipfs_v0.9.0_linux-amd64.tar.gz

tar -xvzf go-ipfs_v0.9.0_linux-amd64.tar.gz

cd go-ipfs
sudo bash install.sh
ipfs --version



 mkdir ipfsledger
 cd ipfsledger
 ipfs init
 ipfs id

 ipfs daemon & disown