import { ReactNode } from 'react';
import Link from 'next/link';
import {
  Moon,
  Sun,
  User,
} from 'lucide-react';
import { useTheme } from 'next-themes';
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
            <Link href="/account/settings" className="flex flex-col">
              <div
                className="text-sm text-mono hover:text-primary font-semibold"
              >
                {profile.username}
              </div>
              <div
                className="text-xs text-muted-foreground hover:text-primary"
              >
                {profile.email}
              </div>
            </Link>
          </div>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link
            href="/account/settings"
            className="flex items-center gap-2"
          >
            <User />
            Hồ sơ của tôi
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
            {resolvedTheme === 'dark' ? 'Chế độ sáng' : 'Chế độ tối'}
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
            Đăng xuất
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
