'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Role } from '@prisma/client';
import Link from 'next/link';
import { 
  Settings as SettingsIcon, 
  Copy, 
  Trash2, 
  Plus,
  Users,
  Crown,
  Shield,
  UserCheck,
  Calendar,
  TrendingUp,
  FileText,
  Image,
  Palette,
  Target,
  User,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  Globe
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { toast, Toaster } from 'sonner';
import { AvatarEditor } from '@/components/ui/avatar-editor';
import { PasswordStrengthIndicator } from '@/components/ui/password-strength-indicator';
import { PasswordInput } from '@/components/ui/password-input';
import { validatePasswordStrength } from '@/utils/passwordStrength';
import { UniversalCodesManager } from '@/components/ui/universal-codes-manager';

// Schema for inviting a user
const inviteUserFormSchema = z.object({
  emailToInvite: z.string().email("Invalid email address"),
});
type InviteUserFormValues = z.infer<typeof inviteUserFormSchema>;

// Schema for profile update
const profileUpdateSchema = z.object({
  username: z.string().min(1, "Username is required"),
  email: z.string().email("Invalid email address"),
});
type ProfileUpdateValues = z.infer<typeof profileUpdateSchema>;

// Schema for password update with strength validation
const passwordUpdateSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string()
    .min(8, "New password must be at least 8 characters")
    .refine((password) => {
      const strength = validatePasswordStrength(password);
      return strength.isValid;
    }, {
      message: "Password does not meet security requirements" // TODO: 使用翻译
    }),
  confirmPassword: z.string().min(8, "Confirm password is required"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});
type PasswordUpdateValues = z.infer<typeof passwordUpdateSchema>;



interface TeamWithRole {
  id: string;
  name: string;
  createdAt: string;
  role: Role;
  memberCount?: number;
  description?: string;
}

interface TeamStats {
  totalMembers: number;
  totalArticles: number;
  totalImages: number;
  totalStyleProfiles: number;
  totalAudiences: number;
}

interface ActivationCode {
  id: string;
  code: string;
  email: string;
  createdAt: string;
  isUsed: boolean;
}

interface UserProfile {
  id: string;
  username: string;
  email: string;
  avatar?: string | null;
  createdAt: string;
  updatedAt: string;
}

interface TeamMember {
  userId: string;
  email: string;
  username: string;
  avatar?: string | null;
  role: Role;
  joinedAt: string;
  userRegisteredAt: string;
}

