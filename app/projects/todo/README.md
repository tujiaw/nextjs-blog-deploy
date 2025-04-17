# 待办事项应用

一个功能齐全的待办事项应用，使用Next.js和Supabase构建

## 功能

- 用户认证（使用GitHub登录）
- 添加、编辑、删除待办事项
- 标记待办事项为已完成/未完成
- 按状态过滤待办事项（全部/未完成/已完成）
- 批量清除已完成待办事项
- 响应式设计
- 黑暗模式支持

## 技术栈

- Next.js 14+ (App Router)
- Supabase（身份验证和数据库）
- React
- TypeScript
- Zustand（状态管理）
- Tailwind CSS

## 数据库设计

本应用使用Supabase PostgreSQL数据库，包含以下表：

- `todos`: 存储待办事项
  - `id`: UUID (主键)
  - `text`: 待办事项文本
  - `completed`: 完成状态布尔值
  - `user_id`: 用户ID (外键)
  - `created_at`: 创建时间

- `profiles`: 用户信息
  - `id`: UUID (主键，关联auth.users)
  - `username`: 用户名
  - `avatar_url`: 头像URL
  - `updated_at`: 更新时间

## 设置与部署

1. 在Supabase创建新项目
2. 运行以下SQL创建所需表格：

```sql
-- 创建待办事项表
CREATE TABLE todos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  text TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 为todos表添加RLS策略
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "用户只能访问自己的待办事项" 
  ON todos 
  USING (auth.uid() = user_id);

CREATE POLICY "认证用户可以插入自己的待办事项" 
  ON todos 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "用户可以更新自己的待办事项" 
  ON todos 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "用户可以删除自己的待办事项" 
  ON todos 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- 创建用户资料表
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT,
  avatar_url TEXT,
  updated_at TIMESTAMP WITH TIME ZONE
);

-- 为profiles表添加RLS策略
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "公开可读取用户资料" 
  ON profiles 
  FOR SELECT 
  USING (true);

CREATE POLICY "用户可以更新自己的资料" 
  ON profiles 
  FOR UPDATE 
  USING (auth.uid() = id);

-- 创建触发器，当用户注册时自动创建资料
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, avatar_url, updated_at)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'avatar_url', NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
```

3. 设置GitHub OAuth提供商
4. 在`.env.local`中设置Supabase环境变量：

```
NEXT_PUBLIC_SUPABASE_URL=你的Supabase项目URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的Supabase匿名密钥
``` 