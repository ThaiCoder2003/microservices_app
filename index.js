const { spawn } = require('child-process');

const services = [
  { name: 'user-service', path: './user-service' },
  { name: 'product-service', path: './product-service' },
  { name: 'bff', path: './bff' }
];

services.forEach(service => {
  const proc = spawn('node', [`${service.path}/index.js`], { stdio: 'inherit' });
  proc.on('close', code => {
    console.log(`${service.name} exited with code ${code}`);
  });
});
