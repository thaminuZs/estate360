import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { createAdminUser } from '../../api/admin';
import { useAdmin } from '../../context/AdminContext';
import { UserPlus } from 'lucide-react';

export function AdminUsersPage() {
  const { token, setFeedbackMsg } = useAdmin();

  const [newAdminName, setNewAdminName] = useState('');
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [newAdminPhone, setNewAdminPhone] = useState('');

  const handleCreateSecondaryAdmin = async (e) => {
    e.preventDefault();
    if (!newAdminName.trim() || !newAdminEmail.trim() || !newAdminPassword) {
      setFeedbackMsg({
        type: 'error',
        text: 'Please provide name, email, and password.',
      });
      return;
    }

    try {
      await createAdminUser(token, {
        name: newAdminName.trim(),
        email: newAdminEmail.trim(),
        password: newAdminPassword,
        phone: newAdminPhone.trim() || undefined,
      });

      setFeedbackMsg({
        type: 'success',
        text: `New admin account created for ${newAdminEmail}.`,
      });
      setNewAdminName('');
      setNewAdminEmail('');
      setNewAdminPassword('');
      setNewAdminPhone('');
    } catch (err) {
      setFeedbackMsg({
        type: 'error',
        text: err.message || 'Failed to create admin.',
      });
    }
  };

  return (
    <div className="space-y-4">
      <Card className="rounded-none border border-[#D7E6DD] bg-white shadow-xs">
        <CardHeader className="p-5 border-b border-[#D7E6DD]/60">
          <CardTitle className="text-base text-[#1F3D2C] flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-[#1F3D2C]" />
            <span>Add Administrator</span>
          </CardTitle>
          <CardDescription className="text-xs text-[#4B5563] mt-1">
            Create another administrator account to manage crops, estates, and owners.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-5">
          <form onSubmit={handleCreateSecondaryAdmin} className="space-y-4 max-w-xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-xs font-medium text-[#1F2937]">
                  Full Name *
                </Label>
                <Input
                  type="text"
                  placeholder="Admin Name"
                  value={newAdminName}
                  onChange={(e) => setNewAdminName(e.target.value)}
                  required
                  className="rounded-none border-[#D7E6DD] text-xs h-9"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-medium text-[#1F2937]">
                  Email Address *
                </Label>
                <Input
                  type="email"
                  placeholder="admin@estate360.lk"
                  value={newAdminEmail}
                  onChange={(e) => setNewAdminEmail(e.target.value)}
                  required
                  className="rounded-none border-[#D7E6DD] text-xs h-9"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-xs font-medium text-[#1F2937]">
                  Password *
                </Label>
                <Input
                  type="password"
                  placeholder="At least 6 characters"
                  value={newAdminPassword}
                  onChange={(e) => setNewAdminPassword(e.target.value)}
                  required
                  className="rounded-none border-[#D7E6DD] text-xs h-9"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-medium text-[#1F2937]">
                  Phone (Optional)
                </Label>
                <Input
                  type="tel"
                  placeholder="+94 77 000 0000"
                  value={newAdminPhone}
                  onChange={(e) => setNewAdminPhone(e.target.value)}
                  className="rounded-none border-[#D7E6DD] text-xs h-9"
                />
              </div>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                className="rounded-none bg-[#1F3D2C] hover:bg-[#162D20] text-white text-xs h-9 px-6 cursor-pointer"
              >
                Create Admin Account
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
