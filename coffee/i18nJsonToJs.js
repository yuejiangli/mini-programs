const fs = require('fs');
const path = require('path');
const inputDir = path.resolve(__dirname, 'i18n', 'json');
const outputDir = path.resolve(__dirname, 'i18n', 'js');

fs.readdir(inputDir, (err, files) => {
    if (err) {
        console.error('Error reading directory:', err);
        return;
    }

    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir);
    }
    files.forEach((file) => {
        const filePath = path.join(inputDir, file);
        const jsonData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        // 将 JSON 数据转换为带有 module.exports 的格式
        const jsData = `module.exports = ${JSON.stringify(jsonData, null, 2)};\n`;
        // 写入 js 文件
        const jsFilePath = path.resolve(outputDir, `${file.split('.')[0]}.js`);
        fs.writeFileSync(jsFilePath, jsData);
    });
});