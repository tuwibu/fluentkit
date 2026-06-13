export interface SegmentedControlOption<T extends string = string> {
  label: string
  value: T
}

export interface SegmentedControlProps<T extends string = string> {
  options: readonly SegmentedControlOption<T>[]
  value: T
  onChange: (value: T) => void
  size?: 'sm' | 'md'
  'aria-label'?: string
  disabled?: boolean
}
