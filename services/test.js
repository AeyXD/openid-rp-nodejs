const jose = require('node-jose');
const rp = require('request-promise');
const _ = require('lodash');

async function main() {
  const a1 = ['hello','world','this','a','book'];
  const a2 = ['hello','a','b'];
  console.log(_.difference(a1, a2));
}

main();


