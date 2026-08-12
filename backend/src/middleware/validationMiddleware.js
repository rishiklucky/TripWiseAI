const validateTripRequest = (req, res, next) => {
  const { origin, destination, startDate, endDate, budget } = req.body;

  if (!origin || typeof origin !== 'string' || !origin.trim()) {
    return res.status(400).json({ success: false, message: 'Starting location (origin) is required.' });
  }

  if (!destination || typeof destination !== 'string' || !destination.trim()) {
    return res.status(400).json({ success: false, message: 'Destination is required.' });
  }

  if (!startDate || !endDate) {
    return res.status(400).json({ success: false, message: 'Start date and end date are required.' });
  }

  if (!budget || isNaN(budget) || Number(budget) <= 0) {
    return res.status(400).json({ success: false, message: 'A valid total trip budget greater than 0 is required.' });
  }

  next();
};

const validateRegister = (req, res, next) => {
  const { name, email, password } = req.body;
  if (!name || !name.trim()) return res.status(400).json({ success: false, message: 'Name is required' });
  if (!email || !email.includes('@')) return res.status(400).json({ success: false, message: 'Valid email is required' });
  if (!password || password.length < 6) return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
  next();
};

module.exports = { validateTripRequest, validateRegister };
