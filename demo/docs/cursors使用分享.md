# Cursor使用分享

# 官方定义
Cursor一是款全新的智能IDE，与AI无缝集成。

## 关于
![Cursor about](https://fibmocuqjpkyzrzoydzq.supabase.co/storage/v1/object/public/drop2/uploads/pasted-image-1745060395920-1745060397893.png)

让Agent解释一下这个图：
> 根据图片生成Cursor所使用到的开源组件之间关系的mermaid图，简要介绍每个组件，以md格式写入到docs目录下。

![Cursor components](https://fibmocuqjpkyzrzoydzq.supabase.co/storage/v1/object/public/drop2/uploads/pasted-image-1745060501726-1745060504287.png)


# 三大对话模式
![model](https://fibmocuqjpkyzrzoydzq.supabase.co/storage/v1/object/public/drop2/uploads/pasted-image-1745068325047-1745068327079.png)

## Ask
Ask模式是Cursor中的“只读”对话模式，允许你通过AI搜索和查询代码库内容，但不会自动修改任何文件。

只说不做，相对于Agent没有手脚的能力，
拥有检索当前项目、访问Web的能力，无MCP能力。
![baidu hot search](https://fibmocuqjpkyzrzoydzq.supabase.co/storage/v1/object/public/drop2/uploads/pasted-image-1745070842843-1745070844538.png)

适合分析、解读、学习项目，思考、探索、头脑风暴等不需要修改的场景。

## Agent
Agent模式是Cursor中最自动化的AI编码模式，能够自主探索、规划并执行复杂的代码库变更，具备全工具访问和多步任务处理能力。
### 能力
* 自主操作：独立探索您的代码库，识别相关文件，并做出必要的更改
* 全工具访问：使用所有可用工具进行搜索、编辑、创建文件和运行终端命令
* 上下文理解：构建对您的项目结构和依赖关系的全面理解
* 多步规划：将复杂任务分解成可管理的步骤并按顺序执行
### 工作流
* 理解需求
* 检索代码库
* 制定计划
* 执行计划
* 验证结果
* 任务完成

## Manual
Manual模式是Cursor中用于精确、定向代码修改的模式，只根据用户明确指定的文件和指令进行编辑，不会自主探索或运行命令。

手动模式主要使用文件编辑工具。项目搜索和终端工具已禁用。

如果要进行与此项目无关的对话，应该使用这种模式。
此模式速度比较快

# 特性
## Tab
智能补全，多行修改

## 局部编辑
选中要修改的文本块，使用快捷键Ctrl+k打开。

## 新对话（支持多Tab）
* 在合适的时候开启新会话
* 新问题跟当前会话历史消息无关时
* 发现总是得不到你要的答案时，尝试新会话避免记忆干扰
* 减少token消耗，防止token超限
* 多会话并行（按住Alt键+鼠标点击加号或者Ctrl+T）

## 代码库索引
使用RAG技术来准确访问代码库。

Cursor默认会将代码库向量化后存储在向量数据库中，当文件有变化时会增量更新。

![code index](https://fibmocuqjpkyzrzoydzq.supabase.co/storage/v1/object/public/drop2/uploads/pasted-image-1745132515656-1745132517515.png)

## Rules
Rules在设置里作为一个独立的设置项说明他是很重要的。

类似System prompt但是更加灵活，不同对话使用不同的rule。

当应用rule时会将其包含在模型上下文的开始处。这可以增强模型的提示，使其模型给出更加准确的回答。

### 写Rules
关于项目的信息，开发环境、技术框架、项目结构等。

[Awesome-cursorrules](https://github.com/PatrickJS/awesome-cursorrules)


### 自动生成Rules
![rules](https://fibmocuqjpkyzrzoydzq.supabase.co/storage/v1/object/public/drop2/uploads/pasted-image-1745134711006-1745134713584.gif)

### Rule Type
