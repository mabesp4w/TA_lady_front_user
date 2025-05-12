/** @format */
// src/components/facilities/FacilityFeatures.tsx
import { Check } from "lucide-react";
import Card from "@/components/ui/Card";

interface FeatureItem {
  title: string;
  description?: string;
}

interface FacilityFeaturesProps {
  features: FeatureItem[];
}

export default function FacilityFeatures({ features }: FacilityFeaturesProps) {
  if (!features.length) return null;

  return (
    <Card>
      <h2 className="text-lg font-bold mb-4">Fitur Fasilitas</h2>
      <ul className="space-y-3">
        {features.map((feature, index) => (
          <li key={index} className="flex">
            <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <Check size={14} />
            </div>
            <div className="ml-3">
              <p className="text-gray-800 font-medium">{feature.title}</p>
              {feature.description && (
                <p className="text-gray-600 text-sm mt-1">
                  {feature.description}
                </p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}
