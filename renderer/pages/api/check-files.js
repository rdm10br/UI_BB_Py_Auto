// import fs from 'fs';
// import path from 'path';

// const checkFilesExist = (files) => {
//   return files.reduce((acc, file) => {
//     const filePath = path.join(process.cwd(), file);
//     // console.warn(`Checking file path: ${filePath}`);
//     acc[file] = fs.existsSync(filePath);
//     return acc;
//   }, {});
// };

// export default function handler(req, res) {
//   const { files } = req.query;

//   if (!files || files.length === 0) {
//     return res.status(400).json({ error: 'No files provided' });
//   }

//   const filesArray = Array.isArray(files) ? files : [files];
//   const fileStatus = checkFilesExist(filesArray);
  
//   res.status(200).json(fileStatus);
// }