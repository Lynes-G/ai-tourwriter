"use client";

import { Header } from "@/components";
import { ComboBoxComponent } from "@syncfusion/ej2-react-dropdowns";
import { useState } from "react";
import { useCountries } from "@/hooks/useCountries";
import Image from "next/image";
import { comboBoxItems, selectItems } from "@/constants";
import { cn, formatKey } from "@/lib/utils";
import {
  LayerDirective,
  LayersDirective,
  MapsComponent,
} from "@syncfusion/ej2-react-maps";
import { world_map } from "@/constants/world_map";
import { ButtonComponent } from "@syncfusion/ej2-react-buttons";
import { account } from "@/appwrite/client";
import { useRouter } from "next/navigation";

export default function CreateTips() {
  const router = useRouter();
  const [selectedCountry, setSelectedCountry] = useState<string>("");

  const {
    countries,
    loading: countriesLoading,
    error: countriesError,
  } = useCountries();

  const [formData, setFormData] = useState<TripFormData>({
    country: countries[0]?.name || "",
    travelStyle: "",
    interest: "",
    budget: "",
    duration: 0,
    groupType: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const mapData = [
    {
      country: formData.country,
      color: "#EA382E",
      coordinates: countries.find((c: Country) => c.name === formData.country)
        ?.coordinates || [0, 0],
    },
  ];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    if (
      !formData.country ||
      !formData.groupType ||
      !formData.travelStyle ||
      !formData.interest ||
      !formData.budget
    ) {
      setError("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    if (formData.duration < 1 || formData.duration > 30) {
      setError("Duration must be between 1 and 30 days.");
      setLoading(false);
      return;
    }

    const user = await account.get();
    if (!user.$id) {
      setError("You must be logged in to create a trip.");
      setLoading(false);
      return;
    }
    try {
      setError(null); // Clear any previous errors
      setSuccessMessage(null); // Clear any previous success messages

      const response = await fetch("/api/create-trip", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          country: formData.country,
          numberOfDays: formData.duration,
          travelStyle: formData.travelStyle,
          interest: formData.interest,
          budget: formData.budget,
          groupType: formData.groupType,
          userId: user.$id,
        }),
      });

      console.log("API Response status:", response.status);
      console.log("API Response ok:", response.ok);

      const result = await response.json();
      console.log("API Response result:", result);

      if (!response.ok) {
        console.error("API Error:", result);
        setError(
          result.message ||
            result.error ||
            "Failed to generate trip. Please try again later.",
        );
        setLoading(false);
        return;
      }
      if (result?.id) {
        // Success! Show success message and redirect
        console.log("Trip created successfully with ID:", result.id);
        setSuccessMessage(
          "Trip created successfully! Redirecting to trip details...",
        );

        // Add a small delay to show the success message
        setTimeout(() => {
          router.push(`/trips/${result.id}`);
        }, 1500);
      } else {
        console.error("API returned success but no trip ID:", result);
        setError(
          "Trip was created but couldn't get the trip details. Please check your trips page.",
        );
        setLoading(false);
      }
    } catch (err) {
      console.error("Error creating trip:", err);
      setError("Failed to generate trip. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const itemTemplate = (data: any) => {
    if (!data) return null;
    return (
      <div className="flex items-center gap-1.5 px-4">
        {data.flag && (
          <Image
            src={data.flagSvg || data.flag}
            alt={data.flagAlt}
            height={34}
            width={34}
            className="aspect-square size-6 rounded-full object-cover"
            onError={(e) => {
              // Fallback to emoji flag if image fails
              const target = e.target as HTMLImageElement;
              target.style.display = "none";
              const span = document.createElement("span");
              span.textContent = data.flag || "";
              span.className = "text-sm";
              target.parentNode?.insertBefore(span, target);
            }}
          />
        )}
        <span>{data.name}</span>
      </div>
    );
  };

  const handleChange = (key: keyof TripFormData, value: string | number) => {
    setFormData({ ...formData, [key]: value });
  };

  return (
    <main className="wrapper flex flex-col gap-10 pb-20">
      <Header
        title="Add a new trip"
        description="View and edit AI generated travel plans"
      />
      <section className="wrapper-md mt-2.5">
        <form className="trip-form" onSubmit={handleSubmit}>
          {/* Country */}
          <div>
            <label htmlFor="country">Country</label>
            {countriesLoading ? (
              <div className="p-2 text-gray-600">Loading countries...</div>
            ) : countriesError ? (
              <div className="p-2 text-red-500">
                Error loading countries: {countriesError}
              </div>
            ) : (
              <ComboBoxComponent
                id="country"
                dataSource={countries as any}
                fields={{ text: "name", value: "value" }}
                placeholder="Select a country"
                allowFiltering={true}
                filterType="Contains"
                ignoreCase={true}
                change={(e: { value: string | undefined }) => {
                  if (e.value) {
                    handleChange("country", e.value);
                  }
                }}
                value={selectedCountry}
                noRecordsTemplate="No countries found"
                actionFailureTemplate="Failed to load countries"
                showClearButton={true}
                readonly={false}
                itemTemplate={itemTemplate}
                // floatLabelType="Auto"
                className="combo-box"
              />
            )}
          </div>
          {/* Duration */}
          <div>
            <label htmlFor="duration">Duration</label>
            <input
              id="duration"
              name="duration"
              type="number"
              placeholder="Enter number of days (5, 12, ....)"
              className="form-input"
              onChange={(e) => handleChange("duration", Number(e.target.value))}
            />
          </div>
          {/* Select Items */}
          {selectItems.map((key) => (
            <div key={key}>
              <label htmlFor={key}>{formatKey(key)}</label>
              <ComboBoxComponent
                id={key}
                dataSource={comboBoxItems[key].map((item) => ({
                  text: item,
                  value: item,
                }))}
                fields={{ text: "text", value: "value" }}
                placeholder={`Select ${formatKey(key)}`}
                change={(e: { value: string | undefined }) => {
                  if (e.value) {
                    handleChange(key, e.value);
                  }
                }}
                allowFiltering={true}
                filterType="Contains"
                ignoreCase={true}
                noRecordsTemplate="No options found"
                actionFailureTemplate="Failed to load options"
                showClearButton={true}
                readonly={false}
                className="combo-box"
              />
            </div>
          ))}
          {/* Map */}
          <div>
            <label htmlFor="location">Location on the map</label>
            <MapsComponent>
              <LayersDirective>
                <LayerDirective
                  dataSource={mapData}
                  shapeData={world_map}
                  shapePropertyPath="name"
                  shapeSettings={{ colorValuePath: "color", fill: "#E5E5E5" }}
                  shapeDataPath="country"
                />
              </LayersDirective>
            </MapsComponent>
          </div>{" "}
          {/* Seperator */}
          <div className="h-px w-full bg-gray-200" />
          {/* Success Message */}
          {successMessage && (
            <div className="success rounded-lg border border-green-200 bg-green-50 p-4">
              <p className="font-medium text-green-700">{successMessage}</p>
            </div>
          )}
          {/* Error Message */}
          {error && (
            <div className="error">
              <p>{error}</p>
            </div>
          )}
          {/* Submit Button */}
          <footer className="w-full px-6">
            <ButtonComponent
              type="submit"
              className="button-class !h-11 !w-full"
              disabled={loading}
            >
              <Image
                src={`/icons/${loading ? "loader" : "magic-star"}.svg`}
                alt="Submit Icon"
                width={24}
                height={24}
                className={cn("size-5", loading ? "animate-spin" : "")}
              />
              <span className="p-16-semibold text-white">
                {loading ? "Generating trip..." : "Generate Trip"}
              </span>
            </ButtonComponent>
          </footer>
        </form>
      </section>
    </main>
  );
}
