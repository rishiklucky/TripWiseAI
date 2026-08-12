import React, { createContext, useState } from 'react';

export const TripContext = createContext();

export const TripProvider = ({ children }) => {
  const [activeTrip, setActiveTrip] = useState(null);
  const [draftWizard, setDraftWizard] = useState({
    origin: 'Hyderabad, India',
    destination: 'Goa, India',
    startDate: new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0],
    endDate: new Date(Date.now() + 86400000 * 12).toISOString().split('T')[0],
    travelers: { adults: 2, children: 0, infants: 0 },
    budget: 30000,
    currency: 'INR',
    travelStyle: 'Standard',
    pace: 'Balanced',
    interests: ['Beaches', 'Food', 'Culture', 'Sunset Spots'],
    foodPreference: 'No Preference',
    accommodationPreference: 'Hotel',
    transportationPreference: 'No Preference',
    mustVisit: ['Baga Beach', 'Fort Aguada'],
    placesToAvoid: [],
    specialOccasion: 'Normal Trip',
    accessibilityRequirements: [],
    additionalNotes: 'Looking for romantic beach views and relaxed vibes.',
  });

  return (
    <TripContext.Provider
      value={{
        activeTrip,
        setActiveTrip,
        draftWizard,
        setDraftWizard,
      }}
    >
      {children}
    </TripContext.Provider>
  );
};
