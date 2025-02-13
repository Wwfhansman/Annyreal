import fs from 'fs';
import fsPromises from 'fs/promises';
import path from 'path';

export const config = {
  api: {
    bodyParser: false, // 禁用默认的 bodyParser
  },
};

// 生成安全的文件名
function sanitizeFileName(fileName) {
  // 移除非法字符，保留字母、数字、下划线、点和短横线
  const sanitized = fileName
    .normalize('NFD')  // 分解特殊字符
    .replace(/[\u0300-\u036f]/g, '')  // 移除重音符号
    .replace(/[^a-zA-Z0-9._-]/g, '_')  // 替换非法字符为下划线
    .replace(/__+/g, '_')  // 多个下划线替换为单个下划线
    .replace(/^_+|_+$/g, '');  // 移除开头和结尾的下划线

  return sanitized;
}

// 推断文件类别
function inferCategory(fileName) {
  const categoryPatterns = [
    { regex: /^(fashion|时尚)/i, category: 'Fashion' },
    { regex: /^(makeup|妆面)/i, category: 'Makeup' },
    { regex: /^(product|产品)/i, category: 'Product' }
  ];

  for (const pattern of categoryPatterns) {
    if (pattern.regex.test(fileName)) {
      return pattern.category;
    }
  }

  return 'Other';
}

// 标准化类别名称
function normalizeCategory(category) {
  const categoryMap = {
    '时尚': 'Fashion',
    '妆面': 'Makeup',
    '产品': 'Product'
  };

  const normalizedCategory = categoryMap[category] || category;
  return normalizedCategory.charAt(0).toUpperCase() + normalizedCategory.slice(1).toLowerCase();
}

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      // 获取文件名并解码
      const encodedFileName = req.headers['x-file-name'];
      const fileName = decodeURIComponent(encodedFileName);
      
      // 如果没有指定类别，尝试从文件名推断
      const rawCategory = req.headers['x-file-category'] || inferCategory(fileName);
      const category = normalizeCategory(rawCategory);

      // 确保目录存在
      const uploadDir = path.join(process.cwd(), 'public', 'images');
      await fsPromises.mkdir(uploadDir, { recursive: true });

      // 生成安全的文件名
      const sanitizedFileName = sanitizeFileName(fileName);
      const fileExtension = path.extname(sanitizedFileName);
      const fileNameWithoutExt = path.basename(sanitizedFileName, fileExtension);

      // 生成唯一文件名
      const uniqueFileName = `${category}_${Date.now()}_${fileNameWithoutExt}${fileExtension}`;
      const filePath = path.join(uploadDir, uniqueFileName);

      // 创建写入流
      const writeStream = fs.createWriteStream(filePath);

      // 监听请求的数据事件并写入文件
      const fileSize = await new Promise((resolve, reject) => {
        let totalBytes = 0;
        
        req.on('data', (chunk) => {
          totalBytes += chunk.length;
          writeStream.write(chunk);
        });

        req.on('end', () => {
          writeStream.end();
          resolve(totalBytes);
        });

        req.on('error', (error) => {
          writeStream.end();
          reject(error);
        });
      });

      console.log('文件上传成功:', {
        originalName: fileName,
        sanitizedName: sanitizedFileName,
        uniqueFileName: uniqueFileName,
        filePath: filePath,
        fileSize: fileSize,
        category: category
      });

      res.status(200).json({ 
        message: '上传成功', 
        filename: uniqueFileName,
        fileSize: fileSize,
        category: category
      });
    } catch (error) {
      console.error('上传错误:', error);
      res.status(500).json({ 
        message: '上传失败', 
        error: error.message 
      });
    }
  } else if (req.method === 'DELETE') {
    try {
      const { filename } = req.query;
      const filePath = path.join(process.cwd(), 'public', 'images', filename);

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        res.status(200).json({ message: '删除成功' });
      } else {
        res.status(404).json({ message: '文件不存在' });
      }
    } catch (error) {
      console.error('删除错误:', error);
      res.status(500).json({ 
        message: '删除失败', 
        error: error.message 
      });
    }
  } else {
    res.setHeader('Allow', ['POST', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
