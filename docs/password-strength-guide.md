# 密码强度验证系统使用指南

## 概述

本项目实现了一个综合的密码强度验证系统，确保用户使用安全的密码。该系统包括前端实时验证、后端API验证和可视化强度指示器。

## 核心组件

### 1. 密码强度验证工具 (`src/utils/passwordStrength.ts`)

```typescript
import { validatePasswordStrength } from '@/utils/passwordStrength';

const result = validatePasswordStrength('MyPassword123!');
console.log(result.score); // 0-4 的分数
console.log(result.isValid); // 是否满足最低要求
console.log(result.feedback); // 改进建议数组
```

#### 验证标准：
- **最小长度**: 8个字符
- **大写字母**: 至少1个 (A-Z)
- **小写字母**: 至少1个 (a-z)
- **数字**: 至少1个 (0-9)
- **特殊字符**: 至少1个 (!@#$%^&*等)
- **常见密码检查**: 避免使用常见弱密码

#### 强度级别：
- **0**: Very Weak (非常弱)
- **1**: Weak (弱)
- **2**: Fair (一般)
- **3**: Strong (强)
- **4**: Very Strong (非常强)

### 2. 密码输入组件 (`src/components/ui/password-input.tsx`)

带有显示/隐藏功能的密码输入框：

```typescript
import { PasswordInput } from '@/components/ui/password-input';

<PasswordInput
  value={password}
  onChange={handleChange}
  placeholder="Enter password..."
/>
```

### 3. 密码强度指示器 (`src/components/ui/password-strength-indicator.tsx`)

实时显示密码强度的可视化组件：

```typescript
import { PasswordStrengthIndicator } from '@/components/ui/password-strength-indicator';

<PasswordStrengthIndicator 
  password={currentPassword}
  showRequirements={true}  // 是否显示详细要求
  className="mt-3"
/>
```

## 集成示例

### 在表单中使用

```typescript
import { useState } from 'react';
import { PasswordInput } from '@/components/ui/password-input';
import { PasswordStrengthIndicator } from '@/components/ui/password-strength-indicator';
import { validatePasswordStrength } from '@/utils/passwordStrength';

function MyPasswordForm() {
  const [password, setPassword] = useState('');
  
  return (
    <div className="space-y-4">
      <PasswordInput
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter password"
      />
      
      <PasswordStrengthIndicator 
        password={password}
        showRequirements={true}
      />
    </div>
  );
}
```

### 在Zod验证中使用

```typescript
import { z } from 'zod';
import { validatePasswordStrength } from '@/utils/passwordStrength';

const schema = z.object({
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .refine((password) => {
      const strength = validatePasswordStrength(password);
      return strength.isValid;
    }, {
      message: "Password does not meet security requirements"
    })
});
```

## 当前集成位置

1. **注册页面** (`/register`): 新用户创建账户时的密码验证
2. **设置页面** (`/settings`): 用户修改密码时的强度验证
3. **后端API**: 
   - `/api/auth/register`: 注册时的密码验证
   - `/api/user/profile`: 修改密码时的验证

## 自定义配置

### 修改验证标准

编辑 `src/utils/passwordStrength.ts` 中的验证逻辑：

```typescript
// 修改最小长度要求
const requirements = {
  minLength: password.length >= 10, // 改为10字符
  // ... 其他要求
};
```

### 添加新的常见密码

```typescript
const COMMON_PASSWORDS = [
  // 添加更多常见密码
  'yourNewCommonPassword',
  // ...
];
```

### 自定义强度分数算法

修改 `validatePasswordStrength` 函数中的分数计算逻辑来调整强度算法。

## 测试页面

访问 `/password-demo` 页面来测试密码强度功能，该页面提供：
- 实时密码强度测试
- 预设示例密码
- 技术细节显示

## 最佳实践

1. **前后端一致性**: 确保前端和后端使用相同的验证逻辑
2. **用户体验**: 提供实时反馈和清晰的改进建议
3. **安全性**: 定期更新常见密码列表
4. **可访问性**: 确保视觉指示器有适当的颜色对比度

## 故障排除

### 常见问题

1. **密码强度不显示**: 检查是否正确导入了组件和工具函数
2. **验证不一致**: 确保前后端使用相同版本的验证逻辑
3. **性能问题**: 密码强度验证在每次输入时触发，对于长密码可能有轻微延迟

### 调试

使用浏览器开发者工具查看密码强度验证的详细结果：

```typescript
const result = validatePasswordStrength(password);
console.log('Strength Result:', result);
``` 