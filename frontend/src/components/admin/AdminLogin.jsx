import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Alert } from '../ui/alert';
import { Badge } from '../ui/badge';
import { loginAdmin, registerInitialAdmin } from '../../api/admin';
import { Shield, Trees, Lock, Mail, Eye, EyeOff, User, Phone, ArrowLeft } from 'lucide-react';

export function AdminLogin({ onLoginSuccess, onExit }) {
  const [mode, setMode] = useState('login'); // 'login' | 'bootstrap'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Setup fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!email.trim() || !password) {
      setErrorMsg('Please enter your email and password.');
      return;
    }

    setLoading(true);
    try {
      const data = await loginAdmin({ email: email.trim(), password });
      onLoginSuccess(data.user);
    } catch (err) {
      setErrorMsg(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleBootstrap = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!email.trim() || !password || !name.trim()) {
      setErrorMsg('Please fill in your name, email, and password.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    try {
      const regData = await registerInitialAdmin({
        email: email.trim(),
        password,
        name: name.trim(),
        phone: phone.trim() || undefined,
      });

      setSuccessMsg('Admin account created! Signing you in...');
      if (regData && regData.accessToken && regData.user) {
        onLoginSuccess(regData.user);
      } else {
        const data = await loginAdmin({ email: email.trim(), password });
        onLoginSuccess(data.user);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to create initial admin account.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#1F2937] flex flex-col justify-between font-sans">
      {/* Top Navbar */}
      <header className="bg-white border-b border-[#D7E6DD] px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-[#1F3D2C] flex items-center justify-center text-white">
            <Trees className="w-5 h-5 text-[#D7E6DD]" />
          </div>
          <span className="font-bold text-lg text-[#1F3D2C]">
            Estate 360
          </span>
          <Badge variant="yellow" className="text-xs">
            Admin
          </Badge>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={onExit}
          className="border-[#D7E6DD] text-[#1F3D2C] hover:bg-[#D7E6DD]/30 text-xs gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Main Site</span>
        </Button>
      </header>

      {/* Main Login Card */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md space-y-4">
          <div className="text-center space-y-1.5 mb-2">
            <div className="inline-flex w-12 h-12 bg-[#D7E6DD]/60 border border-[#D7E6DD] items-center justify-center text-[#1F3D2C] mb-1">
              <Shield className="w-6 h-6 text-[#1F3D2C]" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-[#1F3D2C]">
              {mode === 'login' ? 'Admin Login' : 'Initial Admin Setup'}
            </h1>
            <p className="text-xs text-[#4B5563]">
              {mode === 'login'
                ? 'Sign in to access the administrator dashboard'
                : 'Create the primary admin account for Estate 360'}
            </p>
          </div>

          <Card className="rounded-none border border-[#D7E6DD] bg-white shadow-sm">
            <CardHeader className="border-b border-[#D7E6DD]/60 p-5 pb-4">
              <CardTitle className="text-base text-[#1F3D2C]">
                {mode === 'login' ? 'Sign In' : 'Create Admin'}
              </CardTitle>
              <CardDescription className="text-xs text-[#4B5563]">
                {mode === 'login'
                  ? 'Enter your administrator credentials'
                  : 'Enter details for the initial administrator'}
              </CardDescription>
            </CardHeader>

            <CardContent className="p-5 pt-5 space-y-4">
              {errorMsg && (
                <Alert variant="error" className="text-xs">
                  {errorMsg}
                </Alert>
              )}

              {successMsg && (
                <Alert variant="success" className="text-xs">
                  {successMsg}
                </Alert>
              )}

              {mode === 'login' ? (
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-[#1F2937]">
                      Email Address
                    </Label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-[#4B5563] absolute left-3 top-1/2 -translate-y-1/2" />
                      <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="admin@estate360.lk"
                        required
                        className="rounded-none pl-9 border-[#D7E6DD] focus:border-[#1F3D2C] text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-[#1F2937]">
                      Password
                    </Label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-[#4B5563] absolute left-3 top-1/2 -translate-y-1/2" />
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        className="rounded-none pl-9 pr-9 border-[#D7E6DD] focus:border-[#1F3D2C] text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4B5563] hover:text-[#1F2937] cursor-pointer"
                        tabIndex={-1}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-none bg-[#1F3D2C] hover:bg-[#162D20] text-white text-xs h-10 font-medium cursor-pointer"
                  >
                    {loading ? 'Signing in...' : 'Sign In as Admin'}
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleBootstrap} className="space-y-3.5">
                  <div className="space-y-1">
                    <Label className="text-xs font-medium text-[#1F2937]">
                      Full Name
                    </Label>
                    <div className="relative">
                      <User className="w-4 h-4 text-[#4B5563] absolute left-3 top-1/2 -translate-y-1/2" />
                      <Input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Admin Name"
                        required
                        className="rounded-none pl-9 border-[#D7E6DD] focus:border-[#1F3D2C] text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs font-medium text-[#1F2937]">
                      Email Address
                    </Label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-[#4B5563] absolute left-3 top-1/2 -translate-y-1/2" />
                      <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="admin@estate360.lk"
                        required
                        className="rounded-none pl-9 border-[#D7E6DD] focus:border-[#1F3D2C] text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs font-medium text-[#1F2937]">
                      Phone Number (Optional)
                    </Label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-[#4B5563] absolute left-3 top-1/2 -translate-y-1/2" />
                      <Input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+94 77 123 4567"
                        className="rounded-none pl-9 border-[#D7E6DD] focus:border-[#1F3D2C] text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs font-medium text-[#1F2937]">
                      Password
                    </Label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-[#4B5563] absolute left-3 top-1/2 -translate-y-1/2" />
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="At least 6 characters"
                        required
                        className="rounded-none pl-9 pr-9 border-[#D7E6DD] focus:border-[#1F3D2C] text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4B5563] hover:text-[#1F2937] cursor-pointer"
                        tabIndex={-1}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-none bg-[#1F3D2C] hover:bg-[#162D20] text-white text-xs h-10 font-medium cursor-pointer"
                  >
                    {loading ? 'Creating Admin...' : 'Create Admin Account'}
                  </Button>
                </form>
              )}

              {/* Mode Toggle */}
              <div className="pt-3 border-t border-[#D7E6DD] text-center">
                {mode === 'login' ? (
                  <button
                    type="button"
                    onClick={() => {
                      setMode('bootstrap');
                      setErrorMsg('');
                    }}
                    className="text-xs text-[#1F3D2C] hover:underline cursor-pointer"
                  >
                    First time setup? Create initial admin
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setMode('login');
                      setErrorMsg('');
                    }}
                    className="text-xs text-[#1F3D2C] hover:underline cursor-pointer inline-flex items-center gap-1"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to Admin Login</span>
                  </button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-[#D7E6DD] bg-white px-6 py-3 text-center text-xs text-[#4B5563]">
        Estate 360 Admin Portal
      </footer>
    </div>
  );
}
