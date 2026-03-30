# 项目状态文档 (Project Status Document)

## 1. 项目概述 (Project Overview)
本项目是一个**本体模型驱动 (Ontology-Driven)** 的低代码/零代码平台原型。其核心理念是“模型即应用”，通过定义五大核心要素（对象、行为、规则、事件、场景）来动态生成业务系统。

## 2. 核心架构 (Architecture)

### 2.1 五元模型 (Five-Element Model)
系统放弃了传统的硬编码开发模式，转而使用以下五种抽象概念：
- **对象 (Object)**: 业务实体定义（如：合同、客户），包含字段、类型、必填项等元数据。
- **行为 (Behavior)**: 业务动作定义（如：录入、查询、审批），描述了动作的触发逻辑和目标。
- **规则 (Rule)**: 业务逻辑校验（如：金额检查、日期校验），使用 JSON DSL 定义。
- **事件 (Event)**: 状态变更通知（如：合同已录入、审批已通过），驱动系统流转。
- **场景 (Scene)**: 业务上下文定义（如：合同管理工作台），决定了 UI 的组织方式和渲染模板。

### 2.2 技术栈 (Tech Stack)
- **Frontend**: React + TypeScript + Tailwind CSS
- **State Management**: React Hooks + Custom EventBus (EDA)
- **Visualization**: D3.js (GraphView)
- **Icons**: Lucide React
- **Animations**: Framer Motion (motion/react)

### 2.3 核心设计模式
- **Metadata-First**: UI 渲染（`UIRenderer`）和表单生成（`FormGenerator`）完全由模型元数据驱动。
- **EDA (Event-Driven Architecture)**: 模块间通过 `eventBus` 进行松耦合通信。
- **Logic DSL**: 业务规则通过 `logicEngine` 解析 JSON 表达式执行，而非硬编码 `if-else`。

## 3. 目录结构与代码说明 (Codebase Status)

### 3.1 核心引擎 (`/src/core`)
- `logicEngine.ts`: 逻辑引擎。解析 `>`、`<`、`==`、`matches` 等操作符，用于字段校验。
- `behaviorEngine.ts`: 行为引擎。注册并执行业务动作，负责触发 UI 切换（打开标签页）或数据操作。
- `objectStore.ts`: 对象存储。内存中的数据中心，管理所有对象实例的 CRUD。

### 3.2 业务服务 (`/src/services`)
- `ontologyService.ts`: 本体服务。定义了初始的五元模型数据（Mock），是整个系统的“灵魂”。

### 3.3 UI 渲染组件 (`/src/components/ui`)
- `UIRenderer.tsx`: **通用渲染器**。根据节点的 `metadata`（如 `template: 'table' | 'form'`）动态决定渲染 `DataTable` 还是 `FormGenerator`。
- `FormGenerator.tsx`: **动态表单**。根据对象字段定义自动生成输入项，并集成 `logicEngine` 进行实时校验。
- `DataTable.tsx`: **动态表格**。根据对象字段定义自动生成列。

### 3.4 功能模块 (`/src/features`)
- `ontology/ModelTree.tsx`: 左侧模型树，展示五元模型的层级结构。
- `ontology/GraphView.tsx`: 中心画布，使用 D3 可视化模型间的关联关系。
- `ontology/NodeDetails.tsx`: 右侧详情面板，展示选中节点的属性和元数据。
- `chat/ChatAssistant.tsx`: AI 助手，模拟通过自然语言指令触发 `behaviorEngine`。

### 3.5 布局与入口 (`/src/App.tsx`)
- `App.tsx`: 顶层容器，负责多标签页管理（Tabs）和全局事件监听。
- `components/layout/`: 拆分出的 `Header` 和 `Sidebar` 组件，保持主文件精简。

## 4. 当前需求与进度 (Requirements & Progress)
1. **已完成**:
   - 五元模型基础架构搭建。
   - 动态表单与表格的元数据驱动渲染。
   - 合同管理（Contract）的完整 Demo 流程（录入、查询、校验）。
   - 移除了冗余的“载体（Carrier）”概念，整合入“场景（Scene）”。
   - `App.tsx` 模块化重构。
2. **待开发/优化**:
   - 规则引擎（Rule）的深度集成：目前仅用于表单校验，未来可用于流程流转。
   - 场景（Scene）的复杂布局支持：目前仅支持单模板渲染。
   - 真实后端集成：目前所有数据均为 Mock。

## 5. 给 Claude Code/code x 的提示 (Tips for Next Step)
- **修改模型**: 请前往 `ontologyService.ts`。
- **修改渲染逻辑**: 请前往 `UIRenderer.tsx` 或 `FormGenerator.tsx`。
- **增加新功能**: 遵循“定义模型 -> 注册行为 -> 触发事件”的链路。
- **注意**: 保持 `App.tsx` 的精简，新 UI 逻辑应优先考虑组件化，考虑泛化性。
