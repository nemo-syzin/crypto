"use client";

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { updateUserProfile, uploadAvatar, type UserProfile } from '@/lib/supabase/auth';
import { User, Upload, Loader2, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ProfileTabProps {
  user: any;
  profile: UserProfile | null;
  setProfile: (profile: UserProfile | null) => void;
}

const profileSchema = z.object({
  fullName: z.string().min(2, { message: "Full name must be at least 2 characters" }).optional(),
  phone: z.string().optional(),
  bio: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export function ProfileTab({ user, profile, setProfile }: ProfileTabProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(profile?.avatar_url || null);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: profile?.full_name || '',
      phone: profile?.phone || '',
      bio: '',
    },
  });

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    
    const file = acceptedFiles[0];
    
    // Check file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file",
        variant: "destructive",
      });
      return;
    }
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 5MB",
        variant: "destructive",
      });
      return;
    }
    
    // Create preview
    const previewUrl = URL.createObjectURL(file);
    setAvatarPreview(previewUrl);
    
    setIsUploading(true);
    
    try {
      if (!user.id) throw new Error("User ID not found");
      
      const avatarUrl = await uploadAvatar(user.id, file);
      
      if (!avatarUrl) throw new Error("Failed to upload avatar");
      
      // Update profile state
      if (profile) {
        setProfile({
          ...profile,
          avatar_url: avatarUrl,
        });
      }
      
      toast({
        title: "Avatar updated",
        description: "Your profile picture has been updated successfully",
      });
    } catch (error: any) {
      console.error('Avatar upload error:', error);
      
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload avatar. Please try again.",
        variant: "destructive",
      });
      
      // Revert preview
      setAvatarPreview(profile?.avatar_url || null);
    } finally {
      setIsUploading(false);
    }
  }, [user.id, profile, setProfile, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif'],
    },
    maxFiles: 1,
    disabled: isUploading,
  });

  const onSubmit = async (data: ProfileFormValues) => {
    if (!isDirty) return;
    
    setIsSubmitting(true);
    
    try {
      if (!user.id) throw new Error("User ID not found");
      
      const updatedProfile = await updateUserProfile(user.id, {
        full_name: data.fullName,
        phone: data.phone,
      });
      
      if (!updatedProfile) throw new Error("Failed to update profile");
      
      setProfile(updatedProfile);
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      });
    } catch (error: any) {
      console.error('Profile update error:', error);
      
      toast({
        title: "Update failed",
        description: error.message || "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-bold text-[#001D8D] mb-6">Profile Information</h2>
          
          <div className="flex flex-col md:flex-row gap-8">
            {/* Avatar Upload */}
            <div className="w-full md:w-1/3">
              <Label className="block mb-4">Profile Picture</Label>
              <div 
                {...getRootProps()} 
                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                  isDragActive ? 'border-[#001D8D] bg-[#001D8D]/5' : 'border-gray-300 hover:border-[#001D8D]/50'
                } ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <input {...getInputProps()} />
                
                <div className="flex flex-col items-center">
                  {avatarPreview ? (
                    <div className="relative w-32 h-32 rounded-full overflow-hidden mb-4">
                      <img 
                        src={avatarPreview} 
                        alt="Avatar preview" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-[#001D8D]/10 flex items-center justify-center mb-4">
                      <User className="h-16 w-16 text-[#001D8D]/40" />
                    </div>
                  )}
                  
                  {isUploading ? (
                    <div className="flex items-center text-[#001D8D]">
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      <span>Uploading...</span>
                    </div>
                  ) : (
                    <>
                      <Upload className="h-6 w-6 text-[#001D8D] mb-2" />
                      <p className="text-sm text-gray-600">
                        Drag & drop an image or click to browse
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        JPG, PNG or GIF (max. 5MB)
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
            
            {/* Profile Form */}
            <div className="w-full md:w-2/3">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={user.email}
                    disabled
                    className="bg-gray-50"
                  />
                  <p className="text-xs text-gray-500">
                    Your email address is verified and cannot be changed
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    placeholder="Your full name"
                    className={errors.fullName ? 'border-red-500' : ''}
                    {...register('fullName')}
                  />
                  {errors.fullName && (
                    <p className="text-red-500 text-sm">{errors.fullName.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    placeholder="Your phone number"
                    className={errors.phone ? 'border-red-500' : ''}
                    {...register('phone')}
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm">{errors.phone.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell us about yourself"
                    className={errors.bio ? 'border-red-500' : ''}
                    {...register('bio')}
                  />
                  {errors.bio && (
                    <p className="text-red-500 text-sm">{errors.bio.message}</p>
                  )}
                </div>
                
                <div className="pt-4">
                  <Button
                    type="submit"
                    className="bg-[#001D8D]"
                    disabled={isSubmitting || !isDirty}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}