// Theme
export { ThemeProvider, useTheme } from './theme/theme-provider'
export { ColorThemeProvider, useColorTheme } from './theme/color-theme-provider'
export type { LightTheme, DarkTheme } from './theme/color-theme-provider'
export {
  lightThemeOptions,
  darkThemeOptions,
  lightThemeConfigs,
  darkThemeConfigs,
} from './theme/presets'

// Placeholder (existing — do not remove)
export { Placeholder } from './placeholder'
export type { PlaceholderProps } from './placeholder'

// Lib utils
export { cn } from './lib/cn'
export { cx } from './lib/cx'
export { getTagColor } from './lib/tag-color'

// Primitives — non-interactive
export { Label } from './primitives/label'
export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
} from './primitives/card'
export { Badge, badgeVariants } from './primitives/badge'
export { Tag } from './primitives/tag'
export type { TagProps, TagVariant } from './primitives/tag'
export { Separator } from './primitives/separator'
export { Skeleton } from './primitives/skeleton'

// Primitives — interactive
export { Button, buttonVariants } from './primitives/button'
// Note: primitive Input is internal — the facade `Input` (composite) is the public API.
// Import primitive directly from './primitives/input' if building other composites.
export { Textarea } from './primitives/textarea'
export { Checkbox } from './primitives/checkbox'
export { Switch } from './primitives/switch'

// Primitives — overlay / compound
export {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverAnchor,
} from './primitives/popover'
export {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from './primitives/tooltip'
// Note: primitive radix Select compound parts are internal building blocks.
// The facade `Select` (composite) is the public API for consumers.
// Import from './primitives/select' directly to build other composites.
export { Tabs, TabsList, TabsTrigger, TabsContent } from './primitives/tabs'
export {
  DropdownMenu,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from './primitives/dropdown-menu'
export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
} from './primitives/sheet'

// Composites — public type contracts (Phase 4)
export type {
  ColumnDef,
  DataTableProps,
  PaginationConfig,
  ExpandableConfig,
  RowSelectionConfig,
  ScrollConfig,
} from './composites/data-table/data-table.types'
export { DataTable } from './composites/data-table/data-table'

export type { ModalProps, ConfirmOptions, ModalImperativeApi } from './composites/modal/modal.types'
export { Modal, modal } from './composites/modal/modal'

export type { InputProps, InputSize, InputStatus } from './composites/input/input.types'
// Facade `Input` is the public API — replaces the primitive Input in the barrel.
export { InputComposite as Input } from './composites/input/input-composite'

export type { SelectProps, SelectOption } from './composites/select/select.types'
// Facade `Select` is the public API — replaces the primitive Select compound in the barrel.
export { SelectComposite as Select } from './composites/select/select-composite'

export type { FormFieldProps } from './composites/form-field/form-field.types'
export { FormField } from './composites/form-field/form-field'
export { useFormField } from './composites/form-field/form-field-context'

export type {
  MenuLeaf,
  MenuGroup,
  MenuItem,
  SidebarBrand,
  SidebarProps,
} from './composites/sidebar/sidebar.types'
export { isGroup } from './composites/sidebar/sidebar.types'
export { Sidebar } from './composites/sidebar/sidebar'

export type {
  SegmentedControlOption,
  SegmentedControlProps,
} from './composites/segmented-control/segmented-control.types'
export { SegmentedControl } from './composites/segmented-control/segmented-control'

export type { DetailDrawerProps } from './composites/detail-drawer/detail-drawer.types'
export { DetailDrawer } from './composites/detail-drawer/detail-drawer'

export type { HeaderProps } from './composites/header/header.types'
export { Header } from './composites/header/header'

export type {
  DateRangeValue,
  DateRangePopoverProps,
} from './composites/date-range-popover/date-range-popover.types'
export { DateRangePopover } from './composites/date-range-popover/date-range-popover'

export type { UserDropdownProps, UserDropdownUser } from './composites/user-dropdown/user-dropdown.types'
export { UserDropdown } from './composites/user-dropdown/user-dropdown'

export type { AppShellProps } from './composites/app-shell/app-shell.types'
export { AppShell } from './composites/app-shell/app-shell'
export { AppShellProvider, useAppShell } from './composites/app-shell/app-shell-context'

export type { BulkAction, BulkBarProps } from './composites/bulk-bar/bulk-bar.types'
export { BulkBar } from './composites/bulk-bar/bulk-bar'

export type {
  DrawerSectionProps,
  DrawerInfoRowProps,
} from './composites/drawer-section/drawer-section.types'
export { DrawerSection } from './composites/drawer-section/drawer-section'
export { DrawerInfoRow } from './composites/drawer-section/drawer-info-row'

export type { IconButtonProps } from './composites/icon-button/icon-button.types'
export { IconButton } from './composites/icon-button/icon-button'

export type { PaginationProps } from './composites/pagination/pagination.types'
export { Pagination } from './composites/pagination/pagination'

export type { AvatarProps, AvatarSize } from './composites/avatar/avatar.types'
export { Avatar } from './composites/avatar/avatar'

export type { FilterSelectProps } from './composites/filter-select/filter-select.types'
export { FilterSelect } from './composites/filter-select/filter-select'

export type {
  StatCardProps,
  StatCardTone,
  StatCardVariant,
  StatCardDelta,
  StatCardSkeletonProps,
} from './composites/stat-card/stat-card.types'
export { StatCard, StatCardSkeleton } from './composites/stat-card/stat-card'
