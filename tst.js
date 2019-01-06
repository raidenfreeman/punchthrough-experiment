const g = Buffer.from('Init,123.123.13.3,2131');
const s = g.toString();
// const f = g.split(',');
// console.log(f);
console.log(s);

// Part of https://github.com/chris-rock/node-crypto-examples

var crypto = require('crypto'),
    algorithm = 'aes-256-ctr',
    password = 'this1sAs3cretPassword';

function encrypt(buffer){
  var cipher = crypto.createCipher(algorithm,password)
  var crypted = Buffer.concat([cipher.update(buffer),cipher.final()]);
  return crypted;
}
 
function decrypt(buffer){
  var decipher = crypto.createDecipher(algorithm,password)
  var dec = Buffer.concat([decipher.update(buffer) , decipher.final()]);
  return dec;
}
 
var hw = encrypt(g);
console.log(hw.toString());
// outputs hello world
console.log(decrypt(hw).toString('utf8'));