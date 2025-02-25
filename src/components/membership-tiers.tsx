import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { MembershipTier } from '@prisma/client';

interface MembershipTierProps {
  tiers: MembershipTier[];
  onSelect: (tierId: string) => void;
  selectedTierId?: string;
}

export function MembershipTiers({ tiers, onSelect, selectedTierId }: MembershipTierProps) {
  return (
    <div className="grid md:grid-cols-3 gap-6">
      {tiers.map((tier) => (
        <Card key={tier.id} className={`relative ${selectedTierId === tier.id ? 'border-primary' : ''}`}>
          <CardHeader>
            <CardTitle>{tier.name}</CardTitle>
            <p className="text-2xl font-bold">৳{tier.amount}</p>
            <p className="text-sm text-muted-foreground">
              {tier.period === 'ONE_TIME' ? 'One-time payment' : `per ${tier.period.toLowerCase()}`}
            </p>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">{tier.description}</p>
            <ul className="space-y-2">
              {tier.benefits.map((benefit, index) => (
                <li key={index} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span className="text-sm">{benefit}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={() => onSelect(tier.id)} 
              variant={selectedTierId === tier.id ? "default" : "outline"}
              className="w-full"
            >
              {selectedTierId === tier.id ? 'Selected' : 'Select Plan'}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}