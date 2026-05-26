const express = require('express');
const { exec, execFile } = require('child_process');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/run', auth, async (req, res) => {
  try {
    const { code, language } = req.body;

    if (!code || !language) {
      return res.status(400).json({ message: '缺少代码或语言参数' });
    }

    const allowedLanguages = ['javascript', 'python', 'java'];
    if (!allowedLanguages.includes(language)) {
      return res.status(400).json({ message: '不支持的语言' });
    }

    const dir = path.join(__dirname, '../tmp');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const filename = `${uuidv4()}`;
    let filePath, command;

    switch (language) {
      case 'javascript':
        filePath = path.join(dir, `${filename}.js`);
        command = `node ${filePath}`;
        break;
      case 'python':
        filePath = path.join(dir, `${filename}.py`);
        command = `python ${filePath}`;
        break;
      case 'java':
        filePath = path.join(dir, `${filename}.java`);
        const className = 'Main';
        fs.writeFileSync(filePath, code.replace(/public class \w+/, `public class ${className}`));
        command = `cd ${dir} && javac ${filename}.java && java ${className}`;
        break;
    }

    fs.writeFileSync(filePath, code);

    exec(command, { timeout: 10000 }, (error, stdout, stderr) => {
      try {
        fs.unlinkSync(filePath);
        if (language === 'java') {
          fs.unlinkSync(path.join(dir, `${filename}.class`));
        }
      } catch (e) {}

      if (error) {
        res.json({
          output: stderr || error.message,
          error: true
        });
      } else {
        res.json({
          output: stdout || '执行成功',
          error: false
        });
      }
    });
  } catch (error) {
    res.status(500).json({ message: '服务器错误' });
  }
});

module.exports = router;