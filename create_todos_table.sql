-- 创建待办事项表
CREATE TABLE IF NOT EXISTS todos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  text TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 为todos表添加RLS策略
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;

-- 删除可能已存在的策略（以防止重复执行时的错误）
DROP POLICY IF EXISTS "用户只能访问自己的待办事项" ON todos;
DROP POLICY IF EXISTS "认证用户可以插入自己的待办事项" ON todos;
DROP POLICY IF EXISTS "用户可以更新自己的待办事项" ON todos;
DROP POLICY IF EXISTS "用户可以删除自己的待办事项" ON todos;

-- 创建新的权限策略
CREATE POLICY "用户只能访问自己的待办事项" 
  ON todos 
  FOR SELECT
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