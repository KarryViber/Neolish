'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useTranslations } from 'next-intl';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { 
  CheckCircle2, 
  Users, 
  ArrowRight, 
  Sparkles 
} from 'lucide-react';
import { toast } from 'sonner';

// 团队设置表单验证模式
const teamSetupSchema = z.object({
  name: z.string().min(1, "Team name cannot be empty").max(100, "Team name too long"),
  description: z.string().optional(),
});

type TeamSetupValues = z.infer<typeof teamSetupSchema>;

export default function OnboardingPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [teamCreated, setTeamCreated] = useState(false);
  
  // 检查用户是否已经有团队
  useEffect(() => {
    if (session?.user) {
      checkUserTeams();
    }
  }, [session]);

  async function checkUserTeams() {
    try {
      const response = await fetch('/api/teams');
      if (response.ok) {
        const teams = await response.json();
        // 如果用户已经有团队，直接跳转到dashboard
        if (teams && teams.length > 0) {
          router.push(`/${locale}/dashboard`);
        }
      }
    } catch (error) {
      console.error('Failed to check user teams:', error);
    }
  }

  const form = useForm<TeamSetupValues>({
    resolver: zodResolver(teamSetupSchema),
    defaultValues: {
      name: session?.user?.name ? `${session.user.name}&apos;s Team` : "",
      description: "",
    },
  });

  async function onSubmit(values: TeamSetupValues) {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/teams', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create team');
      }

      setTeamCreated(true);
      toast.success('Welcome! Your team has been created successfully.');
      
      // 3秒后跳转到dashboard
      setTimeout(() => {
        router.push(`/${locale}/dashboard`);
      }, 3000);

    } catch (error) {
      console.error('Error creating team:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create team');
    } finally {
      setIsLoading(false);
    }
  }

  const skipOnboarding = () => {
    router.push(`/${locale}/dashboard`);
  };

  // 如果没有session，显示loading
  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {!teamCreated ? (
          <Card className="shadow-xl">
            <CardHeader className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="relative">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-primary" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>
              <CardTitle className="text-3xl font-bold">
                Welcome to Neolish! 🎉
              </CardTitle>
              <CardDescription className="text-lg">
                Let&apos;s set up your workspace to get you started with creating amazing content.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Progress indicator */}
              <div className="flex items-center justify-center space-x-2 mb-8">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                  1
                </div>
                <div className="w-12 h-0.5 bg-muted"></div>
                <div className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-sm">
                  2
                </div>
              </div>

              <div className="text-center mb-6">
                <Users className="w-12 h-12 text-primary mx-auto mb-3" />
                <h2 className="text-xl font-semibold mb-2">Create Your Team</h2>
                <p className="text-muted-foreground">
                  Your team is where you&apos;ll manage all your content, collaborate with others, and organize your projects.
                </p>
              </div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Team Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your team name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description (Optional)</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Tell us about your team or project..." 
                            rows={3}
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-between pt-4">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={skipOnboarding}
                      disabled={isLoading}
                    >
                      Skip for now
                    </Button>
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="min-w-[120px]"
                    >
                      {isLoading ? (
                        <div className="flex items-center space-x-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          <span>Creating...</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <span>Create Team</span>
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        ) : (
          <Card className="shadow-xl">
            <CardContent className="text-center py-12">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400" />
                </div>
              </div>
              
              <h2 className="text-2xl font-bold mb-4">All Set! 🚀</h2>
              <p className="text-muted-foreground mb-6">
                Your team has been created successfully. You&apos;ll be redirected to your dashboard in a moment.
              </p>
              
              <div className="flex justify-center">
                <Button onClick={() => router.push(`/${locale}/dashboard`)}>
                  Go to Dashboard
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
} 