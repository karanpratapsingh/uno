start-redis:
	docker pull redis:7.0
	docker run -d -p 6379:6379 --name redis redis:7.0

stop-redis:
	docker container rm redis -f

install:
	pip3.10 install -r requirements.txt

dev:
	flask --app app --debug run
