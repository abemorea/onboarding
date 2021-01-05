all: build start

build:
	docker-compose -f docker-compose.yml build

start:
	docker-compose -f docker-compose.yml up -d

stop:
	docker-compose -f docker-compose.yml down

re: stop build start

.PHONY: all build start stop re
