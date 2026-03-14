'use client';

import { useState, useEffect, useRef } from 'react';
import { AppHeader } from '@/components/app/app-header';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Camera, Video, VideoOff } from 'lucide-react';

export default function MeasurePage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Clean up stream on component unmount
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const getCameraPermission = async () => {
    if (!('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices)) {
      toast({
        variant: 'destructive',
        title: 'Camera Not Supported',
        description: 'Your browser does not support camera access.',
      });
      setHasCameraPermission(false);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setHasCameraPermission(true);
      setIsCameraOn(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      setHasCameraPermission(false);
      setIsCameraOn(false);
      toast({
        variant: 'destructive',
        title: 'Camera Access Denied',
        description: 'Please enable camera permissions in your browser settings.',
      });
    }
  };

  const toggleCamera = () => {
    if (isCameraOn) {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
      setIsCameraOn(false);
    } else {
      getCameraPermission();
    }
  };

  return (
    <>
      <AppHeader title="Camera Measurement" />
      <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold md:text-2xl font-headline">Measurement Grid</h1>
          <Button onClick={toggleCamera} variant="outline" size="icon">
            {isCameraOn ? <VideoOff /> : <Video />}
            <span className="sr-only">{isCameraOn ? 'Turn off camera' : 'Turn on camera'}</span>
          </Button>
        </div>

        <div className="relative aspect-video w-full max-w-4xl mx-auto rounded-lg overflow-hidden border bg-muted">
          <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
          
          {isCameraOn && (
            <div className="absolute inset-0 pointer-events-none">
              {/* Grid Overlay */}
              <div className="absolute inset-0 grid grid-cols-4 grid-rows-4">
                {[...Array(16)].map((_, i) => (
                  <div key={i} className="border border-white/20"></div>
                ))}
              </div>
              {/* Center Lines */}
              <div className="absolute top-0 bottom-0 left-1/2 w-px bg-red-500/70"></div>
              <div className="absolute left-0 right-0 top-1/2 h-px bg-red-500/70"></div>
            </div>
          )}

          {!isCameraOn && (
             <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
              <Camera className="w-16 h-16 text-muted-foreground" />
              <p className="text-muted-foreground">Camera is off</p>
              <Button onClick={getCameraPermission}>Turn on Camera</Button>
            </div>
          )}
        </div>

        {hasCameraPermission === false && (
          <Alert variant="destructive" className="max-w-4xl mx-auto">
            <AlertTitle>Camera Access Required</AlertTitle>
            <AlertDescription>
              To use this feature, please allow camera access in your browser settings and refresh the page.
            </AlertDescription>
          </Alert>
        )}

         <div className="max-w-4xl mx-auto text-center text-sm text-muted-foreground mt-4">
          <p>For best results, stand in a well-lit area. Use the grid to align your body with the center lines. Ensure your entire body is visible within the frame.</p>
        </div>
      </main>
    </>
  );
}
