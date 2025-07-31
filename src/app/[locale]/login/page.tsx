'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  FormDescription,
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { LanguageSwitcher } from "@/components/ui/language-switcher";

export default function LoginPage() {
  const [apiError, setApiError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  
  // Get translations
  const t = useTranslations('auth.login');
  const tErrors = useTranslations('auth.login.errors');

  // Define the validation schema using Zod with internationalized messages
  const formSchema = z.object({
    email: z.string().email({ message: tErrors('emailFormat') }),
    password: z.string().min(1, { message: tErrors('required') }),
  });

  // Initialize react-hook-form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Define the submit handler
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setApiError(null);

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email: values.email,
        password: values.password,
      });

      console.log("SignIn Result:", result);

      if (result?.error) {
        // Use internationalized error message
        if (result.error === 'CredentialsSignin') {
           setApiError(tErrors('invalid'));
        } else {
           setApiError(`Login failed: ${result.error}`);
        }
        console.error("SignIn Error Details:", result.error);
        form.resetField('password');
      } else if (result?.ok) {
         console.log("SignIn successful, attempting redirect to: /dashboard");
         router.push(`/${locale}/dashboard`);
      } else {
         console.warn("SignIn result was not ok and not an error:", result);
         setApiError('An unexpected error occurred during login. Please try again.');
      }
    } catch (err) {
      console.error("Login submit error (catch block):", err);
      setApiError('Could not connect to the server. Please check your network connection and try again.');
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
                      <Input 
                        placeholder={t('emailPlaceholder')} 
                        type="email" 
                        autoComplete="email" 
                        {...field} 
                      />
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
                      <Input 
                        placeholder={t('passwordPlaceholder')} 
                        type="password" 
                        autoComplete="current-password" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {apiError && (
                <p className="text-sm font-medium text-destructive">{apiError}</p> 
              )}

              <Button type="submit" className="w-full" disabled={isLoading || !form.formState.isDirty || !form.formState.isValid}>
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  t('signInButton')
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col items-center space-y-2">
           <p className="text-center text-sm text-muted-foreground">
             {t('noAccount')}{' '}
             <Link href={`/${locale}/register`} className="font-semibold text-primary hover:text-primary/90 underline underline-offset-4">
               {t('signUpLink')}
             </Link>
           </p>
        </CardFooter>
      </Card>
    </div>
  );
} 