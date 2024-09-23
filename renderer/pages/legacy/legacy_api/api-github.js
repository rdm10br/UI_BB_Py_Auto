// pages/api/api-github.js
// import axios from 'axios';

// const GITHUB_REPO = 'rdm10br/BB_Py_Automation';

// export default async function handler(req, res) {
//   try {
//     const response = await axios.get(`https://api.github.com/repos/${GITHUB_REPO}/releases/latest`);
//     res.status(200).json(response.data);
//   } catch (error) {
//     console.error('Error fetching latest release:', error);
//     res.status(500).json({ error: 'Error fetching latest release' });
//   }
// }