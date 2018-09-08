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

watch.createMonitor('../hexo-blog', {
  ignoreDotFiles: true,
}, function (monitor) {
  monitor.on("created", function (f, stat) {
    // Handle new files
    logger.info('file created ', f)
    sync()
  })
  monitor.on("changed", function (f, curr, prev) {
    // Handle file changes
    logger.info('file changed', f)
    build()
  })
  monitor.on("removed", function (f, stat) {
    // Handle removed files
    logger.info('file removed ', f)
    build()
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
