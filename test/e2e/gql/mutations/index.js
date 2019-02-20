const fs = require('fs');
const path = require('path');

module.exports.registerBySMSCode = fs.readFileSync(path.join(__dirname, 'registerBySMSCode.gql'), 'utf8');
module.exports.updateCurrentUser = fs.readFileSync(path.join(__dirname, 'updateCurrentUser.gql'), 'utf8');
module.exports.updateUserById = fs.readFileSync(path.join(__dirname, 'updateUserById.gql'), 'utf8');
module.exports.changeBalanceByAdmin = fs.readFileSync(path.join(__dirname, 'changeBalanceByAdmin.gql'), 'utf8');
