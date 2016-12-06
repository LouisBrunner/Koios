#!/bin/bash

PROJECT=koios
PORT=3002

function check_if_root {
	if [[ $EUID -ne 0 ]]; then
		printf "$0: This script must be run as root\n" 1>&2
		exit 1
	fi
}

if [ $# -lt 1 ]; then
	"$0" help
elif [ "$1" == "dev" ]; then
	meteor build .
	"$0" dev-upload
elif [ "$1" == "dev-upload" ]; then
	scp ${PROJECT}.tar.gz lbrunner.net:.
elif [ "$1" == "prod" ]; then
	check_if_root

	cd /home/${PROJECT}
	mv ~/${PROJECT}.tar.gz .
	tar xf ${PROJECT}.tar.gz
	cd bundle/programs/server
	npm install
	cd /home/${PROJECT}
	rm ${PROJECT}.tar.gz
	chown -R ${PROJECT}:${PROJECT} /home/${PROJECT}
	service ${PROJECT} restart
elif [ "$1" == "prod-setup" ]; then
	check_if_root

	adduser --disabled-login --gecos "" ${PROJECT}
	mkdir -p /home/${PROJECT}
	cp private/scripts/apache2.vhost /etc/apache2/sites-available/${PROJECT}
	sed "s/REPLACE_HOST/$PROJECT/g" /etc/apache2/sites-available/${PROJECT}
	sed "s/REPLACE_PORT/$PORT/g" /etc/apache2/sites-available/${PROJECT}
	cd /etc/apache2/sites-enabled
	ln -s ../sites-available/${PROJECT} 3X-${PROJECT}
elif [ "$1" == "prod-setup-service" ]; then
	forever-service install ${PROJECT} -s /home/${PROJECT}/bundle/main.js -r ${PROJECT} -e "PORT=${PORT} BIND_IP=127.0.0.1 HTTP_FORWARDED_COUNT=1 MONGO_URL=mongodb://localhost:27017/${PROJECT} ROOT_URL=http://${PROJECT}.lbrunner.net"
	service ${PROJECT} start
elif [ "$1" == "prod-setup-once" ]; then
	check_if_root

	add-apt-repository ppa:chris-lea/node.js
	apt-get update
	apt-get -y install mongodb-server nodejs g++ make
else
	printf "Usage: $0 [dev|dev-upload|prod|prod-setup|prod-setup-service|prod-setup-once]\n"
	exit 1
fi