// --- Generate Activation Code Form ---
function GenerateCodeForm({ teamId, onCodeGenerated }: { teamId: string, onCodeGenerated: (message: string, isError?: boolean) => void }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const t = useTranslations('settings.teams.generateCode');
  
  const generateForm = useForm<InviteUserFormValues>({
    resolver: zodResolver(inviteUserFormSchema),
    defaultValues: {
      emailToInvite: "",
    },
  });

  async function onGenerateSubmit(values: InviteUserFormValues) {
    setIsGenerating(true);
    setGenerationError(null);
    onCodeGenerated('');
    try {
      const response = await fetch(`/api/teams/${teamId}/invitations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: values.emailToInvite }),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || t('failedToGenerate'));
      }
      
      if (result.code) {
        await navigator.clipboard.writeText(result.code);
        onCodeGenerated(t('successMessage', { code: result.code }));
        generateForm.reset();
      } else {
          throw new Error(t('apiNoCode'));
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : t('failedToGenerate');
      setGenerationError(errorMessage);
      onCodeGenerated(errorMessage, true);
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <Form {...generateForm}>
      <form onSubmit={generateForm.handleSubmit(onGenerateSubmit)} className="flex items-start space-x-2">
        <FormField
          control={generateForm.control}
          name="emailToInvite"
          render={({ field }) => (
            <FormItem className="flex-grow">
              <FormControl>
                <Input placeholder={t('emailPlaceholder')} {...field} />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />
        <Button type="submit" variant="secondary" size="sm" disabled={isGenerating}>
          {isGenerating ? t('generatingButton') : t('generateButton')}
        </Button>
      </form>
      {generationError && <p className="text-xs text-destructive mt-1">{generationError}</p>}
    </Form>
  );
}

// --- Profile Management Component ---
function ProfileManagement({ userProfile, onProfileUpdate }: { userProfile: UserProfile, onProfileUpdate: () => void }) {
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [currentAvatar, setCurrentAvatar] = useState(userProfile.avatar);
  const [newPasswordValue, setNewPasswordValue] = useState('');
  const t = useTranslations('settings.profile');

  const profileForm = useForm<ProfileUpdateValues>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      username: userProfile.username,
      email: userProfile.email,
    },
  });

  const passwordForm = useForm<PasswordUpdateValues>({
    resolver: zodResolver(passwordUpdateSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  async function onProfileSubmit(values: ProfileUpdateValues) {
    setIsUpdatingProfile(true);
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: values.username,
          email: values.email,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || t('messages.profileUpdateError'));
      }

      toast.success(t('messages.profileUpdateSuccess'));
      onProfileUpdate();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error instanceof Error ? error.message : t('messages.profileUpdateError'));
    } finally {
      setIsUpdatingProfile(false);
    }
  }

  async function onPasswordSubmit(values: PasswordUpdateValues) {
    setIsUpdatingPassword(true);
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || t('messages.passwordUpdateError'));
      }

      toast.success(t('messages.passwordUpdateSuccess'));
      passwordForm.reset();
    } catch (error) {
      console.error('Error updating password:', error);
      toast.error(error instanceof Error ? error.message : t('messages.passwordUpdateError'));
    } finally {
      setIsUpdatingPassword(false);
    }
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return t('teams.common.invalidDate');
    }
  };

  const handleAvatarChange = (newAvatarUrl: string | null) => {
    setCurrentAvatar(newAvatarUrl);
    // 通知父组件更新用户资料
    onProfileUpdate();
  };

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            {t('basicInfo.title')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Avatar Editor */}
          <div className="space-y-4">
            <AvatarEditor
              currentAvatar={currentAvatar}
              username={userProfile.username}
              email={userProfile.email}
              onAvatarChange={handleAvatarChange}
            />
          </div>

          <div className="text-sm text-muted-foreground mb-4">
            {t('basicInfo.memberSince', { date: formatDate(userProfile.createdAt) })}
          </div>
          
          <Form {...profileForm}>
            <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
              <FormField
                control={profileForm.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <label className="text-sm font-medium">{t('basicInfo.username')}</label>
                    <FormControl>
                      <Input placeholder={t('basicInfo.usernamePlaceholder')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={profileForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">{t('basicInfo.email')}</label>
                      {!isEditingEmail ? (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setIsEditingEmail(true)}
                          className="h-auto p-1 text-xs"
                        >
                          {t('basicInfo.editEmail')}
                        </Button>
                      ) : (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setIsEditingEmail(false);
                            profileForm.setValue('email', userProfile.email);
                          }}
                          className="h-auto p-1 text-xs text-muted-foreground"
                        >
                          {t('basicInfo.cancelEditEmail')}
                        </Button>
                      )}
                    </div>
                    <FormControl>
                      <Input 
                        type="email" 
                        placeholder={t('basicInfo.emailPlaceholder')} 
                        disabled={!isEditingEmail}
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={isUpdatingProfile}>
                {isUpdatingProfile ? t('basicInfo.updating') : t('basicInfo.updateButton')}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            {t('security.title')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...passwordForm}>
            <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
              <FormField
                control={passwordForm.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <label className="text-sm font-medium">{t('security.currentPassword')}</label>
                    <FormControl>
                      <PasswordInput 
                        placeholder={t('security.currentPasswordPlaceholder')} 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={passwordForm.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <label className="text-sm font-medium">{t('security.newPassword')}</label>
                    <FormControl>
                      <PasswordInput 
                        placeholder={t('security.newPasswordPlaceholder')} 
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          setNewPasswordValue(e.target.value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                    
                    {/* Password Strength Indicator */}
                    <PasswordStrengthIndicator 
                      password={newPasswordValue}
                      showRequirements={true}
                      className="mt-3"
                    />
                  </FormItem>
                )}
              />

              <FormField
                control={passwordForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <label className="text-sm font-medium">{t('security.confirmPassword')}</label>
                    <FormControl>
                      <PasswordInput 
                        placeholder={t('security.confirmPasswordPlaceholder')} 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={isUpdatingPassword}>
                {isUpdatingPassword ? t('security.updatingPassword') : t('security.updatePasswordButton')}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

// --- Team Members List (Read-only for all roles) ---
function TeamMembersList({ teamId, currentUserRole, locale }: { teamId: string, currentUserRole: Role | null, locale: string }) {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const t = useTranslations('settings.teams.members');

  const fetchMembers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/teams/${teamId}/members`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch members');
      }
      const data: TeamMember[] = await response.json();
      setMembers(data);
    } catch (err) {
      console.error('Error fetching members:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch members');
    } finally {
      setIsLoading(false);
    }
  }, [teamId]);

  useEffect(() => {
    fetchMembers();
  }, [teamId, fetchMembers]);

  const formatRole = (role: Role) => {
    const roleKey = role as keyof typeof Role;
    return t(`roles.${roleKey}`);
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return 'Invalid date';
    }
  };

  const getRoleIcon = (role: Role) => {
    switch (role) {
      case Role.OWNER:
        return <Crown className="h-4 w-4" />;
      case Role.ADMIN:
        return <Shield className="h-4 w-4" />;
      case Role.MEMBER:
        return <UserCheck className="h-4 w-4" />;
      default:
        return <UserCheck className="h-4 w-4" />;
    }
  };

  const getRoleBadgeVariant = (role: Role) => {
    switch (role) {
      case Role.OWNER:
        return "default" as const;
      case Role.ADMIN:
        return "secondary" as const;
      case Role.MEMBER:
        return "outline" as const;
      default:
        return "outline" as const;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            {t('title')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center py-8"> 
            <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
            <p className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">Loading members...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            {t('title')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-destructive text-sm">{error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            {t('title')} ({members.length})
          </CardTitle>
          {(currentUserRole === Role.OWNER || currentUserRole === Role.ADMIN) && (
            <Button variant="outline" size="sm" asChild>
              <Link href={`/${locale}/settings/teams/${teamId}`}>
                <SettingsIcon className="h-4 w-4 mr-2" />
                {t('manage')}
              </Link>
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {members.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">{t('noMembers')}</p>
        ) : (
          <div className="space-y-3">
            {members.map((member) => (
              <div key={member.userId} className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={member.avatar ?? undefined} alt={member.username} />
                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-medium">
                      {member.username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{member.username}</div>
                    <div className="text-sm text-muted-foreground">{member.email}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={getRoleBadgeVariant(member.role)} className="flex items-center gap-1">
                    {getRoleIcon(member.role)}
                    {formatRole(member.role)}
                  </Badge>
                  <div className="text-xs text-muted-foreground hidden sm:block">
                    {formatDate(member.joinedAt)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// --- Active Invitations List ---
function ActiveInvitationsList({ teamId, onInvitationChange }: { teamId: string, onInvitationChange?: () => void }) {
  const [invitations, setInvitations] = useState<ActivationCode[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [revokingId, setRevokingId] = useState<string | null>(null);
  const t = useTranslations('settings.teams.invitations');
  const tInviteInfo = useTranslations('settings.teams.inviteInfo');

  const fetchInvitations = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/teams/${teamId}/invitations`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || t('teams.common.failedToFetchInvitations'));
      }
      const data: ActivationCode[] = await response.json();
      setInvitations(data);
    } catch (err) {
      console.error('Error fetching invitations:', err);
      setError(err instanceof Error ? err.message : t('teams.common.failedToFetchInvitations'));
    } finally {
      setIsLoading(false);
    }
  }, [teamId]);

  useEffect(() => {
    fetchInvitations();
  }, [teamId, fetchInvitations]);

  const copyInviteInfo = useCallback((code: string, email: string) => {
    const info = `${tInviteInfo('codeLabel')}: ${code}
${tInviteInfo('emailLabel')}: ${email}
${tInviteInfo('linkLabel')}: ${window.location.origin}/register

${tInviteInfo('instructionText')}: ${code}`;
    
    navigator.clipboard.writeText(info);
    toast.success(t('copySuccess'));
  }, [t, tInviteInfo]);

  const revokeInvitation = async (invitationId: string) => {
    if (!confirm(t('actions.confirmRevoke'))) {
      return;
    }

    setRevokingId(invitationId);
    try {
      const response = await fetch(`/api/teams/${teamId}/invitations?id=${invitationId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || t('revokeError'));
      }

      await fetchInvitations();
      toast.success(t('revokeSuccess'));
      if (onInvitationChange) {
        onInvitationChange();
      }
    } catch (err) {
      console.error('Error revoking invitation:', err);
      toast.error(err instanceof Error ? err.message : t('revokeError'));
    } finally {
      setRevokingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString();
    } catch {
      return dateString;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-4"> 
        <Loader2 className="h-4 w-4 animate-spin text-indigo-600" />
        <p className="ml-2 text-xs font-medium text-gray-700 dark:text-gray-300">Loading invitations...</p>
      </div>
    );
  }

  if (error) {
    return <div className="text-sm text-destructive">{t('loadError', { error })}</div>;
  }

  if (invitations.length === 0) {
    return null; // Don't show section if no invitations
  }

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-medium">{t('title')}</h4>
      <div className="space-y-2">
        {invitations.map((invitation) => (
          <div key={invitation.id} className="flex items-center justify-between p-3 bg-muted rounded border text-sm">
            <div className="flex-1 min-w-0">
              <div className="font-mono text-xs bg-background px-2 py-1 rounded border inline-block">
                {invitation.code}
              </div>
              <div className="text-muted-foreground mt-1">
                {invitation.email} • {formatDate(invitation.createdAt)}
              </div>
            </div>
            <div className="flex items-center space-x-1 ml-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyInviteInfo(invitation.code, invitation.email)}
                className="h-8 w-8 p-0"
              >
                <Copy className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => revokeInvitation(invitation.id)}
                disabled={revokingId === invitation.id}
                className="h-8 w-8 p-0 text-destructive hover:text-destructive"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}



export default function SettingsPage() {
  const { data: session } = useSession();
  const [team, setTeam] = useState<TeamWithRole | null>(null);
  const [teamStats, setTeamStats] = useState<TeamStats | null>(null);
  const [isLoadingTeam, setIsLoadingTeam] = useState<boolean>(true);
  const [fetchTeamError, setFetchTeamError] = useState<string | null>(null);
  const [generationMessage, setGenerationMessage] = useState<{ text: string; isError: boolean } | null>(null);
  
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState<boolean>(true);
  const [profileError, setProfileError] = useState<string | null>(null);
  
  const t = useTranslations('settings');
  const params = useParams();
  const locale = params.locale as string;

  // Fetch user profile
  const fetchUserProfile = useCallback(async () => {
    if (!session) return;
    setIsLoadingProfile(true);
    setProfileError(null);
    try {
      const response = await fetch('/api/user/profile');
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || t('profile.messages.loadError'));
      }
      const profile: UserProfile = await response.json();
      setUserProfile(profile);
    } catch (err) {
      console.error('Error fetching user profile:', err);
      setProfileError(err instanceof Error ? err.message : t('profile.messages.loadError'));
    } finally {
      setIsLoadingProfile(false);
    }
  }, [session, t]);

  // Fetch user's team (should be only one)
  useEffect(() => {
    async function fetchTeam() {
      if (!session) return;
      setIsLoadingTeam(true);
      setFetchTeamError(null);
      try {
        const response = await fetch('/api/teams');
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || t('errors.fetchTeamsFailed'));
        }
        const teams: TeamWithRole[] = await response.json();
        
        // Since one account = one team, take the first (and should be only) team
        if (teams.length > 0) {
          setTeam(teams[0]);
          
          // Fetch team stats
          const statsResponse = await fetch(`/api/teams/${teams[0].id}/stats`);
          if (statsResponse.ok) {
            const stats = await statsResponse.json();
            setTeamStats(stats);
          }
        }
      } catch (err) {
        console.error(err);
        setFetchTeamError(err instanceof Error ? err.message : t('errors.unexpectedError'));
      } finally {
        setIsLoadingTeam(false);
      }
    }
    fetchTeam();
  }, [session, t]);

  // Fetch user profile
  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  const getRoleIcon = (role: Role) => {
    switch (role) {
      case Role.OWNER:
        return <Crown className="h-4 w-4 text-yellow-600" />;
      case Role.ADMIN:
        return <Shield className="h-4 w-4 text-blue-600" />;
      default:
        return <UserCheck className="h-4 w-4 text-gray-600" />;
    }
  };

  const getRoleBadgeVariant = (role: Role) => {
    switch (role) {
      case Role.OWNER:
        return "default";
      case Role.ADMIN:
        return "secondary";
      default:
        return "outline";
    }
  };

  // Redirect or show loading if not authenticated
  if (!session) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-200px)]"> 
        <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
        <p className="ml-3 text-lg font-semibold text-gray-700 dark:text-gray-300">{t('loading')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6 max-w-5xl">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold flex items-center">
          <SettingsIcon size={32} className="mr-3" />
          {t('title')}
        </h1>
        <p className="text-base text-gray-600 dark:text-gray-400 max-w-3xl">
          {t('subtitle')}
        </p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            {t('tabs.profile')}
          </TabsTrigger>
          <TabsTrigger value="team" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            {t('tabs.team')}
          </TabsTrigger>
          <TabsTrigger value="universal-codes" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Universal Codes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">{t('profile.title')}</h2>
            <p className="text-base text-gray-600 dark:text-gray-400">
              {t('profile.subtitle')}
            </p>
          </div>
          
          {isLoadingProfile && (
            <div className="flex justify-center items-center py-12"> 
              <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
              <p className="ml-3 text-lg font-semibold text-gray-700 dark:text-gray-300">{t('profile.messages.loading')}</p>
            </div>
          )}

          {!isLoadingProfile && profileError && (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-destructive">{profileError}</p>
              </CardContent>
            </Card>
          )}

          {!isLoadingProfile && !profileError && userProfile && (
            <ProfileManagement userProfile={userProfile} onProfileUpdate={fetchUserProfile} />
          )}
        </TabsContent>

        <TabsContent value="team" className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">{t('teams.title')}</h2>
            <p className="text-base text-gray-600 dark:text-gray-400">
              {t('teams.subtitle')}
            </p>
          </div>

          {isLoadingTeam && (
            <div className="flex justify-center items-center py-12"> 
              <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
              <p className="ml-3 text-lg font-semibold text-gray-700 dark:text-gray-300">{t('teams.manageTeam.loading')}</p>
            </div>
          )}

          {!isLoadingTeam && fetchTeamError && (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-destructive">{t('errors.fetchTeams', { error: fetchTeamError })}</p>
              </CardContent>
            </Card>
          )}

          {!isLoadingTeam && !fetchTeamError && !team && (
            <Card>
              <CardContent className="p-8 text-center space-y-4">
                <Users className="h-12 w-12 mx-auto text-muted-foreground" />
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">{t('teams.noTeams')}</h3>
                  <p className="text-muted-foreground">{t('teams.noTeamsDescription')}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {!isLoadingTeam && !fetchTeamError && team && (
            <div className="space-y-6">
              {/* Team Info Card */}
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <CardTitle className="text-2xl">{team.name}</CardTitle>
                      {team.description && (
                        <CardDescription className="text-base">{team.description}</CardDescription>
                      )}
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {t('teams.createdAt')} {new Date(team.createdAt).toLocaleDateString()}
                        </div>
                        {team.memberCount && (
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-1" />
                            {t('teams.memberCount', { count: team.memberCount })}
                          </div>
                        )}
                      </div>
                    </div>
                    <Badge variant={getRoleBadgeVariant(team.role)} className="flex items-center gap-2">
                      {getRoleIcon(team.role)}
                      {team.role}
                    </Badge>
                  </div>
                </CardHeader>

                {teamStats && (
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="flex items-center space-x-3 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                        <FileText className="h-6 w-6 text-blue-500" />
                        <div>
                          <div className="text-lg font-semibold">{teamStats.totalArticles}</div>
                          <div className="text-sm text-muted-foreground">{t('teams.stats.articles')}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                        <Image className="h-6 w-6 text-green-500" />
                        <div>
                          <div className="text-lg font-semibold">{teamStats.totalImages}</div>
                          <div className="text-sm text-muted-foreground">{t('teams.stats.images')}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                        <Palette className="h-6 w-6 text-purple-500" />
                        <div>
                          <div className="text-lg font-semibold">{teamStats.totalStyleProfiles}</div>
                          <div className="text-sm text-muted-foreground">{t('teams.stats.styleProfiles')}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
                        <Target className="h-6 w-6 text-orange-500" />
                        <div>
                          <div className="text-lg font-semibold">{teamStats.totalAudiences}</div>
                          <div className="text-sm text-muted-foreground">{t('teams.stats.audiences')}</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>

              {/* Team Members List - Visible to all roles */}
              <TeamMembersList teamId={team.id} currentUserRole={team.role} locale={locale} />

              {/* Team Management - Only for OWNER and ADMIN */}
              {(team.role === Role.OWNER || team.role === Role.ADMIN) && (
                              <Card>
                <CardHeader>
                  <CardTitle>{t('teams.manageTeam.title')}</CardTitle>
                  <CardDescription>{t('teams.subtitle')}</CardDescription>
                </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Generation Message */}
                    {generationMessage && (
                      <div className={`p-3 rounded text-sm ${generationMessage.isError ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}`}>
                        {generationMessage.text}
                      </div>
                    )}

                    {/* Invite New Member */}
                    <div className="space-y-3">
                      <h4 className="font-medium">{t('teams.generateCode.title')}</h4>
                      <GenerateCodeForm 
                        teamId={team.id} 
                        onCodeGenerated={(message, isError = false) => setGenerationMessage({ text: message, isError })} 
                      />
                    </div>

                    {/* Active Invitations */}
                    <ActiveInvitationsList teamId={team.id} />
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="universal-codes" className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Universal Activation Codes</h2>
            <p className="text-base text-gray-600 dark:text-gray-400">
              Manage universal activation codes that allow users to register and create their own teams.
            </p>
          </div>
          
          <UniversalCodesManager />
        </TabsContent>
      </Tabs>
      <Toaster richColors position="top-right" />
    </div>
  );
} 