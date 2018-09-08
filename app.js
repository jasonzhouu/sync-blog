var crypto = require('crypto')
var fs = require('fs')
var watch = require('watch')
var process = require('child_process')
var log4js = require('log4js')

console.log('blog syncing application is running')

log4js.configure({
  appenders: {blog: {type: 'file', filename: 'watch_blog_console.log'}},
  categories: {default: {appenders: ['blog'], level: 'info'}}
})
var logger = log4js.getLogger('blog')

logger.info('watching blog directory started')

watch.createMonitor('../blog/_posts', {
  ignoreDotFiles: true,
}, function (monitor) {
  monitor.on("created", function (f, stat) {
    // Handle new files
    logger.info('blog file created ', f)
    build()
  })
  monitor.on("changed", function (f, curr, prev) {
    // Handle file changes
    logger.info('blog file changed', f)
    build()
  })
  monitor.on("removed", function (f, stat) {
    // Handle removed files
    logger.info('blog file removed ', f)
    build()
  })
})

watch.createMonitor('../blog/public', {
  ignoreDotFiles: true,
}, function (monitor) {
  monitor.on("created", async function (f, stat) {
    // Handle new files
    logger.info('public file created ', f)
    await rename_file_with_hash(f)
    sync()
  })
  monitor.on("changed", async function (f, curr, prev) {
    // Handle file changes
    logger.info('public file changed', f)
    await rename_file_with_hash(f)
    sync()
  })
  monitor.on("removed", function (f, stat) {
    // Handle removed files
    logger.info('public file removed ', f)
    sync()
  })
})

watch.createMonitor('../blog/assets', {
  ignoreDotFiles: true,
}, function (monitor) {
  monitor.on("created", function (f, stat) {
    // Handle new files
    logger.info('public file created ', f)
    sync()
  })
  monitor.on("changed", function (f, curr, prev) {
    // Handle file changes
    logger.info('public file changed', f)
    sync()
  })
  monitor.on("removed", function (f, stat) {
    // Handle removed files
    logger.info('public file removed ', f)
    sync()
  })
})

function sync() {
  process.exec('sh ./sync.sh',function (error, stdout, stderr) {
    logger.info(stdout)
    if (error !== null) {
      logger.info('exec error: ' + error);
    }
  })
}
function build() {
  process.exec('sh ./build.sh',function (error, stdout, stderr) {
    logger.info(stdout)
    if (error !== null) {
      logger.info('exec error: ' + error);
    }
  })
}

function rename_file_with_hash(f){
  var rs = fs.createReadStream(f)

  var hash = crypto.createHash('md5')
  
  rs.on('data', hash.update.bind(hash))

  rs.on('end', function () {
    let file_hash = hash.digest('hex').slice(0,8)
    let now = new Date().toLocaleDateString()
    let directory_info = split_directory(f)
    let new_name = directory_info.directory + now + '-' + file_hash + directory_info.extension
    fs.rename(f, new_name, (err)=>{
      if(err) throw err
      logger.info(`rename file ${f} to ${new_name}`)
    })
  })
}

function split_directory(f) {
  var filename = f.substring(f.lastIndexOf('/')+1)
  var directory = f.substring(0, f.lastIndexOf('/')+1) // e.g. '../blog/public/' or '../blog/_posts'
  if(filename.lastIndexOf('.') != -1)
    var extension = filename.substring(filename.lastIndexOf('.'))
  else
    var extension = ''
  return {directory, filename, extension}
}
