.PHONY: server web

server:
	cd server && pip3.10 install -r requirements.txt && flask --app app --debug run

web:
	cd web && pnpm i && pnpm run dev