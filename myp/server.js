const SocketIO = require('socket.io');
const axios = require('axios');
const cookieParser = require('cookie-parser');
const cookie = require('cookie-signature');

module.exports = (server, app, sessionMiddleware) => {
    const io = SocketIO(server, { path: '/socket.io' });
    app.set('io', io);

    io.use((socket, next) => {
        cookieParser(process.env.COOKIE_SECRET)(socket.request, socket.request.res, next);
       sessionMiddleware(socket.request, socket.request.res, next);
    });

    io.on('connection', (socket) => { // 웹소켓 연결 시
        const req = socket.request;

        socket.emit('join', {
            user: 'system',
            chat: `${req.session}님이 입장하셨습니다.`,
        });

        socket.on('disconnection', () => { // 연결 종료 시
            socket.emit('exit', {
                user: 'system',
                chat: `${req.session.color}님이 퇴장하셨습니다.`,
            });
        });

        socket.on('error', (error) => { // 에러 시
            console.error(error);
        });

        socket.on('chat', (data) => {
            socket.emit(data);
        });

    });
};