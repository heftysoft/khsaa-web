'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';
import Image from 'next/image';
import { ImageIcon } from 'lucide-react';

export default function ProfilePage() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [signature, setSignature] = useState<File | null>(null);
  const [photo, setPhoto] = useState<File | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('/api/profile');
        const data = await response.json();
        setProfile(data);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        toast.error('Error', {
          description: 'Failed to fetch profile data',
        });
      }
    };

    if (session?.user) {
      fetchProfile();
    }
  }, [session]);

  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });
    if (!response.ok) {
      throw new Error('Failed to upload file');
    }
    const { url } = await response.json();
    return url;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);
      
      // Handle social links
      const socialLinks = {
        facebook: formData.get('socialLinks.facebook'),
        linkedin: formData.get('socialLinks.linkedin'),
        twitter: formData.get('socialLinks.twitter'),
        instagram: formData.get('socialLinks.instagram'),
      };
      formData.delete('socialLinks.facebook');
      formData.delete('socialLinks.linkedin');
      formData.delete('socialLinks.twitter');
      formData.delete('socialLinks.instagram');
      formData.set('socialLinks', JSON.stringify(socialLinks));
      
      // Upload files first if they exist
      if (signature) {
        const signatureUrl = await uploadFile(signature);
        formData.set('signature', signatureUrl);
      }

      if (photo) {
        const photoUrl = await uploadFile(photo);
        formData.set('photo', photoUrl);
      }

      const response = await fetch('/api/profile', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      toast.success('Success', {
        description: 'Profile updated successfully',
      });
      
      // Update session to reflect new status
      await update();
      
      if (session?.user.status === 'VERIFIED') {
        router.push('/dashboard');
      }
      // Redirect to membership page instead of dashboard
      router.push('/dashboard/membership');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error('Error', {
        description: 'Failed to update profile',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileSelect = (type: 'signature' | 'photo') => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        if (type === 'signature') {
          setSignature(file);
        } else {
          setPhoto(file);
        }
      }
    };
    input.click();
  };

  const getButtonText = () => {
    if (isSubmitting) return 'Submitting...';
    switch (session?.user?.status) {
      case 'INPROGRESS':
        return 'Profile Under Review';
      case 'VERIFIED':
        return 'Update Profile';
      case 'REJECTED':
        return 'Re-submit for Verification';
      default:
        return 'Submit for Verification';
    }
  };

  return (
    <div className="max-w-4xl py-8">
      <Card>
        <CardHeader>
          <CardTitle>Complete Your Profile</CardTitle>
          <CardDescription>
            {session?.user?.status === 'INPROGRESS' 
              ? 'Your profile is currently under review'
              : 'Please provide all required information to verify your account'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {session?.user.status === 'REJECTED' && (
            <Alert className="mb-6 bg-red-50" variant="destructive">
              <AlertDescription>
                Your profile was rejected. Reason: {session.user.rejectionReason}
                Please update the required information and submit again.
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <fieldset disabled={session?.user?.status === 'INPROGRESS'} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label>Full Name *</label>
                  <Input name="name" required defaultValue={session?.user?.name || ''} />
                </div>

                <div className="space-y-2">
                  <label>Father&apos;s Name *</label>
                  <Input name="fatherName" required defaultValue={profile?.fatherName || ''} />
                </div>

                <div className="space-y-2">
                  <label>Mother&apos;s Name *</label>
                  <Input name="motherName" required defaultValue={profile?.motherName || ''} />
                </div>

                <div className="space-y-2">
                  <label>Mobile Number *</label>
                  <Input name="mobileNumber" type="tel" required defaultValue={profile?.mobileNumber || ''} />
                </div>

                <div className="space-y-2">
                  <label>Email *</label>
                  <Input name="email" type="email" required defaultValue={session?.user?.email || ''} disabled />
                </div>

                <div className="space-y-2">
                  <label>Birthday *</label>
                  <Input 
                    name="birthday" 
                    type="date" 
                    required 
                    defaultValue={profile?.birthday ? new Date(profile.birthday).toISOString().split('T')[0] : ''} 
                  />
                </div>

                <div className="space-y-2">
                  <label>Nationality *</label>
                  <Input name="nationality" required defaultValue={profile?.nationality || ''} />
                </div>

                <div className="space-y-2">
                  <label>Religion *</label>
                  <Input name="religion" required defaultValue={profile?.religion || ''} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label>SSC Registration Number *</label>
                  <Input name="sscRegNumber" required defaultValue={profile?.sscRegNumber || ''} />
                </div>

                <div className="space-y-2">
                  <label>SSC Roll Number *</label>
                  <Input name="sscRollNumber" required defaultValue={profile?.sscRollNumber || ''} />
                </div>

                <div className="space-y-2">
                  <label>Passing Year *</label>
                  <Input name="passingYear" type="number" required defaultValue={profile?.passingYear || ''} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label>Occupation</label>
                  <Input name="occupation" defaultValue={profile?.occupation || ''} />
                </div>

                <div className="space-y-2">
                  <label>Employer Name</label>
                  <Input name="employerName" defaultValue={profile?.employerName || ''} />
                </div>

                <div className="space-y-2">
                  <label>Designation</label>
                  <Input name="designation" defaultValue={profile?.designation || ''} />
                </div>
              </div>

              <div className="space-y-2">
                <label>Employer Address</label>
                <Textarea name="employerAddress" defaultValue={profile?.employerAddress || ''} />
              </div>

              {/* Add Present & Permanent Address */}
              <div className="space-y-2">
                <label>Present Address *</label>
                <Textarea 
                  name="presentAddress" 
                  required 
                  defaultValue={profile?.presentAddress || ''} 
                  placeholder="Your current residential address"
                />
              </div>

              <div className="space-y-2">
                <label>Permanent Address *</label>
                <Textarea 
                  name="permanentAddress" 
                  required 
                  defaultValue={profile?.permanentAddress || ''} 
                  placeholder="Your permanent residential address"
                />
              </div>

              {/* Add Social Links */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label>Facebook Profile</label>
                  <Input 
                    name="socialLinks.facebook" 
                    type="url" 
                    placeholder="https://facebook.com/username"
                    defaultValue={profile?.socialLinks?.facebook || ''} 
                  />
                </div>

                <div className="space-y-2">
                  <label>LinkedIn Profile</label>
                  <Input 
                    name="socialLinks.linkedin" 
                    type="url" 
                    placeholder="https://linkedin.com/in/username"
                    defaultValue={profile?.socialLinks?.linkedin || ''} 
                  />
                </div>

                <div className="space-y-2">
                  <label>Twitter Profile</label>
                  <Input 
                    name="socialLinks.twitter" 
                    type="url" 
                    placeholder="https://twitter.com/username"
                    defaultValue={profile?.socialLinks?.twitter || ''} 
                  />
                </div>

                <div className="space-y-2">
                  <label>Instagram Profile</label>
                  <Input 
                    name="socialLinks.instagram" 
                    type="url" 
                    placeholder="https://instagram.com/username"
                    defaultValue={profile?.socialLinks?.instagram || ''} 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label>Reference</label>
                <Input name="reference" defaultValue={profile?.reference || ''} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label>Signature *</label>
                  <div 
                    className={`relative group border rounded-md overflow-hidden ${
                      session?.user?.status !== 'INPROGRESS' ? 'cursor-pointer' : ''
                    }`}
                    onClick={() => session?.user?.status !== 'INPROGRESS' && handleFileSelect('signature')}
                  >
                    {profile?.signature ? (
                      <>
                        <Image 
                          src={profile.signature} 
                          alt="Signature" 
                          width={200} 
                          height={100} 
                          className="w-full h-[100px] object-contain"
                        />
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <p className="text-white text-sm">Click to replace</p>
                        </div>
                      </>
                    ) : (
                      <div className="h-[100px] bg-muted flex items-center justify-center">
                        <ImageIcon className="h-8 w-8 text-muted-foreground" />
                        <span className="ml-2 text-sm text-muted-foreground">Click to upload signature</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label>Photo *</label>
                  <div 
                    className={`relative group border rounded-md overflow-hidden ${
                      session?.user?.status !== 'INPROGRESS' ? 'cursor-pointer' : ''
                    }`}
                    onClick={() => session?.user?.status !== 'INPROGRESS' && handleFileSelect('photo')}
                  >
                    {profile?.photo ? (
                      <>
                        <Image 
                          src={profile.photo} 
                          alt="Profile Photo" 
                          width={150} 
                          height={150} 
                          className="w-full h-[150px] object-cover"
                        />
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <p className="text-white text-sm">Click to replace</p>
                        </div>
                      </>
                    ) : (
                      <div className="h-[150px] bg-muted flex items-center justify-center">
                        <ImageIcon className="h-8 w-8 text-muted-foreground" />
                        <span className="ml-2 text-sm text-muted-foreground">Click to upload photo</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </fieldset>

            <Button 
              type="submit" 
              disabled={isSubmitting || session?.user?.status === 'INPROGRESS'} 
              className="w-full"
            >
              {getButtonText()}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}