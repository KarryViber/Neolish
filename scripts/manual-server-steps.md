# 服务器端手动代码更新步骤

## 方案概览

由于你想直接在服务器环境中修改代码而不重新部署，我提供了两个方案：

1. **自动化脚本**：`scripts/server-update.sh` (推荐)
2. **手动操作步骤**：以下详细步骤

## 🚀 快速自动更新 (推荐)

```bash
# 确保安装了 sshpass
brew install sshpass  # macOS
# 或
sudo apt-get install sshpass  # Ubuntu

# 运行自动更新脚本
./scripts/server-update.sh
```

## 🔧 手动操作步骤

如果你想了解完整过程或自动脚本遇到问题，可以按以下步骤手动操作：

### 第一步：连接到服务器

```bash
ssh karry@172.31.3.8
```

### 第二步：检查当前容器状态

```bash
# 查看运行中的容器
sudo docker ps | grep v0.8_neolish

# 查看容器日志
sudo docker logs v0.8_neolish-container --tail=20
```

### 第三步：备份原始文件

```bash
# 从容器中复制原始文件作为备份
sudo docker cp v0.8_neolish-container:/app/src/app/[locale]/register/page.tsx /tmp/register-page-backup.tsx
```

### 第四步：创建修改后的文件

在服务器上创建新的注册页面文件：

```bash
# 创建修改后的文件
cat > /tmp/register-page-new.tsx << 'EOF'
'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useTranslations } from 'next-intl';
import { signIn } from 'next-auth/react';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// Label might be implicitly handled by FormLabel, check usage
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { PasswordInput } from "@/components/ui/password-input";
import { PasswordStrengthIndicator } from "@/components/ui/password-strength-indicator";
import { validatePasswordStrength } from "@/utils/passwordStrength";

export default function RegisterPage() {
  const [apiError, setApiError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordValue, setPasswordValue] = useState('');
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;

  // Get translations
  const t = useTranslations('auth.register');
  const tErrors = useTranslations('auth.register.errors');
  const tMessages = useTranslations('auth.messages');

  // Define the validation schema using Zod with internationalized messages and password strength
  const formSchema = z.object({
    email: z.string().email({ message: tErrors('emailFormat') }),
    username: z.string().min(1, { message: tErrors('required') }),
    password: z.string()
      .min(8, { message: tErrors('passwordLength') })
      .refine((password) => {
        const strength = validatePasswordStrength(password);
        return strength.isValid;
      }, {
        message: tErrors('passwordStrengthRequired')
      }),
    confirmPassword: z.string().min(1, { message: tErrors('required') }),
    activationCode: z.string().min(1, { message: tErrors('required') }),
  }).refine((data) => data.password === data.confirmPassword, {
    message: tErrors('passwordMismatch'),
    path: ["confirmPassword"], // 错误信息显示在确认密码字段
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
      activationCode: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setApiError(null);
    setSuccessMessage(null);

    try {
      // Remove confirmPassword from the payload sent to the API
      const { confirmPassword, ...submitValues } = values;
      
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitValues),
      });

      const data = await response.json();

      if (!response.ok) {
        let errorMessage = data.error || 'Registration failed. Please try again later.';
        // Check if backend provided specific field errors
        if (data.details) {
          const validFields = ['email', 'username', 'password', 'confirmPassword', 'activationCode'];
          const fieldErrors = Object.entries(data.details)
            .map(([field, errors]) => {
                // Try to set form error for specific field if possible
                if (validFields.includes(field)) {
                    form.setError(field as keyof z.infer<typeof formSchema>, {
                        type: "server",
                        message: (errors as string[]).join(', ')
                    });
                }
                return `${field}: ${(errors as string[]).join(', ')}`;
            })
            .join('; ');
          if (fieldErrors && !errorMessage.includes(fieldErrors)) {
             errorMessage += ` Details: ${fieldErrors}`;
          }
        }
        setApiError(errorMessage);
      } else {
        setSuccessMessage(tMessages('registrationSuccess'));
        form.reset();
        
        // 注册成功后自动登录
        try {
          const loginResult = await signIn('credentials', {
            email: submitValues.email,
            password: submitValues.password,
            redirect: false, // 阻止自动重定向，我们手动控制
          });

          if (loginResult?.ok) {
            // 登录成功，根据是否为万能激活码决定跳转路径
            // 由于现在注册时已经自动创建团队，直接跳转到dashboard
            setTimeout(() => {
              router.push(`/${locale}/dashboard`);
            }, 2000);
          } else {
            // 登录失败，跳转到登录页面
            setTimeout(() => {
              router.push(`/${locale}/login`);
            }, 2000);
          }
        } catch (loginError) {
          console.error("Auto-login failed:", loginError);
          // 自动登录失败，跳转到登录页面
          setTimeout(() => {
            router.push(`/${locale}/login`);
          }, 2000);
        }
      }
    } catch (err: any) {
      console.error("Registration submission error:", err);
      setApiError(err.message || 'An unexpected network error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-full flex-col items-center justify-center px-4 py-12 relative">
      {/* Language Switcher in top-right corner */}
      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>
      
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">{t('title')}</CardTitle>
          <CardDescription>{t('subtitle')}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('email')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('emailPlaceholder')} type="email" autoComplete="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('username')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('usernamePlaceholder')} type="text" autoComplete="username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('password')}</FormLabel>
                    <FormControl>
                      <PasswordInput 
                        placeholder={t('passwordPlaceholder')} 
                        autoComplete="new-password" 
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          setPasswordValue(e.target.value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                    
                    {/* Password Strength Indicator */}
                    <PasswordStrengthIndicator 
                      password={passwordValue}
                      showRequirements={true}
                      className="mt-3"
                    />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('confirmPassword')}</FormLabel>
                    <FormControl>
                      <PasswordInput 
                        placeholder={t('confirmPasswordPlaceholder')} 
                        autoComplete="new-password" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="activationCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('activationCode')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('activationCodePlaceholder')} type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {apiError && (
                <p className="text-sm font-medium text-destructive">{apiError}</p>
              )}
              {successMessage && (
                <p className="text-sm font-medium text-green-600">{successMessage}</p>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Creating account...' : t('signUpButton')}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col items-center space-y-2">
           <p className="text-center text-sm text-muted-foreground">
             {t('hasAccount')}{' '}
             <Link href={`/${locale}/login`} className="font-semibold text-primary hover:text-primary/90 underline underline-offset-4">
               {t('signInLink')}
             </Link>
           </p>
        </CardFooter>
      </Card>
    </div>
  );
} 
EOF
```

