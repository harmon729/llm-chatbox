# CI/CD 最佳实践

## 最近解决的问题

在我们的 CI/CD 流程中，我们遇到并解决了以下问题：

1. **依赖项更新导致的测试失败**

   - 更新到 Vitest 3.0.7 后需要添加`@vitest/coverage-v8`依赖
   - 测试用例中存在对不正确 DOM 元素的查找

2. **GitHub Actions 版本废弃警告**

   - 将`actions/upload-artifact`从 v3 更新到 v4
   - 将其他 GitHub Actions 也更新到最新版本

3. **Vercel 部署配置问题**
   - 需要在 GitHub Secrets 中配置`VERCEL_TOKEN`、`VERCEL_ORG_ID`和`VERCEL_PROJECT_ID`

## 防止类似问题的最佳实践

### 依赖管理

1. **保持 package.json 和 package-lock.json 同步**

   ```bash
   # 更新依赖后，确保重新生成package-lock.json
   npm install
   ```

2. **定期更新依赖**

   ```bash
   # 检查过期依赖
   npm outdated

   # 更新依赖
   npm update
   ```

3. **主要版本更新时阅读变更日志**
   - 特别关注破坏性变更和新增的依赖要求

### 测试最佳实践

1. **避免脆弱的测试**

   - 不要过度指定 DOM 结构
   - 使用灵活的查询方法，如`getByRole`或`getByTestId`
   - 对于代码块内容这样的文本，使用`textContent.contains()`而非精确匹配

2. **正确使用 React Testing Library**

   - 包装状态更新在`act()`中
   - 使用`userEvent`而非`fireEvent`来更好地模拟用户交互
   - 测试可访问性属性而非内部实现细节

3. **本地运行所有测试后再提交**
   ```bash
   npm run test
   npm run test:coverage
   ```

### GitHub Actions 最佳实践

1. **定期更新 Actions 版本**

   - 关注 GitHub Actions 仓库的发布
   - 定期检查是否有废弃警告

2. **使用版本锁定策略**

   - 对次要版本进行锁定（如`v4`）以自动获取补丁更新
   - 对关键流程考虑锁定到具体版本（如`v4.0.1`）

3. **设置必要的 Secrets**
   - 确保所有需要的令牌和密钥都在 GitHub 仓库的 Settings > Secrets 中设置
   - 为不同环境（开发、测试、生产）设置不同的密钥集

## 常见错误和解决方案

### 测试错误

1. **"Element not found"错误**

   - 原因：DOM 结构发生变化或选择器不正确
   - 解决方案：使用更具弹性的查询方法，如`getByRole`、`getByTestId`或检查文本内容而非 DOM 结构

2. **React 组件测试中的 act()警告**
   - 原因：组件状态更新未被 act()包装
   - 解决方案：确保使用 Testing Library 的方法（如`userEvent`）或将状态更新包装在 act()中

### 部署错误

1. **Vercel 部署失败**

   - 原因：缺少必要的令牌和项目/组织 ID
   - 解决方案：按照 Vercel 文档设置必要的环境变量和 Secrets

2. **依赖问题**
   - 原因：CI 环境中缺少本地开发环境中存在的依赖
   - 解决方案：确保所有依赖都在 package.json 中正确声明，并使用`npm ci`安装依赖

## 自动化工具推荐

1. **依赖管理**

   - Dependabot：自动创建 PR 以更新过时依赖
   - npm-check-updates：检查并更新依赖版本

2. **代码质量**

   - ESLint：强制执行代码质量规则
   - Prettier：统一代码格式
   - Husky：设置 Git 钩子，在提交前运行测试和 lint

3. **持续集成**
   - GitHub Actions：设置自动化工作流
   - Jest/Vitest：运行自动化测试
   - CodeQL：自动代码安全分析
