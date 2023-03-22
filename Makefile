.PHONY: server web

server:
	docker pull redis:7.0
	docker run -d -p 6379:6379 --name redis redis:7.0 
	cd server && pip3.10 install -r requirements.txt && flask --app app --debug run

web:
	cd web && pnpm i && pnpm run dev