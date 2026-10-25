import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Alert } from '../ui/alert';
import { Badge } from '../ui/badge';
import { registerOwner, loginOwner, fetchProfile, setStoredAuth } from '../../api/auth';
import { useNavigate } from '../../router';
import { useOwner } from '../../context/OwnerContext';
import { Trees, User, Mail, Phone, MapPin, Lock, ArrowRight } from 'lucide-react';

export function OwnerRegister({ onRegisterSuccess }) {
  const navigate = useNavigate();
  const ownerCtx = useOwner();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.name.trim()) {
      setError('Owner name is required.');
      return;
    }

    if (!formData.email.trim()) {
      setError('A valid contact email is required.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match. Please re-enter.');
      return;
    }

    setLoading(true);

    try {
      await registerOwner({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || undefined,
        address: formData.address.trim() || undefined,
        password: formData.password,
      });

      setSuccess('Owner account created successfully! Signing in...');

      try {
        const loginRes = await loginOwner({
          email: formData.email.trim(),
          password: formData.password,
        });

        let profile = null;
        try {
          profile = await fetchProfile(loginRes.accessToken);
        } catch {
          profile = {
            email: formData.email.trim(),
            name: formData.name.trim(),
            role: 'owner',
          };
        }

        const authData = {
          accessToken: loginRes.accessToken,
          refreshToken: loginRes.refreshToken,
          user: profile,
        };

        setStoredAuth(authData);

        setTimeout(() => {
          if (onRegisterSuccess) {
            onRegisterSuccess(profile);
          } else {
            ownerCtx.onLoginSuccess(profile);
          }
          navigate('/dashboard');
        }, 600);
      } catch {
        setTimeout(() => {
          navigate('/login');
        }, 1000);
      }
    } catch (err) {
      setError(err.message || 'Registration failed. Please review your inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 bg-[#F8F9FA]">
      <div className="w-full max-w-lg space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex w-10 h-10 bg-[#1F3D2C] items-center justify-center text-white mb-1">
            <Trees className="w-6 h-6 text-[#D7E6DD]" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-[#1F3D2C]">
            Owner Registration
          </h2>
          <p className="text-xs text-[#4B5563]">
            Estate 360 Plantation System
          </p>
          <div className="pt-0.5">
            <Badge variant="yellow" className="text-[11px]">
              Estates are registered after login
            </Badge>
          </div>
        </div>

        {/* Form Card */}
        <Card className="border border-[#D7E6DD] bg-white">
          <form onSubmit={handleSubmit}>
            <CardHeader className="space-y-1 pb-4">
              <CardTitle className="text-base text-[#1F3D2C]">Create Owner Account</CardTitle>
              <CardDescription className="text-xs text-[#4B5563]">
                Enter your details to create your owner profile.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4 pt-4">
              {error && (
                <Alert variant="error" title="Registration Error">
                  {error}
                </Alert>
              )}

              {success && (
                <Alert variant="success" title="Success">
                  {success}
                </Alert>
              )}

              {/* Owner Name */}
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-xs">
                  Full Name / Legal Entity <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="e.g. John Vandebilt / High Valley Estates"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    className="pl-9 text-sm"
                  />
                  <User className="w-4 h-4 text-gray-400 absolute left-3 top-3 pointer-events-none" />
                </div>
              </div>

              {/* Email Address */}
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs">
                  Email Address <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="owner@plantation.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    className="pl-9 text-sm"
                  />
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3 pointer-events-none" />
                </div>
              </div>

              {/* Phone & Address */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="phone" className="text-xs">
                    Phone (Optional)
                  </Label>
                  <div className="relative">
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="+94 77 123 4567"
                      value={formData.phone}
                      onChange={handleChange}
                      disabled={loading}
                      className="pl-9 text-sm"
                    />
                    <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-3 pointer-events-none" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="address" className="text-xs">
                    Address (Optional)
                  </Label>
                  <div className="relative">
                    <Input
                      id="address"
                      name="address"
                      type="text"
                      placeholder="Nuwara Eliya, Sri Lanka"
                      value={formData.address}
                      onChange={handleChange}
                      disabled={loading}
                      className="pl-9 text-sm"
                    />
                    <MapPin className="w-4 h-4 text-gray-400 absolute left-3 top-3 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Passwords */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="space-y-1.5">
                  <Label htmlFor="password" className="text-xs">
                    Password <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="Min 6 characters"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      disabled={loading}
                      className="pl-9 text-sm"
                    />
                    <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3 pointer-events-none" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="confirmPassword" className="text-xs">
                    Confirm Password <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      placeholder="Repeat password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      disabled={loading}
                      className="pl-9 text-sm"
                    />
                    <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3 pointer-events-none" />
                  </div>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-3 pt-2">
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-[#1F3D2C] hover:bg-[#162D20] text-white h-10 font-medium text-sm gap-2"
              >
                {loading ? 'Creating Owner Account...' : 'Complete Owner Registration'}
                {!loading && <ArrowRight className="w-4 h-4" />}
              </Button>

              <div className="text-center text-xs text-[#4B5563] pt-1">
                Already registered as an owner?{' '}
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="font-semibold text-[#1F3D2C] hover:underline cursor-pointer"
                >
                  Sign in here
                </button>
              </div>
            </CardFooter>
          </form>
        </Card>

        {/* Back Link */}
        <div className="text-center">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="text-xs text-[#8C6239] hover:text-[#1F3D2C] font-medium transition-colors cursor-pointer"
          >
            ← Back to Estate 360
          </button>
        </div>
      </div>
    </div>
  );
}
