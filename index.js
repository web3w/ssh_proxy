const net = require('net');

const SERVER_PORT = 8022; // 服务器端口
const REMOTE_HOST = '10.254.48.101'; // 目标主机 '10.254.48.101'; // 
const REMOTE_PORT = 22; // 目标端口

// 创建 TCP 服务器
const server = net.createServer((client) => {
  console.log(`Client connected: ${client.remoteAddress}:${client.remotePort}`);

  // 连接到目标主机
  const remote = net.createConnection({
    host: REMOTE_HOST,
    port: REMOTE_PORT,
  }, () => {
    console.log(`Connected to remote host: ${REMOTE_HOST}:${REMOTE_PORT}`);

    // 将数据从客户端转发到目标主机
    client.pipe(remote);

    // 将数据从目标主机转发到客户端
    remote.pipe(client);
  });

  remote.on('error', (err) => {
    console.error(`Error connecting to remote host: ${err}`);
    client.end();
  });

  client.on('error', (err) => {
    console.error(`Error with client connection: ${err}`);
    remote.end();
  });

  client.on('end', () => {
    console.log(`Client disconnected: ${client.remoteAddress}:${client.remotePort}`);
    remote.end();
  });
});

server.listen(SERVER_PORT, () => {
  console.log(`Server listening on port ${REMOTE_HOST}:${SERVER_PORT}`);
});

// ssh -p 8022 root@10.58.204.103
