'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Store, MapPin, Clock, Camera, Wrench, Phone, CheckCircle,
  ArrowRight, ArrowLeft, Search, Plus, X
} from 'lucide-react';
import Navbar from '@/components/navbar';
import ImageUpload from '@/components/image-upload';

const categories = [
  'Mama/Baba Mboga',
  'Maasai Shop',
  'Barbers',
  'Saloonists',
  'Water Vendors',
  'Gas Refillers',
  'Butcheries',
  'Laundry Mart',
  'SuperMarkets',
  'Eateries',
  'Quick Snacks',
];

const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

interface ProfileData {
  businessName: string;
  category: string;
  description: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
  hours: { [key: string]: { open: string; close: string; closed: boolean } };
  photos: File[];
  photoPreviews: string[];
  services: { name: string; priceHint: string }[];
  whatsapp: string;
  phone: string;
}

const initialHours = daysOfWeek.reduce((acc, day) => {
  acc[day] = { open: '08:00', close: '18:00', closed: false };
  return acc;
}, {} as { [key: string]: { open: string; close: string; closed: boolean } });

function CreateVendorProfilePage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const editVendorId = searchParams.get('edit');
  const isEditMode = !!editVendorId;

  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<ProfileData>({
    businessName: '',
    category: '',
    description: '',
    address: '',
    latitude: null,
    longitude: null,
    hours: initialHours,
    photos: [],
    photoPreviews: [],
    services: [],
    whatsapp: '',
    phone: '',
  });

  const [locationSearch, setLocationSearch] = useState('');
  const [locationResults, setLocationResults] = useState<any[]>([]);
  const [isSearchingLocation, setIsSearchingLocation] = useState(false);
  const [newService, setNewService] = useState({ name: '', priceHint: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loadingEdit, setLoadingEdit] = useState(!!editVendorId);
  const [dataLoaded, setDataLoaded] = useState(!editVendorId);

  useEffect(() => {
    if (!editVendorId || !isLoaded) return;
    (async () => {
      try {
        const res = await fetch(`/api/vendors/${editVendorId}`);
        if (!res.ok) throw new Error('Vendor not found');
        const data = await res.json();
        const v = data.vendor;
        let parsedHours = initialHours;
        if (v.hours) {
          try { parsedHours = typeof v.hours === 'string' ? JSON.parse(v.hours) : v.hours; } catch {}
        }
        let parsedServices: { name: string; priceHint: string }[] = [];
        if (v.services) {
          try { parsedServices = typeof v.services === 'string' ? JSON.parse(v.services) : v.services; } catch {}
        }
        setProfile({
          businessName: v.business_name || '',
          category: v.category || '',
          description: v.description || '',
          address: v.address || '',
          latitude: v.latitude,
          longitude: v.longitude,
          hours: parsedHours,
          photos: [],
          photoPreviews: v.photos || [],
          services: parsedServices,
          whatsapp: v.whatsapp || '',
          phone: v.phone || '',
        });
        if (v.address) setLocationSearch(v.address);
      } catch (error) {
        console.error('Failed to load vendor:', error);
        setErrors({ submit: 'Failed to load shop data.' });
      } finally {
        setLoadingEdit(false);
        setDataLoaded(true);
      }
    })();
  }, [editVendorId, isLoaded]);

  if (isLoaded && !user) {
    router.push('/auth/role');
    return null;
  }

  if (loadingEdit) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const updateProfile = (updates: Partial<ProfileData>) => {
    setProfile(prev => ({ ...prev, ...updates }));
    setErrors({});
  };

  const validateStep = (stepNumber: number): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (stepNumber === 1) {
      if (!profile.businessName.trim()) newErrors.businessName = 'Business name is required';
      if (!profile.category) newErrors.category = 'Please select a category';
    }

    if (stepNumber === 2) {
      if (!profile.address.trim()) newErrors.address = 'Address is required';
      if (!profile.latitude || !profile.longitude) newErrors.location = 'Please select a location on the map';
    }

    if (stepNumber === 4) {
      if (profile.photos.length === 0 && profile.photoPreviews.length === 0) newErrors.photos = 'At least one photo is required';
    }

    if (stepNumber === 6) {
      if (!profile.whatsapp.trim()) newErrors.whatsapp = 'WhatsApp number is required';
      if (profile.whatsapp && !/^\+254\d{9}$/.test(profile.whatsapp)) {
        newErrors.whatsapp = 'Please enter a valid WhatsApp number (+254XXXXXXXXX)';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (isEditMode && !dataLoaded) return;
    if (validateStep(step)) {
      setStep(prev => Math.min(prev + 1, 7));
    }
  };

  const prevStep = () => {
    setStep(prev => Math.max(prev - 1, 1));
  };

  const handleLocationSearch = async () => {
    if (!locationSearch.trim()) return;

    setIsSearchingLocation(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationSearch)}&limit=5`
      );
      const data = await response.json();
      setLocationResults(data);
    } catch (error) {
      console.error('Location search error:', error);
    } finally {
      setIsSearchingLocation(false);
    }
  };

  const selectLocation = (result: any) => {
    updateProfile({
      address: result.display_name,
      latitude: parseFloat(result.lat),
      longitude: parseFloat(result.lon),
    });
    setLocationResults([]);
    setLocationSearch('');
  };

  const addService = () => {
    if (!newService.name.trim()) return;
    updateProfile({
      services: [...profile.services, { ...newService }],
    });
    setNewService({ name: '', priceHint: '' });
  };

  const removeService = (index: number) => {
    updateProfile({
      services: profile.services.filter((_, i) => i !== index),
    });
  };

  const formatWhatsApp = (value: string) => {
    const digits = value.replace(/\D/g, '');
    if (digits.startsWith('254')) {
      return '+' + digits;
    }
    if (digits.startsWith('0')) {
      return '+254' + digits.slice(1);
    }
    return '+254' + digits;
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const base64Images = await Promise.all(
        profile.photos.map(file => convertToBase64(file))
      );

      const existingPhotos = profile.photoPreviews.filter(p => p.startsWith('http'));
      const allPhotos = [...existingPhotos, ...base64Images];

      const payload = {
        ...(isEditMode ? {} : { userId: user?.id }),
        businessName: profile.businessName,
        category: profile.category,
        description: profile.description,
        address: profile.address,
        latitude: profile.latitude,
        longitude: profile.longitude,
        hours: profile.hours,
        services: profile.services,
        whatsapp: profile.whatsapp,
        phone: profile.phone,
        photos: allPhotos.length > 0 ? allPhotos : undefined,
      };

      const url = isEditMode ? `/api/vendors/${editVendorId}` : '/api/vendors';
      const method = isEditMode ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(isEditMode ? 'Failed to update profile' : 'Failed to create profile');
      }

      router.push('/vendor/dashboard');
    } catch (error) {
      console.error('Submit error:', error);
      setErrors({ submit: isEditMode ? 'Failed to update profile. Please try again.' : 'Failed to create profile. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {Array.from({ length: 7 }, (_, i) => (
        <div key={i} className="flex items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
              step > i + 1
                ? 'bg-primary text-primary-foreground'
                : step === i + 1
                ? 'bg-primary text-primary-foreground ring-2 ring-primary/20'
                : 'bg-surface-hover text-text-tertiary'
            }`}
          >
            {step > i + 1 ? <CheckCircle className="w-4 h-4" /> : i + 1}
          </div>
          {i < 6 && (
            <div
              className={`w-8 h-0.5 mx-1 ${
                step > i + 1 ? 'bg-primary' : 'bg-surface-hover'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-text-primary mb-4">Business Information</h3>
        <p className="text-sm text-text-secondary mb-6">Tell us about your business</p>
      </div>

      <div>
        <label htmlFor="businessName" className="block text-sm font-medium text-text-secondary mb-2">
          Business Name *
        </label>
        <input
          id="businessName"
          type="text"
          value={profile.businessName}
          onChange={(e) => updateProfile({ businessName: e.target.value })}
          placeholder="e.g., Mama Njeri's Fresh Produce"
          className={`w-full px-4 py-3 bg-background border rounded-lg text-text-primary placeholder:text-text-tertiary focus:ring-2 focus:ring-primary focus:border-primary ${
            errors.businessName ? 'border-destructive' : 'border-border'
          }`}
        />
        {errors.businessName && <p className="text-destructive text-sm mt-1">{errors.businessName}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-text-secondary mb-2">Category *</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => updateProfile({ category: cat })}
              className={`p-3 text-sm rounded-lg border transition-colors text-left ${
                profile.category === cat
                  ? 'bg-primary/10 border-primary text-primary'
                  : 'bg-surface border-border text-text-secondary hover:border-primary/30'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        {errors.category && <p className="text-destructive text-sm mt-1">{errors.category}</p>}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-text-secondary mb-2">
          Description (Optional)
        </label>
        <textarea
          id="description"
          value={profile.description}
          onChange={(e) => updateProfile({ description: e.target.value })}
          placeholder="Tell customers what makes your business special..."
          rows={3}
          className="w-full px-4 py-3 bg-background border border-border rounded-lg text-text-primary placeholder:text-text-tertiary focus:ring-2 focus:ring-primary focus:border-primary"
        />
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-text-primary mb-4">Business Location</h3>
        <p className="text-sm text-text-secondary mb-6">Help customers find you</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-text-secondary mb-2">
          Search for your address
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={locationSearch}
            onChange={(e) => setLocationSearch(e.target.value)}
            placeholder="Search address..."
            className="flex-1 px-4 py-3 bg-background border border-border rounded-lg text-text-primary placeholder:text-text-tertiary focus:ring-2 focus:ring-primary focus:border-primary"
            onKeyPress={(e) => e.key === 'Enter' && handleLocationSearch()}
          />
          <button
            type="button"
            onClick={handleLocationSearch}
            disabled={isSearchingLocation}
            className="bg-primary text-primary-foreground px-4 py-3 rounded-lg hover:bg-primary-hover transition-colors disabled:opacity-50"
          >
            <Search className="h-5 w-5" />
          </button>
        </div>
      </div>

      {locationResults.length > 0 && (
        <div className="bg-surface border border-border rounded-lg divide-y divide-border max-h-60 overflow-y-auto">
          {locationResults.map((result, index) => (
            <button
              key={index}
              type="button"
              onClick={() => selectLocation(result)}
              className="w-full px-4 py-3 text-left hover:bg-surface-hover transition-colors"
            >
              <p className="text-sm text-text-primary">{result.display_name}</p>
            </button>
          ))}
        </div>
      )}

      {profile.latitude && profile.longitude && (
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <p className="text-sm font-medium text-primary">Location Selected</p>
              <p className="text-sm text-text-secondary mt-1">{profile.address}</p>
              <p className="text-xs text-text-tertiary mt-2">
                {profile.latitude.toFixed(6)}, {profile.longitude.toFixed(6)}
              </p>
            </div>
          </div>
        </div>
      )}

      {!profile.latitude && (
        <div className="bg-surface border border-border rounded-lg p-6 text-center">
          <MapPin className="h-10 w-10 text-text-tertiary mx-auto mb-3" />
          <p className="text-text-secondary">Search for your address above to set your location</p>
        </div>
      )}

      {errors.address && <p className="text-destructive text-sm">{errors.address}</p>}
      {errors.location && <p className="text-destructive text-sm">{errors.location}</p>}
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-text-primary mb-4">Business Hours</h3>
        <p className="text-sm text-text-secondary mb-6">When are you open?</p>
      </div>

      <div className="space-y-4">
        {daysOfWeek.map((day) => (
          <div key={day} className="flex items-center gap-4">
            <div className="w-12">
              <span className="text-sm font-medium text-text-secondary">{day}</span>
            </div>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={!profile.hours[day].closed}
                onChange={(e) =>
                  updateProfile({
                    hours: {
                      ...profile.hours,
                      [day]: { ...profile.hours[day], closed: !e.target.checked },
                    },
                  })
                }
                className="h-4 w-4 text-primary focus:ring-primary border-border rounded"
              />
              <span className="text-sm text-text-secondary">Open</span>
            </label>

            {!profile.hours[day].closed && (
              <div className="flex items-center gap-2">
                <input
                  type="time"
                  value={profile.hours[day].open}
                  onChange={(e) =>
                    updateProfile({
                      hours: {
                        ...profile.hours,
                        [day]: { ...profile.hours[day], open: e.target.value },
                      },
                    })
                  }
                  className="px-3 py-2 bg-background border border-border rounded-lg text-sm text-text-primary focus:ring-2 focus:ring-primary focus:border-primary"
                />
                <span className="text-text-tertiary">to</span>
                <input
                  type="time"
                  value={profile.hours[day].close}
                  onChange={(e) =>
                    updateProfile({
                      hours: {
                        ...profile.hours,
                        [day]: { ...profile.hours[day], close: e.target.value },
                      },
                    })
                  }
                  className="px-3 py-2 bg-background border border-border rounded-lg text-sm text-text-primary focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
            )}

            {profile.hours[day].closed && (
              <span className="text-sm text-text-tertiary italic">Closed</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-text-primary mb-4">Business Photos</h3>
        <p className="text-sm text-text-secondary mb-6">Upload up to 10 photos of your business</p>
      </div>

      <ImageUpload
        images={profile.photoPreviews.filter(p => p.startsWith('http') || p.startsWith('data:'))}
        onImagesChange={(newPreviews) => updateProfile({ photoPreviews: newPreviews })}
        maxImages={10}
      />

      {errors.photos && <p className="text-destructive text-sm">{errors.photos}</p>}
    </div>
  );

  const renderStep5 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-text-primary mb-4">Services & Products</h3>
        <p className="text-sm text-text-secondary mb-6">What do you offer? Add your main services or products</p>
      </div>

      <div className="space-y-4">
        {profile.services.map((service, index) => (
          <div key={index} className="flex items-center gap-3 bg-surface p-3 rounded-lg border border-border">
            <div className="flex-1">
              <p className="font-medium text-text-primary">{service.name}</p>
              {service.priceHint && (
                <p className="text-sm text-text-secondary">From KES {service.priceHint}</p>
              )}
            </div>
            <button
              type="button"
              onClick={() => removeService(index)}
              className="text-destructive hover:text-destructive/80 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>

      <div className="bg-surface p-4 rounded-lg border border-border">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            type="text"
            value={newService.name}
            onChange={(e) => setNewService({ ...newService, name: e.target.value })}
            placeholder="Service or product name"
            className="px-4 py-3 bg-background border border-border rounded-lg text-text-primary placeholder:text-text-tertiary focus:ring-2 focus:ring-primary focus:border-primary"
            onKeyPress={(e) => e.key === 'Enter' && addService()}
          />
          <input
            type="text"
            value={newService.priceHint}
            onChange={(e) => setNewService({ ...newService, priceHint: e.target.value })}
            placeholder="Price hint (optional, e.g., 300)"
            className="px-4 py-3 bg-background border border-border rounded-lg text-text-primary placeholder:text-text-tertiary focus:ring-2 focus:ring-primary focus:border-primary"
            onKeyPress={(e) => e.key === 'Enter' && addService()}
          />
        </div>
        <button
          type="button"
          onClick={addService}
          disabled={!newService.name.trim()}
          className="mt-3 w-full bg-primary text-primary-foreground py-2 px-4 rounded-lg font-medium hover:bg-primary-hover transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Service
        </button>
      </div>

      <p className="text-xs text-text-tertiary">
        You can add more services later. Focus on your main offerings for now.
      </p>
    </div>
  );

  const renderStep6 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-text-primary mb-4">Contact Information</h3>
        <p className="text-sm text-text-secondary mb-6">How can customers reach you?</p>
      </div>

      <div>
        <label htmlFor="whatsapp" className="block text-sm font-medium text-text-secondary mb-2">
          WhatsApp Number *
        </label>
        <input
          id="whatsapp"
          type="tel"
          value={profile.whatsapp}
          onChange={(e) => updateProfile({ whatsapp: formatWhatsApp(e.target.value) })}
          placeholder="+254712345678"
          className={`w-full px-4 py-3 bg-background border rounded-lg text-text-primary placeholder:text-text-tertiary focus:ring-2 focus:ring-primary focus:border-primary ${
            errors.whatsapp ? 'border-destructive' : 'border-border'
          }`}
        />
        {errors.whatsapp && <p className="text-destructive text-sm mt-1">{errors.whatsapp}</p>}
        <p className="text-xs text-text-tertiary mt-2">
          This will be used for customer messages. Format: +254 followed by 9 digits.
        </p>
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-text-secondary mb-2">
          Additional Phone Number (Optional)
        </label>
        <input
          id="phone"
          type="tel"
          value={profile.phone}
          onChange={(e) => updateProfile({ phone: e.target.value })}
          placeholder="+254712345678"
          className="w-full px-4 py-3 bg-background border border-border rounded-lg text-text-primary placeholder:text-text-tertiary focus:ring-2 focus:ring-primary focus:border-primary"
        />
        <p className="text-xs text-text-tertiary mt-2">
          Optional secondary contact number.
        </p>
      </div>
    </div>
  );

  const renderStep7 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-text-primary mb-4">Review Your Profile</h3>
        <p className="text-sm text-text-secondary mb-6">Please review your information before submitting</p>
      </div>

      <div className="space-y-4">
        <div className="bg-surface p-4 rounded-lg border border-border">
          <h4 className="font-medium text-text-primary mb-2">Business Information</h4>
          <p className="text-sm text-text-secondary">Name: {profile.businessName}</p>
          <p className="text-sm text-text-secondary">Category: {profile.category}</p>
          {profile.description && (
            <p className="text-sm text-text-secondary mt-2">{profile.description}</p>
          )}
        </div>

        <div className="bg-surface p-4 rounded-lg border border-border">
          <h4 className="font-medium text-text-primary mb-2">Location</h4>
          <p className="text-sm text-text-secondary">{profile.address}</p>
          {profile.latitude && profile.longitude && (
            <p className="text-xs text-text-tertiary mt-1">
              {profile.latitude.toFixed(6)}, {profile.longitude.toFixed(6)}
            </p>
          )}
        </div>

        <div className="bg-surface p-4 rounded-lg border border-border">
          <h4 className="font-medium text-text-primary mb-2">Business Hours</h4>
          {daysOfWeek.map((day) => (
            <div key={day} className="flex items-center gap-2 text-sm">
              <span className="w-10 text-text-secondary">{day}:</span>
              {profile.hours[day].closed ? (
                <span className="text-text-tertiary italic">Closed</span>
              ) : (
                <span className="text-text-secondary">
                  {profile.hours[day].open} - {profile.hours[day].close}
                </span>
              )}
            </div>
          ))}
        </div>

        <div className="bg-surface p-4 rounded-lg border border-border">
          <h4 className="font-medium text-text-primary mb-2">Photos</h4>
          <div className="flex gap-2">
            {profile.photoPreviews.map((preview, index) => (
              <img
                key={index}
                src={preview}
                alt={`Photo ${index + 1}`}
                className="w-16 h-16 object-cover rounded-lg"
              />
            ))}
          </div>
        </div>

        {profile.services.length > 0 && (
          <div className="bg-surface p-4 rounded-lg border border-border">
            <h4 className="font-medium text-text-primary mb-2">Services</h4>
            {profile.services.map((service, index) => (
              <div key={index} className="text-sm text-text-secondary">
                {service.name}
                {service.priceHint && ` - From KES ${service.priceHint}`}
              </div>
            ))}
          </div>
        )}

        <div className="bg-surface p-4 rounded-lg border border-border">
          <h4 className="font-medium text-text-primary mb-2">Contact</h4>
          <p className="text-sm text-text-secondary">WhatsApp: {profile.whatsapp}</p>
          {profile.phone && (
            <p className="text-sm text-text-secondary">Phone: {profile.phone}</p>
          )}
        </div>
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (step) {
      case 1: return renderStep1();
      case 2: return renderStep2();
      case 3: return renderStep3();
      case 4: return renderStep4();
      case 5: return renderStep5();
      case 6: return renderStep6();
      case 7: return renderStep7();
      default: return null;
    }
  };

  const stepTitles = [
    'Business Info',
    'Location',
    'Hours',
    'Photos',
    'Services',
    'Contact',
    'Review',
  ];

  return (
    <div className="min-h-screen bg-background">
      <nav className="bg-surface border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => router.push('/vendor/dashboard')}
              className="text-text-secondary hover:text-text-primary transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <h1 className="text-lg font-medium text-text-primary">
              Step {step} of 7: {stepTitles[step - 1]}
            </h1>
            <div className="w-6" />
          </div>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        {renderStepIndicator()}

        <div className="bg-surface rounded-xl border border-border p-6 mb-6">
          {renderCurrentStep()}
        </div>

        <div className="flex items-center gap-4">
          {step > 1 && (
            <button
              type="button"
              onClick={prevStep}
              className="flex-1 bg-surface-hover text-text-secondary py-3 px-4 rounded-lg font-medium hover:bg-surface transition-colors flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          )}

          {step < 7 ? (
            <button
              type="button"
              onClick={nextStep}
              disabled={isEditMode && !dataLoaded}
              className="flex-1 bg-primary text-primary-foreground py-3 px-4 rounded-lg font-medium hover:bg-primary-hover transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isEditMode && !dataLoaded ? (
                <>
                  <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1 bg-primary text-primary-foreground py-3 px-4 rounded-lg font-medium hover:bg-primary-hover transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                    {isEditMode ? 'Updating...' : 'Submitting...'}
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    {isEditMode ? 'Update Profile' : 'Create Profile'}
                  </>
                )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function CreateVendorProfileWrapper() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <CreateVendorProfilePage />
    </Suspense>
  );
}

export default CreateVendorProfileWrapper;
