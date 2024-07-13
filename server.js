const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const archiver = require('archiver');

const app = express();

app.use(cors());
app.use(express.static(path.join(__dirname, 'build')));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    // Log the original filename
    console.log('Original filename:', file.originalname);

    // Try to decode the original filename
    let decodedFilename;
    try {
      decodedFilename = decodeURIComponent(escape(file.originalname));
    } catch (e) {
      decodedFilename = file.originalname;
    }

    // Log the decoded filename
    console.log('Decoded filename:', decodedFilename);

    // Get file extension
    const ext = path.extname(decodedFilename);
    // Get file name without extension
    const name = path.basename(decodedFilename, ext);
    // Create date string in format YYYYMMDD_HHMMSS
    const date = new Date().toISOString().replace(/[-:]/g, '').slice(0, 15).replace('T', '_');
    // Create new filename
    const newFilename = `${name}_${date}${ext}`;

    // Log the new filename
    console.log('New filename:', newFilename);

    cb(null, newFilename);
  }
});

const upload = multer({ storage: storage });

app.post('/api/upload', upload.fields([
  { name: 'contributionFile', maxCount: 1 },
  { name: 'reflectionFile', maxCount: 1 }
]), (req, res) => {
  if (!req.files || !req.files.contributionFile || !req.files.reflectionFile) {
    return res.status(400).send('Both files are required.');
  }

  const deliverableType = req.body.deliverableType;
  const contributionFile = req.files.contributionFile[0];
  const reflectionFile = req.files.reflectionFile[0];

  // 압축 파일 이름 변경 로직 개선
  const date = new Date().toISOString().replace(/[-:]/g, '').slice(0, 15).replace('T', '_');
  const zipFileName = `${deliverableType}_${date}.zip`; // deliverableType과 날짜를 결합
  const output = fs.createWriteStream(path.join('uploads', zipFileName));
  const archive = archiver('zip', {
    zlib: { level: 9 }
  });

  output.on('close', function() {
    console.log(archive.pointer() + ' total bytes');
    console.log('Archiver has been finalized and the output file descriptor has closed.');
    res.send('Files uploaded and zipped successfully');
  });

  archive.on('error', function(err) {
    throw err;
  });

  archive.pipe(output);

  const addFileToArchive = (file) => {
    // Decode and transform the filename
    let decodedFilename;
    try {
      decodedFilename = decodeURIComponent(escape(file.originalname));
    } catch (e) {
      decodedFilename = file.originalname;
    }

    const ext = path.extname(decodedFilename);
    const name = path.basename(decodedFilename, ext);
    const date = new Date().toISOString().replace(/[-:]/g, '').slice(0, 15).replace('T', '_');
    const newFilename = `${name}_${date}${ext}`;

    archive.file(file.path, { name: newFilename });
  };

  addFileToArchive(contributionFile);
  addFileToArchive(reflectionFile);

  archive.finalize();
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
