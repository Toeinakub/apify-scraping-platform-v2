"use client";
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';

const STORAGE_KEY = 'mock_user';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);

  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
      if (user?.email) setEmail(user.email);
    } catch {}
  }, []);

  const login = () => {
    if (!email || !password) {
      alert('Please enter email and password');
      return;
    }
    const user = { email, remember };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    router.push('/mock');
  };

  return (
    <div className="max-w-md mx-auto">
      <Card className="p-6 space-y-4">
        <h1 className="text-2xl font-bold">Login</h1>
        <div className="space-y-2">
          <Label>Email</Label>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
        </div>
        <div className="space-y-2">
          <Label>Password</Label>
          <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <div className="flex items-center gap-2">
          <input id="remember" type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="h-4 w-4 rounded border" />
          <Label htmlFor="remember" className="text-sm">Remember me</Label>
        </div>
        <Button onClick={login} className="w-full">Login</Button>
      </Card>
    </div>
  );
}