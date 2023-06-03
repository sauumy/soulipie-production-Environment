// module.exports = {
//    url:'mongodb://soulipieStaging:soulipieATstaging@65.1.211.125/Souliepie'
// }

//mongodb://hardeep:yourSecretPassword@169.45.23.99/animals



// module.exports = {
//    url:'mongodb://localhost/Souliepie'
// }

// module.exports = {
//    url:'mongodb://soulipie:1234@15.206.13.51:27017/Souliepie'
// }
const username = "Soulipie&*$%08";
const pwd = "Soulipie$%123&";
const encodedUsername = encodeURIComponent(username);
const encodedPwd = encodeURIComponent(pwd);
const dbUrl = `mongodb://${encodedUsername}:${encodedPwd}@65.1.211.125:27017/Souliepie`;

module.exports = {
   url: dbUrl
}