import { memo } from 'react'

const DynamicIcon = memo(({ iconMap, iconKey, className = 'w-6 h-6 text-primary-500' }) => {
  const Icon = iconMap?.[iconKey]
  if (!Icon) return null
  return <Icon className={className} />
})

DynamicIcon.displayName = 'DynamicIcon'
export default DynamicIcon
