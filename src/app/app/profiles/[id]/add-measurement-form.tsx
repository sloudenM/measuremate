'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PlusCircle } from 'lucide-react';
import { measurementLabels } from '@/lib/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export function AddMeasurementForm() {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Here you would typically handle form submission, e.g., send data to a server.
    // For this example, we'll just show a toast and close the dialog.
    toast({
      title: 'Success!',
      description: 'New measurements have been added.',
    });
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Measurement
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Measurement</DialogTitle>
          <DialogDescription>
            Enter the new measurements below. Leave fields blank if not
            applicable.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <ScrollArea className="h-96 pr-6">
            <div className="grid gap-4 py-4">
              {Object.entries(measurementLabels).map(([key, label]) => (
                <div className="grid grid-cols-4 items-center gap-4" key={key}>
                  <Label htmlFor={key} className="text-right col-span-2">
                    {label}
                  </Label>
                  <Input
                    id={key}
                    name={key}
                    type="number"
                    step="0.1"
                    className="col-span-2"
                  />
                </div>
              ))}
            </div>
          </ScrollArea>
          <DialogFooter>
            <Button type="submit">Save Measurements</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
