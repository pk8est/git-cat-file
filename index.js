const fs = require('fs')
const moment = require('moment')
const exec = require('child_process').exec
const recover = require('./commit').recover
const scan = require('./scan').scan
const commits = require('./commits').commits

let objectDir = '../.git/objects'

//scan(objectDir)
/*let commitId = 'e8c2b22afcfc35da86c2d05f7a2f138c19673399'
recover(commitId, './src').then(() => {
    console.info('****************************done****************************')
})*/

async function runCommits(){
    for(let commitId of commits){
        let path = objectDir + '/' + commitId.slice(0, 2) + '/' + commitId.slice(2)
        let stats = fs.statSync(path)
        let mtime = moment(stats.mtime.getTime()).format('YYYY-MM-DD HH#mm#ss')
        let dir =  './target/' + mtime
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir)
        }
        await recover(commitId, dir)
        console.info('****************************done****************************')
        console.info('**********'+commitId+'**********')
        console.info('****************************done****************************')
    }
}

runCommits()

