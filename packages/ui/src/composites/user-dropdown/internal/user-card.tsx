import { forwardRef } from 'react'
import { cn } from '../../../lib/cn'
import type { UserDropdownUser } from '../user-dropdown.types'

interface UserCardProps {
  user: UserDropdownUser
  collapsed?: boolean
  open?: boolean
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export const UserCard = forwardRef<HTMLButtonElement, UserCardProps>(
  ({ user, collapsed, open, onClick }, ref) => {
    const initials = getInitials(user.name) || 'U'

    return (
      <button
        ref={ref}
        type="button"
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label={collapsed ? user.name : undefined}
        data-slot="user-card-trigger"
        className={cn(
          'flex items-center gap-3 px-3 py-2 bg-transparent cursor-pointer w-full text-left text-foreground font-[inherit] rounded-[4px] transition-colors duration-100 min-h-[44px]',
          collapsed && 'justify-center px-[6px] gap-0',
          open
            ? 'bg-[var(--win11-hover,hsl(var(--accent)))]'
            : 'hover:bg-[var(--win11-hover,hsl(var(--accent)))]',
        )}
        onClick={onClick}
      >
        {user.avatar ? (
          <img
            src={user.avatar}
            alt=""
            aria-hidden
            className={cn(
              'rounded-full object-cover border border-[var(--win11-card-border,var(--border))] shrink-0 select-none',
              collapsed ? 'w-7 h-7' : 'w-8 h-8',
            )}
          />
        ) : (
          <div
            className={cn(
              'rounded-full flex items-center justify-center font-bold text-primary-foreground shrink-0 select-none',
              collapsed ? 'w-7 h-7 text-[10px]' : 'w-8 h-8 text-xs',
            )}
            style={{
              background:
                'linear-gradient(135deg, color-mix(in srgb, var(--primary) 60%, transparent), var(--primary))',
            }}
            aria-hidden
          >
            {initials}
          </div>
        )}

        {!collapsed && (
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate leading-[1.2]">
              {user.name}
            </p>
            {user.email && (
              <p className="text-xs text-muted-foreground truncate leading-[1.3]">
                {user.email}
              </p>
            )}
          </div>
        )}
      </button>
    )
  },
)

UserCard.displayName = 'UserCard'
