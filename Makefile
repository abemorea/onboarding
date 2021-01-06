UID := $(shell id -u)

all: build start

build:
	UID=$(UID) docker-compose -f docker-compose.yml build

start: init
	echo $(UID)
	UID=$(UID) docker-compose -f docker-compose.yml up -d

stop:
	UID=$(UID) docker-compose -f docker-compose.yml down

restart: env
	docker-compose -f docker-compose.yml restart

re: stop build start

env:
	export UID=$(UID)

init:
	mkdir -p data/mongodb
	chmod -R 777 data

.PHONY: all build start stop restart re
