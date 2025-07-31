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