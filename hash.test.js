var crypto = require('crypto');
var fs = require('fs');

var directory = './test'
var rs = fs.createReadStream(directory)

var hash = crypto.createHash('md5');
rs.on('data', hash.update.bind(hash))

rs.on('end', function () {
    let file_hash = hash.digest('hex').slice(0,8)
    let now = new Date().toLocaleDateString()
    let new_name = `./${now}-${file_hash}`
    fs.rename(directory, new_name, (err)=>{
        if(err) throw err
        console.log(`rename file ${directory} to ${file_hash}`)
    })
})