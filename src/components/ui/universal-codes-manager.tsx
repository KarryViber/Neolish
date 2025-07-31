'use client';

import { useState, useEffect } from 'react';
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  Copy, 
  Trash2, 
  Plus,
  Globe,
  Calendar,
  Mail,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';
// 移除alert-dialog依赖，使用简单的确认对话框

interface UniversalCode {
  id: string;
  code: string;
  email: string;
  isUsed: boolean;
  createdAt: string;
}

export function UniversalCodesManager() {
  const [codes, setCodes] = useState<UniversalCode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [newCodeEmail, setNewCodeEmail] = useState('');

  useEffect(() => {
    fetchCodes();
  }, []);

  async function fetchCodes() {
    try {
      const response = await fetch('/api/activation-codes/universal');
      if (response.ok) {
        const data = await response.json();
        setCodes(data);
      } else if (response.status === 403) {
        // 用户没有权限，不显示错误
        setCodes([]);
      } else {
        throw new Error('Failed to fetch codes');
      }
    } catch (error) {
      console.error('Error fetching universal codes:', error);
      toast.error('Failed to load universal codes');
    } finally {
      setIsLoading(false);
    }
  }

  async function createCode() {
    // 邮箱是可选的，可以为空
    
    // 基本的邮箱格式验证（客户端）
    if (newCodeEmail.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newCodeEmail.trim())) {
      toast.error('请输入有效的邮箱地址或留空');
      return;
    }

    setIsCreating(true);
    try {
      const response = await fetch('/api/activation-codes/universal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: newCodeEmail.trim() || undefined // 空字符串转换为undefined
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        // 提供更友好的错误信息
        if (error.error === 'Invalid input' || error.error === 'Invalid email format') {
          throw new Error('输入的邮箱格式不正确，请检查后重试');
        }
        throw new Error(error.error || 'Failed to create code');
      }

      const newCode = await response.json();
      setCodes([newCode, ...codes]);
      setNewCodeEmail('');
      
      // 自动复制到剪贴板
      await navigator.clipboard.writeText(newCode.code);
      toast.success('万能激活码已创建并复制到剪贴板！');
      
    } catch (error) {
      console.error('Error creating universal code:', error);
      toast.error(error instanceof Error ? error.message : '创建激活码失败');
    } finally {
      setIsCreating(false);
    }
  }

  async function deleteCode(codeId: string) {
    try {
      const response = await fetch(`/api/activation-codes/universal?id=${codeId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete code');
      }

      setCodes(codes.filter(code => code.id !== codeId));
      toast.success('Code deleted successfully');
      
    } catch (error) {
      console.error('Error deleting universal code:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to delete code');
    }
  }

  async function copyCode(code: string) {
    try {
      await navigator.clipboard.writeText(code);
      toast.success('Code copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy code');
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Globe className="w-5 h-5" />
            <span>Universal Activation Codes</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Globe className="w-5 h-5" />
          <span>Universal Activation Codes</span>
        </CardTitle>
        <CardDescription>
          Create universal activation codes that allow users to register and create their own teams.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Create new code form */}
        <div className="flex space-x-2">
          <Input
            placeholder="Email for tracking (optional)"
            value={newCodeEmail}
            onChange={(e) => setNewCodeEmail(e.target.value)}
            className="flex-1"
          />
          <Button 
            onClick={createCode} 
            disabled={isCreating}
            className="min-w-[120px]"
          >
            {isCreating ? (
              <div className="flex items-center space-x-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Creating...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>Create Code</span>
              </div>
            )}
          </Button>
        </div>

        {/* Codes table */}
        {codes.length > 0 ? (
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {codes.map((code) => (
                  <TableRow key={code.id}>
                    <TableCell className="font-mono">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">{code.code}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyCode(code.code)}
                          className="h-6 w-6 p-0"
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">
                          {code.email === '*' ? 'Any email' : code.email}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={code.isUsed ? "secondary" : "default"}>
                        {code.isUsed ? 'Used' : 'Active'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{formatDate(code.createdAt)}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        onClick={() => {
                          if (window.confirm('Are you sure you want to delete this universal activation code? This action cannot be undone.')) {
                            deleteCode(code.id);
                          }
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Globe className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No universal codes created yet.</p>
            <p className="text-sm">Create your first universal activation code above.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 