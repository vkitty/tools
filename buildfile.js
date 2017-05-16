/**
 * Created by mebx on 16/4/10.
 */

var mynode = require('mynode');
new mynode();

var spawn = require('child_process').spawn;
var child = spawn('tmod',['./','--no-watch'],{stdio: 'pipe',cwd:'./build/output/view/'});
child.stderr.on('data',function(err){
    console.log(err.toString);
});

child.stdout.on('data',function(data){
    console.log(data.toString());
});

child.on('close',function(status){
    if(!status){
        process.exit();
    }else{
        console.log(status.toString())
    }
});

