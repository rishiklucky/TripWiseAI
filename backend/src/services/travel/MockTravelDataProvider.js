class MockTravelDataProvider {
  static getMockWeather(destination, durationDays) {
    const conditions = ['Sunny ☀️', 'Partly Cloudy ⛅', 'Clear Sky 🌤️', 'Breezy 🍃', 'Mild Warm 🔥'];
    const weatherData = [];
    for (let i = 1; i <= durationDays; i++) {
      const condition = conditions[(i - 1) % conditions.length];
      weatherData.push({
        dayNumber: i,
        tempC: Math.floor(Math.random() * 8) + 25,
        condition,
        icon: condition.includes('Sunny') ? '01d' : '02d',
        chanceOfRain: `${(Math.random() * 15).toFixed(0)}%`,
        priceType: 'estimated',
      });
    }
    return weatherData;
  }

  static getMockHotels(destination, budget, currency = 'INR') {
    const isINR = currency === 'INR';
    const base = isINR ? 2500 : 40;

    return [
      {
        name: `Grand Stay Resort ${destination}`,
        rating: 4.8,
        location: `Central ${destination}`,
        pricePerNight: Math.round(base * 1.8),
        totalPrice: Math.round(base * 1.8 * 3),
        currency,
        amenities: ['Free WiFi', 'Swimming Pool', 'Breakfast Included', 'Air Conditioning'],
        distanceFromCenter: '1.2 km from center',
        source: 'Mock Hotel Data',
        priceType: 'estimated',
        imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80',
      },
      {
        name: `Boutique Haven ${destination}`,
        rating: 4.5,
        location: `Old Town, ${destination}`,
        pricePerNight: Math.round(base * 1.2),
        totalPrice: Math.round(base * 1.2 * 3),
        currency,
        amenities: ['Free WiFi', 'Breakfast Included', 'Rooftop Bar'],
        distanceFromCenter: '2.5 km from center',
        source: 'Mock Hotel Data',
        priceType: 'estimated',
        imageUrl: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80',
      },
      {
        name: `Backpackers Eco Hostel ${destination}`,
        rating: 4.2,
        location: `Arts District, ${destination}`,
        pricePerNight: Math.round(base * 0.5),
        totalPrice: Math.round(base * 0.5 * 3),
        currency,
        amenities: ['Free WiFi', 'Shared Kitchen', 'Social Lounge', 'Lockers'],
        distanceFromCenter: '0.8 km from center',
        source: 'Mock Hotel Data',
        priceType: 'estimated',
        imageUrl: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=600&q=80',
      },
    ];
  }

  static getMockTransport(origin, destination, currency = 'INR') {
    const isINR = currency === 'INR';
    const flightPrice = isINR ? 4500 : 75;
    const trainPrice = isINR ? 1200 : 25;
    const cabPrice = isINR ? 800 : 15;

    return [
      {
        mode: 'Flight',
        carrier: 'SkyExpress Airlines',
        estimatedPrice: flightPrice,
        currency,
        duration: '2h 15m',
        source: 'Mock Transport Data',
        priceType: 'estimated',
      },
      {
        mode: 'Train',
        carrier: 'National Railways Express',
        estimatedPrice: trainPrice,
        currency,
        duration: '8h 30m',
        source: 'Mock Transport Data',
        priceType: 'estimated',
      },
      {
        mode: 'Cab / Private Rental',
        carrier: 'City Intercity Cabs',
        estimatedPrice: cabPrice,
        currency,
        duration: 'Flex (Local)',
        source: 'Mock Transport Data',
        priceType: 'estimated',
      },
    ];
  }

  static getMockAttractions(destination) {
    return [
      { name: `${destination} Historic Heritage Center`, category: 'History & Culture', estCost: 200 },
      { name: `Scenic Viewpoint & Sunset Point`, category: 'Nature & Views', estCost: 0 },
      { name: `Famous Local Culinary Street Market`, category: 'Food & Shopping', estCost: 500 },
      { name: `${destination} Botanical Gardens`, category: 'Nature & Relaxation', estCost: 150 },
      { name: `Adventure Activity & River Cruise`, category: 'Adventure & Fun', estCost: 1200 },
    ];
  }
}

module.exports = MockTravelDataProvider;
