const fs = require('fs');
const path = require('path');

module.exports.loginBySMSCode = fs.readFileSync(path.join(__dirname, 'loginBySMSCode.gql'), 'utf8');
module.exports.loginByMobileAndPassword = fs.readFileSync(path.join(__dirname, 'loginByMobileAndPassword.gql'), 'utf8');
module.exports.sendLoginVerificationCode = fs.readFileSync(path.join(__dirname, 'sendLoginVerificationCode.gql'), 'utf8');
module.exports.sendRegisterVerificationCode = fs.readFileSync(path.join(__dirname, 'sendRegisterVerificationCode.gql'), 'utf8');
module.exports.getCurrentUser = fs.readFileSync(path.join(__dirname, 'getCurrentUser.gql'), 'utf8');
module.exports.getUserById = fs.readFileSync(path.join(__dirname, 'getUserById.gql'), 'utf8');
module.exports.getUserByMobile = fs.readFileSync(path.join(__dirname, 'getUserByMobile.gql'), 'utf8');
module.exports.getUser = fs.readFileSync(path.join(__dirname, 'getUser.gql'), 'utf8');
module.exports.searchUser = fs.readFileSync(path.join(__dirname, 'searchUser.gql'), 'utf8');
module.exports.countUser = fs.readFileSync(path.join(__dirname, 'countUser.gql'), 'utf8');
module.exports.searchUserAccount = fs.readFileSync(path.join(__dirname, 'searchUserAccount.gql'), 'utf8');
module.exports.countUserAccount = fs.readFileSync(path.join(__dirname, 'countUserAccount.gql'), 'utf8');
module.exports.renewToken = fs.readFileSync(path.join(__dirname, 'renewToken.gql'), 'utf8');
