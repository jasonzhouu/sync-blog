rsync -r ~/blog/ root@zhouys.xyz:/root/blog --delete --exclude='/_site'

time=$(date "+%Y-%m-%d %H:%M:%S")
echo "[${time}] file asyncing finished"