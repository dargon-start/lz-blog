# mac非root用户无法使用80端口解决方案

mac 非root用户是无法使用80端口，但很多情况下我们又需要用到80端口，例如(微信网页授权测试)

主要涉及的文件是/etc/pf.conf

备份 /etc/pf.conf -> sudo cp /etc/pf.conf /etc/pf.conf_backup
编辑 /etc/pf.conf -> sudo vi /etc/pf.conf

找到内容 rdr-anchor "com.apple/*"
在随后一行添加rdr on lo0 inet proto tcp from any to 127.0.0.1 port 80 -> 127.0.0.1 port 8080 (其中lo0是指绑定IP127.0.0.1的设备，在终端使用ifconfig查看)
保存退出


依次运行以下命令，运行过程的提示请忽略

sudo pfctl -d
sudo pfctl -f /etc/pf.conf
sudo pfctl -e

