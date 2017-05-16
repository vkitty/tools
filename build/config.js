var userDir = process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'], //用户目录
    defaultName = process.env.PWD.replace(/.+\//,'');

exports.config={};
exports.config.ip='http://10.1.100.243:9555/';
exports.config.rootDir=defaultName;
exports.config.destDir="/home/www";
