'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Camera, Upload, Trash2, User } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';
import { useSession } from 'next-auth/react';

interface AvatarEditorProps {
  currentAvatar?: string | null;
  username?: string;
  email?: string;
  onAvatarChange?: (newAvatarUrl: string | null) => void;
}

export function AvatarEditor({ currentAvatar, username, email, onAvatarChange }: AvatarEditorProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const t = useTranslations('settings.profile.avatar');
  const { update } = useSession();

  // 生成用户名首字母
  const getInitials = (name?: string, email?: string): string => {
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
    return 'U';
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // 验证文件类型
    if (!file.type.startsWith('image/')) {
      toast.error(t('errors.invalidFileType'));
      return;
    }

    // 验证文件大小 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error(t('errors.fileTooLarge'));
      return;
    }

    // 创建预览
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    const file = fileInputRef.current?.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await fetch('/api/user/avatar', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || t('errors.uploadFailed'));
      }

      const data = await response.json();
      
      // 通知父组件头像已更改
      onAvatarChange?.(data.avatarUrl);
      
      // 更新 session 中的头像信息
      try {
        await update({
          image: data.avatarUrl
        });
        console.log('Session updated with new avatar:', data.avatarUrl);
      } catch (error) {
        console.error('Session update error:', error);
        // 如果 session 更新失败，使用页面刷新作为后备方案
        window.location.reload();
      }
      
      toast.success(t('messages.uploadSuccess'));
      setIsDialogOpen(false);
      setPreviewUrl(null);
      
      // 重置文件输入
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

    } catch (error) {
      console.error('Avatar upload error:', error);
      toast.error(error instanceof Error ? error.message : t('errors.uploadFailed'));
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = async () => {
    setIsUploading(true);
    try {
      const response = await fetch('/api/user/avatar', {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || t('errors.removeFailed'));
      }

      // 通知父组件头像已移除
      onAvatarChange?.(null);
      
      // 更新 session 中的头像信息
      try {
        await update({
          image: null
        });
        console.log('Session updated - avatar removed');
      } catch (error) {
        console.error('Session update error:', error);
        // 如果 session 更新失败，使用页面刷新作为后备方案
        window.location.reload();
      }
      
      toast.success(t('messages.removeSuccess'));
      setIsDialogOpen(false);

    } catch (error) {
      console.error('Avatar removal error:', error);
      toast.error(error instanceof Error ? error.message : t('errors.removeFailed'));
    } finally {
      setIsUploading(false);
    }
  };

  const resetPreview = () => {
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex items-center space-x-4">
      <Avatar className="h-20 w-20">
        <AvatarImage 
          src={currentAvatar ?? undefined} 
          alt={username ?? email ?? 'User Avatar'} 
        />
        <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-lg font-medium">
          {getInitials(username, email)}
        </AvatarFallback>
      </Avatar>

      <div className="flex flex-col space-y-2">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Camera className="h-4 w-4" />
              {currentAvatar ? t('buttons.change') : t('buttons.upload')}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{t('dialog.title')}</DialogTitle>
              <DialogDescription>
                {t('dialog.description')}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {/* 预览区域 */}
              <div className="flex justify-center">
                <Avatar className="h-24 w-24">
                  <AvatarImage 
                    src={previewUrl || currentAvatar || undefined} 
                    alt="Avatar Preview" 
                  />
                  <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xl font-medium">
                    {getInitials(username, email)}
                  </AvatarFallback>
                </Avatar>
              </div>

              {/* 文件选择 */}
              <div className="space-y-2">
                <Input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
                />
                <p className="text-xs text-muted-foreground">
                  {t('dialog.fileRequirements')}
                </p>
              </div>

              {/* 操作按钮 */}
              <div className="flex justify-between">
                <div className="flex space-x-2">
                  {previewUrl && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={resetPreview}
                      disabled={isUploading}
                    >
                      {t('buttons.cancel')}
                    </Button>
                  )}
                  
                  {previewUrl && (
                    <Button
                      size="sm"
                      onClick={handleUpload}
                      disabled={isUploading}
                      className="flex items-center gap-2"
                    >
                      <Upload className="h-4 w-4" />
                      {isUploading ? t('buttons.uploading') : t('buttons.save')}
                    </Button>
                  )}
                </div>

                {currentAvatar && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleRemove}
                    disabled={isUploading}
                    className="flex items-center gap-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    {isUploading ? t('buttons.removing') : t('buttons.remove')}
                  </Button>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {currentAvatar && (
          <p className="text-xs text-muted-foreground">
            {t('currentAvatar')}
          </p>
        )}
      </div>
    </div>
  );
} 