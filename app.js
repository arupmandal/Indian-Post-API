const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware for logging requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Middleware for error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

// Middleware for adding footer message
app.use((req, res, next) => {
  const originalJson = res.json;
  res.json = function(data) {
    if (data) {
      data.footer = "API Made with ❤️|by Arup Mandal";
    }
    originalJson.call(this, data);
  };
  next();
});

// Endpoint for searching by Postal PIN Code
app.get('/searchByPin/:pincode', async (req, res, next) => {
  try {
    const { pincode } = req.params;
    if (!/^\d{6}$/.test(pincode)) {
      throw new Error('Invalid PIN code format');
    }
    const response = await axios.get(`https://api.postalpincode.in/pincode/${pincode}`);
    const data = response.data;
    res.json(data);
  } catch (error) {
    next(error);
  }
});

// Endpoint for searching by Post Office branch name
app.get('/searchByBranch/:branchName', async (req, res, next) => {
  try {
    const { branchName } = req.params;
    if (!branchName || typeof branchName !== 'string') {
      throw new Error('Invalid branch name');
    }
    const response = await axios.get(`https://api.postalpincode.in/postoffice/${branchName}`);
    const data = response.data;
    res.json(data);
  } catch (error) {
    next(error);
  }
});

// Not found middleware
app.use((req, res, next) => {
  res.status(404).json({ message: 'Not Found' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
