import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Alert } from '../ui/alert';
import { Badge } from '../ui/badge';
import { loginOwner, fetchProfile, setStoredAuth } from '../../api/auth';
import { useNavigate } from '../../router';
import { useOwner } from '../../context/OwnerContext';
import { Trees, Lock, Mail, Eye, EyeOff, ArrowRight } from 'lucide-react';

export function OwnerLogin({ onLoginSuccess }) {
  const navigate = useNavigate();
  const ownerCtx = useOwner();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }

    setLoading(true);

    try {
      const loginRes = await loginOwner({ email, password });

      let profile = null;
      try {
        profile = await fetchProfile(loginRes.accessToken);
      } catch {
        profile = {
          email,
          role: 'owner',
        };
      }

      const authData = {
        accessToken: loginRes.accessToken,
        refreshToken: loginRes.refreshToken,
        user: profile,
      };

      setStoredAuth(authData);
      if (onLoginSuccess) {
        onLoginSuccess(profile);
      } else {
        ownerCtx.onLoginSuccess(profile);
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 bg-[#F8F9FA]">
      <div className="w-full max-w-md space-y-6">
        {/* Top Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex w-10 h-10 bg-[#1F3D2C] items-center justify-center text-white mb-1">
            <Trees className="w-6 h-6 text-[#D7E6DD]" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-[#1F3D2C]">
            Owner Login
          </h2>
          <p className="text-xs text-[#4B5563]">
            Estate 360 Owner Portal
          </p>
          <div className="pt-0.5">
            <Badge variant="light" className="text-[11px] text-[#1F3D2C]">
              Authorized Estate Owners
            </Badge>
          </div>
        </div>

        {/* Login Card */}
        <Card className="border border-[#D7E6DD] bg-white">
          <form onSubmit={handleSubmit}>
            <CardHeader className="space-y-1 pb-4">
              <CardTitle className="text-base text-[#1F3D2C]">Sign In</CardTitle>
              <CardDescription className="text-xs text-[#4B5563]">
                Enter your registered owner email and password.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4 pt-4">
              {error && (
                <Alert variant="error" title="Authentication Error">
                  {error}
                </Alert>
              )}

              {/* Email */}
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs">
                  Email Address
                </Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    placeholder="owner@plantation.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                    className="pl-9 text-sm"
                  />
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3 pointer-events-none" />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-xs">
                    Password
                  </Label>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                    className="pl-9 pr-9 text-sm"
                  />
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3 pointer-events-none" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-3 pt-2">
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-[#1F3D2C] hover:bg-[#162D20] text-white h-10 font-medium text-sm gap-2"
              >
                {loading ? 'Signing in...' : 'Sign In'}
                {!loading && <ArrowRight className="w-4 h-4" />}
              </Button>

              <div className="text-center text-xs text-[#4B5563] pt-1">
                Don&apos;t have an owner account?{' '}
                <button
                  type="button"
                  onClick={() => navigate('/register')}
                  className="font-semibold text-[#1F3D2C] hover:underline cursor-pointer"
                >
                  Owner Registration
                </button>
              </div>
            </CardFooter>
          </form>
        </Card>

        {/* Back to Home Link */}
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
