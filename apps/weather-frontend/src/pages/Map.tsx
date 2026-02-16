import { useNavigate } from "react-router";
import { ArrowLeft, Map as MapIcon } from "lucide-react";
import { Button } from "../components/ui/button";
import { Alert, AlertDescription } from "../components/ui/alert";

export function Map() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Button onClick={() => navigate("/")} variant="ghost" className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>

        <h1 className="text-3xl mb-8">Temperature Map</h1>

        <Alert>
          <MapIcon className="h-4 w-4" />
          <AlertDescription>
            <p className="mb-4">
              This feature is prepared for future scaling. The map will display
              temperature information per grid using the NWS gridpoint data.
            </p>
            <div className="space-y-2 text-sm">
              <p>
                <strong>Planned Features:</strong>
              </p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Interactive map showing temperature grids</li>
                <li>Color-coded temperature zones</li>
                <li>Real-time weather data overlay</li>
                <li>Click on grid to see detailed forecast</li>
                <li>Integration with NWS gridpoint API</li>
              </ul>
              <p className="mt-4">
                To implement this feature, you can integrate libraries like
                Leaflet or Mapbox with the gridpoint data from your NestJS
                backend.
              </p>
            </div>
          </AlertDescription>
        </Alert>

        <div className="mt-8 bg-muted rounded-lg h-[500px] flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <MapIcon className="h-16 w-16 mx-auto mb-4 opacity-20" />
            <p>Map visualization will be implemented here</p>
          </div>
        </div>
      </div>
    </div>
  );
}
