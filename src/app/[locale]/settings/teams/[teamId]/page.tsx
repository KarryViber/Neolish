'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation'; // Hook to get dynamic route parameters
import { useSession } from 'next-auth/react';
import { Role } from '@prisma/client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ConfirmDialog,
} from "@/components/ui/confirm-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2, AlertTriangle, PlusCircle, MoreHorizontal, UserCog, UserMinus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

// Define the structure of a member received from the API
interface TeamMember {
  userId: string;
  email: string;
  username: string;
  role: Role;
  joinedAt: string; // ISO date string
  userRegisteredAt: string; // ISO date string
}

export default function ManageTeamPage() {
  const params = useParams();
  const { data: session } = useSession();
  const teamId = params.teamId as string; // Get teamId from URL
  const locale = params.locale as string;
  const t = useTranslations('settings.teams.manageTeam');

  const [members, setMembers] = useState<TeamMember[]>([]);
  const [teamName, setTeamName] = useState<string>('Team'); // Default name
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUserRole, setCurrentUserRole] = useState<Role | null>(null);
  const [updatingMembers, setUpdatingMembers] = useState<Set<string>>(new Set());
  const [memberToRemove, setMemberToRemove] = useState<TeamMember | null>(null);

  const fetchTeamData = useCallback(async () => {
    if (!session || !teamId) return;

    setIsLoading(true);
    setError(null);

    try {
      // Fetch members first
      const membersResponse = await fetch(`/api/teams/${teamId}/members`);
      if (!membersResponse.ok) {
        const errorData = await membersResponse.json().catch(() => ({ error: 'Failed to fetch members' })); // Ensure errorData has a fallback
        throw new Error(errorData.error || 'Failed to fetch members');
      }
      const membersData: TeamMember[] = await membersResponse.json();
      setMembers(membersData);

      // Find current user's role
      const currentUser = membersData.find(member => member.userId === session.user?.id);
      if (currentUser) {
        setCurrentUserRole(currentUser.role);
      }

      // TODO: Optionally fetch team details (like name) from a separate endpoint if needed

    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [session, teamId]); // Added dependencies session and teamId

  useEffect(() => {
    fetchTeamData();
  }, [fetchTeamData]); // Now useEffect depends on the memoized fetchTeamData

  // Check access permission - only OWNER and ADMIN can access this page
  if (currentUserRole && currentUserRole === 'MEMBER') {
    return (
      <div className="flex flex-col justify-center items-center h-[calc(100vh-200px)] text-center p-4">
        <AlertTriangle className="h-16 w-16 text-amber-500 mb-4" />
        <h2 className="text-2xl font-semibold text-amber-700 dark:text-amber-400 mb-2">{t('accessDenied.title')}</h2>
        <p className="text-md text-gray-600 dark:text-gray-400 mb-6">{t('accessDenied.description')}</p>
        <Button variant="outline" asChild>
          <Link href={`/${locale}/settings`}>
            <ArrowLeft className="mr-2 h-4 w-4" /> {t('accessDenied.backButton')}
          </Link>
        </Button>
      </div>
    );
  }

  const canManageRole = (targetRole: Role) => {
    if (!currentUserRole) return false;
    if (currentUserRole === 'OWNER') return true;
    if (currentUserRole === 'ADMIN' && targetRole !== 'OWNER') return true;
    return false;
  };

  const canRemoveMember = (targetRole: Role, targetUserId: string) => {
    if (!currentUserRole) return false;
    if (targetUserId === session?.user?.id) return false; // Can't remove yourself
    if (currentUserRole === 'OWNER') return true;
    if (currentUserRole === 'ADMIN' && targetRole !== 'OWNER') return true;
    return false;
  };

  const handleRoleChange = async (targetUserId: string, newRole: Role) => {
    setUpdatingMembers(prev => new Set([...prev, targetUserId]));
    
    try {
      const response = await fetch(`/api/teams/${teamId}/members`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetUserId, newRole }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update role');
      }

      const updatedMember: TeamMember = await response.json();
      
      // Update the member in our state
      setMembers(prev => prev.map(member => 
        member.userId === targetUserId ? updatedMember : member
      ));

      toast.success(t('members.actions.roleUpdateSuccess'));
    } catch (error) {
      console.error('Error updating role:', error);
      toast.error(t('members.actions.roleUpdateError'));
    } finally {
      setUpdatingMembers(prev => {
        const newSet = new Set(prev);
        newSet.delete(targetUserId);
        return newSet;
      });
    }
  };

  const handleRemoveMember = async (member: TeamMember) => {
    setUpdatingMembers(prev => new Set([...prev, member.userId]));
    
    try {
      const response = await fetch(`/api/teams/${teamId}/members`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetUserId: member.userId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to remove member');
      }

      // Remove the member from our state
      setMembers(prev => prev.filter(m => m.userId !== member.userId));
      
      toast.success(t('members.actions.memberRemoveSuccess'));
    } catch (error) {
      console.error('Error removing member:', error);
      toast.error(t('members.actions.memberRemoveError'));
    } finally {
      setUpdatingMembers(prev => {
        const newSet = new Set(prev);
        newSet.delete(member.userId);
        return newSet;
      });
      setMemberToRemove(null);
    }
  };

  const formatRole = (role: Role) => {
    const roleKey = role as keyof typeof Role;
    return t(`members.roles.${roleKey}`);
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return 'Invalid Date';
    }
  };

  if (isLoading && !error) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-200px)]"> 
        <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
        <p className="ml-3 text-lg font-semibold text-gray-700 dark:text-gray-300">{t('loading')}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-[calc(100vh-200px)] text-center p-4">
        <AlertTriangle className="h-16 w-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-semibold text-red-700 dark:text-red-400 mb-2">{t('error.title')}</h2>
        <p className="text-md text-gray-600 dark:text-gray-400 mb-6 whitespace-pre-wrap">{error}</p>
        <Button onClick={fetchTeamData} disabled={isLoading}>
          <PlusCircle className="mr-2 h-4 w-4" /> {t('error.tryAgain')}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="outline" size="icon" asChild>
          <Link href={`/${locale}/settings`}>
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">{t('backToSettings')}</span>
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">{t('title')}</h1> {/* TODO: Add Team Name Here */} 
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('members.title')}</CardTitle>
          <CardDescription>{t('members.subtitle')}</CardDescription>
        </CardHeader>
        <CardContent>
          {members.length === 0 && (
            <p>{t('members.noMembers')}</p>
          )}
          {members.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('members.tableHeaders.username')}</TableHead>
                  <TableHead>{t('members.tableHeaders.email')}</TableHead>
                  <TableHead>{t('members.tableHeaders.role')}</TableHead>
                  <TableHead>{t('members.tableHeaders.joinedTeam')}</TableHead>
                  <TableHead>{t('members.tableHeaders.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.map((member) => (
                  <TableRow key={member.userId}>
                    <TableCell className="font-medium">{member.username}</TableCell>
                    <TableCell>{member.email}</TableCell>
                    <TableCell>{formatRole(member.role)}</TableCell>
                    <TableCell>{formatDate(member.joinedAt)}</TableCell>
                    <TableCell>
                      {(canManageRole(member.role) || canRemoveMember(member.role, member.userId)) && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0" disabled={updatingMembers.has(member.userId)}>
                              {updatingMembers.has(member.userId) ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <MoreHorizontal className="h-4 w-4" />
                              )}
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {canManageRole(member.role) && (
                              <>
                                {Object.values(Role).filter(role => role !== member.role).map((role) => (
                                  <DropdownMenuItem
                                    key={role}
                                    onClick={() => handleRoleChange(member.userId, role)}
                                  >
                                    <UserCog className="mr-2 h-4 w-4" />
                                    {t('members.actions.changeRole')} - {formatRole(role)}
                                  </DropdownMenuItem>
                                ))}
                              </>
                            )}
                            {canRemoveMember(member.role, member.userId) && (
                              <DropdownMenuItem
                                onClick={() => setMemberToRemove(member)}
                                className="text-red-600 dark:text-red-400"
                              >
                                <UserMinus className="mr-2 h-4 w-4" />
                                {t('members.actions.removeMember')}
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Remove Member Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!memberToRemove}
        onClose={() => setMemberToRemove(null)}
        onConfirm={() => memberToRemove && handleRemoveMember(memberToRemove)}
        title={t('members.actions.removeMember')}
        description={memberToRemove ? t('members.actions.confirmRemove', { username: memberToRemove.username }) : ''}
        confirmText={
          memberToRemove && updatingMembers.has(memberToRemove.userId) 
            ? t('members.actions.removing')
            : t('members.actions.removeMember')
        }
        cancelText={t('members.actions.cancel', { defaultValue: 'Cancel' })}
        variant="danger"
      />
    </div>
  );
} 