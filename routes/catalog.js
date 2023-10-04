import express from 'express';
const router = express.Router();

/// Category Routes ///

// GET request to the homepage
router.get('/', (req, res) => {
  res.send('GET request to the homepage')
})

/// Item Routes ///

export default router;
