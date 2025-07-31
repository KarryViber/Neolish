'use client'; // Mark as a Client Component

import React, { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useTranslations } from 'next-intl';

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner"; // Use sonner for toasts
import { useRouter } from 'next/navigation';

interface AddStyleProfileFormProps {
  onSuccess?: () => void; // Optional callback for when submission succeeds
}

export default function AddStyleProfileForm({ onSuccess }: AddStyleProfileFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const t = useTranslations('style-profiles.addForm');

  // Define the form schema using Zod (matches the API route schema)
  const formSchema = z.object({
    name: z.string().min(1, { message: t('validation.nameRequired') }),
    description: z.string().optional(),
  });

  // Initialize the form using react-hook-form and Zod resolver
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  // Handle form submission
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/style-profiles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create style profile');
      }

      toast.success(t('toast.createSuccess'));
      form.reset(); // Reset form fields
      router.refresh(); // Refresh server-side data (re-fetches the list)
      onSuccess?.(); // Call the success callback if provided (e.g., to close modal)

    } catch (error) {
      console.error("Submission error:", error);
      toast.error(error instanceof Error ? error.message : t('toast.createFailed'));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('profileName')} <span className="text-red-500">{t('required')}</span></FormLabel>
              <FormControl>
                <Input placeholder={t('namePlaceholder')} {...field} />
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
              <FormLabel>{t('description')}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t('descriptionPlaceholder')}
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? t('savingButton') : t('saveButton')}
        </Button>
      </form>
    </Form>
  );
} 