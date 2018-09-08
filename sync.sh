rsync -r ~/hexo-blog/ root@zhouys.xyz:/root/hexo-blog/source --delete

time=$(date "+%Y-%m-%d %H:%M:%S")
echo "[${time}] file asyncing finished"
