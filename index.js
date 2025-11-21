const express = require('express');
const axios = require('axios');

const app = express();

app.get('/api/passes', async (req, res) => {
  const userId = req.query.userId;
  if (!userId) return res.status(400).json({ success: false });

  let passes = [];
  let cursor = '';
  do {
    try {
      const url = `https://inventory.roblox.com/v1/users/${userId}/assets/collectibles?assetType=34&limit=100&cursor=${cursor}`;
      const response = await axios.get(url);
      response.data.data.forEach(item => {
        if (item.priceInRobux > 0) {
          passes.push({
            id: item.assetId,
            name: item.name,
            price: item.priceInRobux
          });
        }
      });
      cursor = response.data.nextPageCursor || '';
    } catch (e) {
      return res.json({ success: false, error: e.message });
    }
  } while (cursor);

  passes.sort((a, b) => a.price - b.price);
  res.json(passes);
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log('Server running on port ' + port));
