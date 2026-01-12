#!/bin/bash

# Turbopack 开发启动脚本
# 首次启动或 Contentlayer 缓存不存在时使用 Webpack 生成，之后切换到 Turbopack

CONTENTLAYER_DIR=".contentlayer/generated"

if [ ! -d "$CONTENTLAYER_DIR" ]; then
  echo "📦 Contentlayer 缓存不存在，使用 Webpack 生成..."
  yarn dev --webpack &
  WEBPACK_PID=$!

  # 等待 Contentlayer 生成
  echo "⏳ 等待 Contentlayer 生成文件..."
  while [ ! -d "$CONTENTLAYER_DIR" ]; do
    sleep 1
  done

  # 额外等待确保生成完成
  sleep 3

  # 停止 Webpack
  echo "✅ Contentlayer 生成完成，停止 Webpack..."
  kill $WEBPACK_PID
  sleep 2
fi

echo "🚀 启动 Turbopack 开发服务器..."
yarn dev
