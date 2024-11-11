const http = require('http');
const { uploadFile, deleteFile } = require('../s3');
const crypto = require('crypto');

const getFileKey = (data) => {
    let key = data?.Key || data?.key || '';

    return key;
};

function establishSocketConnection(app) {
    const server = http.createServer(app);
    const io = require('socket.io')(server, {
        cors: {
          origin: ['http://localhost:5173', 'https://frontend-summer-voice-777.fly.dev'],
          methods: ['GET', 'POST', 'OPTIONS'],
        },
    });
    io.on('connection', (socket) => {
        console.log('New WebSocket connection');
        socket.on('disconnect', (reason) => {
            console.log('Socket disconnected:', reason);
        });
        socket.on('uploadFiles', async ({ file, fileName, fileType }) => {
            try {
                const key = crypto.randomUUID();

                const [type, format] = fileType.split('/');
                
                const fileFormat = type === 'image' ? format : 'txt';
                
                const result = await uploadFile(file, `${key}.${fileFormat}`);
                const fileKey = getFileKey(result);
        
                socket.emit('uploadSuccess', fileKey);
            } catch (e) {
                console.error('Error uploading file:', e);
                socket.emit('uploadError', { message: 'Error while uploading file' });
            }
        });

        socket.on('deleteFile', async ({ fileKey }) => {
            try {
                await deleteFile(fileKey);
            } catch (e) {
                console.error('Error while deleting old file')
            }
        })
    });
    return server;
}

module.exports = establishSocketConnection;