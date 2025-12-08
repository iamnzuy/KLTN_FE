import { ReactNode } from 'react';
import Link from 'next/link';
import {
  BadgeInfo,
  Blocks,
  LockKeyhole,
  Moon,
  Sun,
  User,
  Settings,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Switch } from '@/components/ui/switch';
import useAuth from '@/hooks/use-auth';
import AxiosAPI from '@/lib/axios';

export function UserDropdownMenu({ trigger }: { trigger: ReactNode }) {
  const { resolvedTheme, setTheme } = useTheme();
  const { handleLogout } = useAuth();
  const handleThemeToggle = (checked: boolean) => {
    setTheme(checked ? 'dark' : 'light');
    AxiosAPI.put('/api/users/me', {
      "preferences": {theme: checked ? 'dark' : 'light'}
    })
  };
  const { profile } = useAuth();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent className="w-64" side="bottom" align="end">
        {/* Header */}
        <div className="flex items-center justify-between p-3">
          <div className="flex items-center gap-2">
            <img
              className="w-9 h-9 rounded-full border border-border"
              src={'/media/avatars/300-2.png'}
              alt="User avatar"
            />
            <div className="flex flex-col">
              <div
                className="text-sm text-mono hover:text-primary font-semibold"
              >
                {profile.username}
              </div>
              {/* <Link
                href={`mailto:${profile.email}`}
                className="text-xs text-muted-foreground hover:text-primary"
              >
                {profile.email}
              </Link> */}
              <div
                className="text-xs text-muted-foreground hover:text-primary"
              >
                {profile.email}
              </div>
            </div>
          </div>
          {/* <Badge variant="primary" appearance="outline" size="sm">
            Pro
          </Badge> */}
        </div>

        <DropdownMenuSeparator />

        {/* Menu Items */}
        <DropdownMenuItem asChild>
          <Link
            href="/my-profile"
            className="flex items-center gap-2"
          >
            <User />
            My Profile
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link
            href="/account/settings"
            className="flex items-center gap-2"
          >
            <Settings />
            Settings
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link
            href="/account/billing"
            className="flex items-center gap-2"
          >
            <BadgeInfo />
            Billing
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link
            href="/account/security"
            className="flex items-center gap-2"
          >
           <LockKeyhole />
            Security
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link
            href="/account/integrations"
            className="flex items-center gap-2"
          >
            <Blocks />
            Integrations
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Footer */}
        <DropdownMenuItem
          className="flex items-center gap-2"
          onSelect={(event) => event.preventDefault()}
        >
          {resolvedTheme === 'dark' ? (
            <Sun />
          ) : (
            <Moon />
          )}
          <div className="flex items-center gap-2 justify-between grow">
            {resolvedTheme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            <Switch
              size="sm"
              checked={resolvedTheme === 'dark'}
              onCheckedChange={handleThemeToggle}
            />
          </div>
        </DropdownMenuItem>
        <div className="p-2 mt-1">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => handleLogout()}
          >
            Logout
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
