import isGlobal from 'is-installed-globally';

if (!isGlobal) {
    console.log('\x1b[33m%s\x1b[0m', '⚠️  It is recommended to install this package globally: npm install -g servitect');
}