### 第五步：停止容器并更新文件

```bash
# 停止容器
sudo docker stop v0.8_neolish-container

# 将新文件复制到容器中
sudo docker cp /tmp/register-page-new.tsx v0.8_neolish-container:/app/src/app/[locale]/register/page.tsx
```

### 第六步：重新构建并启动

```bash
# 启动容器
sudo docker start v0.8_neolish-container

# 在容器内重新构建应用
sudo docker exec -u root v0.8_neolish-container sh -c 'cd /app && npm run build'

# 重启容器以应用更改
sudo docker restart v0.8_neolish-container
```

### 第七步：验证更新

```bash
# 检查容器状态
sudo docker ps | grep v0.8_neolish

# 查看最新日志
sudo docker logs v0.8_neolish-container --tail=20

# 清理临时文件
rm -f /tmp/register-page-new.tsx
```

### 第八步：测试

访问 `http://172.31.3.8:3000` 测试注册功能：

1. 进入注册页面
2. 填写注册信息
3. 提交后应该：
   - 自动登录成功
   - 直接跳转到dashboard
   - 而不是onboarding页面

## 🔄 回滚操作 (如果需要)

如果更新出现问题，可以快速回滚：

```bash
# 停止容器
sudo docker stop v0.8_neolish-container

# 恢复备份文件
sudo docker cp /tmp/register-page-backup.tsx v0.8_neolish-container:/app/src/app/[locale]/register/page.tsx

# 重新构建并启动
sudo docker start v0.8_neolish-container
sudo docker exec -u root v0.8_neolish-container sh -c 'cd /app && npm run build'
sudo docker restart v0.8_neolish-container
```

## ⚠️ 注意事项

1. **生产环境操作**：这是在生产环境直接修改代码，请确保操作正确
2. **备份重要**：始终先备份原始文件
3. **构建时间**：`npm run build` 需要几分钟时间，期间服务会暂停
4. **测试验证**：更新完成后务必测试功能是否正常

## 📋 核心改动说明

主要修改点：
- 添加了 `import { signIn } from 'next-auth/react';`
- 修改了注册成功后的逻辑，添加自动登录功能
- 移除了跳转到onboarding的逻辑，统一跳转到dashboard
- 保持了错误处理和用户体验的连续性 