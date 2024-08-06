const express = require('express');
const { ytmp3, ytmp3v2, ytmp3v3 } = require('ruhend-scraper');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/yt', async (req, res) => {
    const { url, version } = req.query;

    if (!url) {
        return res.status(400).json({ error: 'URL parameter is required' });
    }

    if (!version || !['v1', 'v2', 'v3'].includes(version)) {
        return res.status(400).json({ error: 'Version parameter is required and must be one of v1, v2, v3' });
    }

    try {
        let data;
        switch (version) {
            case 'v1':
                data = await ytmp3(url);
                break;
            case 'v2':
                data = await ytmp3v2(url);
                break;
            case 'v3':
                data = await ytmp3v3(url);
                break;
            default:
                return res.status(400).json({ error: 'Invalid version' });
        }
        res.json(data);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'An error occurred while processing the request' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
