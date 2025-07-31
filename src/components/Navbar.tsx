'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton"; // For loading state
import { LogIn, LogOut, Settings, UserPlus, LayoutDashboard } from 'lucide-react'; // Icons
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { Logo } from '@/components/ui/logo';

export default function Navbar() {
  const { data: session, status } = useSession();
  const user = session?.user;
  const isLoading = status === 'loading';
  const params = useParams();
  const locale = params.locale as string;
  
  const t = useTranslations('navigation');

  // Function to get initials from username or email
  const getInitials = (name?: string | null, email?: string | null): string => {
    if (name) {
      const names = name.split(' ');
      if (names.length > 1) {
        return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
      }
      return name.substring(0, 2).toUpperCase();
    }
    if (email) {
      return email.substring(0, 2).toUpperCase();
    }
    return '??';
  };

  return (
    <nav className="bg-gray-900 border-b border-gray-700 sticky top-0 z-50">
      <div className="px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo / App Name */}
          <div className="flex-shrink-0">
            <Logo 
              size="medium" 
              href={`/${locale}/dashboard`}
              priority
            />
          </div>

          {/* Right side items (Login/Signup or User Menu) */}
          <div className="ml-4 flex items-center md:ml-6">
            {isLoading && (
              <div className="flex items-center space-x-4">
                 <Skeleton className="h-8 w-20 rounded-md bg-gray-700" />
                 <Skeleton className="h-10 w-10 rounded-full bg-gray-700" />
              </div>
            )}

            {!isLoading && !user && (
              <div className="space-x-2">
                <Button variant="ghost" asChild className="text-gray-300 hover:text-white hover:bg-gray-800">
                  <Link href={`/${locale}/login`}>
                    <span className="flex items-center">
                      <LogIn className="mr-2 h-4 w-4" /> {t('auth.signIn')}
                    </span>
                  </Link>
                </Button>
                <Button asChild>
                  <Link href={`/${locale}/register`}>
                    <span className="flex items-center">
                      <UserPlus className="mr-2 h-4 w-4" /> {t('auth.signUp')}
                    </span>
                  </Link>
                </Button>
              </div>
            )}

            {!isLoading && user && (
               <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full text-gray-300 hover:text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-white">
                       <Avatar className="h-10 w-10">
                          <AvatarImage src={user.image ?? undefined} alt={user.name ?? user.email ?? 'User Avatar'} />
                          <AvatarFallback className="bg-gray-700 text-gray-300">{getInitials(user.name, user.email)}</AvatarFallback>
                       </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                       <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium leading-none">{user.name ?? 'User'}</p>
                          <p className="text-xs leading-none text-muted-foreground">
                             {user.email}
                          </p>
                       </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                     <DropdownMenuItem asChild>
                         <Link href={`/${locale}/dashboard`}> 
                           <span className="flex items-center">
                              <LayoutDashboard className="mr-2 h-4 w-4" />
                              <span>{t('menu.dashboard')}</span>
                           </span>
                         </Link>
                     </DropdownMenuItem>
                     <DropdownMenuItem asChild>
                         <Link href={`/${locale}/settings`}> 
                           <span className="flex items-center">
                              <Settings className="mr-2 h-4 w-4" />
                              <span>{t('user.settings')}</span>
                           </span>
                         </Link>
                     </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => signOut({ callbackUrl: `/${locale}/login` })}>
                       <LogOut className="mr-2 h-4 w-4" />
                       <span>{t('auth.signOut')}</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
               </DropdownMenu>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 