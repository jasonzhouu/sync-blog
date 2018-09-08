sh ./sync.sh

ssh root@zhouys.xyz "cd ~/blog; jekyll build"

time=$(date "+%Y-%m-%d %H:%M:%S")
echo "[${time}] jekyll build finished"