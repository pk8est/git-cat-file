const fs = require('fs')
const moment = require('moment')
const exec = require('child_process').exec
const recover = require('./commit').recover



module.exports.scan = async function(objectDir){

    fs.readdir(objectDir,function(error, files){
        if(error){
            return console.info(error)
        }
        files.forEach(function(file){
            if(file.length != 2){
                return 
            }
            let path = objectDir + '/' + file
            fs.stat(path, function(error, stats){
                if(stats.isDirectory()){
                    fs.readdir(path,function(error, files){
                        if(error){
                            return console.info(error)
                        }

                        files.forEach(async function(id){
                            let gitId = file + id
                            if(await isCommit(gitId)){
                                fs.stat(path + '/' + id, async function(error, stats){
                                    let dir = './target/' + moment(stats.mtime.getTime()).format("'YYYY-MM-DD HH#mm#ss'")
                                    if (!fs.existsSync(dir)) {
                                        fs.mkdirSync(dir)
                                    }
                                    await recover(gitId, dir)
                                })
                            }

                        })
                    })
                }   
            })
            
        })
    })
    
}

module.exports.isCommit = function(gitId){
    let cmd = 'git cat-file -p ' + gitId
    new Promise((resolve,reject) => {
        exec(cmd, function(error, stdout, stderr) {
            resolve(callback(stdout.indexOf('committer') !== -1))
        })
    })
}