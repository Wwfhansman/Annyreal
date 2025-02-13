import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const { path: dirPath } = req.query;

  if (!dirPath) {
    return res.status(400).json({ error: '未提供路径' });
  }

  try {
    const exists = fs.existsSync(dirPath);
    
    if (exists) {
      // 如果目录存在，列出目录内容
      const files = fs.readdirSync(dirPath);
      return res.status(200).json({ 
        exists: true, 
        files: files 
      });
    } else {
      return res.status(200).json({ 
        exists: false,
        message: '目录不存在' 
      });
    }
  } catch (error) {
    console.error('检查目录错误:', error);
    return res.status(500).json({ 
      error: '检查目录失败',
      details: error.message 
    });
  }
}
