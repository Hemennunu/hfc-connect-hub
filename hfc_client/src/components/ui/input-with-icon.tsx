import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputWithIconProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
}

const InputWithIcon = React.forwardRef<HTMLInputElement, InputWithIconProps>(
  ({ className, type, icon, iconPosition = 'left', ...props }, ref) => {
    const iconSize = '1.25rem'; // Size of the icon
    const iconSpacing = '1.5rem'; // Increased space between icon and text
    const basePadding = '1rem'; // Increased base padding for the input
    const iconContainerWidth = '2.5rem'; // Fixed width for the icon container
    
    // Calculate total padding needed on the side with the icon
    const iconPadding = iconContainerWidth;
    
    return (
      <div className="relative w-full">
        {icon && iconPosition === 'left' && (
          <div 
            className="absolute left-0 top-0 h-full flex items-center justify-center text-muted-foreground"
            style={{
              width: iconContainerWidth,
              pointerEvents: 'none'
            }}
          >
            {icon}
          </div>
        )}
        <input
          type={type}
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            className
          )}
          style={{
            paddingLeft: icon && iconPosition === 'left' ? iconPadding : basePadding,
            paddingRight: icon && iconPosition === 'right' ? iconPadding : basePadding,
            paddingTop: '0.5rem',
            paddingBottom: '0.5rem',
            height: '2.5rem'
          }}
          ref={ref}
          {...props}
        />
        {icon && iconPosition === 'right' && (
          <div 
            className="absolute right-0 top-0 h-full flex items-center justify-center text-muted-foreground"
            style={{
              width: iconContainerWidth,
              pointerEvents: 'none'
            }}
          >
            {icon}
          </div>
        )}
      </div>
    )
  }
)
InputWithIcon.displayName = "InputWithIcon"

export { InputWithIcon }
