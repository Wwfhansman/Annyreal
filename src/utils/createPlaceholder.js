const fs = require('fs');
const { createCanvas } = require('canvas');

function createPlaceholder(width = 400, height = 600) {
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // 背景
  ctx.fillStyle = '#f0f0f0';
  ctx.fillRect(0, 0, width, height);

  // 文字
  ctx.fillStyle = '#888';
  ctx.font = '30px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('Annie Model', width / 2, height / 2);

  // 保存图片
  const buffer = canvas.toBuffer('image/jpeg');
  fs.writeFileSync('public/placeholder.jpg', buffer);
  console.log('占位图创建成功');
}

createPlaceholder();
