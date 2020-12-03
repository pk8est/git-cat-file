const fs = require('fs')
const exec = require('child_process').exec
const execSync = require('child_process').execSync


module.exports.recover = async function (commitId, dir = './'){
    let cmd = 'git cat-file -p ' + commitId
    return new Promise((resolve,reject) => {
        exec(cmd, async function(error, stdout, stderr) {
            if(!error){
                let rows = stdout.split('\n')
                for(let item of rows){
                    let cols = item.split(/\s|\t/)
                    if(cols.length === 2 && cols[0] === 'tree'){
                        console.info('....... scan tree:', cols[1])
                        await module.exports.recover(cols[1], dir)
                    }else if(cols.length === 4){
                        if(cols[1] === 'blob'){
                            try{
                                let output = execSync('git cat-file -p ' + cols[2])
                                if(output){
                                    console.info('----------------> output file: ', dir + '/' + cols[3])
                                    fs.writeFileSync(dir + '/' + cols[3], output, 'utf8')
                                }
                            }catch(error){

                            }
                                

                        }else if(cols[1] === 'tree'){
                            let childDir = dir + '/' + cols[3]
                            if (!fs.existsSync(childDir)) {
                                fs.mkdirSync(childDir)
                            }
                            console.info('................... scan tree:', cols[2])
                            await module.exports.recover(cols[2], childDir)
                        }
                    }
                }
            }
            return resolve()
        })
    })
}

