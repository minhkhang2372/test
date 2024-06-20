const express = require('express');
const axios = require('axios');
const rateLimit = require('express-rate-limit');
const app = express();
const port = process.env.PORT || 3000; // Sử dụng biến môi trường PORT nếu có

// Cấu hình rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 phút
  max: 100 // giới hạn mỗi IP có thể gửi 100 yêu cầu mỗi 15 phút
});

app.use(limiter);

// Danh sách các User-Agents
const userAgents = [
    // Chrome trên Windows
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.128 Safari/537.36',
  
    // Firefox trên Windows
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:88.0) Gecko/20100101 Firefox/88.0',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:87.0) Gecko/20100101 Firefox/87.0',
  
    // Safari trên macOS
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Safari/605.1.15',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.2 Safari/605.1.15',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.1.2 Safari/605.1.15',
  
    // Chrome trên macOS
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.128 Safari/537.36',
  
    // Edge trên Windows
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 Edg/91.0.864.64',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36 Edg/90.0.818.66',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.128 Safari/537.36 Edg/89.0.774.68',
  
    // Safari trên iOS
    'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1',
    'Mozilla/5.0 (iPad; CPU OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 13_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0 Mobile/15E148 Safari/604.1',
  
    // Chrome trên Android
    'Mozilla/5.0 (Linux; Android 11; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Mobile Safari/537.36',
    'Mozilla/5.0 (Linux; Android 10; SM-G973F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Mobile Safari/537.36',
    'Mozilla/5.0 (Linux; Android 9; SM-G960F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.128 Mobile Safari/537.36',
  
    // Firefox trên Android
    'Mozilla/5.0 (Android 11; Mobile; rv:89.0) Gecko/89.0 Firefox/89.0',
    'Mozilla/5.0 (Android 10; Mobile; rv:88.0) Gecko/88.0 Firefox/88.0',
    'Mozilla/5.0 (Android 9; Mobile; rv:87.0) Gecko/87.0 Firefox/87.0'
  ];

// Hàm để chọn ngẫu nhiên một User-Agent từ danh sách
const getRandomUserAgent = () => {
  const randomIndex = Math.floor(Math.random() * userAgents.length);
  return userAgents[randomIndex];
};

// Hàm để thêm độ trễ ngẫu nhiên
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

app.get('/shopeexu', async (req, res) => {
  console.log('Received request for /shopeexu');
  const startTime = Date.now(); // Lấy timestamp hiện tại

  try {
    // Thêm độ trễ ngẫu nhiên từ 1 đến 3 giây giữa các yêu cầu
    await delay(Math.floor(Math.random() * 2000) + 1000);

    const response = await axios.get('https://api.chietkhau.pro/api/v1/shopeexu/all_spinner', {
      params: {
        limit: 20,
        'startTime[gte]': startTime
      },
      headers: {
        'Referer': 'https://shopeexu-nextjs.vercel.app',
        'Origin': 'https://shopeexu-nextjs.vercel.app',
        'User-Agent': getRandomUserAgent() // Sử dụng User-Agent ngẫu nhiên
      }
    });

    console.log('API call successful:', response.data);
    res.json(response.data);
  } catch (error) {
    console.error('Error calling API:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
      console.error('Response headers:', error.response.headers);
    } else if (error.request) {
      console.error('Request data:', error.request);
    }
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`API server is running at http://localhost:${port}`);
});