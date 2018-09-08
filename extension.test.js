var f = '../public/foo.txt'

function get_extension(f) {
    var filename = f.substring(f.lastIndexOf('/')+1)
    var directory = f.substring(0, f.lastIndexOf('/')+1) // e.g. '../blog/public/' or '../blog/_posts'
    if(filename.lastIndexOf('.') != -1)
      var extension = filename.substring(filename.lastIndexOf('.'))
    else
      var extension = ''
    return {filename, directory, extension}
}

console.log(get_extension(f))