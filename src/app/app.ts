import * as fs from 'fs';
import * as archiver from 'archiver';
import * as unzipper from 'unzipper';

class ZipSample {
    constructor(private srcPath: string, private zipDest: string, private unzipDest: string) { }

    async zipFiles() {
        const srcPath = this.srcPath;
        const zipDest = this.zipDest;
        const archive = archiver.create('zip', { zlib: { level: 5 } });
        const output = fs.createWriteStream(zipDest);

        output.on('close', () => {
            console.log(archive.pointer() + 'bytes');
        });
        archive.pipe(output);

        let allFiles = fs.readdirSync(srcPath);
        for(const file of allFiles) {
            const path = `${srcPath}/${file}`;
            const stat = fs.statSync(path);
        
            if(stat.isFile()) {
                archive.file(path,{name: file})
            }
            if(stat.isDirectory()){
                archive.directory(path, file)
            }

            console.log(`add ${file}`);
        }

        await archive.finalize();
    }

    async unzipFiles() {
        const unzipDest = this.unzipDest
        await fs.createReadStream(this.zipDest).pipe(unzipper.Extract({ path: unzipDest})).promise()
        return `${unzipDest}/`;
    }
}

const zipSample = new ZipSample('/tmp/src', '/tmp/src.zip', '/tmp/unzipDest');
// zipSample.zipFiles().then( () => {
//     console.log('done');
// });

zipSample.unzipFiles().then( () => {
    console.log('done');
});