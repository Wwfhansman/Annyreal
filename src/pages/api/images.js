import fs from 'fs/promises';
import path from 'path';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const imagesDir = path.join(process.cwd(), 'public', 'images');
      
      // 确保目录存在
      await fs.mkdir(imagesDir, { recursive: true });

      // 读取目录中的所有文件
      const allFiles = await fs.readdir(imagesDir);
      
      console.log('Images API - 目录完整路径:', imagesDir);
      console.log('Images API - 所有文件:', allFiles);

      // 过滤出图片文件
      const imageFiles = [];
      for (const file of allFiles) {
        const ext = path.extname(file).toLowerCase();
        const isImage = ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext);
        
        if (isImage) {
          try {
            const fullPath = path.join(imagesDir, file);
            const stats = await fs.stat(fullPath);
            const isReadable = stats.isFile() && stats.size > 0;

            console.log(`文件: ${file}, 是否为图片: ${isImage}, 是否可读: ${isReadable}, 文件大小: ${stats.size}`);

            if (isReadable) {
              imageFiles.push(file);
            }
          } catch (error) {
            console.error(`检查文件 ${file} 时出错:`, error);
          }
        }
      }

      // 按照文件名中的时间戳排序（最新的在前）
      const sortedImages = imageFiles.sort((a, b) => {
        const getTimestamp = (filename) => {
          const match = filename.match(/_(\d+)_/);
          return match ? parseInt(match[1]) : 0;
        };
        return getTimestamp(b) - getTimestamp(a);
      });

      console.log('Images API - 找到的图片:', sortedImages);

      res.status(200).json({ 
        images: sortedImages,
        total: sortedImages.length,
        directory: imagesDir
      });
    } catch (error) {
      console.error('获取图片列表错误:', error);
      res.status(500).json({ 
        error: '无法获取图片列表',
        details: error.message 
      });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
