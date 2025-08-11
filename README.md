# Tampa Bay Rays Digital Prize Wheel

A professional digital prize wheel application for the Tampa Bay Rays with participant tracking and customizable prize icons.

## Features

- **Entry Form**: Captures participant information for marketing purposes
- **Digital Slot Machine**: Interactive 3-reel slot machine with guaranteed wins
- **Prize Management**: Configurable odds for inventory control
- **Database Tracking**: Complete participant tracking with Supabase
- **Admin Dashboard**: Analytics and participant management
- **Responsive Design**: Works on all devices

## Database Setup

1. **Connect to Supabase**: Click the "Connect to Supabase" button in the top right
2. **Run Migration**: The database table will be created automatically
3. **Environment Variables**: Will be configured automatically

## Customizing Prize Icons

### Method 1: Using Lucide React Icons (Recommended)

The current icons are from Lucide React. To change them:

1. **Browse Available Icons**: Visit [lucide.dev](https://lucide.dev) to see all available icons
2. **Update SlotMachine.tsx**: Modify the `prizeIcons` object:

```typescript
// In src/components/SlotMachine.tsx
import { Trophy, Shirt, Ticket, Percent, Gift, Star, Award, Crown } from 'lucide-react';

const prizeIcons = {
  1: { icon: Crown, color: '#F5D130', bgColor: '#092C5C' },     // Grand Prize
  2: { icon: Shirt, color: '#FFFFFF', bgColor: '#092C5C' },     // Jersey  
  3: { icon: Ticket, color: '#092C5C', bgColor: '#8FBCE6' },    // Tickets
  4: { icon: Percent, color: '#092C5C', bgColor: '#FFFFFF' },   // Discounts
  5: { icon: Star, color: '#FFFFFF', bgColor: '#4A90E2' }       // Swag Bag
};
```

### Method 2: Using Custom Images

To use custom images instead of icons:

1. **Add Images**: Place your images in the `public/images/` folder:
   - `public/images/grand-prize.png`
   - `public/images/jersey.png` 
   - `public/images/tickets.png`
   - `public/images/discount.png`
   - `public/images/swag-bag.png`

2. **Update SlotMachine.tsx**: Replace the icon rendering:

```typescript
// Replace the IconComponent rendering with:
<img 
  src={`/images/prize-${prize.id}.png`}
  alt={prize.name}
  className="w-8 h-8 md:w-12 md:h-12 mb-2 object-contain"
/>
```

### Method 3: Using Custom SVG Icons

1. **Create SVG Components**: Add custom SVG components in `src/components/icons/`
2. **Import and Use**: Import your custom icons and use them in the `prizeIcons` object

## Customizing Colors and Styling

### Prize Colors
Update colors in `src/types.ts`:

```typescript
const prizes: Prize[] = [
  {
    id: 1,
    name: 'GRAND PRIZE: 2026 SUITE NIGHT',
    color: '#F5D130',      // Background color of prize segment
    textColor: '#092C5C'   // Text color for readability
  }
];
```

### Slot Machine Styling
Modify `src/components/SlotMachine.tsx`:
- **Reel Colors**: Update `backgroundColor` in the reel rendering
- **Machine Frame**: Modify the gradient classes in the container
- **Button Styling**: Update the "PULL LEVER" button classes

## Admin Dashboard

Access participant data and analytics:
- **View All Entries**: See complete participant list
- **Export Data**: Download CSV of all participants  
- **Prize Analytics**: View distribution of prizes awarded
- **Marketing Metrics**: Track opt-in rates

## Prize Odds Configuration

Current odds (can be modified in `SlotMachine.tsx`):
- **GRAND PRIZE**: 1%
- **CITY CONNECT JERSEY**: 2% 
- **2026 TICKETS**: 5%
- **MERCH DISCOUNTS**: 90%
- **RAYS SWAG BAG**: 2%

## Development

```bash
npm run dev    # Start development server
npm run build  # Build for production
```

## Database Schema

The `participants` table tracks:
- Personal information (name, email, phone)
- Marketing opt-in status
- Prize won and timestamp
- User agent and IP (optional)

All data is stored securely with Row Level Security enabled.