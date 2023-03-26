# UNO

Classic UNO card game implemented with React and Python using [Socket.IO](https://socket.io/) for realtime multiplayer functionality.

_Check it out [here](https://uno-web-4m6k.onrender.com)_

## Screenshots

<img width="33%" src="./docs/images/home.png"><img width="33%" src="./docs/images/room.png"><img width="33%" src="./docs/images/game.png">

## Development

**Server**

```
$ cd server
$ make start-redis
$ make dev
```

_Note: Make sure docker is running._

**Web**

```
$ cd web
$ pnpm install
$ pnpm run dev
```

## Potential Improvements

- [] Better game validation rules
- [] Implement game log
- [] Host can kick player from room
- [] Place chance logic
- [] Generate random player name
- [] Player can remove a card from hand
- [] Migrate to a message broker like NATS?
